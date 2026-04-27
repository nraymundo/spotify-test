import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as AppleAuthentication from "expo-apple-authentication";
import { tokens, fonts } from "../../lib/tokens";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  async function handleAppleSignIn() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });
      if (error) Alert.alert("Sign in failed", error.message);
    } catch (e) {
      if (e.code !== "ERR_REQUEST_CANCELED") {
        Alert.alert("Sign in failed", e.message);
      }
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.wordmarkContainer}>
        <Text style={styles.wordmark}>reverb</Text>
      </View>

      <View style={[styles.buttons, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={styles.loginButton}
          onPress={() => navigation.navigate("EmailAuth", { mode: "login" })}
        >
          <Text style={styles.loginLabel}>Log in</Text>
        </Pressable>

        <Pressable
          style={styles.signupButton}
          onPress={() => navigation.navigate("EmailAuth", { mode: "signup" })}
        >
          <Text style={styles.signupLabel}>Sign up</Text>
        </Pressable>

        {Platform.OS === "ios" && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={999}
            style={styles.appleButton}
            onPress={handleAppleSignIn}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.bg,
  },
  wordmarkContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  wordmark: {
    fontFamily: "ClimateCrisis_400Regular",
    fontSize: 72,
    color: tokens.ink,
    letterSpacing: -1,
  },
  buttons: {
    paddingHorizontal: 24,
    gap: 12,
  },
  loginButton: {
    height: 56,
    borderRadius: 999,
    backgroundColor: tokens.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  loginLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    color: tokens.ink,
  },
  signupButton: {
    height: 56,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: tokens.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  signupLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    color: tokens.ink,
  },
  appleButton: {
    height: 56,
    width: "100%",
  },
});
