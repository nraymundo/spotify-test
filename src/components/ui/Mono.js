import React from "react";
import { Text } from "react-native";
import { fonts } from "../../lib/tokens";
import { useTokens } from "../../lib/theme";

export default function Mono({ children, size = 10, dim, style }) {
  const t = useTokens();
  return (
    <Text
      style={[
        {
          fontFamily: fonts.mono,
          fontSize: size,
          letterSpacing: 0.2,
          textTransform: "uppercase",
          color: dim ? t.ink3 : t.ink2,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
