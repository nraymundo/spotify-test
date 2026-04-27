// artists-screens.jsx — Top Artists B (Podium / editorial)

const DF_BODY = '"Inter", system-ui, sans-serif';
const DF_MONO = '"JetBrains Mono", ui-monospace, monospace';

// B · Podium / editorial — Top Artists detail screen
function ArtistsB({ dark }) {
  const t = window.useWFTokens(dark);
  return (
    <div style={{ padding: '14px 20px 130px', height: '100%', overflow: 'auto' }}>
      <window.WFMono dark={dark} dim>top · this month</window.WFMono>
      <div style={{ fontFamily: DF_BODY, fontSize: 24, fontWeight: 800, letterSpacing: -0.6, color: t.ink, marginBottom: 12 }}>
        Top Artists
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        <window.WFChip dark={dark}>Week</window.WFChip>
        <window.WFChip dark={dark} active>Month</window.WFChip>
        <window.WFChip dark={dark}>6mo</window.WFChip>
      </div>

      {/* #1 hero — full-width square */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ width: '100%' }}>
          <window.WFArt
            size={{ w: '100%', h: 0 }}
            dark={dark}
            label="ARTIST · #1"
            accent
            style={{ borderRadius: 0, aspectRatio: '1 / 1', height: 'auto' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6 }}>
            <div style={{ fontFamily: DF_BODY, fontSize: 16, fontWeight: 700, color: t.ink }}>
              <span style={{ color: t.ink3, marginRight: 8 }}>#1</span>
              The Weather Station
            </div>
            <div style={{ fontFamily: DF_BODY, fontSize: 16, fontWeight: 700, color: t.accent2 }}>14h</div>
          </div>
        </div>
      </div>

      {/* #2, #3 side by side — square tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          { r: '#2', n: 'Big Thief', m: '9h 04m' },
          { r: '#3', n: 'Phoebe Bridgers', m: '7h 12m' },
        ].map((x, i) => (
          <div key={i}>
            <window.WFArt
              size={{ w: '100%', h: 130 }}
              dark={dark}
              label={x.r}
              style={{ borderRadius: 0, aspectRatio: '1 / 1', height: 'auto' }}
            />
            <div style={{ marginTop: 4, fontFamily: DF_BODY, fontSize: 13, fontWeight: 700, color: t.ink }}>
              <span style={{ color: t.ink3, marginRight: 6 }}>{x.r}</span>
              {x.n}
            </div>
            <window.WFMono dark={dark} dim size={9}>{x.m}</window.WFMono>
          </div>
        ))}
      </div>

      {/* compact rest — 4 through 10 */}
      <window.WFMono dark={dark}>4 — 10</window.WFMono>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
        {['Fleet Foxes', 'Sufjan Stevens', 'Bon Iver', 'Adrianne Lenker', 'Mitski'].map((n, i) => (
          <div
            key={n}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: `1px dashed ${t.line2}` }}
          >
            <span style={{ width: 18, fontFamily: DF_MONO, fontSize: 10, color: t.ink3 }}>{i + 4}</span>
            <window.WFArt size={28} round dark={dark} label="" />
            <span style={{ flex: 1, fontFamily: DF_BODY, fontSize: 12, fontWeight: 600, color: t.ink }}>{n}</span>
            <window.WFMono dark={dark} dim size={9}>{5 - Math.floor(i / 2)}h</window.WFMono>
          </div>
        ))}
      </div>
    </div>
  );
}
window.ArtistsB = ArtistsB;
