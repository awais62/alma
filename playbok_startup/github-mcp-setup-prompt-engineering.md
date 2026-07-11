# Prompt Engineering Playbook — Setting Up the GitHub MCP Server (Zero → Success)

A reproducible, prompt-driven guide for configuring the **GitHub MCP server** inside
Claude Code, from an empty environment to a fully working, tool-authenticated setup.

> MCP = Model Context Protocol. An MCP server exposes a set of tools (here: GitHub
> operations like `create_repository`, `list_issues`, `create_pull_request`) that the
> model can call directly, instead of you shelling out to `git`/`gh` by hand.

---

## 0. Success Criteria (what "done" looks like)

You are done when **all** of these are true:

1. `claude mcp list` shows a `github` server with status **connected**.
2. The model can call `mcp__github__get_me` and it returns *your* GitHub login.
3. A read call works, e.g. `mcp__github__search_repositories` returns results.
4. A write call works against a repo you own, e.g. `mcp__github__create_or_update_file`
   or `mcp__github__create_repository` (test on a throwaway repo first).

Keep this list handy — the whole playbook is just closing the gap to these four checks.

---

## 1. Prerequisites (the "zero" state)

Before any prompt engineering, make sure the physical prerequisites exist. Missing
these is the #1 cause of "it won't connect."

| Requirement | How to get it | Verify |
|---|---|---|
| A GitHub account | github.com | you can log in |
| A **Personal Access Token (PAT)** | GitHub → Settings → Developer settings → Personal access tokens | token string starting `ghp_` or `github_pat_` |
| Docker **or** a remote MCP endpoint | Docker Desktop running, or use GitHub's hosted server | `docker ps` works |
| Claude Code CLI | already installed if you're reading this in-session | `claude --version` |

### Token scopes (get this right once)

Create a **fine-grained** or **classic** PAT with only what you need:

- `repo` — read/write to repositories (required for most write tools)
- `read:org` — org membership / teams
- `read:user` — `get_me`, user lookups
- `workflow` — only if you'll touch GitHub Actions
- `gist` — only if you'll create gists

> **Least privilege:** start read-only, add write scopes when a write tool fails with 403.
> Never grant `admin:*` unless a specific tool demands it.

> **Gotcha we actually hit:** a **fine-grained PAT cannot create repositories** through
> the `POST /user/repos` (or org) endpoint — it returns
> `403 Resource not accessible by personal access token`. Use a **classic PAT with the
> `repo` scope** for repo creation. Fine-grained tokens can still *push* to repos already
> selected in the token's repo list. Also, creating a repo **inside an organization**
> (e.g. `Taible-io`) worked where a personal-account create had been blocked — pass the
> `organization` argument when your token is org-authorized.

---

## 2. Two Install Paths — Pick One

### Path A — Remote (hosted) GitHub MCP server (simplest, no Docker)

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \
  --header "Authorization: Bearer YOUR_GITHUB_PAT"
```

### Path B — Local Docker server (fully self-hosted)

```bash
claude mcp add github -- \
  docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_GITHUB_PAT \
  ghcr.io/github/github-mcp-server
```

Either path registers a server named `github`. Confirm:

```bash
claude mcp list
```

You want to see `github ✓ connected`.

---

## 3. The Prompt-Engineering Layer

This is the part that turns "the server is connected" into "the model reliably does
the right GitHub work." Configuration alone isn't enough — how you *instruct* the model
determines whether it uses the tools correctly.

### 3.1 System / project instruction block

Add this to `CLAUDE.md` (project root) or a memory file so it loads every session:

```markdown
## GitHub MCP usage rules
- ALWAYS call `mcp__github__get_me` first to establish identity & permissions
  before any create/update/delete operation.
- Prefer `list_*` tools for broad retrieval; use `search_*` for targeted queries.
- Paginate in batches of 5–10 items. Pass `minimal_output: true` when full
  payloads aren't needed (saves context).
- Before creating an issue, run `search_issues` to avoid duplicates.
- Before opening a PR, look for `.github/PULL_REQUEST_TEMPLATE` and follow it.
- Never force-push, never delete branches/repos, never merge without explicit
  user confirmation.
```

### 3.2 The "zero → success" bootstrap prompt

Paste this to the model the first time, verbatim:

```
Set up and verify the GitHub MCP server end to end.
1. Run the identity check (get_me) and tell me which GitHub login you're acting as.
2. Do a read test: search for one of my repositories and list it.
3. Do a SAFE write test: create a new private throwaway repo named
   "mcp-smoke-test", add a README, then confirm the file exists.
