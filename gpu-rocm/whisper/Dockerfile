# Whisper.cpp HTTP server — compiled with HIP (AMD ROCm)
# Based on the official whisper.cpp repo with ROCm support.
# Exposes an HTTP endpoint compatible with the OpenAI /v1/audio/transcriptions API.

FROM rocm/dev-ubuntu-22.04:6.1-complete AS builder

RUN apt-get update && apt-get install -y \
    git cmake make g++ libcurl4-openssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Clone and build whisper.cpp with HIP support
RUN git clone --depth=1 https://github.com/ggerganov/whisper.cpp /whisper && \
    cd /whisper && \
    cmake -B build \
      -DGGML_HIP=ON \
      -DAMDGPU_TARGETS=gfx1100 \
      -DCMAKE_BUILD_TYPE=Release && \
    cmake --build build --config Release -j$(nproc) --target whisper-server

# Download the large-v3 model
RUN cd /whisper && bash models/download-ggml-model.sh large-v3

# ── Runtime stage ─────────────────────────────────────────────────────────
FROM rocm/dev-ubuntu-22.04:6.1

COPY --from=builder /whisper/build/bin/whisper-server /usr/local/bin/whisper-server
COPY --from=builder /whisper/models/ggml-large-v3.bin /models/ggml-large-v3.bin

EXPOSE 8178

CMD ["whisper-server", \
     "--model", "/models/ggml-large-v3.bin", \
     "--host", "0.0.0.0", \
     "--port", "8178", \
     "--language", "en", \
     "--threads", "4"]
