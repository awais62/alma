# Taible — Web App UI Design Brief (Guest PWA + Staff Display)

> **What this is:** the design + UI prompt for the diner-facing PWA and the staff order
> display. Paste it into Claude Code (or your design tool) to generate the interface.
> It maps to the [`web-app`](https://github.com/Taible-io/web-app) repo.
>
> **Scope:** MVP / Proof of Concept — validate **one** workflow. Nothing else. Do **not**
> design additional restaurant-management features.

---

## Tech stack

- **Next.js + React + TypeScript** — mobile-first Progressive Web App
- **Tailwind CSS**
- **Pipecat Client SDK** — voice transport
- **Supabase JS + Realtime** — orders/menu data and live updates
- **Cloudflare Pages** — hosting (via `@cloudflare/next-on-pages`)

> **Stack note:** this build targets **Next.js**, not Vite. Prefer the App Router; keep
> the guest flow client-rendered where it needs mic/WebRTC, and lean on Server Components
> for the static menu/shell.

---

## Core user journey

The entire product revolves around this experience:

1. A customer arrives at a restaurant or café.
2. A staff member opens Taible on their phone and displays a **QR code for that table**.
3. The customer scans the QR code.
4. The customer immediately starts talking to the **AI voice waiter**.
5. The AI builds the order through conversation.
6. The customer **confirms** the order.
7. The staff **instantly** receives the order on their dashboard.
8. Staff marks the order as **accepted** and later **delivered**.

**Nothing else.** The goal is to demonstrate the core value proposition, not a complete POS system.

---

## Brand & visual style

Warm, minimal and modern. Inspired by the Taible logo, where **TAI** forms a wooden table with a small green plant.

### Colors

| Token | Hex | Used for |
|---|---|---|
| **Table Brown** | `#8F5E3A` | Brand color · headers · table chips · icons · QR card border |
| **Ink Black** | `#141414` | Primary text |
| **Leaf Green** | `#5BA85C` | *Sparingly:* primary buttons · voice orb · success states · active confirmations |
| **Warm White** | `#FAF8F5` | Main background |
| **Border** | `#E5DFD8` | Borders (no heavy shadows) |
| **Rust** | `#B0532F` | *Only:* Sold Out · delete actions · errors |

### Other

- **Typography:** Inter
- **Rounded corners:** 12 px
- **No gradients. No glassmorphism. No heavy shadows.**
- **Large whitespace.**

The interface should feel calm, premium and incredibly simple.

---

## Guest experience (390px mobile)

The customer **never creates an account.** No login. No onboarding. No install prompt.
After scanning the QR, the restaurant and table are already known.

### Screen 1 — Welcome
- Taible logo
- Restaurant name
- Brown chip: **Table 12**
- Headline: **"Hi! I'm your AI waiter."**
- Subheadline: **"Tell me what you'd like to order."**
- Primary button: **Start Talking**
- Secondary link: **Browse Menu**
- Small microphone-permission explanation

### Screen 2 — Voice Conversation (hero screen)
- Large **animated voice orb** with states: **Listening · Thinking · Speaking · Muted**
- Below: conversation transcript
  - Customer messages on the **right**
  - Assistant messages on the **left**
  - Streaming assistant responses
- Bottom bar: **Mute · Call Staff · Cart**
- Everything spoken by the AI must **always remain visible as text.**

The experience should feel conversational, calm and trustworthy.

### Screen 3 — Menu
- Simple browse experience.
- Categories: **Coffee · Food · Desserts · Drinks**
- Each card: photo · name · short description · price
- Unavailable items stay visible with a **Sold Out** state.
- Selecting an item opens a lightweight **bottom sheet** with: description · ingredients · allergens · **"Ask the assistant about this"**

### Screen 4 — Order Review (bottom sheet)
- Ordered items · quantity · total
- Buttons: **Confirm Order** · **Keep Talking**
- After confirmation → simple **success screen**: "Your order has been sent." + estimated preparation time.

### Edge states (only these)
- Microphone denied
- Connection lost
- Waiter called

---

## Staff experience (responsive — tablet & desktop)

Should feel like a **lightweight kitchen display**, not an admin dashboard.
Only **two** sections exist: **Orders · Menu**. Nothing else.

### Orders (primary screen)
- Simple **Kanban board**, three columns: **New · Preparing · Delivered**
- Each order card: table number · ordered items · quantity · time received
- Primary action per stage: **Accept → Ready → Delivered**
- New orders animate subtly when received.
- Large touch-friendly cards. Fast interaction.
- **No** filters, analytics, statistics, charts, or revenue.

### Menu
- Simple **editable list.** Each row: photo · item name · price · availability toggle
- Staff can: edit price · edit name · upload photo · enable/disable availability · add new menu item
- **No** advanced category management, inventory, or ingredients editor beyond basic text.

Think of the staff experience as a **beautiful, minimal order inbox.**

---

## Shared components

Create only the components needed for the MVP:

Primary button · Secondary button · Voice orb · Order card · Menu card ·
Availability toggle · Bottom sheet · Toast notification · Empty state · Table chip · Brown divider

---

## Design principles

The application should feel: **extremely simple · extremely fast · beautiful · production-ready · understandable in under one minute.**

Avoid unnecessary screens or enterprise features. **Do NOT generate:**

Analytics · Revenue dashboards · Sales reports · Restaurant settings · User management ·
Employee management · Inventory · Reservations · Loyalty · CRM · Multi-location management · Business intelligence

---

## The one clear message

> A customer scans a QR code, talks naturally with an AI waiter, confirms the order, and the
> restaurant immediately receives it in a clean, distraction-free dashboard.
