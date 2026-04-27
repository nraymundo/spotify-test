import React, { useState, useCallback, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { tokens, fonts } from "../../lib/tokens";
import { fetchRecent } from "../../lib/supabase";
import Mono from "../../components/ui/Mono";
import Body from "../../components/ui/Body";
import Art from "../../components/ui/Art";

function formatTime(isoString) {
  const d = new Date(isoString);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "p" : "a";
  h = h % 12 || 12;
  return `${h}:${m}${ampm}`;
}

function formatGroupKicker(day) {
  const m = day.total_minutes;
  const time = m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
  return `${day.total_plays} plays · ${time}`;
}

function DayGroup({ label, kicker, plays, totalPlays, onSeeAll }) {
  // Chunk into rows of 3
  const rows = [];
  for (let i = 0; i < plays.length; i += 3) {
    rows.push(plays.slice(i, i + 3));
  }

  return (
    <View style={styles.group}>
      <View style={styles.groupHead}>
        <Mono>{label}</Mono>
        <Mono dim>{kicker}</Mono>
      </View>

      <View style={{ gap: 8 }}>
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={{ flexDirection: "row", gap: 8 }}>
            {row.map((play, colIdx) => (
              <View key={colIdx} style={{ flex: 1 }}>
                <Art
                  size={{ w: "100%" }}
                  uri={play.album_image_url}
                  style={{ aspectRatio: 1 }}
                />
                <Body
                  size={11}
                  weight={600}
                  style={{ marginTop: 5, lineHeight: 14 }}
                  numberOfLines={2}
                >
                  {play.track_name}
                </Body>
                <View style={styles.tileMeta}>
                  <Mono
                    dim
                    size={9}
                    style={{ flex: 1, textTransform: "none" }}
                    numberOfLines={1}
                  >
                    {play.artist_names?.[0]}
                  </Mono>
                  <Mono dim size={9} style={{ textTransform: "none" }}>
                    {formatTime(play.played_at)}
                  </Mono>
                </View>
              </View>
            ))}
            {/* Pad last row so flex distributes correctly */}
            {Array(3 - row.length)
              .fill(null)
              .map((_, i) => (
                <View key={`pad-${i}`} style={{ flex: 1 }} />
              ))}
          </View>
        ))}
      </View>

      {totalPlays > 6 && (
        <Pressable style={styles.seeAllRow} onPress={onSeeAll}>
          <Mono
            size={10}
            style={{ color: tokens.accent2, fontFamily: fonts.monoMedium }}
          >
            see all {totalPlays} →
          </Mono>
        </Pressable>
      )}
    </View>
  );
}

export default function RecentScreen({ user }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const hasLoaded = useRef(false);

  const load = useCallback((silent = false) => {
    if (!user?.id) return;
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    const tzOffset = new Date().getTimezoneOffset();
    fetchRecent({ userId: user.id, tzOffset })
      .then(setData)
      .catch((err) => {
        console.log("recent error", err.message);
        setError(err.message);
      })
      .finally(() => { setLoading(false); setRefreshing(false); });
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      load(!hasLoaded.current ? false : true);
      hasLoaded.current = true;
      const interval = setInterval(() => load(true), 2 * 60 * 1000);
      return () => clearInterval(interval);
    }, [load])
  );

  function goToDay(date, label) {
    navigation.navigate("DayDetail", { date, label, userId: user.id });
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 14 }]}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Body size={26} weight={800} style={{ letterSpacing: -0.6 }}>
            Recent
          </Body>
          {refreshing && <ActivityIndicator size="small" color={tokens.ink3} />}
        </View>

        {loading && (
          <ActivityIndicator color={tokens.ink3} style={{ marginTop: 40 }} />
        )}

        {!loading && error && (
          <Mono dim style={{ textTransform: "none", marginTop: 40, textAlign: "center" }}>
            {error}
          </Mono>
        )}

        {!loading && !error && data && !data.today && !data.yesterday && (
          <Mono dim style={{ textTransform: "none", marginTop: 40, textAlign: "center" }}>
            no plays yet today or yesterday
          </Mono>
        )}

        {!loading && !error && data && (
          <>
            {data.today && (
              <DayGroup
                label="today"
                kicker={formatGroupKicker(data.today)}
                plays={data.today.plays}
                totalPlays={data.today.total_plays}
                onSeeAll={() => goToDay(data.today.date, "Today")}
              />
            )}
            {data.yesterday && (
              <DayGroup
                label="yesterday"
                kicker={formatGroupKicker(data.yesterday)}
                plays={data.yesterday.plays}
                totalPlays={data.yesterday.total_plays}
                onSeeAll={() => goToDay(data.yesterday.date, "Yesterday")}
              />
            )}
            {/* TODO: older day groups are out of scope — data layer may return them in future */}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.bg,
  },
  group: {
    marginBottom: 20,
  },
  groupHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tileMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
    marginTop: 3,
  },
  seeAllRow: {
    marginTop: 8,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: tokens.line2,
    borderStyle: "dashed",
  },
});
