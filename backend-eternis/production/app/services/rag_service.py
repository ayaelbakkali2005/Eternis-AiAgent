# app/services/rag_service.py
"""Responsible for FAISS vector store retrieval."""
import os
import logging
from typing import List
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

logger = logging.getLogger(__name__)


class RAGService:
    """Handles FAISS index loading and context retrieval."""

    def __init__(self, faiss_path: str, embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.faiss_path = faiss_path
        self.embedding_model = embedding_model
        self.vector_store = None
        self._loaded = False

    def load(self) -> bool:
        """Load FAISS index. Returns True if successful."""
        if self._loaded:
            return True
        if not os.path.exists(self.faiss_path):
            logger.warning(f"FAISS index not found at {self.faiss_path}")
            return False
        try:
            logger.info(f"🔍 Loading FAISS index from {self.faiss_path}...")
            embeddings = HuggingFaceEmbeddings(model_name=self.embedding_model)
            self.vector_store = FAISS.load_local(
                self.faiss_path, embeddings, allow_dangerous_deserialization=True
            )
            self._loaded = True
            logger.info("FAISS index loaded successfully")
            return True
        except Exception as e:
            # Catch Pydantic v1/v2 compatibility error
            error_str = str(e).lower()
            if "__fields_set__" in error_str or "pydantic" in error_str or "validation" in error_str:
                logger.warning(f"Pydantic compatibility issue with FAISS: {e}")
                logger.warning("RAG disabled - using model knowledge only")
            else:
                logger.error(f"Failed to load FAISS: {e}")
            return False

    def retrieve_context(self, query: str, k: int = 3) -> str:
        """Retrieve top-k relevant documents as context string."""
        if not self.vector_store:
            return ""
        try:
            docs = self.vector_store.similarity_search(query, k=k)
            return "\n\n".join([d.page_content for d in docs])
        except Exception as e:
            logger.warning(f"Context retrieval failed: {e}")
            return ""

    def get_sources(self, query: str, k: int = 3) -> List[str]:
        """Extract source metadata from retrieved documents."""
        if not self.vector_store:
            return []
        try:
            docs = self.vector_store.similarity_search(query, k=k)
            return [d.metadata.get("source", d.metadata.get("filename", "Internal KB")) for d in docs]
        except Exception:
            return []

    @property
    def is_ready(self) -> bool:
        return self._loaded and self.vector_store is not None
