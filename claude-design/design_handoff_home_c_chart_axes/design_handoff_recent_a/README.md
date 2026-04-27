# Handoff: Recent (A) + Day Detail

## Overview
This bundle covers **two screens** in the Recent flow:

1. **Recent (A)** — the main "Recent" tab, a 3-column album-art grid
   grouped by day. For now, **only show two day groups**: `TODAY` and
   `YESTERDAY`. Each group has a "see all →" affordance that links to
   the day detail screen.
2. **Day Detail** — a single-day full track list, reached by tapping
   "see all" on a day group.

## About the Design Files
The files in this bundle are **design references created in HTML** — a
React + inline JSX prototype showing the intended look. They are not
production code to ship as-is.

Use them to understand layout, hierarchy, and copy. Apply your own
design tokens for type, color, and spacing.

## Fidelity
**Low-fidelity wireframe.** Structure and placement, not final visuals.

---

## Screen 1 · Recent (A)

### Layout
```
┌─────────────────────────────────────────────────┐
│  Recent                              filter ▾    │
├─────────────────────────────────────────────────┤
│  TODAY                       12 plays · 47m      │
│  ┌──────┐  ┌──────┐  ┌──────┐                    │
│  │ art  │  │ art  │  │ art  │                    │
│  └──────┘  └──────┘  └──────┘                    │
│   title    title    title                        │
│   artist   artist   artist                       │
│  ┌──────┐  ┌──────┐  ┌──────┐                    │
│  │ art  │  │ art  │  │ art  │                    │
│  └──────┘  └──────┘  └──────┘                    │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─           │
│  showing 6 of 12          SEE ALL 12 →           │
├─────────────────────────────────────────────────┤
│  YESTERDAY                  18 plays · 1h 12m    │
│  (same 6-tile grid)                              │
│  showing 6 of 18          SEE ALL 18 →           │
└─────────────────────────────────────────────────┘
```

### Behavior
- **Two day groups only**: `TODAY` and `YESTERDAY`. (Older days come
  later — out of scope for this handoff.)
- Each group shows the **first 6 plays** as a 3-col album-art grid.
- Beneath the grid, a divider row with:
  - left: caption `showing 6 of {total}` (dim mono)
  - right: link `SEE ALL {total} →` (accent color, mono uppercase, ~10px)
- Tapping anywhere on that row navigates to the **Day Detail** screen.

### Copy
- Group label `TODAY` / `YESTERDAY` — uppercase mono.
- Group sub-label `{plays} plays · {duration}` — uppercase mono, dim.
- Tile body: track title (Inter 11px / 600), `artist` (mono dim 9px),
  play time (mono dim 9px, e.g. `3:24p`), right-aligned.

---

## Screen 2 · Day Detail

### Layout
```
┌─────────────────────────────────────────────────┐
│  ← recent                                        │
│                                                  │
│  THU · APR 24                                    │
│  Today                                           │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │ PLAYS  │ LISTENING │ ARTISTS │ STREAK    │   │
│  │   12   │   47m     │    7    │   23d     │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  [by time]  [by artist]  [longest]               │
│                                                  │
│  9:42a  ▢  Track title                  3:24    │
│            artist · album                        │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─        │
│  10:18a ▢  Track title                  3:24    │
│            artist · album                        │
│  …(12 rows)                                      │
│                                                  │
│  end of day · 12 plays                           │
└─────────────────────────────────────────────────┘
```

### Sections (top to bottom)
1. **Back affordance** — `← recent` (mono dim). Returns to Recent (A).
2. **Day header** — kicker `THU · APR 24` (mono dim) + display `Today`
   (Inter 26px / 800, `-0.6` letter-spacing). For yesterday's detail,
   the kicker is `WED · APR 23` and display is `Yesterday`.
3. **Summary card** — single bordered card, 4 stats in a row:
   - **PLAYS** · `12`
   - **LISTENING** · `47m` (suffix is mono small/dim)
   - **ARTISTS** · `7` (distinct artists)
   - **STREAK** · `23d` (current daily-listening streak)
   - Stat labels: mono uppercase 9px dim. Stat values: Inter 18px / 800.
4. **Sort chips** — `by time` (active) · `by artist` · `longest`. The
   list re-orders accordingly. Default: `by time` ascending.
5. **Track list** — full list of every play that day (12 for Today,
   18 for Yesterday). Each row:
   - timestamp (mono dim 9px, e.g. `9:42a`), 36px right-aligned
   - 36px square album art
   - title (Inter 12px / 700) + `artist · album` (mono dim 9px)
   - duration (mono dim 9px), e.g. `3:24`
   - 8px vertical padding, dashed `1px` top border between rows.
6. **End footer** — centered mono dim `end of day · 12 plays`.

### Behavior notes
- The `← recent` affordance **must** preserve scroll position when
  returning to Recent (A) — users will tap into a day, scroll, and
  come back; don't reset.
- Sort chips re-order client-side. They do **not** filter — every play
  is always visible.
- "Longest" sorts by play duration (full plays first, partial/skipped
  plays toward the bottom).

---

## Typography (shared)
- Body: `Inter` (use your codebase's body font).
- Mono: `JetBrains Mono` (use your codebase's mono font).
- Hand: not used in these screens.

## Color
- Use your codebase's `accent2` / "secondary accent" color for the
  `SEE ALL` link and any positive numerical highlights.
- Dim text = your tertiary/caption color.
- Card border = 1.5px primary ink at low contrast.

## Implementation notes
- The "see all" affordance only renders when `totalPlays > tilesShown`.
  In production, the cap might rise or fall — gate on the inequality,
  not the literal numbers.
- Day-detail data should be **route-parameterized** by date (`/recent/{yyyy-mm-dd}`)
  so deep links work. The current screen mocks "today" but the
  component should accept a date prop.

## Files
- `recent-a.html` — visual reference of the Recent tab with TODAY +
  YESTERDAY groups and the see-all rows.
- `day-detail.html` — visual reference of the day detail screen.
