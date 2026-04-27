import React from "react";
import { Pressable, Text } from "react-native";
import { tokens, fonts } from "../../lib/tokens";

export default function Chip({ children, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: active ? tokens.accent2 : tokens.line2,
        backgroundColor: active ? "rgba(88,139,139,0.22)" : "transparent",
      }}
    >
      <Text
        style={{
          fontFamily: fonts.bodySemibold,
          fontSize: 11,
          color: active ? tokens.accent2 : tokens.ink2,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
