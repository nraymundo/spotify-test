import React from "react";
import { View, Text, Pressable } from "react-native";
import { fonts } from "../../lib/tokens";
import { useTokens } from "../../lib/theme";

export default function SectionHead({ kicker, title, action, onActionPress }) {
  const t = useTokens();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: 12,
      }}
    >
      <View>
        {kicker ? (
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 10,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: t.ink3,
              marginBottom: 2,
            }}
          >
            {kicker}
          </Text>
        ) : null}
        <Text
          style={{
            fontFamily: fonts.handBold,
            fontSize: 28,
            lineHeight: 28,
            color: t.ink,
          }}
        >
          {title}
        </Text>
      </View>
      {action ? (
        <Pressable onPress={onActionPress} style={{ paddingBottom: 2 }}>
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 11,
              color: t.accent2,
              textTransform: "uppercase",
              letterSpacing: 0.2,
            }}
          >
            {action}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
