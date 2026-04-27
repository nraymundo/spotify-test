import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, ScrollView, StyleSheet, Pressable, Animated, Text, Image, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { tokens, fonts } from "../../lib/tokens";
import { fetchStats, fetchTop } from "../../lib/supabase";
import { useToast } from "../../lib/toast";
import Mono from "../../components/ui/Mono";
import Hand from "../../components/ui/Hand";
import Body from "../../components/ui/Body";
import Box from "../../components/ui/Box";
import Art from "../../components/ui/Art";
import Chip from "../../components/ui/Chip";
import LineChart from "../../components/ui/LineChart";
import SectionHead from "../../components/ui/SectionHead";

const CHART_RANGES = [
  { key: "7d", label: "7d", title: "7 days", days: 7 },
  { key: "30d", label: "30d", title: "30 days", days: 30 },
  { key: "6m", label: "6mo", title: "6 months", days: 180 },
];

// Placeholder friend feed — we don't have a social graph yet.
const PLACEHOLDER_FRIENDS = [
  { handle: "mira", track: "Linger", artist: "The Cranberries", time: "2m ago" },
  { handle: "jules", track: "Robbers", artist: "The 1975", time: "14m ago" },
  { handle: "sam", track: "Ribs", artist: "Lorde", time: "1h ago" },
];

function startOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = new Date(now);
  start.setDate(now.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
}

function startOfLastWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -13 : -6 - day;
  const start = new Date(now);
  start.setDate(now.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
}

