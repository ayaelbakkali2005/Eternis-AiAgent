"""Centralized prompt templates for AI responses."""

ERP_ASSISTANT_PROMPT = """You are an intelligent assistant for the Eternis ERP system.
Use the following retrieved context to answer accurately.

Context:
{context}

Question:
{question}

Answer:"""

ERP_ASSISTANT_NO_CONTEXT_PROMPT = """You are an intelligent assistant for the Eternis ERP system.
Answer the following question accurately and professionally.

Question:
{question}

Answer:"""

AGENT_PROMPT = """You are an ERP AI assistant. Answer professionally.
User: {user_query}
Assistant:"""

EXECUTIVE_SUMMARY_PROMPT = "Generate an executive summary for: {topic}"
RISK_ANALYSIS_PROMPT = "Analyze potential risks and provide mitigation strategies for: {topic}"
FINANCIAL_ANALYSIS_PROMPT = "Analyze the financial health and budget utilization for: {topic}"
TEAM_ANALYSIS_PROMPT = "Analyze team performance and productivity for: {topic}"