# Taible-io — Organization Context (Mother Document)

**This is the single source of truth for building Taible-io. Read this first.**

- **Owner:** caeltarifa (CAEL) — Founder / DevOps Engineer
- **Location:** Buenos Aires, AR
- **GitHub org:** [Taible-io](https://github.com/Taible-io)
- **Last updated:** 2026-07-08
- **Lives in:** `Taible-io/playbook_startup` → `organization-context.md`

**Status legend:** ✅ done and verified · 🔧 partly done · ⬜ not started

---

## 0. What we're building (the mission)

A **restaurant voice agent**. A diner scans a QR at the table, talks to an AI assistant in the browser (WebRTC, no install), and it answers menu questions and takes the order. The speech pipeline (Whisper STT → LLM → TTS) runs **self-hosted on AMD GPUs (ROCm) — a hard requirement, no CUDA**. The LLM calls our MCP tools to read the live menu and place orders into the restaurant's POS/kitchen.

Full system as versioned diagrams: **[Taible-io/architecture](https://github.com/Taible-io/architecture)** → `diagrams/container/voice-agent.d2`.

---

## 1. What is set up right now

| Area | Status | Reality today |
|---|---|---|
| GitHub organization | ✅ | `Taible-io` exists, caeltarifa is admin |
| Playbook repo | ✅ | `Taible-io/playbook_startup` (private) |
| Architecture repo | ✅ | `Taible-io/architecture` — D2-as-code, CI renders to SVG |
| Product definition | ✅ | Voice agent for restaurants on AMD/ROCm (see §0) |
| GitHub MCP | ✅ | Connected over HTTP, can create repos in the org + push files |
| Discord server | ✅ | "Taible" server live, 5 categories / 16 channels |
| Discord MCP | ✅ | `discord-mcp` connected, can list channels + send messages |
| Service repos | 🔧 | Scaffolded, empty. See §5 |
| AMD GPU / ROCm server | ⬜ | Core requirement, not provisioned yet. See §6 |
| Team beyond founder | ⬜ | Only caeltarifa so far |

Everything marked ✅ has been done and verified in a real session. 🔧 = started, not finished. ⬜ = to-do.

---

## 2. The playbook repo (`playbook_startup`)

**URL:** https://github.com/Taible-io/playbook_startup · **Branch:** `main` · **Visibility:** private

**Files that exist today:**

```
playbook_startup/
├── README.md                                  # Onboarding landing page
├── organization-context.md                    # THIS document (mother doc)
├── github-mcp-setup-prompt-engineering.md     # GitHub MCP: zero → working, with prompts
├── discord_mcp_setup.md                        # Discord MCP: working config + every failure we fixed
└── channel_structure.md                        # The exact Taible Discord channel layout
```

**Naming rule:** all files lowercase, except `README.md`. Use kebab-case or snake_case.

**These are prompt playbooks, not scripts.** You don't run them in a shell — you open Claude Code and paste the prompts inside each file. Each file has a "Success Criteria" list; you're done when those pass.

---

## 3. GitHub MCP — how it actually works here

| Field | Value |
|---|---|
| Transport | HTTP |
| Endpoint | `https://api.githubcopilot.com/mcp/` |
| Auth | `Authorization: Bearer <PAT>` |
| Identity check | `mcp__github__get_me` → returns `caeltarifa` |

**Register it:**
```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \
  --header "Authorization: Bearer $GITHUB_PAT"
claude mcp list        # expect: github  ✓ connected
```

**Real gotchas we hit (don't repeat them):**
- A **fine-grained PAT cannot create repos on a personal account** → `403 Resource not accessible by personal access token`. Creating **inside the `Taible-io` org** works (pass the org name). For personal repos use a **classic PAT with the `repo` scope**.
- On a **freshly created repo**, the fine-grained PAT can't use the Git Data API (`push_files` / multi-file commits → 403) until access propagates; the **Contents API (single-file commits) works immediately**. A classic PAT avoids this.
- A `/mcp` → Reconnect refreshes the **connection**, not the token's **permissions** — to change scope you must actually swap the token.

Full guide: `github-mcp-setup-prompt-engineering.md`.

---

## 4. Discord MCP — how it actually works here

| Field | Value |
|---|---|
| Transport | stdio (local process) |
| Package | `@quadslab.io/discord-mcp` (binary `discord-mcp`, v2.1.1) |
| Config | `.mcp.json` at project root (project scope) |
| Server | "Taible" |
| Guild ID | `1523737340202324068` |
| Bot | `TAIBLE MCP bot#2472` |

**Working `.mcp.json`:**
```json
{
  "mcpServers": {
    "discord": {
      "command": "discord-mcp",
      "env": {
        "DISCORD_TOKEN": "<YOUR_DISCORD_BOT_TOKEN>",
        "DISCORD_GUILD_ID": "1523737340202324068"
      }
    }
  }
}
```

**Two things that will bite you:**
1. **Both** `DISCORD_TOKEN` and `DISCORD_GUILD_ID` are required. Token alone → the process exits with `DISCORD_GUILD_ID is not set`.
2. A valid token is not enough — the **bot must be invited to the server**, or you get `Bot is not in guild <id>` even though login succeeds.
3. After fixing config, **reconnect in-session**: `/mcp` → discord → Reconnect.

Full guide: `discord_mcp_setup.md`.

---

## 5. Repos & how they map to the architecture

The service repos map 1:1 to the [architecture](https://github.com/Taible-io/architecture) diagram:

| Repo | Role | Status |
|---|---|---|
| [`architecture`](https://github.com/Taible-io/architecture) | System diagrams (D2) + ADRs | ✅ scaffolded |
| [`gpu-rocm`](https://github.com/Taible-io/gpu-rocm) | AMD/ROCm speech pipeline: Whisper STT · vLLM · Kokoro TTS | 🔧 empty |
| [`voice-orchestration`](https://github.com/Taible-io/voice-orchestration) | Pipecat/LiveKit turn-taking (CPU) | 🔧 empty |
| [`mcp-server`](https://github.com/Taible-io/mcp-server) | Menu/order tools: `get_menu`, `place_order`, … | 🔧 empty |
| [`web-app`](https://github.com/Taible-io/web-app) | Diner PWA (QR → WebRTC) | 🔧 empty |
| [`restaurant-partnerships`](https://github.com/Taible-io/restaurant-partnerships) | Partner onboarding, menu/stock admin, POS | 🔧 empty |

**Discord `#project-focus`** channels predate this naming and still read `#ai-model-nlp`, `#mobile-app`, `#crypto-payments`. Treat them as: `#ai-model-nlp` → gpu-rocm/voice, `#mobile-app` → web-app. `#crypto-payments` is **not part of the current product** — decide whether to repurpose or drop it.

---

## 6. AMD GPU / ROCm server — core requirement, not yet provisioned

The speech pipeline **must** run on AMD GPUs with ROCm (no CUDA). Target: a single 24 GB VRAM card (e.g. Radeon 7900 XTX) running Whisper (whisper.cpp/HIP), vLLM (Llama 3.1 8B / Qwen 2.5 7B), and Kokoro TTS in Docker.

**Still to do:** pick the AMD cloud/provider, provision the box, stand up the ROCm + Docker images, and wire it to `voice-orchestration`. When done, document the provider, the `GPU_API_KEY`/access method, and how to monitor it here.

---

## 7. Secrets & environment

Each person keeps their **own** `.env` with their **own** tokens. Never commit `.env` (gitignore it) and never paste tokens into chat, commits, or docs.

```bash
# .env  — per person, never committed
GITHUB_PAT=github_pat_...      # or classic ghp_... if you need to create personal repos
DISCORD_TOKEN=...              # only if you manage the Discord server
GPU_API_KEY=...                # once the AMD/ROCm box is provisioned
```

Rotate tokens every 90 days; revoke immediately on any leak.

---

## 8. Still open

- [ ] **AMD cloud/provider** for the ROCm GPU box, and provisioning it (§6).
- [ ] **Business model:** how it makes money.
- [ ] **Stage:** pre-launch / MVP / growth (currently pre-MVP).
- [ ] **Primary language:** the pipeline notes Spanish STT + English TTS — confirm the target locale(s).
- [ ] **Team structure & roles** beyond the founder.
- [ ] **`crypto-payments`** repo/channel: repurpose or drop (not in current product).
- [ ] **Discord invite link** and the server's official purpose (team-only vs. public community).

---

## 9. Onboarding a new colleague

1. Get added to the `Taible-io` GitHub org (ask caeltarifa).
2. Clone the playbook: `gh repo clone Taible-io/playbook_startup`
3. Read this file, then `README.md`, then the [architecture](https://github.com/Taible-io/architecture) repo.
4. Create your **own** fine-grained PAT scoped to `Taible-io`, put it in your local `.env`.
5. Register the GitHub MCP (§3). Verify with `mcp__github__get_me` → your login.
6. Only if you manage Discord: get the bot token, set up `.mcp.json` (§4), reconnect.
7. For any common task, check the relevant playbook file before doing it by hand.

---

## 10. Keep this document honest

Update it whenever you: add a person, add/change an MCP, change the GitHub or Discord structure, provision the GPU box, or answer any open question in §8. Don't add `[DEFINE]` placeholders — either write the real answer or put it in the §8 checklist. **Owner:** caeltarifa · commit changes to `Taible-io/playbook_startup`.
