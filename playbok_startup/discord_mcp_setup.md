# Discord MCP + Claude Code — Setup Documentation

This document records the **working configuration** we established to connect a Discord bot to Claude Code (Claude CLI) via the `discord-mcp` MCP server, including the issues we hit and how each was resolved.

- **Server:** Taible
- **Guild (Server) ID:** `1523737340202324068`
- **Bot:** `TAIBLE MCP bot#2472`
- **MCP server package:** `@quadslab.io/discord-mcp` (binary: `discord-mcp`, v2.1.1)
- **Status:** ✔ Connected and verified (listed channels + sent messages successfully)

---

## 1. Overview of the stack

```
Claude Code (CLI)  ──stdio──▶  discord-mcp (local process)  ──▶  Discord API  ──▶  Taible server
```

- Claude Code launches `discord-mcp` as a local MCP server over stdio.
- `discord-mcp` authenticates as a Discord bot using a bot token and operates on a single guild.
- Tools (list channels, send messages, manage roles, etc.) are exposed to Claude Code and appear as `mcp__discord__*`.

---

## 2. Prerequisites

- **Node.js** (the `discord-mcp` binary is a Node CLI).
- **Claude Code** installed and available as `claude` on the CLI.
- A **Discord bot** created in the [Discord Developer Portal](https://discord.com/developers/applications) with:
  - A **bot token**.
  - The bot **invited to the target server** (guild) with appropriate scopes/permissions.
- The `discord-mcp` binary installed and on `PATH`.
  - In this setup it lives at: `/Users/cael/miniconda3/envs/envclaude/bin/discord-mcp`
  - It can be run/installed via `npx @quadslab.io/discord-mcp`.

---

## 3. The MCP configuration (`.mcp.json`)

The MCP server is configured at **project scope** in `.mcp.json` at the project root
(`/Users/cael/discord_taible/.mcp.json`). This is the final, working configuration:

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

### Required environment variables

| Variable            | Required | Purpose                                                        |
| ------------------- | -------- | -------------------------------------------------------------- |
| `DISCORD_TOKEN`     | Yes      | Bot token used to authenticate with the Discord API.           |
| `DISCORD_GUILD_ID`  | Yes      | The server (guild) the bot operates on. **Omitting it fails.** |

> **Security:** The real bot token is stored in `.mcp.json` in plaintext. Do **not** commit it to
> a shared/public repo. Add `.mcp.json` to `.gitignore`, or use a secrets manager / environment
> injection. If the token ever leaks, **regenerate it** in the Discord Developer Portal.

---

## 4. Step-by-step: what we did

### Step 1 — Discover the configured MCP server
```bash
claude mcp list
```
Initially returned:
```
discord: discord-mcp  - ✘ Failed to connect
```

### Step 2 — Inspect the config
```bash
claude mcp get discord
cat .mcp.json
```
Found only `DISCORD_TOKEN` was set — `DISCORD_GUILD_ID` was missing.

### Step 3 — Reproduce the failure directly
Running the binary with just the token revealed the real error:
```
Error: DISCORD_GUILD_ID is not set.
```

### Step 4 — Add the guild ID
Added `DISCORD_GUILD_ID` to the `env` block in `.mcp.json` (see config above).

### Step 5 — Next failure: bot not in the server
Re-testing produced:
```
[discord-mcp] Logged in as TAIBLE MCP bot#2472
[discord-mcp] Failed to start: Bot is not in guild 1523737340202324068
```
The token was valid (login succeeded), but the **bot had not been invited** to the server.

**Fix:** Invite the bot via the Discord Developer Portal → OAuth2 → URL Generator:
- Scopes: `bot`
- Bot Permissions (minimum): **View Channels**, **Send Messages**, **Read Message History**
- Open the generated URL and add the bot to the **Taible** server.

### Step 6 — Verify the server connects
```bash
claude mcp list
```
Now returns:
```
discord: discord-mcp  - ✔ Connected
```
Direct run confirmed:
```
Server cache refreshed: 4 channels, 2 roles, 1 members
Discord MCP server v2.1.1 started
[discord-mcp] Ready — guild 1523737340202324068
```

### Step 7 — Reconnect within the running Claude Code session
Because the session had loaded MCP tools at startup (when the server was still failing),
the Discord tools were not registered. Editing `.mcp.json` and passing a health check does
**not** retroactively load tools into a running session.

**Fix:** Reconnect the server in-session:
- Run `/mcp` → select **discord** → **Reconnect**
  (Alternatively, fully restart Claude Code.)

After reconnecting, the `mcp__discord__*` tools became available.

### Step 8 — Verify end to end
- Listed channels (`list_channels`) → 4 channels returned.
- Sent a message to `#general` (`send_message`) → success.

---

## 5. Gotchas & lessons learned

1. **Both env vars are required.** `DISCORD_TOKEN` alone is not enough — `discord-mcp` also
   needs `DISCORD_GUILD_ID`, or it exits immediately.
2. **A valid token ≠ a usable bot.** The bot must actually be **invited to the guild**, or you
   get `Bot is not in guild <id>` even though login succeeds.
3. **Confirm the guild ID.** A wrong `DISCORD_GUILD_ID` produces the same "not in guild" error
   even if the bot is invited. Copy it via Discord → right-click server → **Copy Server ID**
   (Developer Mode must be enabled under Settings → Advanced).
4. **Running sessions need a reconnect.** After fixing config, run `/mcp` → Reconnect (or restart
   Claude Code) so the tools load into the current session.
5. **Changing the model (`/model`) does not reconnect MCP servers.** Use `/mcp` for that.
6. **Keep the token secret.** It lives in `.mcp.json` in plaintext — gitignore it and rotate if leaked.

---

## 6. Handy commands reference

```bash
# List all configured MCP servers and their health
claude mcp list

# Show details for the discord server
claude mcp get discord

# Remove the discord server (project scope)
claude mcp remove discord -s project

# Run the discord-mcp setup wizard (interactive)
npx @quadslab.io/discord-mcp init

# Troubleshoot the connection
npx @quadslab.io/discord-mcp check
```

Inside Claude Code:
- `/mcp` — manage/reconnect MCP servers.

---

## 7. Current Taible server channels (verified)

| Category       | Channel    | Type  |
| -------------- | ---------- | ----- |
| Text Channels  | `#general` | text  |
| Voice Channels | `General`  | voice |

---

*Generated as part of establishing the Discord MCP + Claude Code integration for the Taible server.*
