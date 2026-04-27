# Handoff: Stats C — Power-user dashboard

## Overview
This is the **Stats** screen for an iOS app that surfaces the user's Spotify
listening data. "Variation C" is the **power-user dashboard**: a dense,
scroll-rich layout that prioritizes total numbers, comparisons, and multiple
breakdown charts on a single screen.

## About the Design Files
The files in this bundle are **design references created in HTML** — a React +
inline JSX prototype showing the intended look and behavior. They are not
production code to ship as-is.

Your job is to **recreate this design in the target codebase's existing
environment** (React, SwiftUI, React Native, etc.), reusing its established
patterns, components, and primitives. If no environment exists yet, choose the
most appropriate framework (SwiftUI is recommended for iOS-first delivery) and
implement the design there.

## Fidelity
**Low-fidelity wireframe.** This file shows structure, hierarchy, and layout —
not final visuals. Treat the diagonal-stripe rectangles as **album-art / image
placeholders**; treat dashed borders as draft containers. Apply the target
codebase's design system (typography, color, iconography, real images) when
rendering.

The wireframe deliberately uses placeholder typography (Inter / JetBrains Mono /
Caveat) and a tight palette. Do not lift these literally for production unless
they match the codebase's design tokens.

## Screen: Stats C

### Purpose
Single-screen dashboard for users who want detail. Optimised for **comparison
and trends** rather than storytelling. Designed to be scrolled top-to-bottom
once, with each section answering a specific question.

### Layout (top → bottom)

1. **Title row** — `"Stats"` heading, 22px bold, left-aligned. No actions.
2. **Range chips** — segmented selector with three options:
   `Week` · `Month` (active) · `6 months`. Pill chips, active fills with ink,
   inactive is outlined.
3. **Hero card** (bordered box, 14px padding)
   - Top row, two columns:
     - **Left**: kicker `"total · 6mo"` (mono dim), big number `13,422` (38px,
       weight 800, tight tracking) with a small `min` suffix in mono.
     - **Right**: kicker `"vs prev"` (mono dim), `↑ 22.4%` in accent2 teal,
       14px weight 700.
   - **Below**: 30-day filled line chart, 80px tall, accent yellow stroke +
     ~18% opacity fill.
4. **Metric grid** — 3×2 grid of small KPIs in a single bordered card:
   `plays 1,892` · `unique 463` · `skips 12%` · `avg/day 74m` · `peak day thu`
   · `peak hr 10p`. Each cell: mono caption (9px dim) + 16px bold value.
5. **Top split** — 2-column grid of two cards:
   - **Top artist** card: artist artwork placeholder (square, 90px tall),
     `"The Weather Station"` (12px bold), mono caption `"14h · 38 plays"`.
   - **Top album** card: same shape, `"Ignorance"`, `"9h · 38 plays"`.
6. **Top genres** — horizontal bar list with 5 rows. Each row:
   - Genre label (~110px wide, 11px) e.g. `indie folk`.
   - Track bar (8px tall, fully rounded) with fill width = % share.
     #1 row uses accent yellow, others use ink.
   - Mono percentage on the right (28px right-aligned).
   - Sample data: `indie folk 92` · `art pop 64` · `chamber pop 50` ·
     `singer-songwriter 38` · `ambient 22`.
