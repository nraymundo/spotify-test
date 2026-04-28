import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTokens } from "../../lib/theme";
import { fetchDay } from "../../lib/supabase";
import Mono from "../../components/ui/Mono";
import Body from "../../components/ui/Body";
import Art from "../../components/ui/Art";
import Box from "../../components/ui/Box";

const SORT_OPTIONS = ["by time", "by artist", "longest"];

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function formatKicker(dateStr) {
  // Parse as noon UTC to avoid any date-boundary issues
  const d = new Date(dateStr + "T12:00:00Z");
  return `${WEEKDAYS[d.getUTCDay()]} · ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

function formatTime(isoString) {
  const d = new Date(isoString);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "p" : "a";
  h = h % 12 || 12;
  return `${h}:${m}${ampm}`;
}

function formatDuration(ms) {
  const totalSec = Math.round(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function DayDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { date, label, userId } = route.params;
  const t = useTokens();
  const styles = useMemo(() => makeStyles(t), [t]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("by time");

  useEffect(() => {
    const tzOffset = new Date().getTimezoneOffset();
    fetchDay({ userId, date, tzOffset })
      .then(setData)
      .catch((err) => console.log("day error", err.message))
      .finally(() => setLoading(false));
  }, [userId, date]);

  const sortedPlays = useMemo(() => {
    if (!data?.plays) return [];
    const p = [...data.plays];
    if (sort === "by time") {
      return p.sort((a, b) => new Date(b.played_at) - new Date(a.played_at));
    }
    if (sort === "by artist") {
      return p.sort((a, b) =>
        (a.artist_names?.[0] ?? "").localeCompare(b.artist_names?.[0] ?? "")
      );
    }
    // longest
    return p.sort((a, b) => b.duration_ms - a.duration_ms);
  }, [data?.plays, sort]);

  const stats = data
    ? [
        ["plays", String(data.total_plays), null],
        ["listening", String(data.total_minutes), "m"],
        ["artists", String(data.unique_artists), null],
        ["streak", String(data.streak), "d"],
      ]
    : [];

  return (
    <View style={[styles.root, { paddingTop: insets.top + 14 }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 10 }}>
          <Mono dim style={{ textTransform: "none" }}>← recent</Mono>
        </Pressable>

        {/* Day header */}
        <Mono size={10} style={{ letterSpacing: 0.5 }}>{formatKicker(date)}</Mono>
        <Body
          size={26}
          weight={800}
          style={{ letterSpacing: -0.6, marginTop: 2, marginBottom: 10 }}
        >
          {label}
        </Body>

        {loading && (
          <ActivityIndicator color={t.ink3} style={{ marginTop: 40 }} />
        )}

        {!loading && data && (
          <>
            {/* Summary card */}
            <Box style={styles.summaryCard}>
              {stats.map(([lbl, val, suffix]) => (
                <View key={lbl}>
                  <Mono dim size={9}>{lbl}</Mono>
                  <View style={{ flexDirection: "row", alignItems: "baseline", marginTop: 2 }}>
                    <Body size={18} weight={800}>{val}</Body>
                    {suffix && (
                      <Mono size={10} style={{ marginLeft: 2 }}>{suffix}</Mono>
                    )}
                  </View>
                </View>
              ))}
            </Box>

            {/* Sort chips */}
            <View style={styles.chips}>
              {SORT_OPTIONS.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => setSort(opt)}
                  style={[styles.chip, sort === opt && styles.chipActive]}
                >
                  <Mono
                    size={9}
                    style={{
                      color: sort === opt ? t.accentInk : t.ink2,
                      textTransform: "none",
                    }}
                  >
                    {opt}
                  </Mono>
                </Pressable>
              ))}
            </View>

            {/* Track list */}
            <View>
              {sortedPlays.map((play, i) => (
                <View
                  key={i}
                  style={[styles.row, i === 0 && { borderTopWidth: 0 }]}
                >
                  <Mono
                    dim
                    size={9}
                    style={{ width: 36, textAlign: "right", textTransform: "none" }}
                  >
                    {formatTime(play.played_at)}
                  </Mono>
                  <Art size={36} uri={play.album_image_url} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Body size={12} weight={700} numberOfLines={1}>
                      {play.track_name}
                    </Body>
                    <Mono
                      dim
                      size={9}
                      style={{ textTransform: "none" }}
                      numberOfLines={1}
                    >
                      {play.artist_names?.[0]}
                    </Mono>
                  </View>
                  <Mono dim size={9} style={{ textTransform: "none" }}>
                    {formatDuration(play.duration_ms)}
                  </Mono>
                </View>
              ))}
            </View>

            {/* End footer */}
            <View style={styles.footer}>
              <Mono dim size={9} style={{ textTransform: "none" }}>
                end of day · {data.total_plays} plays
              </Mono>
            </View>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 130,
  },
  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 12,
  },
  chips: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
  },
  chip: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: t.line,
  },
  chipActive: {
    backgroundColor: t.accent,
    borderColor: t.accent,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: t.line2,
    borderStyle: "dashed",
  },
  footer: {
    marginTop: 14,
    alignItems: "center",
    paddingBottom: 8,
  },
});
