# Prompt for Claude Code

Copy-paste the block below into Claude Code (or any coding agent) once you
have this `design_handoff_home_c_chart_axes/` folder available in the
codebase you want to update.

---

I have a small design update to apply. The handoff is in
`design_handoff_home_c_chart_axes/` — please **read both files first**:

- `design_handoff_home_c_chart_axes/README.md` — the spec.
- `design_handoff_home_c_chart_axes/chart-with-axes.html` — the visual
  reference (open it in a browser to see the intended result).

## What I need

On the **Home (Dense dashboard)** page there is already a 30-day
"Listening" line chart — the small chart inside the card with the
`7d / 30d / 6m` range chips, sitting above the "Top · this month" list.
**The chart itself is already built. Do not rebuild or restyle it.**

I need you to **add x-axis and y-axis labels around it**, exactly as
described in the README.

Concretely:

1. **Y-axis** — a 3-label vertical column placed to the **left** of the
   chart, same height as the chart, space-between layout. Labels:
   `200` / `100` / `0`.

2. **X-axis** — a 3-label horizontal row placed **directly below** the
   chart, space-between layout, aligned to the chart's width (not the
   y-axis column's width). Labels: `mar 25` / `apr 09` / `apr 24`.

3. Wrap the chart and the x-axis row together in a flex column
   (`flex: 1; min-width: 0`), and put the y-axis column next to it in a
   parent flex row with `gap: 6px`. See the JSX snippet in the README.

4. Use your codebase's **mono font**, font size **9px**, and your
   **tertiary/dim text color** for the labels. Don't introduce new
   typography tokens.

5. The label values are placeholders. If you can wire them to real data
   (chart max → y-top, date range → x-labels) cleanly, do — otherwise
   ship the static values from the spec and leave a `TODO` comment
   pointing at the formulas in the README's "Implementation notes".

## What NOT to change

- Do not redesign the chart line, fill, colors, or height.
- Do not touch the card header (`listening · 30 days` + range chips).
- Do not add gridlines, tooltips, or hover states.
- Do not refactor surrounding components.

## Done criteria

- The chart card visually matches `chart-with-axes.html` in label
  placement and proportions.
- Labels use the codebase's existing mono font and dim text color.
- No regressions to the rest of the Home page.

When finished, show me a diff of the changed file(s) and a screenshot
of the updated card.
