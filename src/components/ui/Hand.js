import React from "react";
import { Text } from "react-native";
import { fonts } from "../../lib/tokens";
import { useTokens } from "../../lib/theme";

export default function Hand({ children, size = 22, color, style }) {
  const t = useTokens();
  return (
    <Text
      style={[
        {
          fontFamily: fonts.hand,
          fontSize: size,
          color: color ?? t.ink,
          lineHeight: size * 1.05,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
