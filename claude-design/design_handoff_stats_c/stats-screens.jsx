// stats-screens.jsx — 3 Stats deep dive variations

const SF_BODY = '"Inter", system-ui, sans-serif';
const SF_MONO = '"JetBrains Mono", ui-monospace, monospace';
const SF_HAND = '"Caveat", cursive';

// ── A · Time-range hero with stacked breakdowns ──────────────
function StatsA({ dark }) {
  const t = window.useWFTokens(dark);
  return (
    <div style={{ padding: '14px 20px 130px', height: '100%', overflow: 'auto' }}>
      <div style={{ marginBottom: 4 }}>
        <window.WFMono dark={dark} dim>your stats</window.WFMono>
      </div>
      <div style={{ fontFamily: SF_BODY, fontSize: 26, fontWeight: 800, color: t.ink, letterSpacing: -0.6, marginBottom: 12 }}>
        Listening report
      </div>

      {/* range chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        <window.WFChip dark={dark}>Week</window.WFChip>
        <window.WFChip dark={dark} active>Month</window.WFChip>
        <window.WFChip dark={dark}>6 months</window.WFChip>
      </div>

      <window.WFBox dark={dark} style={{ padding: 16, marginBottom: 12 }}>
        <window.WFMono dark={dark} dim>minutes · april</window.WFMono>
        <div style={{ fontFamily: SF_BODY, fontWeight: 800, fontSize: 56, letterSpacing: -2, lineHeight: 1, color: t.ink, marginTop: 4 }}>
          2,184
        </div>
        <div style={{ marginTop: 10 }}>
          <window.WFLine dark={dark} accent fill height={70} points={[40, 55, 48, 70, 60, 82, 90, 78, 110, 95, 88, 120, 100, 86, 94, 102, 88, 96, 110, 122]} />
        </div>
      </window.WFBox>

      {/* by hour heatmap mock */}
      <window.WFBox dark={dark} style={{ padding: 14, marginBottom: 12 }}>
        <window.WFMono dark={dark}>When you listen</window.WFMono>
        <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'auto repeat(12, 1fr)', gap: 2 }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, di) => (
            <React.Fragment key={di}>
              <div style={{ fontFamily: SF_MONO, fontSize: 9, color: t.ink3, paddingRight: 4 }}>{d}</div>
              {Array.from({ length: 12 }).map((_, hi) => {
                const v = Math.abs(Math.sin(di * 1.3 + hi * 0.7)) * (hi > 4 && hi < 10 ? 1 : 0.4);
                return (
                  <div
                    key={hi}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 2,
                      background: v > 0.7 ? t.accent : v > 0.4 ? (dark ? 'rgba(29,185,84,0.5)' : 'rgba(29,185,84,0.4)') : v > 0.2 ? t.shade2 : t.shade,
                    }}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <window.WFMono dark={dark} dim size={9}>0a</window.WFMono>
          <window.WFMono dark={dark} dim size={9}>peak: 9–11pm</window.WFMono>
          <window.WFMono dark={dark} dim size={9}>11p</window.WFMono>
        </div>
      </window.WFBox>

      {/* genre breakdown */}
      <window.WFBox dark={dark} style={{ padding: 14, marginBottom: 12 }}>
        <window.WFMono dark={dark}>Top genres</window.WFMono>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { g: 'indie folk', p: 92 },
            { g: 'art pop', p: 64 },
            { g: 'chamber pop', p: 50 },
            { g: 'singer-songwriter', p: 38 },
            { g: 'ambient', p: 22 },
          ].map((x, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 110, fontFamily: SF_BODY, fontSize: 11, color: t.ink }}>{x.g}</span>
              <div style={{ flex: 1, height: 8, borderRadius: 99, background: t.shade }}>
                <div style={{ width: `${x.p}%`, height: '100%', background: i === 0 ? t.accent : t.ink, borderRadius: 99 }} />
              </div>
              <window.WFMono dark={dark} dim size={9} style={{ width: 28, textAlign: 'right' }}>{x.p}</window.WFMono>
            </div>
          ))}
        </div>
      </window.WFBox>

      <window.WFBox dark={dark} style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <window.WFMono dark={dark} dim>discovery</window.WFMono>
          <div style={{ fontFamily: SF_BODY, fontWeight: 800, fontSize: 22, color: t.ink, marginTop: 2 }}>34%</div>
          <window.WFMono dark={dark} dim size={9}>new artists</window.WFMono>
        </div>
        <div>
          <window.WFMono dark={dark} dim>repeats</window.WFMono>
          <div style={{ fontFamily: SF_BODY, fontWeight: 800, fontSize: 22, color: t.ink, marginTop: 2 }}>2.3×</div>
          <window.WFMono dark={dark} dim size={9}>avg per song</window.WFMono>
        </div>
      </window.WFBox>
    </div>
  );
}
window.StatsA = StatsA;

