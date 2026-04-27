// wireframe-kit.jsx — Shared low-fi primitives for the Spotify Stats wireframe set
// Aesthetic: clean rectangles, dashed placeholders, mono labels, single accent.
// All components read from window.WF_TOKENS so dark mode flows from a single source.

const WF_LIGHT = {
  bg: '#F0EEE9',
  surface: '#F7F5F0',
  ink: '#121212',
  ink2: '#3D3D3D',
  ink3: '#7A756B',
  line: '#121212',
  line2: '#C7C2B6',
  shade: '#E5E2D9',
  shade2: '#D8D4C8',
  accent: '#FFD166',
  accent2: '#588B8B',
  accentInk: '#3A2A05',
  navGlass: 'rgba(240,238,233,0.78)',
  navBorder: 'rgba(18,18,18,0.14)',
};

const WF_DARK = {
  bg: '#121212',
  surface: '#1B1B1B',
  ink: '#F0EEE9',
  ink2: '#BFBAB0',
  ink3: '#85807A',
  line: '#F0EEE9',
  line2: '#3A3833',
  shade: '#1F1F1F',
  shade2: '#2A2A2A',
  accent: '#FFD166',
  accent2: '#588B8B',
  accentInk: '#3A2A05',
  navGlass: 'rgba(18,18,18,0.72)',
  navBorder: 'rgba(255,255,255,0.14)',
};

window.useWFTokens = function useWFTokens(dark) {
  return dark ? WF_DARK : WF_LIGHT;
};

// ── Type ─────────────────────────────────────────────────────
const WF_FONT_HAND = '"Caveat", "Bradley Hand", cursive';
const WF_FONT_BODY = '"Inter", -apple-system, system-ui, sans-serif';
const WF_FONT_MONO = '"JetBrains Mono", "SF Mono", ui-monospace, monospace';

