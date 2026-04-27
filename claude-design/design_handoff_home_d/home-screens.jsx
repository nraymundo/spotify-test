// home-screens.jsx — 3 Home variations
// A: Big-number hero + top items + friends
// B: Editorial card stack
// C: Dense data dashboard

const WF_FONT_HAND_H = '"Caveat", cursive';
const WF_FONT_BODY_H = '"Inter", system-ui, sans-serif';
const WF_FONT_MONO_H = '"JetBrains Mono", ui-monospace, monospace';

// ── A · Hero number ──────────────────────────────────────────
function HomeA({ dark }) {
  const t = window.useWFTokens(dark);
  return (
    <div style={{ padding: '14px 20px 130px', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <window.WFMono dark={dark} dim>Mon · Apr 24</window.WFMono>
        <window.WFArt size={32} round dark={dark} label="me" />
      </div>

      {/* Hero */}
      <div style={{ marginBottom: 6 }}>
        <window.WFMono dark={dark} dim>this week</window.WFMono>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: WF_FONT_BODY_H, fontWeight: 800, fontSize: 84, letterSpacing: -3, lineHeight: 0.9, color: t.ink }}>
          487
        </span>
        <span style={{ fontFamily: WF_FONT_MONO_H, fontSize: 14, color: t.ink2 }}>min</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <window.WFChip dark={dark} active>↑ 12% vs last wk</window.WFChip>
        <window.WFText dark={dark} dim size={12}>89 plays · 23 artists</window.WFText>
      </div>

      {/* mini bars */}
      <window.WFBox dark={dark} style={{ padding: 14, marginBottom: 22 }}>
        <window.WFBars
          dark={dark}
          height={70}
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
      </window.WFBox>

      {/* Top items row */}
      <window.WFSectionHead kicker="quick jump" title="Your top this month" action="see all →" dark={dark} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 22 }}>
        {[
          { l: 'artist', n: 'The Weather Station', s: '14h' },
          { l: 'album', n: 'Ignorance', s: '38 plays' },
          { l: 'song', n: 'Atlantic', s: '21 plays' },
        ].map((x) => (
          <window.WFBox dark={dark} key={x.l} style={{ padding: 10 }}>
            <window.WFArt size={{ w: '100%', h: 84 }} dark={dark} label={x.l.toUpperCase()} />
            <div style={{ marginTop: 8, fontFamily: WF_FONT_BODY_H, fontSize: 11, fontWeight: 700, color: t.ink, lineHeight: 1.2 }}>
              {x.n}
            </div>
            <div style={{ marginTop: 2 }}>
              <window.WFMono dark={dark} dim size={9}>{x.s}</window.WFMono>
            </div>
          </window.WFBox>
        ))}
      </div>

      {/* Friends */}
      <window.WFSectionHead kicker="friends" title="What they're playing" dark={dark} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { who: 'mira', track: 'Linger', who2: 'The Cranberries', t: '2m ago' },
          { who: 'jules', track: 'Robbers', who2: 'The 1975', t: '14m ago' },
          { who: 'sam', track: 'Ribs', who2: 'Lorde', t: '1h ago' },
        ].map((f, i) => (
          <window.WFBox dark={dark} key={i} style={{ padding: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <window.WFArt size={36} round dark={dark} label={f.who} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: WF_FONT_BODY_H, fontSize: 12, fontWeight: 600, color: t.ink }}>
                @{f.who} · <span style={{ color: t.ink2, fontWeight: 500 }}>{f.track}</span>
              </div>
              <window.WFMono dark={dark} dim size={9}>{f.who2} · {f.t}</window.WFMono>
            </div>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: t.accent }} />
          </window.WFBox>
        ))}
      </div>
    </div>
  );
}
window.HomeA = HomeA;

