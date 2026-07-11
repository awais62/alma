"""
Kokoro TTS FastAPI server — OpenAI-compatible /v1/audio/speech endpoint.
Runs on AMD ROCm via PyTorch.

Compatible with Pipecat's OpenAITTSService (base_url=http://this-server:8880/v1).
"""

import io
import soundfile as sf
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from kokoro_onnx import Kokoro

app = FastAPI(title="Taible Kokoro TTS")

# Load Kokoro model once at startup
_kokoro = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")


class TTSRequest(BaseModel):
    model: str = "kokoro"
    input: str
    voice: str = "af_sky"
    response_format: str = "wav"
    speed: float = 1.0


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/v1/audio/speech")
async def synthesize(req: TTSRequest):
    try:
        samples, sample_rate = _kokoro.create(
            req.input,
            voice=req.voice,
            speed=req.speed,
            lang="en-us",
        )
        buf = io.BytesIO()
        sf.write(buf, samples, sample_rate, format="WAV")
        buf.seek(0)
        return Response(
            content=buf.read(),
            media_type="audio/wav",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
