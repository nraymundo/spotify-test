# Quick Jump — "Your top this week"

Standalone handoff for the three-up shortcut card section in HomeD.

## Files
- `QuickJump.html` — self-contained HTML/CSS reference (drop into a browser to preview)
- `QuickJump.jsx` — React component (matches main project style)
- `tokens.css` — color + type tokens used

## Anatomy

```
┌─────────────────────────────────────────────┐
│ QUICK JUMP                       see all →  │  ← kicker (mono 10px) + action (teal mono 11px)
│ Your top this week                          │  ← title (Caveat 28px hand)
├─────────────────────────────────────────────┤
│ ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│ │ ARTIST  │  │ ALBUM   │  │ SONG    │      │  ← label (mono 9px ALL CAPS)
│ │ ░░░░░░░ │  │ ░░░░░░░ │  │ ░░░░░░░ │      │  ← 84px placeholder art
│ │ ░░░░░░░ │  │ ░░░░░░░ │  │ ░░░░░░░ │      │
│ │ The     │  │ Ignor-  │  │ Atlantic│      │  ← title (Inter 11/700)
│ │ Weather │  │ ance    │  │         │      │
│ │ Station │  │         │  │         │      │
│ │ 14h     │  │ 38 plays│  │ 21 plays│      │  ← meta (mono 9px)
│ └─────────┘  └─────────┘  └─────────┘      │
└─────────────────────────────────────────────┘
```

## Tokens

| Token       | Hex       | Used for                          |
|-------------|-----------|-----------------------------------|
| `--bg`      | `#F0EEE9` | page background                   |
| `--paper`   | `#FAF7F1` | card background                   |
| `--ink`     | `#121212` | primary text                      |
| `--ink3`    | `#7A756B` | meta + kicker                     |
| `--line`    | `#C7C2B6` | dashed card border                |
| `--accent2` | `#588B8B` | "see all" link (teal)             |

Fonts:
- **Caveat 700** — section title (handwritten feel)
- **JetBrains Mono** — kickers, labels, meta, action link
- **Inter 700** — card name

## Layout rules

- 3-column CSS grid, `gap: 10px`, equal `1fr` columns.
- Card: 1.5px **dashed** border (`--line`), `border-radius: 10px`, `padding: 10px`.
- Card content uses `flex: column` so meta sits at the bottom and `.name` flexes (`min-height: 26px` ensures 2-line consistency across all 3 cards).
- Art block is `height: 84px`, diagonal repeating-linear-gradient hatch placeholder. Replace with real `<img>` when wiring up.

## Behavior

- Tap card → navigate to corresponding detail screen (`/top/artists`, `/top/albums`, `/top/songs`) pre-filtered to "this week".
- Tap "see all →" → `/top` overview.
- Cards should preserve their position when navigating back (no re-fetch flash).

## Interaction states (suggested)

- **Pressed**: scale `0.98`, 80ms ease.
- **Hover** (iPad): `border-style: solid`, accent2 `#588B8B` border.
- **Loading**: keep label + meta, hatch art stays as placeholder.

## Dark mode equivalents

| Token       | Dark hex  |
|-------------|-----------|
| `--bg`      | `#1B1B1A` |
| `--paper`   | `#242422` |
| `--ink`     | `#F0EEE9` |
| `--ink3`    | `#9A968B` |
| `--line`    | `#3A3A38` |
| `--accent2` | `#7BB0B0` |
