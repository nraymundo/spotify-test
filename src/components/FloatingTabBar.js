import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { BlurView } from "expo-blur";
import { tokens, tokensDark, fonts } from "../lib/tokens";
import { HomeIcon, StatsIcon, RecentIcon } from "./ui/TabIcons";

const ICONS = {
  Home: HomeIcon,
  Stats: StatsIcon,
  Recent: RecentIcon,
};

const isDark = tokens === tokensDark;
const blurTint = isDark ? "dark" : "light";
const pillBg = isDark ? "rgba(18,18,18,0.55)" : "rgba(240,238,233,0.78)";
const borderColor = isDark ? "rgba(255,255,255,0.14)" : "rgba(18,18,18,0.14)";

export default function FloatingTabBar({ state, navigation }) {
  return (
    <View style={[styles.container, { borderColor }]}>
      <BlurView intensity={60} tint={blurTint} style={[styles.pill, { backgroundColor: pillBg }]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const Icon = ICONS[route.name];
          const color = isFocused ? tokens.accent2 : tokens.ink2;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              {Icon ? <Icon color={color} /> : null}
              <Text style={[styles.label, { color }]}>{route.name}</Text>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 22,
    height: 64,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tab: {
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.3,
  },
});
