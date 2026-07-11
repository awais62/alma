# 0001. Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-07-08
- **Deciders:** caeltarifa

## Context
As Taible grows and new engineers join, we need a durable record of *why* the architecture is shaped the way it is — not just the current diagrams. Decisions made only in chat or in someone's head are lost and get re-litigated.

## Decision
We will keep Architecture Decision Records (ADRs) in this repo under `adr/`, one markdown file per significant decision, using the format in `template.md`. ADRs are immutable once accepted; a changed decision is captured by a new ADR that supersedes the old one.

## Consequences
- The reasoning behind the system is written down and reviewable via PR.
- Onboarding and investor diligence both get a ready-made decision trail.
- Small ongoing cost: authors must write a short ADR for significant choices.

## Alternatives considered
- **Only diagrams, no ADRs** — shows *what* but never *why*; rejected.
- **Decisions in a wiki / Notion** — drifts from the code and isn't versioned with the architecture; rejected.
