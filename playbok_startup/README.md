# Taible-io — Start Here

**Welcome. This repo gets you from zero to building on Taible-io in under an hour.**

If you read one thing, read the **[Organization Context (mother document)](./organization-context.md)** — it's the single source of truth for who we are, what's set up, and what's still open.

---

## The mission (in one line)

Taible-io builds a **restaurant voice agent**: a diner scans a QR at the table, talks to an AI assistant in the browser, and it takes the order — powered by a **self-hosted AMD GPU (ROCm) speech pipeline** (Whisper → LLM → TTS) and our MCP menu/order tools.

See the full system as versioned diagrams: **[Taible-io/architecture](https://github.com/Taible-io/architecture)**.
<img width="1762" height="1453" alt="diagram-export-7-7-2026-4_52_37-PM" src="https://github.com/user-attachments/assets/ddf7feb2-25f5-4075-a0e9-0b7968ba6c47" />

---

## Onboarding — do these 5 steps, in order

Target: **~45 minutes** to a working setup.

### 1. Get access (5 min)
- Ask **caeltarifa** to add you to the [Taible-io GitHub org](https://github.com/Taible-io).
- Get invited to the **Taible Discord** and introduce yourself in `#general`.

### 2. Read the mother doc (10 min)
Read **[organization-context.md](./organization-context.md)** top to bottom. It tells you exactly what exists today (✅) and what doesn't (⬜) — no guessing.

### 3. Clone this repo (2 min)
```bash
gh repo clone Taible-io/playbook_startup
cd playbook_startup
```

### 4. Connect the GitHub MCP (10 min)
This is what lets you (and Claude) create repos, push code, and open PRs in the org.
```bash
# Create your OWN fine-grained PAT scoped to Taible-io, then:
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \
  --header "Authorization: Bearer $GITHUB_PAT"
claude mcp list        # expect: github  ✓ connected
```
Verify inside Claude Code: `mcp__github__get_me` should return **your** login.
Full guide + gotchas: **[github-mcp-setup-prompt-engineering.md](./github-mcp-setup-prompt-engineering.md)**

### 5. (Optional) Connect Discord (10 min)
Only if you'll manage the community/server. Follow **[discord_mcp_setup.md](./discord_mcp_setup.md)** — both env vars required, bot must be invited, then `/mcp` reconnect.

**You're onboarded when:** `get_me` returns your login and you can see the repos in the org. That's it — start building.

---

## What's in this repo

| File | Read it to… |
|---|---|
| **[organization-context.md](./organization-context.md)** | Understand the whole company: mission, what's set up, open questions. **Start here.** |
| [github-mcp-setup-prompt-engineering.md](./github-mcp-setup-prompt-engineering.md) | Let Claude Code act on GitHub for you (create repos, push, PRs, issues). |
| [discord_mcp_setup.md](./discord_mcp_setup.md) | Connect a Discord bot to Claude Code and run the server from chat. |
| [channel_structure.md](./channel_structure.md) | Reference the exact Taible Discord channel layout. |
| [database-population.md](./database-population.md) | Seed the pilot Supabase DB via MCP — Taible Bistro menu, modifiers, and `menu-images`. |
| [web-app-ui-design.md](./web-app-ui-design.md) | Build the diner PWA + staff display UI — brand tokens, screens, and components (Next.js). |

These are **prompt playbooks**, not scripts: you open Claude Code and paste the prompts inside each file. Each has a "Success Criteria" list — you're done when it passes.

---

## How we build projects

Every new project follows the same repeatable path, so anyone can spin one up:

1. **Propose it** in Discord `#product` (or the relevant `#project-focus` channel).
2. **Create the repo in the org** — via Claude + GitHub MCP:
   > "Using the GitHub MCP, create a private repo `taible-io/<name>`, add a README describing the project, and confirm it exists."
3. **Document as you go** — if you solve something non-obvious (a setup, a fix, a prompt that works), add a playbook file here so the next person doesn't re-learn it.
4. **Open PRs, not direct pushes** to shared repos; keep `main` clean.

**The service repos (map 1:1 to the [architecture](https://github.com/Taible-io/architecture) diagram):**
- [`architecture`](https://github.com/Taible-io/architecture) — system diagrams (D2-as-code) + decision records
- [`gpu-rocm`](https://github.com/Taible-io/gpu-rocm) — AMD/ROCm speech pipeline: Whisper STT · vLLM · Kokoro TTS
- [`voice-orchestration`](https://github.com/Taible-io/voice-orchestration) — Pipecat/LiveKit turn-taking (CPU)
- [`mcp-server`](https://github.com/Taible-io/mcp-server) — menu/order tools: `get_menu`, `place_order`, …
- [`web-app`](https://github.com/Taible-io/web-app) — the diner PWA (QR → WebRTC)
- [`restaurant-partnerships`](https://github.com/Taible-io/restaurant-partnerships) — partner onboarding, menu/stock admin, POS

Check [Taible-io](https://github.com/Taible-io) for the current list.

---

## Ground rules

- **Never commit secrets.** Tokens live in your own local `.env` (gitignored), never in code, commits, or chat. Rotate every 90 days.
- **Least privilege:** your PAT is fine-grained and scoped to `Taible-io` only.
- **Document the non-obvious.** A 10-minute writeup here saves every future teammate the same hour.
- **Keep the mother doc honest.** Answered an open question or changed the setup? Update [organization-context.md](./organization-context.md).

---

## Who to ask

- **Anything blocking:** ping **caeltarifa** (Founder / DevOps) in Discord.
- **Something undefined?** Don't guess — add it to the open-questions list in the mother doc and raise it.

*Now go build. — Taible-io*