function weekIndex() {
  const now = new Date();
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

function formatHoursMinutes(totalMinutes) {
  if (!totalMinutes) return "0 hours, 0 mins";
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hours} hour${hours === 1 ? "" : "s"}, ${mins} min${mins === 1 ? "" : "s"}`;
}

function formatDuration(totalMinutes) {
  if (totalMinutes == null) return "—";
  if (totalMinutes < 60) return `${totalMinutes}m`;
  return `${Math.round(totalMinutes / 60)}h`;
}

function getChartSince(rangeKey) {
  const now = new Date();
  if (rangeKey === "7d") {
    const d = new Date(now); d.setDate(now.getDate() - 7); return d.toISOString();
  }
  if (rangeKey === "6m") {
    const d = new Date(now); d.setMonth(now.getMonth() - 6); return d.toISOString();
  }
  const d = new Date(now); d.setDate(now.getDate() - 30); return d.toISOString();
}

// X-axis labels for the listening chart, 3 labels per range.
// TODO: replace with real date range from the data endpoint once daily aggregation is added.
// Formula: 7d → weekday abbrevs; 30d → month+day (start, mid, today); 6m → month abbrevs.
function getXLabels(rangeKey) {
  const now = new Date();
  const fmtDate = (d) =>
    `${d.toLocaleString("en-US", { month: "short" }).toLowerCase()} ${d.getDate()}`;
  const fmtMonth = (d) =>
    d.toLocaleString("en-US", { month: "short" }).toLowerCase();
  const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  if (rangeKey === "7d") {
    const start = new Date(now); start.setDate(now.getDate() - 6);
    const mid = new Date(now);   mid.setDate(now.getDate() - 3);
    return [weekdays[start.getDay()], weekdays[mid.getDay()], weekdays[now.getDay()]];
  }
  if (rangeKey === "6m") {
    const start = new Date(now); start.setMonth(now.getMonth() - 5);
    const mid = new Date(now);   mid.setMonth(now.getMonth() - 2);
    return [fmtMonth(start), fmtMonth(mid), fmtMonth(now)];
  }
  // 30d
  const start = new Date(now); start.setDate(now.getDate() - 29);
  const mid = new Date(now);   mid.setDate(now.getDate() - 14);
  return [fmtDate(start), fmtDate(mid), fmtDate(now)];
}

export default function HomeScreen({
  user,
  topArtists4Weeks,
  topArtists6Months,
  topArtistsAllTime,
  topTracks4Weeks,
  topTracks6Months,
  topTracksAllTime,
  onLogout,
}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const showToast = useToast();
  const scrollRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [lastWeekStats, setLastWeekStats] = useState(null);
  const [weekTop, setWeekTop] = useState(null);
  const [chartRange, setChartRange] = useState("7d");
  const [chartPoints, setChartPoints] = useState(null);
  const [chartRefreshing, setChartRefreshing] = useState(false);
  const chartCache = useRef({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [pullRefreshing, setPullRefreshing] = useState(false);
  const pendingRefreshes = useRef(0);

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    setRefreshKey(k => k + 1);
  }, []));

  function handlePullRefresh() {
    setPullRefreshing(true);
    pendingRefreshes.current = 2;
    setRefreshKey(k => k + 1);
  }

  function onFetchDone() {
    pendingRefreshes.current -= 1;
    if (pendingRefreshes.current <= 0) setPullRefreshing(false);
  }

  useEffect(() => {
    if (!user?.id) return;
    fetchStats({ userId: user.id, since: startOfWeek() })
      .then(setStats)
      .catch((error) => { console.log("stats error", error.message); showToast("Couldn't load stats"); })
      .finally(onFetchDone);
    fetchStats({ userId: user.id, since: startOfLastWeek(), until: startOfWeek() })
      .then(setLastWeekStats)
      .catch((error) => console.log("last week stats error", error.message))
      .finally(onFetchDone);
  }, [user?.id, refreshKey]);

  useEffect(() => {
    if (!user?.id) return;
    fetchTop({ userId: user.id, since: startOfWeek() })
      .then(setWeekTop)
      .catch((error) => { console.log("weekTop error", error.message); showToast("Couldn't load top tracks"); });
  }, [user?.id, refreshKey]);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    if (chartCache.current[chartRange]) {
      setChartPoints(chartCache.current[chartRange]);
    } else {
      setChartPoints(null);
    }
    setChartRefreshing(true);

    fetchStats({
      userId: user.id,
      since: getChartSince(chartRange),
      groupBy: "calendar_day",
      tzOffset: new Date().getTimezoneOffset(),
    })
      .then((result) => {
        if (cancelled) return;
        const points = result?.chart_points ?? null;
        if (points) chartCache.current[chartRange] = points;
        setChartPoints(points);
      })
      .catch((err) => console.log("chart error", err.message))
      .finally(() => { if (!cancelled) setChartRefreshing(false); });

    return () => { cancelled = true; };
  }, [user?.id, chartRange]);

  const minutes = stats?.total_minutes ?? 0;
  const plays = stats?.total_plays ?? 0;
  const lastWeekMinutes = lastWeekStats?.total_minutes ?? 0;
  const weekChange = lastWeekMinutes > 0
    ? Math.round(((minutes - lastWeekMinutes) / lastWeekMinutes) * 100)
    : null;
  const firstName = user?.displayName?.split(" ")?.[0] ?? "there";

  const chartMax = chartPoints ? Math.max(...chartPoints, 1) : 1;
  const yTop = Math.ceil(chartMax / 50) * 50;
  const yMid = yTop / 2;
  const xLabels = getXLabels(chartRange);

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 14, paddingBottom: 130 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={pullRefreshing} onRefresh={handlePullRefresh} tintColor={tokens.ink} />
        }
      >
        {/* Header: hand greeting + avatar */}
        <View style={styles.headerRow}>
          <Hand size={34}>Hi, {firstName}.</Hand>
          <Pressable
            onLongPress={() =>
              Alert.alert("Sign out", "Are you sure?", [
                { text: "Cancel", style: "cancel" },
                { text: "Sign out", style: "destructive", onPress: onLogout },
              ])
            }
          >
            <Art size={32} round uri={user?.image} />
          </Pressable>
        </View>
        <View style={{ marginBottom: 14 }}>
          <Mono dim>week {weekIndex()} of 52</Mono>
        </View>

        {/* Editorial hero card */}
        <View style={styles.hero}>
          <Mono
            size={10}
            style={{ color: tokens.accent, letterSpacing: 1.5, marginBottom: 8 }}
          >
            THIS WEEK · IN MINUTES
          </Mono>
          <Body
            size={92}
            weight={800}
            color={tokens.bg}
            style={{ letterSpacing: -3.5, marginTop: -8, marginBottom: -8 }}
          >
            {minutes}
          </Body>
          <Hand size={22} color={tokens.accent} style={{ marginTop: 6 }}>
            ~ that's {formatHoursMinutes(minutes)}
          </Hand>
          {weekChange !== null && (
            <View style={styles.heroFooter}>
              <Mono size={10} style={{ color: "rgba(255,255,255,0.6)" }}>
                {weekChange >= 0 ? "↑" : "↓"} {Math.abs(weekChange)}% vs last week
              </Mono>
            </View>
          )}
        </View>

        {/* Top-3 shortcut grid */}
        <SectionHead
          kicker="quick jump"
          title="Your top this week"
          action="see all →"
          onActionPress={() =>
            navigation.navigate("Top Artists", { userId: user.id })
          }
        />
        <View style={styles.topGrid}>
          <TopCard
            label="ARTIST"
            name={weekTop?.topArtist?.name}
            stat={formatDuration(weekTop?.topArtist?.minutes)}
            uri={weekTop?.topArtist?.artistImageUrl}
            onPress={() =>
              navigation.navigate("Top Artists", { userId: user.id })
            }
          />
          <TopCard
            label="ALBUM"
            name={weekTop?.topAlbum?.name}
            stat={weekTop?.topAlbum?.plays ? `${weekTop.topAlbum.plays} plays` : null}
            uri={weekTop?.topAlbum?.albumImageUrl}
          />
          <TopCard
            label="SONG"
            name={weekTop?.topTrack?.name}
            stat={weekTop?.topTrack?.plays ? `${weekTop.topTrack.plays} plays` : null}
            uri={weekTop?.topTrack?.albumImageUrl}
            onPress={() =>
              navigation.navigate("Top Tracks", {
                topTracks4Weeks,
                topTracks6Months,
                topTracksAllTime,
              })
            }
          />
        </View>

        {/* 30-day listening chart */}
        <Box style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Mono>Listening · {CHART_RANGES.find((r) => r.key === chartRange)?.title}</Mono>
              {chartRefreshing && <ActivityIndicator size="small" color={tokens.ink3} />}
            </View>
            <View style={styles.chips}>
              {CHART_RANGES.map((r) => (
                <Chip
                  key={r.key}
                  active={r.key === chartRange}
                  onPress={() => setChartRange(r.key)}
                >
                  {r.label}
                </Chip>
              ))}
            </View>
          </View>
          {chartPoints ? (
            <View style={styles.chartRow}>
              {/* Y-axis */}
              <View style={[styles.yAxis, { height: 110 }]}>
                <Mono size={9} dim>{yTop}</Mono>
                <Mono size={9} dim>{yMid}</Mono>
                <Mono size={9} dim>0</Mono>
              </View>
              {/* Chart + x-axis */}
              <View style={styles.chartCol}>
                <LineChart points={chartPoints} height={110} />
                <View style={styles.xAxis}>
                  {xLabels.map((label, i) => (
                    <Mono key={i} size={9} dim style={{ textTransform: "none" }}>{label}</Mono>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.chartSkeleton} />
          )}
        </Box>

        {/* Friends feed */}
        <SectionHead kicker="friends" title="What they're playing" />
        <View style={styles.friendsList}>
          {PLACEHOLDER_FRIENDS.map((f, i) => (
            <Box key={i} style={styles.friendCard}>
              <Art size={36} round />
              <View style={styles.friendText}>
                <Body size={12} weight={600}>
                  @{f.handle} ·{" "}
                  <Body size={12} weight={500} color={tokens.ink2}>
                    {f.track}
                  </Body>
                </Body>
                <View style={{ marginTop: 2 }}>
                  <Mono size={9} dim>
                    {f.artist} · {f.time}
                  </Mono>
                </View>
              </View>
              <View style={styles.friendDot} />
            </Box>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function TopCard({ label, name, stat, uri, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.timing(scale, { toValue: 0.98, duration: 80, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }).start();

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} style={{ flex: 1 }}>
      <Animated.View style={[styles.topCardBox, { transform: [{ scale }] }]}>
        <Text style={styles.topCardLabel}>{label}</Text>
        <View style={styles.topCardArt}>
          {uri ? (
            <Image source={{ uri }} style={{ width: "100%", height: "100%" }} />
          ) : (
            <View style={{ flex: 1, backgroundColor: tokens.shade2 }} />
          )}
        </View>
        <Text style={styles.topCardName} numberOfLines={2}>
          {name ?? "—"}
        </Text>
        <Text style={styles.topCardMeta}>{stat ?? "—"}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.bg,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  hero: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: tokens.ink,
    marginBottom: 16,
    overflow: "hidden",
  },
  heroFooter: {
    marginTop: 14,
    flexDirection: "row",
    gap: 14,
  },
  topGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  topCardBox: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FAF7F1",
    borderWidth: 1.5,
    borderColor: tokens.line,
    borderRadius: 10,
    flexDirection: "column",
  },
  topCardLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: tokens.ink3,
    marginBottom: 6,
  },
  topCardArt: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: tokens.line2,
    overflow: "hidden",
    backgroundColor: tokens.shade2,
  },
  topCardName: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 13.2,
    color: tokens.ink,
    marginTop: 8,
    flex: 1,
    minHeight: 26,
  },
  topCardMeta: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: tokens.ink3,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },
  chartCard: {
    padding: 12,
    marginBottom: 18,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  chips: {
    flexDirection: "row",
    gap: 4,
  },
  chartSkeleton: {
    height: 126,
    borderRadius: 6,
    backgroundColor: tokens.shade2,
  },
  chartRow: {
    flexDirection: "row",
    gap: 6,
  },
  yAxis: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: 1,
    paddingBottom: 1,
  },
  chartCol: {
    flex: 1,
    minWidth: 0,
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  friendsList: {
    gap: 8,
  },
  friendCard: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  friendText: {
    flex: 1,
    minWidth: 0,
  },
  friendDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    backgroundColor: tokens.accent,
  },
});
