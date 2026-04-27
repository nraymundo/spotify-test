import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, Pressable } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tokens, fonts } from "../../lib/tokens";
import { fetchStats, fetchTop, fetchGenres } from "../../lib/supabase";
import { useToast } from "../../lib/toast";
import Mono from "../../components/ui/Mono";
import Body from "../../components/ui/Body";
import Box from "../../components/ui/Box";
import Art from "../../components/ui/Art";
import Chip from "../../components/ui/Chip";
import LineChart from "../../components/ui/LineChart";

const RANGES = [
  { key: "day",   label: "Day",   kicker: "total · today" },
  { key: "week",  label: "Week",  kicker: "total · week" },
  { key: "month", label: "Month", kicker: "total · month" },
  { key: "6mo",   label: "6mo",   kicker: "total · 6mo" },
];

function getSince(rangeKey) {
  const now = new Date();
  if (rangeKey === "day") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }
  if (rangeKey === "week") {
    const d = new Date(now);
    const day = d.getDay();
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }
  if (rangeKey === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  }
  // 6mo
  const d = new Date(now);
  d.setMonth(d.getMonth() - 6);
  return d.toISOString();
}

function formatMinutes(total) {
  if (total == null) return "—";
  return total.toLocaleString();
}

const MONTH_ABBRS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
const CHART_H = 96;
const CHART_X_H = 16; // must match LineChart's X_LABEL_H

function formatAxisY(v) {
  if (v === 0) return '0';
  if (v >= 1_000_000) {
    const m = v / 1_000_000;
    return `${m % 1 === 0 ? m : m.toFixed(1)}m`;
  }
  if (v >= 1_000) {
    const k = v / 1_000;
    return `${k % 1 === 0 ? k : k.toFixed(1)}k`;
  }
  return String(Math.round(v));
}

const axisLabelStyle = {
  fontFamily: fonts.mono,
  fontSize: 9,
  color: tokens.ink3,
};

function getXLabels(rangeKey) {
  if (rangeKey === 'day') return ['12a', '6a', '12p', '6p', '11p'];
  if (rangeKey === 'week') return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  if (rangeKey === 'month') return ['w1', 'w2', 'w3', 'w4'];
  if (rangeKey === '6mo') {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return MONTH_ABBRS[d.getMonth()];
    });
  }
  return undefined;
}


