import React from "react";
import { Text } from "react-native";
import { tokens, fonts } from "../../lib/tokens";

export default function Mono({ children, size = 10, dim, style }) {
  return (
    <Text
      style={[
        {
          fontFamily: fonts.mono,
          fontSize: size,
          letterSpacing: 0.2,
          textTransform: "uppercase",
          color: dim ? tokens.ink3 : tokens.ink2,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