// ── B · Editorial / wrapped-style ────────────────────────────
function StatsB({ dark }) {
  const t = window.useWFTokens(dark);
  return (
    <div style={{ padding: '14px 20px 130px', height: '100%', overflow: 'auto' }}>
      <div style={{ marginBottom: 14 }}>
        <window.WFMono dark={dark} dim>chapter 04 · april</window.WFMono>
      </div>

      <div
        style={{
          padding: 22,
          borderRadius: 18,
          background: t.accent,
          color: '#062C13',
          marginBottom: 12,
        }}
      >
        <div style={{ fontFamily: SF_MONO, fontSize: 10, letterSpacing: 1.5, opacity: 0.7 }}>
          MOST PLAYED · APRIL
        </div>
        <div style={{ fontFamily: SF_BODY, fontWeight: 800, fontSize: 36, letterSpacing: -0.8, lineHeight: 1.05, marginTop: 8 }}>
          The Weather<br />Station
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 14 }}>
          <div>
            <div style={{ fontFamily: SF_BODY, fontWeight: 800, fontSize: 22 }}>14h 22m</div>
            <div style={{ fontFamily: SF_MONO, fontSize: 9, opacity: 0.7 }}>LISTENING</div>
          </div>
          <div>
            <div style={{ fontFamily: SF_BODY, fontWeight: 800, fontSize: 22 }}>38</div>
            <div style={{ fontFamily: SF_MONO, fontSize: 9, opacity: 0.7 }}>PLAYS</div>
          </div>
          <div>
            <div style={{ fontFamily: SF_BODY, fontWeight: 800, fontSize: 22 }}>4</div>
            <div style={{ fontFamily: SF_MONO, fontSize: 9, opacity: 0.7 }}>ALBUMS</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <window.WFBox dark={dark} style={{ padding: 14 }}>
          <window.WFMono dark={dark} dim>total minutes</window.WFMono>
          <div style={{ fontFamily: SF_BODY, fontWeight: 800, fontSize: 30, color: t.ink, letterSpacing: -1, marginTop: 4 }}>2,184</div>
          <span style={{ fontFamily: SF_HAND, fontSize: 18, color: t.accent2 }}>+18% on march</span>
        </window.WFBox>
        <window.WFBox dark={dark} style={{ padding: 14 }}>
          <window.WFMono dark={dark} dim>avg / day</window.WFMono>
          <div style={{ fontFamily: SF_BODY, fontWeight: 800, fontSize: 30, color: t.ink, letterSpacing: -1, marginTop: 4 }}>72m</div>
          <span style={{ fontFamily: SF_HAND, fontSize: 18, color: t.ink3 }}>≈ a movie</span>
        </window.WFBox>
      </div>

      <window.WFBox dark={dark} style={{ padding: 14, marginBottom: 12 }}>
        <window.WFMono dark={dark} dim>your week, in shapes</window.WFMono>
        <div style={{ marginTop: 12 }}>
          <window.WFBars
            dark={dark}
            height={100}
            data={[
              { l: 'M', v: 65 },
              { l: 'T', v: 88 },
              { l: 'W', v: 42 },
              { l: 'T', v: 95, hi: true },
              { l: 'F', v: 110, hi: true },
              { l: 'S', v: 50 },
              { l: 'S', v: 37 },
            ]}
          />
        </div>
      </window.WFBox>

      <window.WFBox dark={dark} style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
        <window.WFDonut
          dark={dark}
          size={100}
          label="62%"
          segments={[
            { v: 62 },
            { v: 24 },
            { v: 14 },
          ]}
        />
        <div style={{ flex: 1 }}>
          <window.WFMono dark={dark} dim>mood split</window.WFMono>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { c: t.accent, l: 'mellow', v: '62%' },
              { c: t.ink, l: 'energetic', v: '24%' },
              { c: t.ink3, l: 'sad', v: '14%' },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: m.c }} />
                <span style={{ flex: 1, fontFamily: SF_BODY, fontSize: 11, color: t.ink }}>{m.l}</span>
                <window.WFMono dark={dark} dim size={9}>{m.v}</window.WFMono>
              </div>
            ))}
          </div>
        </div>
      </window.WFBox>
    </div>
  );
}
window.StatsB = StatsB;