4. Report each step as PASS/FAIL with the tool name you used.
Stop and ask me before doing anything destructive.
```

### 3.3 Prompt patterns that work (and anti-patterns)

**DO — be tool-explicit and outcome-framed:**
> "Using the GitHub MCP tools, open a PR from `feat/login` into `main` titled
> 'Add login flow', body summarizing the 3 commits. Show me the PR URL."

**DON'T — vague, shell-implying:**
> "push my code and make a PR" ← ambiguous; may trigger raw git instead of MCP tools.

**DO — force verification:**
> "After creating it, read it back with `get_file_contents` and paste the first 5 lines."

**DON'T — batch destructive ops without a gate:**
> "delete all stale branches" ← always require an explicit confirm + a dry-run list first.

### 3.4 Guardrail prompt snippets (reusable)

- **Identity gate:** "Before any write, confirm `get_me` login == `<expected-user>`; abort if not."
- **Idempotency gate:** "Check existence with a `get_*`/`search_*` call before every create."
- **Confirmation gate:** "For delete/merge/force operations, print the plan and wait for my 'yes'."
- **Context gate:** "Use `minimal_output: true` and pagination ≤10 to avoid flooding context."

---

## 4. Verification Ladder (run in order)

Climb this ladder; stop and fix at the first rung that fails.

1. **Connection** — `claude mcp list` → `github` connected.
2. **Auth** — `mcp__github__get_me` returns your login (not an error, not another user).
3. **Read scope** — `mcp__github__search_repositories` / `list_issues` returns data.
4. **Write scope** — `create_or_update_file` on the smoke-test repo succeeds.
5. **Readback** — `get_file_contents` shows what you just wrote.
6. **Cleanup** — delete the smoke-test repo (with confirmation).

---

## 5. Troubleshooting Matrix

| Symptom | Likely cause | Fix |
|---|---|---|
| `github` not in `claude mcp list` | server never registered | re-run the `claude mcp add …` command |
| status `failed` / `disconnected` | bad token, Docker not running | check `docker ps`; regenerate PAT |
| `get_me` returns 401 | token invalid/expired | mint a new PAT, update the header/env |
| write tools return 403 | missing `repo` scope | add `repo` scope to the PAT and re-add server |
| **create_repository → 403 "Resource not accessible by personal access token"** | **fine-grained PAT can't create repos** | **use a classic PAT with `repo`, or create the repo in an org you're authorized in via the `organization` arg** |
| tools exist but model won't use them | vague prompts | use §3.2 / §3.3 tool-explicit phrasing |
| context floods with huge payloads | no pagination | enforce `minimal_output` + batches ≤10 |
| "resource not found" on a private repo | token lacks org access | add `read:org`, ensure PAT is org-approved (SSO) |
| fixed config but tools still missing | running session loaded tools at startup | `/mcp` → **Reconnect** (or restart Claude Code) |

---

## 6. Security & Hygiene

- **Never** paste the raw PAT into chat, commits, or this file. Use env vars / the
  header flag only.
- Store the token in a secret manager or your shell's keychain, not `.bashrc` in plaintext.
- Rotate the PAT on a schedule; revoke immediately if it leaks.
- Keep a dedicated **read-only** token for exploration and a scoped write token for CI/agents.
- Prefer fine-grained PATs limited to specific repos over classic all-repo tokens.

---

## 7. Quick Reference — Common Tools

| Goal | Tool |
|---|---|
| Who am I? | `mcp__github__get_me` |
| Find repos | `mcp__github__search_repositories` |
| Read a file | `mcp__github__get_file_contents` |
| Write/update a file | `mcp__github__create_or_update_file` |
| Push many files | `mcp__github__push_files` |
| New branch | `mcp__github__create_branch` |
| Open PR | `mcp__github__create_pull_request` |
| List/search issues | `mcp__github__list_issues` / `search_issues` |
| Create issue | `mcp__github__issue_write` |
| Review a PR | `mcp__github__pull_request_review_write` (+ `add_comment_to_pending_review`) |
| New repo | `mcp__github__create_repository` (pass `organization` for org repos) |

---

## 8. Case Study — What We Actually Did (Taible)

The exact zero → success path that produced the `Taible-io/playbok_startup` repo:

1. **Identity** — `get_me` → confirmed login `caeltarifa`. ✅
2. **First write attempt (personal account)** — `create_repository` →
   `403 Resource not accessible by personal access token`. ❌
   The connected PAT could read but not create repos on the personal account.
3. **Reconnect** — ran `/mcp` → Reconnect. Connection refreshed, but the *same token*
   still 403'd on personal-account create — a reconnect refreshes the connection, not
   the token's scopes.
4. **Switched target to the org** — called `create_repository` with
   `organization: "taible-io"`. ✅ Repo created at `Taible-io/playbok_startup`.
5. **Push** — `push_files` sent all `.md` playbooks to `main` in a single commit. ✅

**Lesson:** when personal-account repo creation is blocked by token scope, creating
inside an org you're authorized in (via the `organization` arg) is a clean unblock —
and a single `push_files` call commits many files atomically.

---

## 9. TL;DR One-Screen Recipe

```bash
# 1. Get a PAT with `repo`, `read:org`, `read:user` (classic PAT if you need to CREATE repos).
# 2. Register the server:
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \
  --header "Authorization: Bearer $GITHUB_PAT"
# 3. Verify:
claude mcp list                       # -> github connected
# 4. In chat, run the bootstrap prompt from §3.2.
# 5. Confirm all four Success Criteria from §0. Done.
```

---

*Save this file, reuse the prompts in §3, and any future GitHub MCP setup goes from
zero to success in one pass.*
