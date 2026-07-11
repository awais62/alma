# gpu-rocm

AMD **ROCm** speech pipeline for the Taible voice agent. Runs on AMD GPUs — **no CUDA**.

- **STT:** whisper.cpp (HIP) — large-v3 / medium
- **LLM:** vLLM — Llama 3.1 8B / Qwen 2.5 7B (OpenAI-compatible endpoint)
- **TTS:** Kokoro (PyTorch / ROCm)

Target: a single 24 GB card (e.g. Radeon 7900 XTX), Dockerized. Consumed by [`voice-orchestration`](https://github.com/Taible-io/voice-orchestration).

Architecture: [Taible-io/architecture](https://github.com/Taible-io/architecture) · New here? [playbook_startup](https://github.com/Taible-io/playbook_startup).

_Stage: 🔧 empty scaffold. Never commit secrets._
