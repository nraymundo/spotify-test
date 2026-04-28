import React, { useState } from "react";
import { View, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import { fonts } from "../../lib/tokens";
import { useTokens } from "../../lib/theme";

const X_LABEL_H = 16;


export default function LineChart({ points, height = 70, fill = true, xLabels }) {
  const t = useTokens();
  const [chartWidth, setChartWidth] = useState(0);

  const hasX = xLabels && xLabels.length > 0;
  const svgHeight = hasX ? height - X_LABEL_H : height;

  const max = Math.max(...points, 1);
  const stepX = chartWidth > 0 ? chartWidth / (points.length - 1) : 0;

  function getY(value) {
    return svgHeight - (value / max) * (svgHeight - 14) - 7;
  }

  const canDraw = points.length >= 2 && chartWidth > 0;

  const path = canDraw
    ? points.map((p, i) => `${i === 0 ? "M" : "L"}${(i * stepX).toFixed(1)},${getY(p).toFixed(1)}`).join(" ")
    : "";
  const fillPath = canDraw ? `${path} L${chartWidth},${svgHeight} L0,${svgHeight} Z` : "";

  const labelStyle = {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: t.ink3,
  };

  return (
    <View style={{ width: "100%", height: hasX ? height : height }}>
      <View
        style={{ width: "100%", height: svgHeight }}
        onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
      >
        {canDraw && (
          <Svg width={chartWidth} height={svgHeight}>
            {fill && <Path d={fillPath} fill={t.accent} opacity={0.18} />}
            <Path
              d={path}
              stroke={t.accent}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}

      </View>

      {/* X-axis labels */}
      {hasX && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            height: X_LABEL_H,
            alignItems: "flex-end",
          }}
        >
          {xLabels.map((label, i) => (
            <Text key={i} style={labelStyle}>
              {label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
