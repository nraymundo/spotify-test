import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

export function HomeIcon({ color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M3 9l7-6 7 6v7a1 1 0 0 1-1 1h-3v-5H7v5H4a1 1 0 0 1-1-1V9z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function StatsIcon({ color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M3 17V9M9 17V4M15 17v-6"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function RecentIcon({ color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx={10} cy={10} r={7} stroke={color} strokeWidth={1.6} />
      <Path
        d="M10 6v4l3 2"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}
