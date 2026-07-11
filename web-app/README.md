# Taible PWA — MVP

The simplest useful version: a guest scans the table QR, **orders by voice**; staff open one screen and **see orders arrive live**. Nothing else.

🎨 **Design / prototype:** [Figma — AI Voice Ordering Assistant](https://www.figma.com/make/L0XtLsWMQtblR5q6bovIB2/AI-Voice-Ordering-Assistant?t=HCyNXTMQC3fedoi8-20&fullscreen=1)

## Scope

| Role | Gets | Doesn't get (yet) |
|---|---|---|
| Guest | Welcome → voice conversation (orb + live transcript) → spoken order confirmation | Visual menu browsing, cart editing UI |
| Staff | One live orders board (`/staff`, PIN-protected): table #, items, time, "Done" button | Menu editor, QR generator page, stats, login system |

**The MVP trick — admin UI is Supabase itself:** menu items, prices and the "sold out" flag are edited directly in the Supabase table editor (free, already built, works on a phone). Table QR codes are generated once by a 20-line script (`scripts/make-qrs.ts`) that outputs printable PNGs. Both get real UIs later; neither blocks launch.

## Tech stack & roles

| Piece | Role |
|---|---|
| **Vite + React + TS** | Build tool + UI runtime + types. Two routes: `/t/:restaurant/:table` (guest) and `/staff` (lazy). |
| **Tailwind CSS** | Styling; brand tokens (brown `#8F5E3A`, green `#5BA85C`, ink `#141414`) in config. Few KB, no runtime. |
| **Pipecat client SDK** | The voice wire: WebRTC to the Pipecat server, mic out / agent audio in, events (listening/thinking/speaking + transcripts) drive the orb and feed. |
| **Supabase JS (Realtime)** | `orders` table subscription → staff board updates live, no polling. Also serves the menu the MCP tools read. |
| **Cloudflare Pages** | Free static hosting from the edge (Buenos Aires POP included). |

Dropped from the full stack: **Zustand** (React `useState`/`useReducer` is enough at this size), **vite-plugin-pwa** (add when installability/offline matters), all chart/QR runtime libraries.

## Latency targets

| Moment | Target |
|---|---|
| QR scan → welcome screen interactive | < 1.5 s |
| Tap "start talking" → ready to talk (WebRTC up) | < 1.5 s |
| Voice-to-voice response (guest stops talking → agent starts) | < 1.5 s (≤ 2 s with menu/order tool call) |
| Order confirmed → card on staff board | < 1 s |

## Folder structure

```
taible-pwa/
├── index.html               # Shell; preconnect to Pipecat/TURN + Supabase
├── vite.config.ts
├── tailwind.config.ts       # Brand tokens
├── scripts/
│   └── make-qrs.ts          # One-off: printable QR PNG per table
└── src/
    ├── main.tsx             # Router: guest route eager, /staff lazy
    ├── pages/
    │   ├── Guest.tsx        # Welcome → conversation → order-confirmed, one flow
    │   └── Staff.tsx        # PIN gate + live orders board
    ├── components/
    │   ├── VoiceOrb.tsx     # listening / thinking / speaking / muted
    │   ├── Transcript.tsx   # Streaming chat feed
    │   └── OrderCard.tsx    # Table #, items, elapsed time, Done button
    ├── lib/
    │   ├── pipecat.ts       # SDK client factory + event → state glue
    │   └── supabase.ts      # Client + orders channel subscription
    └── styles.css           # Tailwind entry
```

~10 source files. Rule kept from day one: nothing heavy may be imported by `Guest.tsx` — it ships only the SDK, the orb and the transcript.

## Grows into

The full app (menu browse UI, staff menu editor, QR page, stats, Zustand, PWA offline) extends this same repo — `pages/` becomes `routes/guest|staff/`, state moves into stores, nothing is thrown away.

---

Part of the [Taible voice agent](https://github.com/Taible-io/architecture). Talks to [`voice-orchestration`](https://github.com/Taible-io/voice-orchestration) (Pipecat/WebRTC) and reads/writes via [`mcp-server`](https://github.com/Taible-io/mcp-server). New here? Start at [playbok_startup](https://github.com/Taible-io/playbok_startup).
