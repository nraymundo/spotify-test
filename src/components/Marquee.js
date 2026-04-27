import React, { useEffect, useRef } from "react";
import { Animated, Easing, View, StyleSheet, Image } from "react-native";

const ITEM_SIZE = 100;
const ITEM_GAP = 12;
const ITEM_FULL = ITEM_SIZE + ITEM_GAP;

export default function Marquee({ items, direction = "left", speed = 40 }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const singleSetWidth = items.length * ITEM_FULL;

  useEffect(() => {
    if (singleSetWidth === 0) return;
    const start = direction === "left" ? 0 : -singleSetWidth;
    const end = direction === "left" ? -singleSetWidth : 0;
    translateX.setValue(start);
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: end,
        duration: (singleSetWidth / speed) * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [singleSetWidth, direction, speed]);

  if (items.length === 0) return <View style={styles.viewport} />;

  return (
    <View style={styles.viewport}>
      <Animated.View style={[styles.row, { transform: [{ translateX }] }]}>
        {[...items, ...items].map((item, i) => (
          <Image
            key={i}
            source={{ uri: item.image }}
            style={styles.item}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    height: ITEM_SIZE,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
  },
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 8,
    marginRight: ITEM_GAP,
    backgroundColor: "#222",
  },
});
