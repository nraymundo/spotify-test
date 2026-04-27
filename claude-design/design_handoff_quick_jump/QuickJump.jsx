// QuickJump.jsx — "Your top this week" three-up shortcut row
// Drop into a React app. Wire `items` to your top-of-week query.

const TOKENS = {
  light: {
    paper: '#FAF7F1',
    ink:   '#121212',
    ink3:  '#7A756B',
    line:  '#C7C2B6',
    accent2: '#588B8B',
  },
  dark: {
    paper: '#242422',
    ink:   '#F0EEE9',
    ink3:  '#9A968B',
    line:  '#3A3A38',
    accent2: '#7BB0B0',
  },
};

const FONTS = {
  hand: "'Caveat', cursive",
  mono: "'JetBrains Mono', 'SF Mono', ui-monospace, monospace",
  body: "'Inter', system-ui, sans-serif",
};

export default function QuickJump({
  items = [
    { kind: 'artist', name: 'The Weather Station', meta: '14h',      onTap: () => {} },
    { kind: 'album',  name: 'Ignorance',           meta: '38 plays', onTap: () => {} },
    { kind: 'song',   name: 'Atlantic',            meta: '21 plays', onTap: () => {} },
  ],
  onSeeAll = () => {},
  dark = false,
}) {
  const t = dark ? TOKENS.dark : TOKENS.light;

  return (
    <section style={{ width: '100%' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <div>
          <div style={{
            fontFamily: FONTS.mono,
            fontSize: 10,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: t.ink3,
          }}>quick jump</div>
          <div style={{
            fontFamily: FONTS.hand,
            fontSize: 28,
            fontWeight: 700,
            color: t.ink,
            lineHeight: 1,
            marginTop: 2,
          }}>Your top this week</div>
        </div>
        <button
          type="button"
          onClick={onSeeAll}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontFamily: FONTS.mono,
            fontSize: 11,
            color: t.accent2,
            cursor: 'pointer',
          }}
        >see all →</button>
      </header>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 10,
      }}>
        {items.map((it) => (
          <Card key={it.kind} item={it} tokens={t} />
        ))}
      </div>
    </section>
  );
}

function Card({ item, tokens: t }) {
  return (
    <button
      type="button"
      onClick={item.onTap}
      style={{
        textAlign: 'left',
        background: t.paper,
        border: `1.5px dashed ${t.line}`,
        borderRadius: 10,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
    >
      <div style={{
        fontFamily: FONTS.mono,
        fontSize: 9,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        color: t.ink3,
        marginBottom: 6,
      }}>{item.kind}</div>

      {/* Art — replace with real <img src={item.artUrl} /> */}
      <div style={{
        width: '100%',
        height: 84,
        borderRadius: 6,
        background: 'repeating-linear-gradient(135deg, #E5E2D9 0, #E5E2D9 6px, #D8D4C8 6px, #D8D4C8 12px)',
        border: `1px solid ${t.line}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONTS.mono,
        fontSize: 9,
        color: '#7A756B',
      }}>{item.kind.toUpperCase()}</div>

      <div style={{
        marginTop: 8,
        fontFamily: FONTS.body,
        fontSize: 11,
        fontWeight: 700,
        color: t.ink,
        lineHeight: 1.2,
        flex: 1,
        minHeight: 26,
      }}>{item.name}</div>

      <div style={{
        marginTop: 4,
        fontFamily: FONTS.mono,
        fontSize: 9,
        color: t.ink3,
      }}>{item.meta}</div>
    </button>
  );
}
