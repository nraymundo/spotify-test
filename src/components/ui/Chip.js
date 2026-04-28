import React from "react";
import { Pressable, Text } from "react-native";
import { fonts } from "../../lib/tokens";
import { useTokens } from "../../lib/theme";

export default function Chip({ children, active, onPress }) {
  const t = useTokens();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: active ? t.accent2 : t.line2,
        backgroundColor: active ? "rgba(88,139,139,0.22)" : "transparent",
      }}
    >
      <Text
        style={{
          fontFamily: fonts.bodySemibold,
          fontSize: 11,
          color: active ? t.accent2 : t.ink2,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