7. **Genre over time** — stacked bar chart, 12 vertical bars (≈12 months).
   Each bar has 3 colored bands: accent yellow (band #1), ink (band #2),
   ink3 grey (band #3). Tallness of each band = that genre's minutes that
   month. Caption row: `nov` left, `apr` right.
8. **Genre over time (duplicate)** — same chart again, currently included
   for scroll-comparison purposes; in production you'd likely keep just one
   or wire the second to a different metric.

The whole screen scrolls inside a phone frame. A floating semi-opaque pill nav
(Home / Stats / Recent) is anchored 22px from the bottom of the phone, **outside**
the scroll content. Padding-bottom of 130px reserves space so the last item
clears the nav.

### Floating Bottom Nav
- Pill, full-width with side margins, glass blur backdrop.
- Three tabs: Home, Stats (active here), Recent.
- Active tab: icon + label tinted in **`accent2` (#588B8B)**, no background fill.
- Inactive: icon + label in `ink2` (`#3D3D3D` light / `#BFBAB0` dark).

## Interactions & Behavior
- Range chips → switch the dataset everywhere on the screen (hero number,
  metric grid, all charts) and re-animate.
- Hero card → tappable, opens a full-screen detail with the hero chart
  zoomable + scrubbable.
- Each metric tile → opens that metric's detail (e.g. tapping "skips" opens a
  per-track skip-rate list).
- Top artist / top album cards → open artist or album detail.
- Top genres rows → tap to filter the dashboard to that genre.
- Genre over time bars → tap a month to jump to that month's recap.
- Bottom nav tabs → cross-fade swap between Home, Stats, Recent.

## State Management
- `range` ('week' | 'month' | '6mo'), default `'month'`.
- `totalMinutes`, `vsPrevPct` (hero, derived from range)
- `chartPoints[]` for the hero line chart
- `metrics = { plays, unique, skips, avgPerDay, peakDay, peakHour }`
- `topArtist = { name, plays, minutes, artworkUrl }`
- `topAlbum  = { name, plays, minutes, artworkUrl }`
- `topGenres[] = { name, sharePct }` — top 5
- `genreTimeline[] = [{ month, byGenre: { [genreName]: minutes } }]` — 12 months
- All derived from Spotify API; cache for at least 5 minutes.

## Design Tokens

### Colors
| Token         | Light       | Dark        | Use                                    |
|---------------|-------------|-------------|----------------------------------------|
| `bg`          | `#F0EEE9`   | `#121212`   | App background                         |
| `surface`     | `#F7F5F0`   | `#1B1B1B`   | Cards / boxes                          |
| `ink`         | `#121212`   | `#F0EEE9`   | Primary text, active chip fill         |
| `ink2`        | `#3D3D3D`   | `#BFBAB0`   | Secondary text                         |
| `ink3`        | `#7A756B`   | `#85807A`   | Tertiary / dim, genre-bar #3 band      |
| `line`        | `#121212`   | `#F0EEE9`   | Strong borders                         |
| `line2`       | `#C7C2B6`   | `#3A3833`   | Subtle borders / placeholder fills     |
| `shade`       | `#E8E4DC`   | `#252525`   | Track bar background                   |
| `accent`      | `#FFD166`   | `#FFD166`   | Hero chart, #1 genre bar, accent dots  |
| `accent2`     | `#588B8B`   | `#588B8B`   | "vs prev" delta, active nav            |

### Typography
- **Display / hand**: Caveat 600 — not used on this screen, but available in
  the kit.
- **Body**: Inter 400/500/600/700/800 — primary text, big numbers (800 + tight
  letter-spacing).
- **Mono**: JetBrains Mono 400/500/600 — captions, kickers, stat labels.

### Spacing / radius
- Card radius: 10–14px.
- Page padding: 14px top, 16px sides, 130px bottom (clears floating nav).
- Section gap: ~10px between cards.
- Bottom-nav anchor: 22px from phone-bottom, ~16px side margins.

## Assets
- Album-art / avatar placeholders are diagonal-stripe SVG-equivalent CSS
  gradients — **swap for real Spotify artwork URLs in production.**
- No icons baked in; the bottom nav uses 18px line-art SVG glyphs
  (home/stats/recent). Replace with the codebase's existing icon set.

## Files
- `stats-screens.jsx` — defines `StatsA`, `StatsB`, `StatsC`. Render `<StatsC>`.
- `wireframe-kit.jsx` — primitive components: `WFPhone`, `WFBottomNav`,
  `WFBox`, `WFArt`, `WFChip`, `WFLine`, `WFMono`, `WFHand`, `WFSectionHead`,
  color tokens via `useWFTokens(dark)`.
- `ios-frame.jsx` — iPhone bezel + status bar wrapper.
- `preview.html` — open in a browser to see Stats C rendered standalone.

## Implementation notes
- The original prototype mounts components on `window` so multiple `<script>`
  tags can share scope. In a real codebase, use normal ES module imports.
- All `dark` props can be replaced with the codebase's theme provider /
  context.
- The phone frame wrapper is for prototype display only — not needed in the
  real app.
- The "Genre over time" duplicate is intentional in the wireframe so the
  designer could compare two states; production should keep only one (or wire
  the second instance to a different breakdown — e.g. mood, decade).
