import React from "react";
import { Text } from "react-native";
import { tokens, fonts } from "../../lib/tokens";

export default function Hand({ children, size = 22, color, style }) {
  return (
    <Text
      style={[
        {
          fontFamily: fonts.hand,
          fontSize: size,
          color: color ?? tokens.ink,
          lineHeight: size * 1.05,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
