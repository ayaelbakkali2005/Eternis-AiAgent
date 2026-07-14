# scripts/build_demo_rag.py
"""
Build a demo FAISS index with sample ERP data.
Perfect for demos when no real database is available.
Run inside Docker: docker compose exec api python3 /scripts/build_demo_rag.py
"""
import os
import sys
sys.path.insert(0, "/app")

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document

# =============================================================================
# 🎭 SAMPLE ERP DATA (واقعية لكن وهمية ← مثالية للعرض)
# =============================================================================

demo_documents = [
    # 📊 Projects
    Document(
        page_content="Project P41A05199 (Payment App): Budget $50,000, Status: Planning, Start: 2024-01-01, Deadline: 2024-06-30, Team: 5 developers, Progress: 0%, Priority: High, Client: FinTech Corp",
        metadata={"source": "projects_db", "type": "project", "project_id": "P41A05199", "status": "planning", "client": "FinTech Corp"}
    ),
    Document(
        page_content="Project P41A05200 (Mobile CRM): Budget $75,000, Status: Development, Start: 2023-11-15, Deadline: 2024-08-30, Team: 8 developers, Progress: 45%, Priority: Medium, Client: RetailPlus",
        metadata={"source": "projects_db", "type": "project", "project_id": "P41A05200", "status": "development", "client": "RetailPlus"}
    ),
    Document(
        page_content="Project P41A05201 (Analytics Dashboard): Budget $30,000, Status: Completed, Start: 2023-06-01, Deadline: 2023-12-31, Team: 3 developers, Progress: 100%, Priority: Low, Client: Internal",
        metadata={"source": "projects_db", "type": "project", "project_id": "P41A05201", "status": "completed", "client": "Internal"}
    ),
    
    # 👥 Employees / HR
    Document(
        page_content="Employee E001: John Doe, Role: Senior Python Developer, Department: IT, Salary: $85,000, Start Date: 2023-01-15, Projects: P41A05199, P41A05200, Performance: Excellent",
        metadata={"source": "hr_db", "type": "employee", "employee_id": "E001", "department": "IT", "role": "developer"}
    ),
    Document(
        page_content="Employee E002: Sarah Smith, Role: UX Designer, Department: Design, Salary: $72,000, Start Date: 2023-03-20, Projects: P41A05200, P41A05201, Performance: Good",
        metadata={"source": "hr_db", "type": "employee", "employee_id": "E002", "department": "Design", "role": "designer"}
    ),
    Document(
        page_content="Employee E003: Mike Johnson, Role: DevOps Engineer, Department: IT, Salary: $90,000, Start Date: 2022-11-01, Projects: All infrastructure, Performance: Excellent",
        metadata={"source": "hr_db", "type": "employee", "employee_id": "E003", "department": "IT", "role": "devops"}
    ),
    
    # 💰 Finance / Budget
    Document(
        page_content="Q1 2024 Financial Report: Revenue $1.2M, Expenses $950K, Net Profit $250K, Key drivers: New contracts, Cost optimization",
        metadata={"source": "finance_db", "type": "report", "period": "Q1-2024", "category": "financial"}
    ),
    Document(
        page_content="Q2 2024 Budget Allocation: Total $550K, Salaries 60%, Infrastructure 25%, Tools & Licenses 10%, Training 5%, Forecast: On track",
        metadata={"source": "finance_db", "type": "budget", "period": "Q2-2024", "category": "allocation"}
    ),
    
    # 📋 Company Policies
    Document(
        page_content="Remote Work Policy: Employees can work remotely up to 3 days/week with manager approval. Core collaboration hours: 10:00-15:00 UTC. Equipment stipend: $500/year",
        metadata={"source": "policies_db", "type": "policy", "category": "work_arrangement"}
    ),
    Document(
        page_content="Code Review Policy: All pull requests require 2+ approvals from senior developers. CI/CD pipeline must pass all tests. Security scan mandatory for external APIs",
        metadata={"source": "policies_db", "type": "policy", "category": "development"}
    ),
    Document(
        page_content="Expense Reimbursement Policy: Submit receipts within 30 days. Max $50/day for meals during travel. Pre-approval required for expenses >$200",
        metadata={"source": "policies_db", "type": "policy", "category": "finance"}
    ),
]


def build_demo_index(output_path: str = "/app/models/faiss_index"):
    """Build FAISS index from demo data."""
    
    print("🔍 Loading embeddings model...")
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    print(f"📚 Creating index with {len(demo_documents)} demo documents...")
    vector_store = FAISS.from_documents(demo_documents, embeddings)
    
    print(f"💾 Saving to {output_path}...")
    os.makedirs(output_path, exist_ok=True)
    vector_store.save_local(output_path)
    
    print(f"✅ Demo RAG index built successfully!")
    print(f"📊 Stats: {vector_store.index.ntotal} vectors")
    
    # Verify
    print("🔍 Verifying index...")
    loaded = FAISS.load_local(output_path, embeddings, allow_dangerous_deserialization=True)
    print(f"✅ Verified: {loaded.index.ntotal} vectors loaded")
    
    return True


if __name__ == "__main__":
    try:
        build_demo_index()
        print("\n🎉 Demo RAG ready! Restart API to enable rag_enabled: true")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)