import React from "react";
import { View } from "react-native";
import { useTokens } from "../../lib/theme";

export default function Box({ children, style, accent }) {
  const t = useTokens();
  return (
    <View
      style={[
        {
          borderWidth: 1.5,
          borderColor: accent ? t.accent : t.line,
          borderRadius: 10,
          backgroundColor: t.surface,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
