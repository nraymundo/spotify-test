# Prompt for Claude Code

Copy-paste the block below into Claude Code (or any coding agent) once
you have this `design_handoff_recent_a/` folder available in the
codebase you want to update.

---

I have two screens to build/update in the **Recent** flow. The handoff
is in `design_handoff_recent_a/` — please **read all three files first**:

- `design_handoff_recent_a/README.md` — full spec for both screens.
- `design_handoff_recent_a/recent-a.html` — visual reference for the
  Recent tab.
- `design_handoff_recent_a/day-detail.html` — visual reference for the
  Day Detail screen.

## What I need

### 1. Recent (A) — main "Recent" tab
Update the existing Recent tab so it shows **only two day groups for
now**: `TODAY` and `YESTERDAY`. (Older days are out of scope and should
not render — leave a TODO if your data layer fetches them.)

Each group:
- Shows the first **6 plays** as a 3-column album-art grid.
- Has a "see all" affordance below the grid:
  - left caption: `showing 6 of {totalPlays}` (mono dim)
  - right link: `SEE ALL {totalPlays} →` (accent color, mono uppercase)
  - separated from the grid by a `1px` dashed top border
- Tapping the see-all row navigates to **Day Detail** for that date.

Only render the see-all row when `totalPlays > 6`.

### 2. Day Detail — new screen
Build a new screen at `/recent/{yyyy-mm-dd}` (or your routing
equivalent) that shows every play for one day. It contains, top to
bottom:

1. **Back affordance** — `← recent` (mono dim). Returns to Recent (A)
   **with scroll position preserved**.
2. **Day header** — kicker `THU · APR 24` (or actual weekday + date),
   display title `Today` / `Yesterday` / actual date for older days.
3. **Summary card** — 4-stat row inside a single bordered card:
   - PLAYS · count
   - LISTENING · total minutes (`47m`)
   - ARTISTS · distinct artist count
   - STREAK · current daily-listening streak (`23d`)
4. **Sort chips** — `by time` (default active) · `by artist` · `longest`.
   Re-orders the list client-side; never filters.
5. **Track list** — every play that day. Each row: timestamp, 36px
   album art, title + `artist · album`, duration. Dashed `1px` top
   border between rows.
6. **End footer** — centered mono dim `end of day · {n} plays`.

Use your codebase's mono font, body font (Inter or equivalent), and
existing design tokens for color and spacing. Don't introduce new
typography tokens.

## What NOT to do

- Don't render day groups other than TODAY and YESTERDAY in Recent (A).
- Don't add hover/long-press menus; tapping a tile already has a
  separate destination, untouched here.
- Don't reset Recent (A) scroll on back-navigation from Day Detail.

## Done criteria

- Recent (A) matches `recent-a.html` for the two day groups, with
  working "see all" link routing.
- Day Detail matches `day-detail.html` and accepts a date param.
- Sort chips on Day Detail re-order the list and never filter.
- No regressions to other tabs.

When finished, show a diff and screenshots of both screens.
