"""Responsible for loading Qwen tokenizer and model."""
import os
import torch
import logging
from transformers import AutoTokenizer, AutoModelForCausalLM

logger = logging.getLogger(__name__)


class ModelLoader:
    """Loads Qwen model and tokenizer with CPU/GPU optimization."""

    def __init__(self, model_path: str, device: str = "cpu"):
        self.model_path = model_path
        self.device = torch.device(device)
        self.is_cuda = device == "cuda"
        self.tokenizer = None
        self.model = None
        self._loaded = False

    def load(self) -> bool:
        """Load tokenizer and model. Returns True if successful."""
        if self._loaded:
            return True
        try:
            logger.info(f"🔍 Loading tokenizer from {self.model_path}...")
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_path,
                local_files_only=True,
                trust_remote_code=True
            )
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            logger.info("✅ Tokenizer loaded")

            logger.info(f"🔍 Loading model on {self.device.type}...")
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_path,
                trust_remote_code=True,
                low_cpu_mem_usage=True,
                torch_dtype=torch.float32,
                local_files_only=True
            )
            self.model.eval()
            self.model.to(self.device)
            
            self._loaded = True
            logger.info("✅ Model loaded successfully")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to load model: {e}", exc_info=True)
            return False

    @property
    def is_ready(self) -> bool:
        return self._loaded and self.model is not None and self.tokenizer is not None