export default function StatsScreen({ user, token }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const showToast = useToast();
  const [range, setRange] = useState("week");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const cache = React.useRef({});
  const scrollRef = useRef(null);

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []));

  const currentRange = RANGES.find((r) => r.key === range);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    async function load() {
      // 1. Serve from memory cache instantly (range switch within session)
      if (cache.current[range]) {
        setData(cache.current[range]);
      } else {
        // 2. Hydrate from persistent cache so UI is never blank on load
        try {
          const stored = await SecureStore.getItemAsync(`stats_v5_${range}`);
          if (stored && !cancelled) {
            const parsed = JSON.parse(stored);
            cache.current[range] = parsed;
            setData(parsed);
          }
        } catch {}
      }

      // 3. Fetch fresh data — only show loading spinner if nothing cached yet
      if (!cache.current[range]) setLoading(true);
      setFetching(true);

      try {
        const since = getSince(range);
        const tzOffset = new Date().getTimezoneOffset();
        const groupBy = range === "day" ? "hour" : range === "week" ? "day" : null;

        const spotifyMediumTerm = range === "6mo" && token
          ? Promise.all([
              fetch("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=1", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
              fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=1", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
            ]).catch(() => null)
          : Promise.resolve(null);

        const [statsData, topData, genresData, spotifyData] = await Promise.all([
          fetchStats({ userId: user.id, since, groupBy, tzOffset }),
          fetchTop({ userId: user.id, since }),
          fetchGenres({ userId: user.id, since }).catch(() => ({ genres: [] })),
          spotifyMediumTerm,
        ]);

        if (cancelled) return;

        const genres = genresData?.genres ?? [];
        let result;

        if (range === "6mo") {
          // Switch this to true once polling history covers ~6 months,
          // then stats/top can come entirely from polling like other ranges.
          const has6moPolling = false;

          const sa = spotifyData?.[0]?.items?.[0] ?? null;
          const st = spotifyData?.[1]?.items?.[0] ?? null;
          result = {
            stats: has6moPolling ? statsData : null,
            top: has6moPolling ? topData : {
              topArtist: sa
                ? { name: sa.name, albumImageUrl: sa.images?.[1]?.url ?? null, plays: null, minutes: null }
                : null,
              topTrack: st
                ? { name: st.name, albumImageUrl: st.album?.images?.[1]?.url ?? null, plays: null }
                : null,
            },
            artistImageUri: has6moPolling ? null : (sa?.images?.[1]?.url ?? null),
            genres: has6moPolling ? genres : [],
          };
        } else {
            const artistImageUri = topData?.topArtist?.artistImageUrl ?? null;
          result = { stats: statsData, top: topData, artistImageUri, genres };
        }

        if (cancelled) return;

        // Only update state + persist if data actually changed
        if (JSON.stringify(cache.current[range]) !== JSON.stringify(result)) {
          cache.current[range] = result;
          setData(result);
          SecureStore.setItemAsync(`stats_v5_${range}`, JSON.stringify(result)).catch(() => {});
        }
      } catch (err) {
        console.log("stats error", err.message);
        showToast("Couldn't load stats");
      } finally {
        if (!cancelled) { setLoading(false); setFetching(false); }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [user?.id, range]);

  const totalMinutes = data?.stats?.total_minutes ?? null;
  const totalPlays = data?.stats?.total_plays ?? null;
  const topArtist = data?.top?.topArtist ?? null;
  const topTrack = data?.top?.topTrack ?? null;
  const artistImageUri = data?.artistImageUri ?? null;
  const genres = data?.genres ?? [];

  const chartPoints = data?.stats?.chart_points ?? null;
  const chartXLabels = getXLabels(range);
  const chartMax = chartPoints ? Math.max(...chartPoints, 1) : 1;
  const chartYLabels = [formatAxisY(chartMax), formatAxisY(chartMax / 2), '0'];
  const yColH = chartXLabels ? CHART_H - CHART_X_H : CHART_H;

  function formatAvgDay(m) {
    if (m == null) return "—";
    return m >= 60 ? `${(m / 60).toFixed(1)}h` : `${m}m`;
  }

  function formatArtistStat() {
    if (!topArtist?.plays) return null;
    const hrs = Math.round(topArtist.minutes / 60);
    const time = hrs > 0 ? `${hrs}h` : `${topArtist.minutes}m`;
    return `${time} · ${topArtist.plays} plays`;
  }

  function formatTrackStat() {
    if (!topTrack?.plays) return null;
    return `${topTrack.plays} plays`;
  }

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 14, paddingBottom: 130 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Body size={22} weight={800} style={{ letterSpacing: -0.6, marginBottom: 18 }}>
          Stats
        </Body>

        {/* Range chips */}
        <View style={styles.chips}>
          {RANGES.map((r) => (
            <Chip key={r.key} active={r.key === range} onPress={() => setRange(r.key)}>
              {r.label}
            </Chip>
          ))}
        </View>

        {/* Hero card */}
        <Box style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View>
              <Mono dim>{currentRange.kicker}</Mono>
              <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6, marginTop: 2 }}>
                <Body size={38} weight={800} style={{ letterSpacing: -1.4 }}>
                  {loading ? "—" : formatMinutes(totalMinutes)}
                </Body>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingBottom: 5 }}>
                  <Mono size={12}>min</Mono>
                  {fetching && <ActivityIndicator size="small" color={tokens.ink3} style={{ transform: [{ scale: 0.6 }] }} />}
                </View>
              </View>
            </View>
            <View style={styles.heroDelta}>
              <Mono dim>plays</Mono>
              <Body size={14} weight={700} style={{ marginTop: 2 }}>
                {loading ? "—" : (totalPlays?.toLocaleString() ?? "—")}
              </Body>
            </View>
          </View>

          {chartPoints && (
            <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
              {/* Y-axis column */}
              <View style={{ justifyContent: 'space-between', height: yColH, paddingTop: 1, paddingBottom: 1 }}>
                {chartYLabels.map((lbl, i) => (
                  <Text key={i} style={axisLabelStyle}>{lbl}</Text>
                ))}
              </View>
              {/* Chart + x-axis labels */}
              <View style={{ flex: 1, minWidth: 0 }}>
                <LineChart points={chartPoints} height={CHART_H} xLabels={chartXLabels} />
              </View>
            </View>
          )}
        </Box>

        {/* Metric grid */}
        <Box style={styles.metricCard}>
          <View style={styles.metricGrid}>
            {[
              ["plays", loading ? "—" : (totalPlays?.toLocaleString() ?? "—")],
              ["unique", loading ? "—" : (data?.stats?.unique_tracks?.toLocaleString() ?? "—")],
              ["skips", "—"],
              ["avg/day", loading || range === "day" ? "—" : formatAvgDay(data?.stats?.avg_min_per_day)],
              ["peak day", loading || range === "day" ? "—" : (data?.stats?.peak_day ?? "—")],
              ["peak hr", "—"],
            ].map(([label, value]) => (
              <View key={label} style={styles.metricCell}>
                <Mono size={9} style={{ color: tokens.accentInk, opacity: 0.5 }}>{label}</Mono>
                <Body size={20} weight={700} style={{ marginTop: 2, color: tokens.accentInk }}>
                  {value}
                </Body>
              </View>
            ))}
          </View>
        </Box>

        {/* Top artist + top album */}
        <View style={styles.splitGrid}>
          <TopSplitCard
            kicker="top artist"
            name={loading ? null : topArtist?.name}
            stat={loading ? null : formatArtistStat()}
            uri={loading ? undefined : (artistImageUri ?? topArtist?.albumImageUrl)}
            onPress={() => navigation.navigate("TopArtists", { userId: user.id })}
          />
          <TopSplitCard
            kicker="top track"
            name={loading ? null : topTrack?.name}
            stat={loading ? null : formatTrackStat()}
            uri={loading ? undefined : topTrack?.albumImageUrl}
          />
        </View>

        {/* Top genres */}
        {!loading && genres.length === 0 ? null : <Box style={styles.genreCard}>
          <Mono>Top genres</Mono>
          <View style={styles.genreList}>
            {(loading || genres.length === 0 ? [] : genres).map((g, i) => (
              <View key={g.name} style={styles.genreRow}>
                <Body size={11} weight={500} style={styles.genreLabel} numberOfLines={1}>
                  {g.name}
                </Body>
                <View style={styles.genreTrack}>
                  <View
                    style={[
                      styles.genreFill,
                      {
                        width: `${g.pct}%`,
                        backgroundColor: i === 0 ? tokens.accent : tokens.ink,
                      },
                    ]}
                  />
                </View>
                <Mono dim size={9} style={styles.genrePct}>
                  {g.minutes == null ? "—" : g.minutes >= 60 ? `${(g.minutes / 60).toFixed(1)}h` : `${g.minutes}m`}
                </Mono>
              </View>
            ))}
          </View>
        </Box>}
      </ScrollView>
    </View>
  );
}

