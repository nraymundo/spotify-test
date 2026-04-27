import React from "react";
import { View } from "react-native";
import { tokens } from "../../lib/tokens";

export default function Box({ children, style, accent }) {
  return (
    <View
      style={[
        {
          borderWidth: 1.5,
          borderColor: accent ? tokens.accent : tokens.line,
          borderRadius: 10,
          backgroundColor: tokens.surface,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
