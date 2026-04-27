import React from "react";
import { View, Image } from "react-native";
import Svg, { Defs, Pattern, Rect, Line } from "react-native-svg";
import { tokens } from "../../lib/tokens";

// Diagonal-stripe placeholder when no image URI is provided.
// Mimics the wireframe's diagonal-stripe gradient.
function StripeFill({ width, height }) {
  return (
    <Svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
      <Defs>
        <Pattern id="stripes" patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(135)">
          <Rect width="12" height="12" fill={tokens.shade} />
          <Line x1="0" y1="0" x2="0" y2="12" stroke={tokens.shade2} strokeWidth="6" />
        </Pattern>
      </Defs>
      <Rect width={width} height={height} fill="url(#stripes)" />
    </Svg>
  );
}

export default function Art({ size = 48, uri, round, style }) {
  const isObj = typeof size === "object";
  const w = isObj ? size.w : size;
  const h = isObj ? size.h : size;
  // For round images sized with a percentage width, force a true circle via
  // aspectRatio so the height matches the resolved width at runtime.
  const usePercentSquare = round && typeof w === "string";
  const radius = round ? 9999 : 6;

  const containerStyle = [
    {
      width: w,
      ...(usePercentSquare ? { aspectRatio: 1 } : { height: h }),
      borderRadius: radius,
      borderWidth: 1,
      borderColor: tokens.line2,
      overflow: "hidden",
      backgroundColor: tokens.shade,
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

  // Numeric width/height for SVG fallback. If width is "100%" we can't measure here;
  // wrap in a relative-sized View and let StripeFill use a reasonable fixed width.
  if (typeof w === "string" || typeof h === "string") {
    return (
      <View
        style={[
          containerStyle,
          {
            backgroundColor: tokens.shade2,
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
