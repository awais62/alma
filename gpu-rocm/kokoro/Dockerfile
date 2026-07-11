# Kokoro TTS — PyTorch on AMD ROCm
# Exposes an OpenAI-compatible /v1/audio/speech endpoint.
# Compatible with Pipecat's OpenAITTSService.

FROM rocm/pytorch:rocm6.1_ubuntu22.04_py3.10_pytorch_2.1.2 AS base

RUN pip install --no-cache-dir \
    kokoro-onnx>=0.4 \
    soundfile \
    fastapi \
    uvicorn[standard] \
    httpx

# ── Kokoro HTTP wrapper ──────────────────────────────────────────────────
# Exposes POST /v1/audio/speech (OpenAI-compat) → returns WAV audio bytes
COPY server.py /app/server.py

WORKDIR /app

EXPOSE 8880

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8880"]