function TopSplitCard({ kicker, name, stat, uri, round, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.splitCard}>
      <Box style={{ padding: 10 }}>
        <Mono dim>{kicker}</Mono>
        <Art
          size={{ w: "100%" }}
          uri={uri}
          round={round}
          style={[
            { marginTop: 6, aspectRatio: 1 },
            round && { backgroundColor: "transparent", borderWidth: 0 },
          ]}
        />
        <Body size={12} weight={700} style={{ marginTop: 6 }} numberOfLines={2}>
          {name ?? "—"}
        </Body>
        <Mono dim size={9} style={{ marginTop: 2 }}>
          {stat ?? "—"}
        </Mono>
      </Box>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.bg,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  chips: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 18,
  },
  heroCard: {
    padding: 14,
    marginBottom: 18,
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroDelta: {
    alignItems: "flex-end",
  },
  metricCard: {
    padding: 16,
    marginBottom: 18,
    backgroundColor: tokens.accent,
    borderColor: tokens.accent,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  metricCell: {
    width: "33.33%",
    paddingVertical: 10,
    paddingRight: 8,
  },
  splitGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  splitCard: {
    flex: 1,
  },
  genreCard: {
    padding: 14,
    marginBottom: 18,
  },
  genreList: {
    marginTop: 10,
    gap: 8,
  },
  genreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  genreLabel: {
    width: 110,
  },
  genreTrack: {
    flex: 1,
    height: 8,
    borderRadius: 99,
    backgroundColor: tokens.shade,
    overflow: "hidden",
  },
  genreFill: {
    height: "100%",
    borderRadius: 99,
  },
  genrePct: {
    width: 32,
    textAlign: "right",
  },
});
