# Handoff: Stats Hero Chart — X / Y Axis Labels

## Overview
You already have the **hero line chart** built (the 6-month "13,422 min" total
chart on the Stats page). This handoff covers **only the addition of x-axis
and y-axis labels** to that chart.

## About the Design Files
The files in this bundle are **design references created in HTML** — a React +
inline JSX prototype showing the intended look. They are not production code
to ship as-is.

Your task is to **add x-axis and y-axis labels to your existing chart
component** in your codebase, matching the layout and typography spec below.

## Fidelity
**Low-fidelity wireframe.** The reference shows structure and placement, not
final visuals. Apply your own design tokens for type, color, and spacing where
the reference's choices conflict with your design system.

## Layout

The chart has three pieces arranged in a horizontal flex row:

```
┌──────┬──────────────────────────────────────────┐
│  3k  │                                          │
│      │      (existing line chart)               │
│ 1.5k │                                          │
│      │                                          │
│   0  │                                          │
├──────┴──────────────────────────────────────────┤
│        nov   dec   jan   feb   mar   apr        │
└─────────────────────────────────────────────────┘
```

### Y-axis (left column)
- A **vertical column** placed to the **left** of the chart.
- `display: flex; flex-direction: column; justify-content: space-between`
- Same height as the chart (80px in the wireframe).
- 3 labels: `3k` at top, `1.5k` middle, `0` at bottom.
- Padding 1px top/bottom so labels align flush with the chart's
  top/bottom strokes.
- **Spacing**: 6px gap between this column and the chart on its right.

### Chart (middle/right column)
- `flex: 1; min-width: 0` so it takes the remaining horizontal space.
- Existing chart renders here unchanged.

### X-axis (below the chart)
- A **horizontal row** placed **directly below the chart**, inside the same
  flex column as the chart (so it aligns with the chart's width, not the
  y-axis column).
- `display: flex; justify-content: space-between`
- 6 labels evenly spaced: `nov` · `dec` · `jan` · `feb` · `mar` · `apr`.
- 6px top margin from the chart.

## Typography (axis labels)
- **Font family**: monospace (in the reference: `JetBrains Mono`, but use
  your codebase's mono font).
- **Font size**: 9px.
- **Color**: tertiary / dim text (`#7A756B` light theme, `#85807A` dark theme
  in the reference; in your system use whatever maps to "tertiary text" or
  "caption dim").
- **Weight**: 400 (regular).
- All lowercase.

## Reference markup (React/JSX)

```jsx
<div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
  {/* y-axis */}
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 80,
    paddingTop: 1,
    paddingBottom: 1,
  }}>
    <AxisLabel>3k</AxisLabel>
    <AxisLabel>1.5k</AxisLabel>
    <AxisLabel>0</AxisLabel>
  </div>

  {/* chart + x-axis */}
  <div style={{ flex: 1, minWidth: 0 }}>
    <YourExistingChart height={80} points={[...]} />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
      <AxisLabel>nov</AxisLabel>
      <AxisLabel>dec</AxisLabel>
      <AxisLabel>jan</AxisLabel>
      <AxisLabel>feb</AxisLabel>
      <AxisLabel>mar</AxisLabel>
      <AxisLabel>apr</AxisLabel>
    </div>
  </div>
</div>
```

## Implementation notes
- The y-axis column **does not** need to overlap the chart — it sits beside
  it. If you want gridlines, add them inside the chart SVG, not in the label
  column.
- The 3 y-values (`0`, `1.5k`, `3k`) are placeholders. In production,
  compute them from the chart's actual min/max:
  ```js
  const max = Math.max(...points);
  const yLabels = [formatK(max), formatK(max / 2), '0'];
  ```
  where `formatK(n)` returns `1.5k`, `12k`, `1.2m` etc.
- The 6 x-labels assume 6 months on a "6mo" range. For other ranges:
  - **Week**: 7 labels (mon–sun)
  - **Month**: 4 labels (week 1–4) or evenly-spaced day numbers
  - **6 months**: 6 month abbreviations (current behavior)
  - **1 year**: every other month (jan, mar, may, jul, sep, nov)

  Pick the label count to keep them readable — never overflow.
- If your chart already paints its own SVG axis lines, you can skip the
  border/divider details; the wireframe only adds **text labels**.

## Files
- `chart-with-axes.html` — open in a browser to see the chart with axes
  rendered standalone for visual reference. Contains a minimal stand-in
  for the line chart so you can see exactly how the labels position.
