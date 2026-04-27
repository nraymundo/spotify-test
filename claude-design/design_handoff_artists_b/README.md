# Handoff: Top Artists B — Podium / editorial

## Overview
This is the **Top Artists detail screen** for an iOS app that surfaces the
user's Spotify listening data. "Variation B" is the **podium / editorial**
treatment: a magazine-style hierarchy where #1 gets a full-width hero square,
#2 and #3 share a row of half-width tiles, and ranks 4–10 collapse into a
compact list below.

## Where this screen comes from

This screen is opened when the user taps either of these entry points:

| Source screen | Trigger element |
| --- | --- |
| **Stats C** (power-user dashboard) | The **"Top artist"** card in the *Top split* section (the bordered card with the artist artwork, name, and `"14h · 38 plays"` caption). |
| **Home D** | The **"Top Artist"** card on the home screen. |

Both entry points should push this `ArtistsB` screen onto the navigation stack
with a standard slide transition. The screen pre-selects the **Month** range
(matching the default for both source screens); selecting a different chip
re-fetches the ranking for that window.

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
not final visuals. Treat the diagonal-stripe rectangles as **artist artwork
placeholders**; treat dashed borders as draft containers. Apply the target
codebase's design system (typography, color, iconography, real images) when
rendering.

The wireframe deliberately uses placeholder typography (Inter / JetBrains Mono /
Caveat) and a tight palette. Do not lift these literally for production unless
they match the codebase's design tokens.

## Screen: Top Artists B

### Purpose
Editorial-feeling leaderboard for the user's most-listened artists. Optimised
for **storytelling and visual recognition** — #1 is celebrated like a magazine
cover, #2/#3 are clear runners-up, and the long tail is acknowledged without
competing for attention.

### Layout (top → bottom)

1. **Kicker** — `"top · this month"`, mono dim, 10px.
2. **Title** — `"Top Artists"`, 24px weight 800, tight tracking (-0.6).
3. **Range chips** — segmented selector with three options:
   `Week` · `Month` (active) · `6mo`. Pill chips, active fills with ink,
   inactive is outlined.
4. **#1 hero card**
   - **Artwork**: full-column-width **square** placeholder (1:1 aspect ratio),
     `accent`-bordered, no rounding.
   - **Caption row** below the artwork (6px gap):
     - Left: `#1` (dim ink3, 8px right margin) + artist name
       (`"The Weather Station"`, 16px, weight 700).
     - Right: total listening time (`"14h"`, 16px, weight 700, `accent2` teal).
5. **#2 / #3 row** — 2-column grid, 10px gap.
   - Each cell: square artwork (1:1, no rounding) + caption row underneath:
     - Rank (`#2` / `#3` in dim ink3) + name (13px, weight 700) on one line.
     - Mono caption (9px dim) with formatted listening time
       (`"9h 04m"` / `"7h 12m"`).
6. **Section header** — mono `"4 — 10"` to introduce the long tail.
7. **Compact rest** — vertical list of ranks 4 through 10 (7 rows).
   Each row has a dashed bottom-border and contains:
   - Rank number (mono 10px, `ink3`, fixed 18px column).
   - 28px round avatar placeholder.
   - Name (12px weight 600).
   - Mono listening hours, right-aligned (`"5h"` / `"4h"` / etc).

The whole screen scrolls inside a phone frame. A floating semi-opaque pill nav
(Home / Stats / Recent) is anchored 22px from the bottom of the phone, **outside**
the scroll content. Padding-bottom of 130px reserves space so the last list
row clears the nav.

### Floating Bottom Nav
- Pill, full-width with side margins, glass blur backdrop.
- Three tabs: Home, **Stats** (active here, since this is a stats sub-screen),
  Recent.
- Active tab: icon + label tinted in **`accent2` (#588B8B)**, no background fill.
- Inactive: icon + label in `ink2` (`#3D3D3D` light / `#BFBAB0` dark).

## Interactions & Behavior
- **Range chips** → switch the dataset (the entire podium + tail re-ranks and
  re-animates for the new window).
- **#1 hero card** → tap → opens the artist's full detail page (top tracks,
  top albums, listening history).
- **#2 / #3 tiles** → same — tap to open the artist's detail page.
- **4–10 rows** → tap any row to open that artist's detail page.
- **Bottom nav tabs** → cross-fade swap between Home, Stats, Recent.
- **Back gesture / swipe-from-left-edge** → returns to the source screen
  (Stats C or Home D).

## State Management
- `range` ('week' | 'month' | '6mo'), default `'month'`.
- `topArtists[]` — array of at least 10 entries, each:
  ```ts
  { rank: number, name: string, minutes: number, plays: number, artworkUrl: string }
  ```
- Format `minutes` for display:
  - **#1**: `"{H}h"` (no minutes shown for the hero — keep it clean).
  - **#2 / #3**: `"{H}h {MM}m"` (full precision).
  - **#4–10**: `"{H}h"` (rounded).
- All derived from Spotify API; cache for at least 5 minutes. Re-fetch when
  `range` changes.

## Design Tokens

