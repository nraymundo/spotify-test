# Handoff: Home D — Spotify Stats

## Overview
This is the **Home / Dashboard** screen for an iOS app that surfaces the user's Spotify
listening stats. "Variation D" combines an editorial hero number, three top-item
shortcut cards, a 30-day listening line chart, and a friend activity feed.

## About the Design Files
The files in this bundle are **design references created in HTML** — a React + inline
JSX prototype showing the intended look and behavior. They are not production code to
ship as-is.

Your job is to **recreate this design in the target codebase's existing environment**
(React, SwiftUI, React Native, etc.), reusing its established patterns, components,
and primitives. If no environment exists yet, choose the most appropriate framework
(SwiftUI is recommended for iOS-first delivery) and implement the design there.

## Fidelity
**Low-fidelity wireframe.** This file shows structure, hierarchy, and layout — not
final visuals. Treat the diagonal-stripe rectangles as **album-art / image
placeholders**; treat dashed borders as draft containers. Apply the target codebase's
design system (typography, color, iconography, real images) when rendering.

The wireframe deliberately uses placeholder typography (Inter / JetBrains Mono /
Caveat) and a tight palette. Do not lift these literally for production unless they
match the codebase's design tokens.

## Screen: Home D

### Purpose
Default landing surface after open. Single-glance summary of listening this week +
quick jumps into deeper stats + ambient social signal from friends.

### Layout (top → bottom)

1. **Header row** — `"Hi, <name>."` (handwritten/display type) on the left, circular
   avatar on the right.
2. **Sub-header** — small mono caption: `"week 17 of 52"`.
3. **Hero card** (dark, full-width, 16px radius)
   - Kicker (mono, uppercase): `"THIS WEEK · IN MINUTES"` in the yellow accent.
   - Big number (`487`) — heavy display type, ~92px, very tight tracking.
   - Tagline (handwritten): `"~ that's 8 hours, 7 mins"` in yellow accent.
   - Footer row of three mono stats: `↑ 12% vs last`, `89 PLAYS`, `23 ARTISTS`.
4. **Section head** — kicker `"quick jump"`, title `"Your top this month"`, action
   `"see all →"`.
5. **Top-3 shortcut grid** — 3 equal-width cards (artist / album / song):
   - Square album-art placeholder on top.
   - Bold name (1–2 lines, truncates).
   - Mono dim caption with stat (`14h`, `38 plays`, `21 plays`).
6. **30-day listening chart card** — bordered box, padding 12px:
   - Header: mono label `"Listening · 30 days"` left, range chip group right (`7d`,
     `30d` active, `6m`).
   - Line chart, fill area at ~18% opacity, stroke 2px, accent yellow.
7. **Friends feed** — section head `"What they're playing"`, then 3 stacked cards:
   - 36px round avatar, `@handle · TrackName` (handle bold, track regular dim),
     mono caption `Artist · time-ago`, small accent dot at right.

The whole screen scrolls inside a phone frame. A floating semi-opaque pill nav
(Home / Stats / Recent) is anchored 22px from the bottom of the phone, **outside** the
scroll content. Padding-bottom of 130px reserves space so the last item clears the nav.

### Floating Bottom Nav
- Pill, full-width with side margins, glass blur backdrop.
- Three tabs: Home, Stats, Recent.
- Active tab: icon + label tinted in **`accent2` (#588B8B)**, no background fill.
- Inactive: icon + label in `ink2` (`#3D3D3D` light / `#BFBAB0` dark).

## Interactions & Behavior
- Header avatar → opens Settings.
- Hero card → tappable, deep-link to Stats screen with "this week" range preset.
- "see all →" → opens combined top-items detail.
- Each top-3 card → opens its respective detail (Artists / Albums / Songs).
- Chip group on chart → switches range; chart re-animates between datasets.
- Friend card → opens friend profile / their listening history.
- Bottom nav tabs → cross-fade swap between Home, Stats, Recent.

## State Management
- `weekIndex`, `totalWeeks` (header)
- `weekMinutes`, `weekPlays`, `weekArtists`, `weekDeltaPct` (hero)
- `topArtist`, `topAlbum`, `topSong` with name + stat each
- `chartRange` ('7d' | '30d' | '6m'), `chartPoints[]`
- `friendsFeed[] = { handle, track, artist, lastPlayedAt }`
- All derived from Spotify API; cache for at least 5 minutes.

## Design Tokens

### Colors
| Token         | Light       | Dark        | Use                                    |
|---------------|-------------|-------------|----------------------------------------|
| `bg`          | `#F0EEE9`   | `#121212`   | App background                         |
| `surface`     | `#F7F5F0`   | `#1B1B1B`   | Cards / boxes                          |
| `ink`         | `#121212`   | `#F0EEE9`   | Primary text, dark hero card bg        |
| `ink2`        | `#3D3D3D`   | `#BFBAB0`   | Secondary text                         |
| `ink3`        | `#7A756B`   | `#85807A`   | Tertiary / dim                         |
| `line`        | `#121212`   | `#F0EEE9`   | Strong borders                         |
| `line2`       | `#C7C2B6`   | `#3A3833`   | Subtle borders / placeholder fills     |
| `accent`      | `#FFD166`   | `#FFD166`   | Hero kicker, chart stroke, accent dots |
| `accent2`     | `#588B8B`   | `#588B8B`   | Active nav, accent text on light bg    |

### Typography
- **Display / hand**: Caveat 600 — used for `"Hi, Olivia."` and the hero tagline.
- **Body**: Inter 400/500/600/700/800 — primary text, big numbers (800 + tight letter-spacing).
- **Mono**: JetBrains Mono 400/500/600 — captions, kickers, stat labels.

### Spacing / radius
- Card radius: 10–16px (hero 16, generic boxes 10).
- Page padding: 14px top, 20px sides, 130px bottom (clears floating nav).
- Section gap: ~18px between major sections, ~10px inside lists.

## Assets
- Album-art / avatar placeholders are diagonal-stripe SVG-equivalent CSS gradients —
  **swap for real Spotify artwork URLs in production.**
- No icons baked in; the bottom nav uses 18px line-art SVG glyphs (home/stats/recent).
  Replace with the codebase's existing icon set.

## Files
- `home-screens.jsx` — defines `HomeA`, `HomeB`, `HomeC`, `HomeD`. Render `<HomeD>`.
- `wireframe-kit.jsx` — primitive components: `WFPhone`, `WFBottomNav`, `WFBox`,
  `WFArt`, `WFChip`, `WFLine`, `WFMono`, `WFHand`, `WFSectionHead`, color tokens
  via `useWFTokens(dark)`.
- `ios-frame.jsx` — iPhone bezel + status bar wrapper.
- `preview.html` — open in a browser to see Home D rendered standalone.

## Implementation notes
- The original prototype mounts components on `window` so multiple `<script>` tags
  can share scope. In a real codebase, use normal ES module imports.
- All `dark` props can be replaced with the codebase's theme provider / context.
- The phone frame wrapper is for prototype display only — not needed in the real app.
