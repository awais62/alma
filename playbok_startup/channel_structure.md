# Taible — Discord Server Channel Structure

Documentation of the Discord server channel setup created for the **Taible** startup.

- **Server:** Taible
- **Guild ID:** `1523737340202324068`
- **Date created:** 2026-07-07
- **Created via:** Claude Code + `discord-mcp`

---

## 1. The Request (Prompt)

> Create the following channels on my Discord server for Taible:
>
> **CORE CHANNELS:**
> - announcements
> - general
> - random
>
> **INTERNAL TEAM:**
> - engineering
> - product
> - marketing
> - finance
>
> **PROJECT FOCUS:**
> - ai-model-nlp
> - mobile-app
> - crypto-payments
> - restaurant-partnerships
>
> **COMMUNITY:**
> - restaurant-partners
> - beta-testers
> - investors
>
> **ADMIN:**
> - resources
> - logs
>
> Please create all of these channels and organize them logically.

---

## 2. The Result

5 categories were created, 15 new text channels were created, and the pre-existing
`#general` channel was **moved** into CORE CHANNELS (rather than duplicated).

### 📁 CORE CHANNELS
| Channel          | Type | ID                     | Notes                          |
| ---------------- | ---- | ---------------------- | ------------------------------ |
| `#announcements` | text | `1524056107457445898`  | new                            |
| `#general`       | text | `1523737342379299011`  | existing channel, moved here   |
| `#random`        | text | `1524056172469026937`  | new                            |

**Category ID:** `1524055537682092084`

### 📁 INTERNAL TEAM
| Channel        | Type | ID                     |
| -------------- | ---- | ---------------------- |
| `#engineering` | text | `1524056450819821619`  |
| `#product`     | text | `1524056452854059160`  |
| `#marketing`   | text | `1524056579219914842`  |
| `#finance`     | text | `1524056705107886090`  |

**Category ID:** `1524055540030902314`

### 📁 PROJECT FOCUS
| Channel                     | Type | ID                     |
| --------------------------- | ---- | ---------------------- |
| `#ai-model-nlp`             | text | `1524056830957846669`  |
| `#mobile-app`               | text | `1524056956665467073`  |
| `#crypto-payments`          | text | `1524057082993836144`  |
| `#restaurant-partnerships`  | text | `1524057208369840221`  |

**Category ID:** `1524055668879786154`

### 📁 COMMUNITY
| Channel                | Type | ID                     |
| ---------------------- | ---- | ---------------------- |
| `#restaurant-partners` | text | `1524057334241034481`  |
| `#beta-testers`        | text | `1524057460019560587`  |
| `#investors`           | text | `1524057585664397375`  |

**Category ID:** `1524055794453184645`

### 📁 ADMIN
| Channel      | Type | ID                     |
| ------------ | ---- | ---------------------- |
| `#resources` | text | `1524057711774531716`  |
| `#logs`      | text | `1524057837758713876`  |

**Category ID:** `1524055920785620992`

---

## 3. Uncategorized / Pre-existing

| Channel          | Type  | Notes                                                        |
| ---------------- | ----- | ----------------------------------------------------------- |
| `#documentation` | text  | Created earlier to hold the Discord MCP setup docs.         |
| `General`        | voice | Original voice channel from the server's initial creation.  |

---

## 4. Summary

- **Categories created:** 5 (CORE CHANNELS, INTERNAL TEAM, PROJECT FOCUS, COMMUNITY, ADMIN)
- **New text channels created:** 15
- **Channels moved:** 1 (`#general` → CORE CHANNELS)
- **Total requested channels in place:** 16 / 16 ✅

---

*Generated as part of setting up the Taible startup's Discord workspace via Claude Code + discord-mcp.*
