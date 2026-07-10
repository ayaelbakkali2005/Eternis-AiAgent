# app/services/generator.py
"""Responsible for text generation using loaded model."""
import torch
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class Generator:
    """Handles text generation with Qwen model."""

    def __init__(self, model, tokenizer, device: torch.device):
        self.model = model
        self.tokenizer = tokenizer
        self.device = device

    def generate(
        self,
        prompt: str,
        max_tokens: int = 128,          # CPU-optimized: shorter responses = faster
        temperature: float = 0.1,       # Lower temperature = more deterministic + faster
        top_p: float = 0.8,             # Slightly reduced for speed
        repetition_penalty: float = 1.1
    ) -> Optional[str]:
        """Generate response from prompt - OPTIMIZED FOR CPU."""
        if not self.model or not self.tokenizer:
            logger.error("Generator not initialized")
            return None
        try:
            # Tokenize the prompt
            inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
            
            # Generate response - CPU optimized parameters
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=max_tokens,
                    temperature=temperature,
                    top_p=top_p,
                    do_sample=(temperature > 0),  # greedy decoding if temp=0 (faster)
                    pad_token_id=self.tokenizer.eos_token_id,
                    repetition_penalty=repetition_penalty,
                    use_cache=False,                # False on CPU often faster
                    num_beams=1,                    # No beam search (very slow on CPU)
                    early_stopping=True,            # Stop immediately when EOS generated
                )
            
            # Decode the output
            full_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Extract clean answer after prompt markers
            for marker in ["Assistant:", "Answer:", "assistant:", "answer:"]:
                if marker in full_text:
                    answer = full_text.split(marker)[-1].strip()
                    for stop_marker in ["\nUser:", "\nQuestion:", "\nContext:"]:
                        if stop_marker in answer:
                            answer = answer.split(stop_marker)[0].strip()
                    return answer
            
            # If no marker found, return the full text cleaned up
            if prompt.strip() in full_text:
                return full_text.replace(prompt, "").strip()
            
            return full_text.strip()
            
        except Exception as e:
            logger.error(f"Generation failed: {e}")
            return None
