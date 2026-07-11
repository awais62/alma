# 0002. Use D2 + C4 with CI rendering for architecture

- **Status:** Accepted
- **Date:** 2026-07-08
- **Deciders:** caeltarifa

## Context
We need architecture diagrams for the whole company (microservices, UI, database) that a DevOps-led team can version and evolve. Binary diagram files (drawn in a GUI) don't diff, don't review well in PRs, and drift from reality. We want diagrams treated like code.

## Decision
- Author all diagrams as **[D2](https://d2lang.com)** source (`.d2`) — text that diffs and reviews like code.
- Organize them with the **[C4 model](https://c4model.com)** (Context → Container → Component), plus `data/` and `ui/` folders.
- **CI renders** `.d2` → `.svg` with a pinned D2 version: PRs validate that every diagram renders; merges to `main` commit the SVGs into `rendered/`. Source is the truth; renders are generated artifacts.
- Apply a single D2 theme across all diagrams so they read as one system.

## Consequences
- Full version history of the architecture; changes go through PR review.
- No manual exports to drift out of date.
- Contributors need D2 installed to preview locally (optional — CI is authoritative).
- Bumping the pinned D2 version is a deliberate, reviewed change.

## Alternatives considered
- **Mermaid** — great for inline docs, but weaker for large multi-level system diagrams and theming; rejected as the primary tool.
- **draw.io / Excalidraw / Lucidchart** — GUI-first, binary or lock-in formats that don't diff cleanly; rejected.
- **PlantUML** — capable, but heavier toolchain and less modern output than D2 for our needs; rejected.
