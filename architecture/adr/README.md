# Architecture Decision Records (ADRs)

An ADR captures **one significant architecture decision**: the context, the choice, and its consequences. They are short, immutable once accepted, and superseded (not edited) when a decision changes.

## Why we keep them
- New engineers understand *why* the system looks the way it does, not just *what* it is.
- During fundraising / diligence, the decision trail is already written down.

## How to add one
1. Copy [`template.md`](./template.md) to `NNNN-short-title.md` (next number, zero-padded).
2. Fill it in. Keep it to a page.
3. Open a PR. Discuss and merge with status **Accepted**.
4. To reverse a past decision, add a **new** ADR that supersedes the old one; mark the old one `Superseded by NNNN`.

## Log
- [0001](./0001-record-architecture-decisions.md) — Record architecture decisions
- [0002](./0002-d2-c4-and-ci-rendering.md) — Use D2 + C4 with CI rendering for architecture
