# tests/test_health.py
"""Simple health check test."""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """Test that health endpoint returns healthy status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "app" in data
    print(" Health check passed")


def test_docs_available():
    """Test that Swagger docs are accessible."""
    response = client.get("/docs")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    print(" Swagger docs accessible")


if __name__ == "__main__":
    test_health_check()
    test_docs_available()
    print("\n All tests passed!")