# Taible — AI Voice Ordering System
> AMD ROCm-powered restaurant voice ordering with Pipecat, vLLM, Whisper, Kokoro, and FastMCP

## Architecture

```
Guest Browser (PWA)
  │ WebRTC (LiveKit)
  ▼
voice-orchestration/ (Pipecat CPU pipeline)
  ├── Whisper STT ──────────────────────────┐
  ├── vLLM Qwen2.5-7B ────────────────────┤  gpu-rocm/ (AMD ROCm)
  └── Kokoro TTS ──────────────────────────┘
  │
  │ HTTP tool calls
  ▼
mcp-server/ (FastMCP — Python)
  │ Supabase service-role key
  ▼
Supabase (PostgreSQL + Realtime)
  │ Realtime channel
  ▼
taible/ (Next.js Staff Dashboard)
```

## Repositories

| Folder | Purpose |
|--------|---------|
| `taible/` | Guest PWA + Staff Dashboard (Next.js 15) |
| `voice-orchestration/` | Pipecat CPU pipeline — WebRTC ↔ GPU glue |
| `gpu-rocm/` | AMD ROCm Docker stack (vLLM, Whisper, Kokoro) |
| `mcp-server/` | FastMCP tool server (get_menu, create_order, …) |
| `architecture/` | C4 D2-as-code diagrams |

---

## Setup Order

### 1. Supabase Database

1. Create a project at [supabase.com](https://supabase.com) (free tier works)
2. In the SQL Editor, run in order:
   - `mcp-server/db/schema.sql`
   - `mcp-server/db/seed.sql`
3. Copy your **Project URL** and **service_role secret key** from Settings → API

### 2. MCP Server (FastMCP)

```bash
cd mcp-server
cp .env.example .env
# Edit .env: fill SUPABASE_URL and SUPABASE_SECRET_KEY

pip install -r requirements.txt
python server.py
# → Listening on http://localhost:8080
```

Test it:
```bash
curl -X POST http://localhost:8080/tools/get_menu \
  -H "Content-Type: application/json" \
  -d '{"restaurant_slug": "taible-bistro"}'
```

### 3. AMD ROCm GPU Pipeline

> Requires an AMD GPU server with ROCm 6.x and Docker installed.

```bash
cd gpu-rocm
docker compose up -d
# Starts: vLLM (:8000), Whisper (:8178), Kokoro (:8880)

# Verify
curl http://amd-gpu-server:8000/health
curl http://amd-gpu-server:8178/health
curl http://amd-gpu-server:8880/health
```

### 4. Voice Orchestration (Pipecat)

You need a **LiveKit** server. Use [LiveKit Cloud](https://livekit.io) (free tier) or self-host.

```bash
cd voice-orchestration
cp .env.example .env
# Edit .env: fill LIVEKIT_*, VLLM_BASE_URL, WHISPER_BASE_URL,
#            KOKORO_BASE_URL, MCP_SERVER_URL

pip install -r requirements.txt
python main.py
# → Pipecat agent connected to LiveKit room "taible-demo"
```

### 5. Frontend (Next.js)

```bash
cd taible
cp .env.local.example .env.local
# Edit .env.local: fill NEXT_PUBLIC_PIPECAT_URL, NEXT_PUBLIC_SUPABASE_URL,
#                        NEXT_PUBLIC_SUPABASE_ANON_KEY

npm install
npm run dev
# → http://localhost:3000
```

---

## Demo Flow

1. Open `http://localhost:3000` on your phone (or scan the QR code)
2. Tap **"Start talking"** — the orb connects to Pipecat via LiveKit
3. Say: *"Hi, what's on the menu?"*
4. The AI reads the menu from Supabase via MCP and speaks back
5. Order something: *"I'd like a flat white with oat milk"*
6. Confirm: *"Yes, that's everything"*
7. Switch to **Staff View →** to see the order appear in real-time

---

## Environment Variables Reference

### `mcp-server/.env`
| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | `https://your-ref.supabase.co` |
| `SUPABASE_SECRET_KEY` | Service-role key (never expose to browser) |
| `PORT` | HTTP port (default `8080`) |

### `voice-orchestration/.env`
| Variable | Description |
|----------|-------------|
| `LIVEKIT_URL` | `wss://your.livekit.cloud` |
| `LIVEKIT_API_KEY` | LiveKit API key |
| `LIVEKIT_API_SECRET` | LiveKit API secret |
| `VLLM_BASE_URL` | `http://amd-gpu-server:8000/v1` |
| `VLLM_MODEL` | `Qwen/Qwen2.5-7B-Instruct` |
| `WHISPER_BASE_URL` | `http://amd-gpu-server:8178` |
| `KOKORO_BASE_URL` | `http://amd-gpu-server:8880` |
| `MCP_SERVER_URL` | `https://your-mcp-server.fly.dev` |
| `RESTAURANT_SLUG` | `taible-bistro` |
| `LIVEKIT_ROOM` | `taible-demo` |

### `taible/.env.local`
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_PIPECAT_URL` | LiveKit server URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key (safe for browser) |
