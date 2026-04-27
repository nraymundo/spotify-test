import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { Animated, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tokens, fonts } from "./tokens";

const ToastContext = createContext(() => {});

export function useToast() {
  return useContext(ToastContext);
}

function ToastView({ message, opacity }) {
  const insets = useSafeAreaInsets();
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.toast, { top: insets.top + 12, opacity }]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

export function ToastProvider({ children }) {
  const [message, setMessage] = useState("");
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);

  const show = useCallback(
    (msg) => {
      if (timer.current) clearTimeout(timer.current);
      setMessage(msg);
      Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      }, 4000);
    },
    [opacity]
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      <ToastView message={message} opacity={opacity} />
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 9999,
    backgroundColor: tokens.ink,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: tokens.bg,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    flex: 1,
  },
});