### Colors
| Token         | Light       | Dark        | Use                                    |
|---------------|-------------|-------------|----------------------------------------|
| `bg`          | `#F0EEE9`   | `#121212`   | App background                         |
| `surface`     | `#F7F5F0`   | `#1B1B1B`   | Cards / boxes                          |
| `ink`         | `#121212`   | `#F0EEE9`   | Primary text, active chip fill         |
| `ink2`        | `#3D3D3D`   | `#BFBAB0`   | Secondary text                         |
| `ink3`        | `#7A756B`   | `#85807A`   | Rank numerals, dim captions, tail meta |
| `line`        | `#121212`   | `#F0EEE9`   | Strong borders                         |
| `line2`       | `#C7C2B6`   | `#3A3833`   | Subtle borders, dashed dividers        |
| `shade`       | `#E8E4DC`   | `#252525`   | Placeholder fill stripe A              |
| `shade2`      | `#DCD7CB`   | `#2A2A2A`   | Placeholder fill stripe B              |
| `accent`      | `#FFD166`   | `#FFD166`   | #1 hero artwork border                 |
| `accent2`     | `#588B8B`   | `#588B8B`   | #1 listening-time stat, active nav     |

### Typography
- **Display / hand**: Caveat 600 — not used on this screen, but available in
  the kit.
- **Body**: Inter 400/500/600/700/800 — title (800 + tight tracking), names
  (700), tail rows (600).
- **Mono**: JetBrains Mono 400/500/600 — kicker, range labels, rank numerals
  in the tail, listening-time captions.

### Spacing / radius
- Page padding: 14px top, 20px sides, 130px bottom (clears floating nav).
- Title margin-bottom: 12px.
- Chips row margin-bottom: 14px.
- Hero block margin-bottom: 18px (slightly more breathing room before the
  #2/#3 row).
- #2/#3 grid gap: 10px; below-tile caption gap: 4px between artwork and name.
- Tail rows: 4px vertical padding, dashed `line2` bottom border.
- Card / artwork radius: **0** for the podium artworks (deliberately
  rectangular for editorial feel); 9999 for the 28px round avatars in the
  tail.

## Assets
- Artist artwork placeholders are diagonal-stripe SVG-equivalent CSS
  gradients — **swap for real Spotify artist images in production.** The #1
  hero gets the largest crop (full column width); the tail uses 28px round
  thumbnails.
- No icons baked in; the bottom nav uses 18px line-art SVG glyphs
  (home/stats/recent). Replace with the codebase's existing icon set.

## Files
- `artists-screens.jsx` — defines `ArtistsB`. Render `<ArtistsB dark={false} />`.
- `wireframe-kit.jsx` — primitive components: `WFPhone`, `WFBottomNav`,
  `WFBox`, `WFArt`, `WFChip`, `WFLine`, `WFMono`, `WFHand`, `WFSectionHead`,
  color tokens via `useWFTokens(dark)`.
- `ios-frame.jsx` — iPhone bezel + status bar wrapper.
- `preview.html` — open in a browser to see ArtistsB rendered standalone.

## Implementation Prompt

Use this prompt verbatim when handing off to an implementation agent (Claude
Code, Cursor, etc.):

> Build a new screen called **Top Artists** based on the wireframe in this
> handoff bundle (`artists-screens.jsx` + `preview.html`). Match the layout,
> hierarchy, spacing, and typography described in this README, applying the
> codebase's existing design tokens, components, and image-loading
> primitives. Use real Spotify artist artwork in place of the diagonal-stripe
> placeholders.
>
> The screen must be reachable from **two existing entry points**:
>
> 1. **Stats screen** — the *Top artist* card in the *Top split* section
>    (the bordered card showing artist artwork, name, and `"14h · 38 plays"`
>    caption). Tapping that card pushes the new Top Artists screen.
> 2. **Home screen** — the *Top Artist* card. Tapping that card pushes the
>    same screen.
>
> Wire both cards up:
> - Add a tap/press handler to each card.
> - Navigate to the new Top Artists route using the codebase's existing
>   navigation pattern (e.g. `router.push('/top-artists')`,
>   `navigation.navigate('TopArtists')`, `NavigationLink(...)`).
> - Pre-select the **Month** range chip when the screen mounts (matching the
>   default on both source screens). If either source screen later exposes
>   range selection, pass the selected range through as a route param.
>
> Data: read from the existing top-artists API (or add one if it doesn't
> exist) and return at least 10 ranked entries with `{ rank, name, minutes,
> plays, artworkUrl }`. Cache for ≥5 minutes; re-fetch on range change.
>
> Interactions: tapping any artist (#1 hero, #2/#3 tile, or 4–10 row) opens
> that artist's existing detail page. Range chips re-fetch and re-rank.
> Back gesture returns to the source screen.
>
> Do **not** ship the diagonal-stripe placeholders, dashed borders, or the
> Inter/JetBrains Mono/Caveat font stack — those are wireframe-only. Use the
> codebase's typography, color, and image components throughout.

## Implementation notes
- The original prototype mounts components on `window` so multiple `<script>`
  tags can share scope. In a real codebase, use normal ES module imports.
- All `dark` props can be replaced with the codebase's theme provider /
  context.
- The phone frame wrapper is for prototype display only — not needed in the
  real app.
- The `WFArt` placeholder accepts `aspectRatio: '1 / 1'` + `height: 'auto'`
  via the `style` prop to render a true square that scales with column width
  — replicate this with whatever responsive-image primitive your codebase
  uses (e.g. `AspectRatio` in SwiftUI, `aspect-square` in Tailwind).
- The dashed bottom-border on tail rows is purely a wireframe affordance —
  swap for the codebase's standard list-row separator.
- Both entry points (Stats C top-artist card, Home D top-artist card) should
  push this screen with the same default range (`Month`). Consider passing
  the source screen's currently-selected range through if you add range
  selection to those entry points later.
