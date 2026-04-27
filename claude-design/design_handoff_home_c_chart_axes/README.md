# Handoff: Home Dashboard — 30-Day Listening Chart, X / Y Axis Labels

## Overview
On the **Home (Dense dashboard)** page you already have the **30-day
"Listening" line chart** built — the small chart that sits above the
"Top · this month" list, with the `7d / 30d / 6m` range chips in its
header. This handoff covers **only the addition of x-axis and y-axis
labels** to that existing chart.

This is a sibling to the `design_handoff_chart_axes` bundle (which covers
the larger Stats hero chart). Same pattern, different chart, different
label values.

## About the Design Files
The files in this bundle are **design references created in HTML** — a
simple HTML/SVG mockup showing the intended look. They are not production
code to ship as-is.

Your task is to **add x-axis and y-axis labels to your existing 30-day
Listening chart** in your codebase, matching the layout and typography
spec below.

## Fidelity
**Low-fidelity wireframe.** The reference shows structure and placement,
not final visuals. Apply your own design tokens for type, color, and
spacing where the reference's choices conflict with your design system.

## Layout

The chart card has a header row (title + range chips) on top, then the
chart with its axes arranged in a horizontal flex row:

```
┌─────────────────────────────────────────────────┐
│  listening · 30 days          [7d][30d][6m]     │
├──────┬──────────────────────────────────────────┤
│ 200  │                                          │
│      │      (existing line chart, h=60)         │
│ 100  │                                          │
│      │                                          │
│   0  │                                          │
├──────┴──────────────────────────────────────────┤
│        mar 25      apr 09      apr 24           │
└─────────────────────────────────────────────────┘
```

### Y-axis (left column)
- A **vertical column** placed to the **left** of the chart.
- `display: flex; flex-direction: column; justify-content: space-between`
- Same height as the chart (**60px** in the wireframe — note: this chart
  is shorter than the Stats hero chart, which is 80px).
- 3 labels: top / middle / bottom.
  - `200` at top
  - `100` in the middle
  - `0` at bottom
- Padding 1px top/bottom so labels align flush with the chart's
  top/bottom strokes.
- **Spacing**: 6px gap between this column and the chart on its right.

### Chart (middle/right column)
- `flex: 1; min-width: 0` so it takes the remaining horizontal space.
- Existing chart renders here unchanged (height 60px, with the orange
  fill underneath the line).

### X-axis (below the chart)
- A **horizontal row** placed **directly below the chart**, inside the
  same flex column as the chart (so it aligns with the chart's width,
  not the y-axis column).
- `display: flex; justify-content: space-between`
- **3 date labels** evenly spaced across the 30-day window:
  - left: `mar 25` (30 days ago)
  - middle: `apr 09` (15 days ago)
  - right: `apr 24` (today)
- 6px top margin from the chart.

## Typography (axis labels)
- **Font family**: monospace (in the reference: `JetBrains Mono`, but use
  your codebase's mono font).
- **Font size**: 9px.
- **Color**: tertiary / dim text (`#7A756B` light theme, `#85807A` dark
  theme in the reference; in your system use whatever maps to "tertiary
  text" or "caption dim").
- **Weight**: 400 (regular).
- All lowercase.

## Reference markup (React/JSX)

```jsx
<div style={{ display: 'flex', gap: 6 }}>
  {/* y-axis */}
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 60,
    paddingTop: 1,
    paddingBottom: 1,
  }}>
    <AxisLabel>200</AxisLabel>
    <AxisLabel>100</AxisLabel>
    <AxisLabel>0</AxisLabel>
  </div>

  {/* chart + x-axis */}
  <div style={{ flex: 1, minWidth: 0 }}>
    <YourExistingChart height={60} points={[...]} />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
      <AxisLabel>mar 25</AxisLabel>
      <AxisLabel>apr 09</AxisLabel>
      <AxisLabel>apr 24</AxisLabel>
    </div>
  </div>
</div>
```

## Implementation notes
- **Y-axis values are minutes per day.** `200` and `100` are placeholders
  representing roughly the 30-day max and midpoint. In production,
  compute them from the chart's actual data:
  ```js
  const max = Math.max(...points);            // ceil to a clean number
  const top = Math.ceil(max / 50) * 50;       // e.g. 187 → 200
  const yLabels = [`${top}`, `${top / 2}`, '0'];
  ```
  Use clean step sizes (25, 50, 100, 200…) so the label numbers feel
  intentional, not arbitrary.

- **X-axis labels scale with the active range chip** (`7d`, `30d`, `6m`):
  - `7d` → 3 labels: `mon`, `thu`, `sun` (or actual weekday abbreviations
    from the date range)
  - `30d` → 3 labels: `<start date>`, `<midpoint>`, `today` (current
    behavior — month-abbrev + day, e.g. `mar 25`)
  - `6m` → 3 labels: `<start month>`, `<mid month>`, `<this month>`
    (e.g. `nov`, `feb`, `apr`)
  Always 3 labels here — the chart is narrow, so 6 (like the Stats hero
  chart) would be too cramped.

- The y-axis column **does not** overlap the chart — it sits beside it.
  If you want gridlines, add them inside the chart SVG, not in the label
  column.

- The current chart already renders an orange fill + line; **keep it as
  is**. This handoff only adds labels around it.

## Files
- `chart-with-axes.html` — open in a browser to see the chart with axes
  rendered standalone for visual reference. Contains a minimal stand-in
  for the line chart so you can see exactly how the labels position.
