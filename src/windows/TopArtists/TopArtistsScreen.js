import React, { useEffect, useState, useMemo } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTokens } from "../../lib/theme";
import { fetchTop } from "../../lib/supabase";
import Mono from "../../components/ui/Mono";
import Body from "../../components/ui/Body";
import Art from "../../components/ui/Art";
import Chip from "../../components/ui/Chip";

const PREV_ROUTE_LABELS = {
  Main: "home",
  StatsMain: "stats",
};

const _cache = {};
const TTL = 5 * 60 * 1000;

function getSince(range) {
  const now = new Date();
  if (range === "day") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }
  if (range === "week") {
    const d = new Date(now);
    const day = d.getDay();
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }
  if (range === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  }
  const d = new Date(now);
  d.setMonth(d.getMonth() - 6);
  return d.toISOString();
}

function getKicker(range) {
  if (range === "day") return "top · today";
  if (range === "week") return "top · this week";
  if (range === "6mo") return "top · 6 months";
  return "top · this month";
}

function fmtHero(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${h}h`;
}

function fmtTile(minutes) {
  const h = Math.floor(minutes / 60);
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}h ${m}m`;
}

function fmtTail(minutes) {
  return `${Math.round(minutes / 60)}h`;
}

const SUPPORTED_RANGES = ["day", "week", "month", "6mo"];

export default function TopArtistsScreen({ route }) {
  const { userId } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const t = useTokens();
  const styles = useMemo(() => makeStyles(t), [t]);
  const initialRange = SUPPORTED_RANGES.includes(route.params?.range)
    ? route.params.range
    : "month";
  const [range, setRange] = useState(initialRange);
  const [artists, setArtists] = useState(null);

  const navState = navigation.getState();
  const prevRouteName = navState?.routes?.[navState.index - 1]?.name;
  const backLabel = PREV_ROUTE_LABELS[prevRouteName] ?? "back";

  useEffect(() => {
    if (!userId) return;
    const key = `${userId}_${range}`;
    const cached = _cache[key];
    if (cached && Date.now() - cached.ts < TTL) {
      setArtists(cached.data);
      return;
    }
    setArtists(null);
    fetchTop({ userId, since: getSince(range) })
      .then((res) => {
        const list = res?.topArtistsList ?? [];
        _cache[key] = { data: list, ts: Date.now() };
        setArtists(list);
      })
      .catch((err) => console.log("topArtists error", err.message));
  }, [userId, range]);

  const hero = artists?.[0] ?? null;
  const second = artists?.[1] ?? null;
  const third = artists?.[2] ?? null;
  const tail = artists?.slice(3, 10) ?? [];

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 14, paddingBottom: 130 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 10 }}>
          <Mono dim style={{ textTransform: "none" }}>← {backLabel}</Mono>
        </Pressable>
        <Mono size={10} dim style={{ marginBottom: 4 }}>
          {getKicker(range)}
        </Mono>
        <Body size={24} weight={800} style={{ letterSpacing: -0.6, marginBottom: 12 }}>
          Top Artists
        </Body>

        <View style={styles.chips}>
          <Chip active={range === "day"} onPress={() => setRange("day")}>Day</Chip>
          <Chip active={range === "week"} onPress={() => setRange("week")}>Week</Chip>
          <Chip active={range === "month"} onPress={() => setRange("month")}>Month</Chip>
          <Chip active={range === "6mo"} onPress={() => setRange("6mo")}>6mo</Chip>
        </View>

        {artists === null ? (
          <View style={styles.skeleton} />
        ) : (
          <>
            {/* Hero #1 */}
            {hero && (
              <View style={{ marginBottom: 18 }}>
                <Art
                  size={{ w: "100%" }}
                  uri={hero.artworkUrl}
                  style={{ aspectRatio: 1, borderRadius: 0 }}
                />
                <View style={styles.heroCaption}>
                  <View style={styles.heroCaptionLeft}>
                    <Mono size={8} style={{ color: t.ink3, marginRight: 8 }}>#1</Mono>
                    <Body size={16} weight={700} numberOfLines={1} style={{ flex: 1 }}>
                      {hero.name}
                    </Body>
                  </View>
                  <Body size={16} weight={700} style={{ color: t.accent2 }}>
                    {fmtHero(hero.minutes)}
                  </Body>
                </View>
              </View>
            )}

            {/* Tiles #2/#3 */}
            {(second || third) && (
              <View style={styles.tilesRow}>
                {[second, third].map((artist, idx) =>
                  artist ? (
                    <View key={artist.rank} style={styles.tileCell}>
                      <Art
                        size={{ w: "100%" }}
                        uri={artist.artworkUrl}
                        style={{ aspectRatio: 1, borderRadius: 0 }}
                      />
                      <View style={{ marginTop: 4, gap: 2 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Mono size={8} style={{ color: t.ink3, marginRight: 4 }}>
                            #{artist.rank}
                          </Mono>
                          <Body size={13} weight={700} numberOfLines={1} style={{ flex: 1 }}>
                            {artist.name}
                          </Body>
                        </View>
                        <Mono size={9} dim>{fmtTile(artist.minutes)}</Mono>
                      </View>
                    </View>
                  ) : (
                    <View key={idx} style={styles.tileCell} />
                  )
                )}
              </View>
            )}

            {/* Section header */}
            {tail.length > 0 && (
              <Mono size={10} style={{ marginBottom: 8, marginTop: 2 }}>
                4 — {3 + tail.length}
              </Mono>
            )}

            {/* Tail list 4–10 */}
            {tail.map((artist) => (
              <View key={artist.rank} style={styles.tailRow}>
                <Mono size={10} style={{ color: t.ink3, width: 18 }}>
                  {artist.rank}
                </Mono>
                <Art size={28} round uri={artist.artworkUrl} />
                <Body size={12} weight={600} numberOfLines={1} style={{ flex: 1 }}>
                  {artist.name}
                </Body>
                <Mono size={9} dim>{fmtTail(artist.minutes)}</Mono>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = (t) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: t.bg,
  },
  scroll: {
    paddingHorizontal: 20,
  },
  chips: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  skeleton: {
    flex: 1,
    minHeight: 400,
    backgroundColor: t.shade2,
    borderRadius: 6,
  },
  heroCaption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  heroCaptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  tilesRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  tileCell: {
    flex: 1,
  },
  tailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: t.line2,
  },
});
