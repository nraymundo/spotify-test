// Design tokens from claude-design/design_handoff_home_d.
// Currently the app runs in dark mode only; light is exported for future use.

const dark = {
  bg: "#121212",
  surface: "#1B1B1B",
  ink: "#F0EEE9",
  ink2: "#BFBAB0",
  ink3: "#85807A",
  line: "#F0EEE9",
  line2: "#3A3833",
  shade: "#1F1F1F",
  shade2: "#2A2A2A",
  accent: "#FFD166",
  accent2: "#588B8B",
  accentInk: "#3A2A05",
};

const light = {
  bg: "#F0EEE9",
  surface: "#F7F5F0",
  ink: "#121212",
  ink2: "#3D3D3D",
  ink3: "#7A756B",
  line: "#121212",
  line2: "#C7C2B6",
  shade: "#E5E2D9",
  shade2: "#D8D4C8",
  accent: "#FFD166",
  accent2: "#588B8B",
  accentInk: "#3A2A05",
};

export const tokens = light;
export const tokensLight = light;
export const tokensDark = dark;

export const fonts = {
  hand: "Caveat_600SemiBold",
  handBold: "Caveat_700Bold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemibold: "Inter_600SemiBold",
  bodyBold: "Inter_700Bold",
  bodyHeavy: "Inter_800ExtraBold",
  mono: "JetBrainsMono_400Regular",
  monoMedium: "JetBrainsMono_500Medium",
};