// ── C · Power-user dashboard ─────────────────────────────────
function StatsC({ dark }) {
  const t = window.useWFTokens(dark);
  return (
    <div style={{ padding: '14px 16px 130px', height: '100%', overflow: 'auto' }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontFamily: SF_BODY, fontSize: 22, fontWeight: 800, letterSpacing: -0.6, color: t.ink }}>Stats</div>
      </div>

      {/* range chips (from A) */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <window.WFChip dark={dark}>Week</window.WFChip>
        <window.WFChip dark={dark} active>Month</window.WFChip>
        <window.WFChip dark={dark}>6 months</window.WFChip>
      </div>

      {/* hero with sub-line */}
      <window.WFBox dark={dark} style={{ padding: 14, marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <window.WFMono dark={dark} dim>total · 6mo</window.WFMono>
            <div style={{ fontFamily: SF_BODY, fontWeight: 800, fontSize: 38, letterSpacing: -1.4, color: t.ink, marginTop: 2 }}>
              13,422<span style={{ fontFamily: SF_MONO, fontSize: 12, color: t.ink2, marginLeft: 4 }}>min</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <window.WFMono dark={dark} dim>vs prev</window.WFMono>
            <div style={{ fontFamily: SF_BODY, fontWeight: 700, fontSize: 14, color: t.accent2, marginTop: 2 }}>↑ 22.4%</div>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <window.WFLine
            dark={dark}
            accent
            fill
            height={80}
            points={[80, 110, 90, 130, 105, 145, 160, 140, 175, 168, 152, 190, 170, 195, 210, 188, 175, 200, 220, 215, 232, 245, 228, 250]}
          />
        </div>
      </window.WFBox>

      {/* metric grid — moved up below the chart */}
      <window.WFBox dark={dark} style={{ padding: 12, marginBottom: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            ['plays', '1,892'],
            ['unique', '463'],
            ['skips', '12%'],
            ['avg/day', '74m'],
            ['peak day', 'thu'],
            ['peak hr', '10p'],
          ].map(([k, v]) => (
            <div key={k}>
              <window.WFMono dark={dark} dim size={9}>{k}</window.WFMono>
              <div style={{ fontFamily: SF_BODY, fontWeight: 700, fontSize: 16, color: t.ink, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </window.WFBox>

      {/* split: top artist + top album */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <window.WFBox dark={dark} style={{ padding: 10 }}>
          <window.WFMono dark={dark} dim>top artist</window.WFMono>
          <window.WFArt size={{ w: '100%', h: 90 }} dark={dark} label="ARTIST" style={{ marginTop: 6 }} />
          <div style={{ fontFamily: SF_BODY, fontSize: 12, fontWeight: 700, color: t.ink, marginTop: 6 }}>The Weather Station</div>
          <window.WFMono dark={dark} dim size={9}>14h · 38 plays</window.WFMono>
        </window.WFBox>
        <window.WFBox dark={dark} style={{ padding: 10 }}>
          <window.WFMono dark={dark} dim>top album</window.WFMono>
          <window.WFArt size={{ w: '100%', h: 90 }} dark={dark} label="ALBUM" style={{ marginTop: 6 }} />
          <div style={{ fontFamily: SF_BODY, fontSize: 12, fontWeight: 700, color: t.ink, marginTop: 6 }}>Ignorance</div>
          <window.WFMono dark={dark} dim size={9}>9h · 38 plays</window.WFMono>
        </window.WFBox>
      </div>

      {/* top genres (from A) */}
      <window.WFBox dark={dark} style={{ padding: 14, marginBottom: 10 }}>
        <window.WFMono dark={dark}>Top genres</window.WFMono>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { g: 'indie folk', p: 92 },
            { g: 'art pop', p: 64 },
            { g: 'chamber pop', p: 50 },
            { g: 'singer-songwriter', p: 38 },
            { g: 'ambient', p: 22 },
          ].map((x, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 110, fontFamily: SF_BODY, fontSize: 11, color: t.ink }}>{x.g}</span>
              <div style={{ flex: 1, height: 8, borderRadius: 99, background: t.shade }}>
                <div style={{ width: `${x.p}%`, height: '100%', background: i === 0 ? t.accent : t.ink, borderRadius: 99 }} />
              </div>
              <window.WFMono dark={dark} dim size={9} style={{ width: 28, textAlign: 'right' }}>{x.p}</window.WFMono>
            </div>
          ))}
        </div>
      </window.WFBox>

      {/* genre stack bars */}
      <window.WFBox dark={dark} style={{ padding: 12, marginBottom: 10 }}>
        <window.WFMono dark={dark}>Genre over time</window.WFMono>
        <div style={{ marginTop: 8, display: 'flex', gap: 4, height: 60 }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const h1 = 40 + Math.sin(i) * 10;
            const h2 = 25 + Math.cos(i * 0.7) * 8;
            const h3 = 15 + Math.sin(i * 1.2) * 5;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: 1 }}>
                <div style={{ height: h1, background: t.accent, borderRadius: 1 }} />
                <div style={{ height: h2, background: t.ink, borderRadius: 1 }} />
                <div style={{ height: h3, background: t.ink3, borderRadius: 1 }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <window.WFMono dark={dark} dim size={9}>nov</window.WFMono>
          <window.WFMono dark={dark} dim size={9}>apr</window.WFMono>
        </div>
      </window.WFBox>

      {/* genre stack bars — duplicate */}
      <window.WFBox dark={dark} style={{ padding: 12 }}>
        <window.WFMono dark={dark}>Genre over time</window.WFMono>
        <div style={{ marginTop: 8, display: 'flex', gap: 4, height: 60 }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const h1 = 40 + Math.sin(i) * 10;
            const h2 = 25 + Math.cos(i * 0.7) * 8;
            const h3 = 15 + Math.sin(i * 1.2) * 5;
            return (
              <div key={`b${i}`} style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: 1 }}>
                <div style={{ height: h1, background: t.accent, borderRadius: 1 }} />
                <div style={{ height: h2, background: t.ink, borderRadius: 1 }} />
                <div style={{ height: h3, background: t.ink3, borderRadius: 1 }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <window.WFMono dark={dark} dim size={9}>nov</window.WFMono>
          <window.WFMono dark={dark} dim size={9}>apr</window.WFMono>
        </div>
      </window.WFBox>
    </div>
  );
}
window.StatsC = StatsC;
