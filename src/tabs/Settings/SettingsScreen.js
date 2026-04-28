import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTokens, useThemeMode } from "../../lib/theme";
import { supabase } from "../../lib/supabase";
import Mono from "../../components/ui/Mono";
import Body from "../../components/ui/Body";
import Box from "../../components/ui/Box";
import Art from "../../components/ui/Art";

const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

function formatSince(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = String(d.getFullYear()).slice(-2);
  return `since ${month} '${year}`;
}

export default function SettingsScreen({ user, onLogout }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const t = useTokens();
  const { mode, setMode } = useThemeMode();
  const styles = useMemo(() => makeStyles(t), [t]);
  const [memberSince, setMemberSince] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setMemberSince(formatSince(data?.user?.created_at));
    });
  }, []);

  function confirmLogout() {
    Alert.alert("Log out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: onLogout },
    ]);
  }

  const handle = user?.id ? `@${user.id}` : null;
  const subtitle = [handle, memberSince].filter(Boolean).join(" · ");

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={styles.backButton}
        >
          <Body size={22} weight={500}>
            ‹
          </Body>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileBlock}>
          <Art size={104} round uri={user?.image} />
          <Body size={26} weight={800} style={styles.name}>
            {user?.displayName ?? "—"}
          </Body>
          {subtitle ? (
            <Mono size={10} dim style={styles.subtitle}>
              {subtitle}
            </Mono>
          ) : null}
          <Pressable style={styles.editProfileButton}>
            <Body size={13} weight={600}>
              Edit profile
            </Body>
          </Pressable>
        </View>

        <Mono size={10} dim style={styles.sectionKicker}>
          CONNECTIONS
        </Mono>
        <Box style={styles.card}>
          <View style={styles.row}>
            <Body size={14} weight={500}>
              Spotify
            </Body>
            <View style={styles.rowRight}>
              <Mono size={10} dim>
                {user ? "CONNECTED" : "DISCONNECTED"}
              </Mono>
              <Body size={16} weight={400} color={t.ink3}>
                ›
              </Body>
            </View>
          </View>
        </Box>

        <Mono size={10} dim style={styles.sectionKicker}>
          PREFERENCES
        </Mono>
        <Box style={styles.card}>
          <View style={styles.themeRowGroup}>
            <Body size={14} weight={500} style={styles.themeLabel}>
              Theme
            </Body>
            {THEME_OPTIONS.map((opt) => {
              const active = mode === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setMode(opt.value)}
                  style={[styles.themeOption, active && styles.themeOptionActive]}
                >
                  <Body size={13} weight={active ? 700 : 500} color={active ? t.accentInk : t.ink}>
                    {opt.label}
                  </Body>
                </Pressable>
              );
            })}
          </View>
        </Box>

        <Pressable
          onPress={confirmLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Body size={15} weight={700}>
            Log out
          </Body>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const makeStyles = (t) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: t.bg,
  },
  headerBar: {
    height: 40,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  profileBlock: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 4,
  },
  name: {
    marginTop: 14,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 4,
    letterSpacing: 0.6,
  },
  editProfileButton: {
    marginTop: 12,
    paddingHorizontal: 18,
    height: 36,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: t.line,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionKicker: {
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1,
  },
  card: {
    paddingHorizontal: 14,
    marginBottom: 22,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    minHeight: 48,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  themeRowGroup: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 6,
  },
  themeLabel: {
    flex: 1,
  },
  themeOption: {
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: t.line2,
    alignItems: "center",
    justifyContent: "center",
  },
  themeOptionActive: {
    backgroundColor: t.accent,
    borderColor: t.accent,
  },
  logoutButton: {
    marginTop: 12,
    height: 52,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: t.line,
    alignItems: "center",
    justifyContent: "center",
  },
});