// ── Sketchy box ──────────────────────────────────────────────
function WFBox({ children, dashed, dark, style = {}, accent, ...rest }) {
  const t = window.useWFTokens(dark);
  return (
    <div
      style={{
        border: `1.5px ${dashed ? 'dashed' : 'solid'} ${accent ? t.accent : t.line}`,
        borderRadius: 10,
        background: t.surface,
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
window.WFBox = WFBox;

// ── Placeholder rectangle (album art / image slot) ───────────
function WFArt({ size = 48, label, dark, style = {}, round, accent }) {
  const t = window.useWFTokens(dark);
  const w = typeof size === 'number' ? size : size.w;
  const h = typeof size === 'number' ? size : size.h;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: round ? 9999 : 6,
        background: `repeating-linear-gradient(135deg, ${t.shade} 0 6px, ${t.shade2} 6px 12px)`,
        border: `1px solid ${accent ? t.accent : t.line2}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: WF_FONT_MONO,
        fontSize: 9,
        color: t.ink3,
        textAlign: 'center',
        flexShrink: 0,
        ...style,
      }}
    >
      {label}
    </div>
  );
}
window.WFArt = WFArt;

// ── Hand label (Caveat) ──────────────────────────────────────
function WFHand({ children, size = 22, dark, style = {} }) {
  const t = window.useWFTokens(dark);
  return (
    <span
      style={{
        fontFamily: WF_FONT_HAND,
        fontSize: size,
        color: t.ink,
        lineHeight: 1.05,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
window.WFHand = WFHand;

// ── Mono caption ─────────────────────────────────────────────
function WFMono({ children, size = 10, dark, dim, style = {} }) {
  const t = window.useWFTokens(dark);
  return (
    <span
      style={{
        fontFamily: WF_FONT_MONO,
        fontSize: size,
        letterSpacing: 0.2,
        textTransform: 'uppercase',
        color: dim ? t.ink3 : t.ink2,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
window.WFMono = WFMono;

// ── Body text ────────────────────────────────────────────────
function WFText({ children, size = 13, weight = 500, dark, dim, style = {} }) {
  const t = window.useWFTokens(dark);
  return (
    <span
      style={{
        fontFamily: WF_FONT_BODY,
        fontSize: size,
        fontWeight: weight,
        color: dim ? t.ink3 : t.ink,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
window.WFText = WFText;

// ── Floating bottom nav (semi-opaque liquid glass pill) ──────
function WFBottomNav({ active = 'home', dark, style = {} }) {
  const t = window.useWFTokens(dark);
  const items = [
    { k: 'home', label: 'Home', glyph: HomeGlyph },
    { k: 'stats', label: 'Stats', glyph: StatsGlyph },
    { k: 'recent', label: 'Recent', glyph: RecentGlyph },
  ];
  return (
    <div
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 22,
        height: 64,
        borderRadius: 999,
        background: t.navGlass,
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        border: `1px solid ${t.navBorder}`,
        boxShadow: dark
          ? '0 8px 28px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 8px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 70,
        ...style,
      }}
    >
      {items.map((it) => {
        const isActive = it.k === active;
        const Glyph = it.glyph;
        return (
          <div
            key={it.k}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '6px 18px',
              borderRadius: 999,
              background: 'transparent',
            }}
          >
            <Glyph color={isActive ? t.accent2 : t.ink2} />
            <span
              style={{
                fontFamily: WF_FONT_BODY,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.3,
                color: isActive ? t.accent2 : t.ink2,
              }}
            >
              {it.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
window.WFBottomNav = WFBottomNav;

function HomeGlyph({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 9l7-6 7 6v7a1 1 0 0 1-1 1h-3v-5H7v5H4a1 1 0 0 1-1-1V9z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function StatsGlyph({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 17V9M9 17V4M15 17v-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function RecentGlyph({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.6" />
      <path d="M10 6v4l3 2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// ── Status bar (minimal — for wireframes) ────────────────────
function WFStatusBar({ dark }) {
  const t = window.useWFTokens(dark);
  return (
    <div
      style={{
        height: 44,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '0 24px 8px',
        fontFamily: WF_FONT_BODY,
        fontSize: 13,
        fontWeight: 600,
        color: t.ink,
      }}
    >
      <span>9:41</span>
      <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 11 }}>●●●</span>
        <span style={{ fontSize: 11 }}>📶</span>
        <span style={{ fontSize: 11 }}>🔋</span>
      </span>
    </div>
  );
}
window.WFStatusBar = WFStatusBar;

// ── Phone shell (392 × 760 — thin bezel, no chrome) ──────────
function WFPhone({ children, dark, style = {} }) {
  const t = window.useWFTokens(dark);
  return (
    <div
      style={{
        width: 392,
        height: 760,
        borderRadius: 44,
        background: t.bg,
        border: `1.5px solid ${t.line}`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: dark
          ? '0 30px 60px rgba(0,0,0,0.5)'
          : '0 30px 60px rgba(0,0,0,0.12)',
        fontFamily: WF_FONT_BODY,
        ...style,
      }}
    >
      {/* dynamic island */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 110,
          height: 30,
          borderRadius: 99,
          background: '#000',
          zIndex: 80,
        }}
      />
      <WFStatusBar dark={dark} />
      <div style={{ height: 'calc(100% - 44px)', position: 'relative', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}
window.WFPhone = WFPhone;

// ── Section header (used inside screens) ─────────────────────
function WFSectionHead({ kicker, title, action, dark }) {
  const t = window.useWFTokens(dark);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }}>
      <div>
        {kicker && (
          <div style={{ marginBottom: 2 }}>
            <WFMono dark={dark} dim>
              {kicker}
            </WFMono>
          </div>
        )}
        <div style={{ fontFamily: WF_FONT_BODY, fontSize: 18, fontWeight: 700, color: t.ink, letterSpacing: -0.3 }}>
          {title}
        </div>
      </div>
      {action && (
        <span style={{ fontFamily: WF_FONT_BODY, fontSize: 12, fontWeight: 500, color: t.ink2 }}>
          {action}
        </span>
      )}
    </div>
  );
}
window.WFSectionHead = WFSectionHead;

// ── Bar chart (vertical) ─────────────────────────────────────
function WFBars({ data, dark, height = 90, accent }) {
  const t = window.useWFTokens(dark);
  const max = Math.max(...data.map((d) => d.v));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, width: '100%' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div
            style={{
              width: '100%',
              height: `${(d.v / max) * 100}%`,
              background: d.hi ? t.accent : accent ? t.ink : t.line2,
              borderRadius: 3,
              minHeight: 3,
            }}
          />
          <span style={{ fontFamily: WF_FONT_MONO, fontSize: 9, color: t.ink3 }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
}
window.WFBars = WFBars;

// ── Sparkline-ish line (svg) ─────────────────────────────────
function WFLine({ points, dark, height = 80, fill, accent }) {
  const t = window.useWFTokens(dark);
  const max = Math.max(...points);
  const min = Math.min(...points);
  const w = 300;
  const h = height;
  const stepX = w / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = i * stepX;
      const y = h - ((p - min) / (max - min || 1)) * (h - 12) - 6;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const fillPath = `${path} L${w},${h} L0,${h} Z`;
  const stroke = accent ? t.accent : t.ink;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      {fill && <path d={fillPath} fill={accent ? t.accent : t.line2} opacity={0.18} />}
      <path d={path} stroke={stroke} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
window.WFLine = WFLine;

// ── Donut chart (svg) ────────────────────────────────────────
function WFDonut({ segments, dark, size = 120, label }) {
  const t = window.useWFTokens(dark);
  const r = size / 2 - 8;
  const c = size / 2;
  const total = segments.reduce((s, x) => s + x.v, 0);
  let acc = 0;
  const colors = [t.accent, t.ink, t.ink3, t.line2];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((s, i) => {
        const a0 = (acc / total) * 2 * Math.PI - Math.PI / 2;
        acc += s.v;
        const a1 = (acc / total) * 2 * Math.PI - Math.PI / 2;
        const x0 = c + r * Math.cos(a0);
        const y0 = c + r * Math.sin(a0);
        const x1 = c + r * Math.cos(a1);
        const y1 = c + r * Math.sin(a1);
        const large = a1 - a0 > Math.PI ? 1 : 0;
        return (
          <path
            key={i}
            d={`M${c},${c} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`}
            fill={s.color || colors[i % colors.length]}
            stroke={t.surface}
            strokeWidth={2}
          />
        );
      })}
      {label && (
        <text
          x={c}
          y={c + 4}
          textAnchor="middle"
          fontFamily={WF_FONT_BODY}
          fontWeight={700}
          fontSize={14}
          fill={t.ink}
        >
          {label}
        </text>
      )}
    </svg>
  );
}
window.WFDonut = WFDonut;

// ── Pill / chip ──────────────────────────────────────────────
function WFChip({ children, active, dark, style = {} }) {
  const t = window.useWFTokens(dark);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 10px',
        borderRadius: 999,
        border: `1px solid ${active ? t.accent2 : t.line2}`,
        background: active ? (dark ? 'rgba(88,139,139,0.22)' : 'rgba(88,139,139,0.14)') : 'transparent',
        fontFamily: WF_FONT_BODY,
        fontSize: 11,
        fontWeight: 600,
        color: active ? t.accent2 : t.ink2,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
window.WFChip = WFChip;

// ── Big number (the "minutes listened" hero) ─────────────────
function WFBigNum({ value, unit, label, dark, hand, accent }) {
  const t = window.useWFTokens(dark);
  return (
    <div>
      {label && (
        <div style={{ marginBottom: 4 }}>
          <WFMono dark={dark} dim>
            {label}
          </WFMono>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span
          style={{
            fontFamily: hand ? WF_FONT_HAND : WF_FONT_BODY,
            fontSize: hand ? 76 : 56,
            fontWeight: hand ? 500 : 800,
            letterSpacing: hand ? 0 : -2,
            lineHeight: 0.95,
            color: accent ? t.accent2 : t.ink,
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontFamily: WF_FONT_MONO,
              fontSize: 13,
              color: t.ink2,
              fontWeight: 500,
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
window.WFBigNum = WFBigNum;
