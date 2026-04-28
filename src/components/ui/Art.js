import React from "react";
import { View, Image } from "react-native";
import Svg, { Defs, Pattern, Rect, Line } from "react-native-svg";
import { useTokens } from "../../lib/theme";

function StripeFill({ width, height }) {
  const t = useTokens();
  return (
    <Svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
      <Defs>
        <Pattern id="stripes" patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(135)">
          <Rect width="12" height="12" fill={t.shade} />
          <Line x1="0" y1="0" x2="0" y2="12" stroke={t.shade2} strokeWidth="6" />
        </Pattern>
      </Defs>
      <Rect width={width} height={height} fill="url(#stripes)" />
    </Svg>
  );
}

export default function Art({ size = 48, uri, round, style }) {
  const t = useTokens();
  const isObj = typeof size === "object";
  const w = isObj ? size.w : size;
  const h = isObj ? size.h : size;
  const usePercentSquare = round && typeof w === "string";
  const radius = round ? 9999 : 6;

  const containerStyle = [
    {
      width: w,
      ...(usePercentSquare ? { aspectRatio: 1 } : { height: h }),
      borderRadius: radius,
      borderWidth: 1,
      borderColor: t.line2,
      overflow: "hidden",
      backgroundColor: t.shade,
    },
    style,
  ];

  if (uri) {
    return (
      <View style={containerStyle}>
        <Image source={{ uri }} style={{ width: "100%", height: "100%" }} />
      </View>
    );
  }

  if (typeof w === "string" || typeof h === "string") {
    return (
      <View
        style={[
          containerStyle,
          {
            backgroundColor: t.shade2,
          },
        ]}
      />
    );
  }

  return (
    <View style={containerStyle}>
      <StripeFill width={w} height={h} />
    </View>
  );
}