// ── B · Editorial card stack ─────────────────────────────────
function HomeB({ dark }) {
  const t = window.useWFTokens(dark);
  return (
    <div style={{ padding: '14px 20px 130px', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <window.WFHand dark={dark} size={34}>Hi, Olivia.</window.WFHand>
        <window.WFArt size={32} round dark={dark} label="me" />
      </div>
      <div style={{ marginBottom: 18 }}>
        <window.WFMono dark={dark} dim>week 17 of 52</window.WFMono>
      </div>

      {/* Editorial hero card */}
      <div
        style={{
          padding: 18,
          borderRadius: 16,
          background: t.ink,
          color: t.bg,
          marginBottom: 14,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ fontFamily: WF_FONT_MONO_H, fontSize: 10, color: t.accent, letterSpacing: 1.5, marginBottom: 8 }}>
          THIS WEEK · IN MINUTES
        </div>
        <div style={{ fontFamily: WF_FONT_BODY_H, fontWeight: 800, fontSize: 92, letterSpacing: -3.5, lineHeight: 0.9, color: t.bg }}>
          487
        </div>
        <div style={{ marginTop: 6, fontFamily: WF_FONT_HAND_H, fontSize: 22, color: t.accent }}>
          ~ that's 8 hours, 7 mins
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 14, fontFamily: WF_FONT_MONO_H, fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>
          <span>↑ 12% vs last</span>
          <span>89 PLAYS</span>
          <span>23 ARTISTS</span>
        </div>
      </div>

      {/* Top three cards stacked tall */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        {[
          { kicker: '#1 ARTIST', name: 'The Weather Station', sub: '14h 22m · 38 plays', rank: '01' },
          { kicker: '#1 ALBUM', name: 'Ignorance', sub: 'The Weather Station · 38 plays', rank: '02' },
          { kicker: '#1 SONG', name: 'Atlantic', sub: 'The Weather Station · 21 plays', rank: '03' },
        ].map((c, i) => (
          <window.WFBox dark={dark} key={i} style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <window.WFArt size={56} dark={dark} label="art" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <window.WFMono dark={dark} dim>{c.kicker}</window.WFMono>
              <div style={{ fontFamily: WF_FONT_BODY_H, fontSize: 15, fontWeight: 700, color: t.ink, marginTop: 2 }}>{c.name}</div>
              <div style={{ marginTop: 2 }}>
                <window.WFText dark={dark} size={11} dim>{c.sub}</window.WFText>
              </div>
            </div>
            <span style={{ fontFamily: WF_FONT_HAND_H, fontSize: 28, color: t.ink3 }}>{c.rank}</span>
          </window.WFBox>
        ))}
      </div>

      {/* Friends ribbon */}
      <window.WFSectionHead kicker="friends" title="On rotation" dark={dark} />
      <div style={{ display: 'flex', gap: 10, overflow: 'hidden' }}>
        {['mira', 'jules', 'sam', 'devi'].map((f) => (
          <div key={f} style={{ width: 90, flexShrink: 0 }}>
            <window.WFArt size={{ w: 90, h: 90 }} dark={dark} label="album" />
            <div style={{ marginTop: 6, fontFamily: WF_FONT_BODY_H, fontSize: 11, fontWeight: 600, color: t.ink }}>@{f}</div>
            <window.WFMono dark={dark} dim size={9}>just now</window.WFMono>
          </div>
        ))}
      </div>
    </div>
  );
}
window.HomeB = HomeB;

// ── C · Dense data dashboard ─────────────────────────────────
function HomeC({ dark }) {
  const t = window.useWFTokens(dark);
  return (
    <div style={{ padding: '14px 16px 130px', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <window.WFMono dark={dark} dim>dashboard · 04/24</window.WFMono>
          <div style={{ fontFamily: WF_FONT_BODY_H, fontSize: 22, fontWeight: 800, color: t.ink, letterSpacing: -0.6 }}>
            Olivia
          </div>
        </div>
        <window.WFArt size={36} round dark={dark} label="me" />
      </div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        {[
          { k: 'this week', v: '487', u: 'min', d: '↑12%' },
          { k: 'today', v: '74', u: 'min', d: '↑3%' },
          { k: 'plays', v: '89', u: '7d', d: '↑18%' },
          { k: 'streak', v: '23', u: 'days', d: 'pr' },
        ].map((x, i) => (
          <window.WFBox dark={dark} key={i} style={{ padding: 10 }}>
            <window.WFMono dark={dark} dim>{x.k}</window.WFMono>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
              <span style={{ fontFamily: WF_FONT_BODY_H, fontWeight: 800, fontSize: 26, color: t.ink, letterSpacing: -0.8 }}>
                {x.v}
              </span>
              <span style={{ fontFamily: WF_FONT_MONO_H, fontSize: 10, color: t.ink2 }}>{x.u}</span>
            </div>
            <div style={{ fontFamily: WF_FONT_MONO_H, fontSize: 9, color: t.accent2, marginTop: 2 }}>{x.d}</div>
          </window.WFBox>
        ))}
      </div>

      {/* Mini line + bars */}
      <window.WFBox dark={dark} style={{ padding: 12, marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <window.WFMono dark={dark}>Listening · 30 days</window.WFMono>
          <div style={{ display: 'flex', gap: 4 }}>
            <window.WFChip dark={dark}>7d</window.WFChip>
            <window.WFChip dark={dark} active>30d</window.WFChip>
            <window.WFChip dark={dark}>6m</window.WFChip>
          </div>
        </div>
        <window.WFLine
          dark={dark}
          accent
          fill
          height={60}
          points={[34, 50, 42, 68, 55, 80, 90, 72, 110, 95, 88, 120, 100, 86, 94]}
        />
      </window.WFBox>

      {/* Top items dense list */}
      <window.WFBox dark={dark} style={{ padding: 12, marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <window.WFMono dark={dark}>Top · this month</window.WFMono>
          <window.WFMono dark={dark} dim>artist · album · song</window.WFMono>
        </div>
        {[
          { r: 1, t: 'The Weather Station', s: 'artist · 14h 22m', bar: 100 },
          { r: 2, t: 'Big Thief', s: 'artist · 9h 04m', bar: 64 },
          { r: 3, t: 'Ignorance', s: 'album · 38 plays', bar: 56 },
          { r: 4, t: 'Atlantic', s: 'song · 21 plays', bar: 32 },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderTop: i ? `1px dashed ${t.line2}` : 'none' }}>
            <span style={{ fontFamily: WF_FONT_MONO_H, fontSize: 10, color: t.ink3, width: 14 }}>{row.r}</span>
            <window.WFArt size={28} dark={dark} label="" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: WF_FONT_BODY_H, fontSize: 12, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {row.t}
              </div>
              <window.WFMono dark={dark} dim size={9}>{row.s}</window.WFMono>
            </div>
            <div style={{ width: 60, height: 5, borderRadius: 3, background: t.shade, overflow: 'hidden' }}>
              <div style={{ width: `${row.bar}%`, height: '100%', background: t.accent }} />
            </div>
          </div>
        ))}
      </window.WFBox>

      {/* Friends compact */}
      <window.WFBox dark={dark} style={{ padding: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <window.WFMono dark={dark}>Friends · live</window.WFMono>
          <window.WFMono dark={dark} dim>4 online</window.WFMono>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['mira', 'jules', 'sam', 'devi'].map((f, i) => (
            <div key={f} style={{ flex: 1, textAlign: 'center' }}>
              <window.WFArt size={32} round dark={dark} label={f} style={{ margin: '0 auto', borderColor: i === 0 ? t.accent : t.line2 }} />
              <div style={{ marginTop: 4 }}>
                <window.WFMono dark={dark} dim size={8}>{i === 0 ? 'now' : `${i * 4}m`}</window.WFMono>
              </div>
            </div>
          ))}
        </div>
      </window.WFBox>
    </div>
  );
}
window.HomeC = HomeC;

// ── D · Combined: editorial hero + top-3 shortcuts + 30d chart ───
function HomeD({ dark }) {
  const t = window.useWFTokens(dark);
  return (
    <div style={{ padding: '14px 20px 130px', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <window.WFHand dark={dark} size={34}>Hi, Olivia.</window.WFHand>
        <window.WFArt size={32} round dark={dark} label="me" />
      </div>
      <div style={{ marginBottom: 14 }}>
        <window.WFMono dark={dark} dim>week 17 of 52</window.WFMono>
      </div>

      {/* Editorial hero card (from B) */}
      <div
        style={{
          padding: 18,
          borderRadius: 16,
          background: t.ink,
          color: t.bg,
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ fontFamily: WF_FONT_MONO_H, fontSize: 10, color: t.accent, letterSpacing: 1.5, marginBottom: 8 }}>
          THIS WEEK · IN MINUTES
        </div>
        <div style={{ fontFamily: WF_FONT_BODY_H, fontWeight: 800, fontSize: 92, letterSpacing: -3.5, lineHeight: 0.9, color: t.bg }}>
          487
        </div>
        <div style={{ marginTop: 6, fontFamily: WF_FONT_HAND_H, fontSize: 22, color: t.accent }}>
          ~ that's 8 hours, 7 mins
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 14, fontFamily: WF_FONT_MONO_H, fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>
          <span>↑ 12% vs last</span>
          <span>89 PLAYS</span>
          <span>23 ARTISTS</span>
        </div>
      </div>

      {/* Top-3 shortcut cards (from A) */}
      <window.WFSectionHead kicker="quick jump" title="Your top this month" action="see all →" dark={dark} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18 }}>
        {[
          { l: 'artist', n: 'The Weather Station', s: '14h' },
          { l: 'album', n: 'Ignorance', s: '38 plays' },
          { l: 'song', n: 'Atlantic', s: '21 plays' },
        ].map((x) => (
          <window.WFBox dark={dark} key={x.l} style={{ padding: 10 }}>
            <window.WFArt size={{ w: '100%', h: 84 }} dark={dark} label={x.l.toUpperCase()} />
            <div style={{ marginTop: 8, fontFamily: WF_FONT_BODY_H, fontSize: 11, fontWeight: 700, color: t.ink, lineHeight: 1.2 }}>
              {x.n}
            </div>
            <div style={{ marginTop: 2 }}>
              <window.WFMono dark={dark} dim size={9}>{x.s}</window.WFMono>
            </div>
          </window.WFBox>
        ))}
      </div>

      {/* Listening 30-day chart (from C) */}
      <window.WFBox dark={dark} style={{ padding: 12, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <window.WFMono dark={dark}>Listening · 30 days</window.WFMono>
          <div style={{ display: 'flex', gap: 4 }}>
            <window.WFChip dark={dark}>7d</window.WFChip>
            <window.WFChip dark={dark} active>30d</window.WFChip>
            <window.WFChip dark={dark}>6m</window.WFChip>
          </div>
        </div>
        <window.WFLine
          dark={dark}
          accent
          fill
          height={70}
          points={[34, 50, 42, 68, 55, 80, 90, 72, 110, 95, 88, 120, 100, 86, 94]}
        />
      </window.WFBox>

      {/* Friends — What they're playing (from A) */}
      <window.WFSectionHead kicker="friends" title="What they're playing" dark={dark} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        {[
          { who: 'mira', track: 'Linger', who2: 'The Cranberries', t: '2m ago' },
          { who: 'jules', track: 'Robbers', who2: 'The 1975', t: '14m ago' },
          { who: 'sam', track: 'Ribs', who2: 'Lorde', t: '1h ago' },
        ].map((f, i) => (
          <window.WFBox dark={dark} key={i} style={{ padding: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <window.WFArt size={36} round dark={dark} label={f.who} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: WF_FONT_BODY_H, fontSize: 12, fontWeight: 600, color: t.ink }}>
                @{f.who} · <span style={{ color: t.ink2, fontWeight: 500 }}>{f.track}</span>
              </div>
              <window.WFMono dark={dark} dim size={9}>{f.who2} · {f.t}</window.WFMono>
            </div>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: t.accent }} />
          </window.WFBox>
        ))}
      </div>

      {/* Friends — duplicate for scroll demo */}
      <window.WFSectionHead kicker="friends" title="What they're playing" dark={dark} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { who: 'mira', track: 'Linger', who2: 'The Cranberries', t: '2m ago' },
          { who: 'jules', track: 'Robbers', who2: 'The 1975', t: '14m ago' },
          { who: 'sam', track: 'Ribs', who2: 'Lorde', t: '1h ago' },
        ].map((f, i) => (
          <window.WFBox dark={dark} key={`b${i}`} style={{ padding: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <window.WFArt size={36} round dark={dark} label={f.who} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: WF_FONT_BODY_H, fontSize: 12, fontWeight: 600, color: t.ink }}>
                @{f.who} · <span style={{ color: t.ink2, fontWeight: 500 }}>{f.track}</span>
              </div>
              <window.WFMono dark={dark} dim size={9}>{f.who2} · {f.t}</window.WFMono>
            </div>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: t.accent }} />
          </window.WFBox>
        ))}
      </div>
    </div>
  );
}
window.HomeD = HomeD;
