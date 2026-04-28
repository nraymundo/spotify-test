import React from "react";
import { Text } from "react-native";
import { fonts } from "../../lib/tokens";
import { useTokens } from "../../lib/theme";

const weightMap = {
  400: fonts.body,
  500: fonts.bodyMedium,
  600: fonts.bodySemibold,
  700: fonts.bodyBold,
  800: fonts.bodyHeavy,
};

export default function Body({ children, size = 13, weight = 500, dim, color, style }) {
  const t = useTokens();
  return (
    <Text
      style={[
        {
          fontFamily: weightMap[weight] ?? fonts.body,
          fontSize: size,
          color: color ?? (dim ? t.ink3 : t.ink),
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
