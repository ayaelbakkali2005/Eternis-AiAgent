# backend-eternis/production/Dockerfile
FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    TRANSFORMERS_CACHE=/app/models \
    HF_HOME=/app/models \
    HUGGINGFACE_HUB_CACHE=/app/models

WORKDIR /app

# تثبيت الاعتماديات النظامية + git-lfs للنماذج الكبيرة
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libpq-dev \
    curl \
    git \
    git-lfs \
    && rm -rf /var/lib/apt/lists/* \
    && git lfs install

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# نسخ الكود فقط (بدون مجلد models/)
COPY app/ ./app/
COPY data/ ./data/
# ❌ احذفي هذا السطر: COPY models/ ./models/

# ✅ تحميل نموذج Qwen من HuggingFace أثناء البناء
# ⚠️ استبدلي اسم النموذج أدناه بالنموذج الفعلي الذي تستخدمينه
RUN mkdir -p /app/models && \
    git clone https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct /app/models/qwen-local

# ✅ إذا كان لديكِ FAISS index، حمّليه أيضاً (اختياري)
# COPY models/faiss_index/ ./models/faiss_index/

COPY .env* ./

# إنشاء مستخدم غير root للأمان
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser
EXPOSE 8000

# ✅ زيادة start-period لأن تحميل النموذج قد يأخذ وقتاً
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD curl -f http://localhost:8000/voice/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
