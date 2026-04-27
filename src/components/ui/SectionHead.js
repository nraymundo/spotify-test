import React from "react";
import { View, Text, Pressable } from "react-native";
import { tokens, fonts } from "../../lib/tokens";

export default function SectionHead({ kicker, title, action, onActionPress }) {
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
              color: tokens.ink3,
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
            color: tokens.ink,
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
              color: tokens.accent2,
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
