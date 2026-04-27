import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { tokens, fonts } from "../../lib/tokens";
import { signIn, signUp, supabase } from "../../lib/supabase";
import Body from "../../components/ui/Body";
import Mono from "../../components/ui/Mono";

const RESEND_DELAY = 15;

const PASSWORD_RULES = [
  { label: "6+ characters", test: (p) => p.length >= 6 },
  { label: "1 letter", test: (p) => /[a-zA-Z]/.test(p) },
  { label: "1 number", test: (p) => /[0-9]/.test(p) },
  { label: "1 special character", test: (p) => /[^a-zA-Z0-9]/.test(p) },
];

export default function EmailAuthScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { params } = useRoute();
  const mode = params?.mode ?? "login";
  const isLogin = mode === "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(RESEND_DELAY);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const countdownRef = useRef(null);

  useEffect(() => {
    if (!awaitingConfirmation) return;
    setResendCountdown(RESEND_DELAY);
    countdownRef.current = setInterval(() => {
      setResendCountdown((n) => {
        if (n <= 1) { clearInterval(countdownRef.current); return 0; }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [awaitingConfirmation]);

  async function handleSubmit() {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    if (!isLogin && PASSWORD_RULES.some((r) => !r.test(password))) { setError("Password doesn't meet all requirements."); return; }
    if (!isLogin && password !== confirmPassword) { setError("Passwords don't match."); return; }
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        const { error: authError } = await signIn(email.trim(), password);
        if (authError) setError(authError.message);
      } else {
        const { data, error: authError } = await signUp(email.trim(), password);
        if (authError) {
          setError(authError.message);
        } else {
          if (data.user?.identities?.length === 0) {
            await supabase.auth.resend({ type: "signup", email: email.trim() });
          }
          setAwaitingConfirmation(true);
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendLoading(true);
    setResendSuccess(false);
    const { error: resendError } = await supabase.auth.resend({ type: "signup", email: email.trim() });
    setResendLoading(false);
    if (!resendError) {
      setResendSuccess(true);
      setResendCountdown(RESEND_DELAY);
      countdownRef.current = setInterval(() => {
        setResendCountdown((n) => {
          if (n <= 1) { clearInterval(countdownRef.current); setResendSuccess(false); return 0; }
          return n - 1;
        });
      }, 1000);
    }
  }

  async function handleForgotSubmit() {
    if (!email) { setError("Please enter your email."); return; }
    setError(null);
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
    } else {
      setForgotSent(true);
    }
  }

  // — Awaiting email confirmation —
  if (awaitingConfirmation) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <View style={styles.content}>
          <Body size={28} weight={800} style={{ letterSpacing: -0.6, marginBottom: 12 }}>
            Check your email
          </Body>
          <Body size={15} weight={400} style={{ color: tokens.ink2, lineHeight: 22, marginBottom: 32 }}>
            We sent a confirmation link to{" "}
            <Body size={15} weight={700}>{email.trim()}</Body>
            . Tap it to activate your account.
          </Body>

          {resendSuccess && (
            <Mono size={10} style={{ textTransform: "none", color: tokens.ink2, marginBottom: 12 }}>
              Email resent.
            </Mono>
          )}

          <Pressable
            style={[styles.outlineButton, (resendCountdown > 0 || resendLoading) && { opacity: 0.4 }]}
            onPress={handleResend}
            disabled={resendCountdown > 0 || resendLoading}
          >
            <Text style={styles.outlineLabel}>
              {resendLoading ? "Sending..." : resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend confirmation"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // — Forgot password —
  if (forgotMode) {
    return (
      <KeyboardAvoidingView
        style={[styles.root, { paddingTop: insets.top }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.back} onPress={() => { setForgotMode(false); setForgotSent(false); setError(null); }}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <View style={styles.content}>
          {forgotSent ? (
            <>
              <Body size={28} weight={800} style={{ letterSpacing: -0.6, marginBottom: 12 }}>
                Check your email
              </Body>
              <Body size={15} weight={400} style={{ color: tokens.ink2, lineHeight: 22 }}>
                If an account exists for{" "}
                <Body size={15} weight={700}>{email.trim()}</Body>
                , you'll receive a password reset link shortly.
              </Body>
            </>
          ) : (
            <>
              <Body size={28} weight={800} style={{ letterSpacing: -0.6, marginBottom: 8 }}>
                Reset password
              </Body>
              <Body size={15} weight={400} style={{ color: tokens.ink2, lineHeight: 22, marginBottom: 24 }}>
                Enter your email and we'll send you a reset link.
              </Body>

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={tokens.ink3}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                textContentType="none"
              />

              {error && (
                <Mono dim size={10} style={{ textTransform: "none", marginBottom: 8, color: "red" }}>
                  {error}
                </Mono>
              )}

              <Pressable style={[styles.submit, loading && { opacity: 0.6 }]} onPress={handleForgotSubmit} disabled={loading}>
                <Text style={styles.submitLabel}>{loading ? "..." : "Send reset link"}</Text>
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }

  // — Login / Sign up —
  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Pressable style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>←</Text>
      </Pressable>

      <View style={styles.content}>
        <Body size={28} weight={800} style={{ letterSpacing: -0.6, marginBottom: 28 }}>
          {isLogin ? "Log in" : "Sign up"}
        </Body>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={tokens.ink3}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          textContentType="none"
        />

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.inputFlex]}
            placeholder="Password"
            placeholderTextColor={tokens.ink3}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            textContentType="none"
          />
          <Pressable style={styles.eyeButton} onPress={() => setShowPassword((v) => !v)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={tokens.ink3} />
          </Pressable>
        </View>

        {!isLogin && password.length > 0 && (
          <View style={styles.rules}>
            {PASSWORD_RULES.map((rule) => {
              const met = rule.test(password);
              return (
                <View key={rule.label} style={styles.ruleItem}>
                  <Ionicons
                    name={met ? "checkmark-circle" : "ellipse-outline"}
                    size={13}
                    color={met ? tokens.accent : tokens.ink3}
                  />
                  <Mono size={9} style={{ textTransform: "none", color: met ? tokens.ink : tokens.ink3, marginLeft: 4 }}>
                    {rule.label}
                  </Mono>
                </View>
              );
            })}
          </View>
        )}

        {!isLogin && (
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputFlex]}
              placeholder="Confirm password"
              placeholderTextColor={tokens.ink3}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              textContentType="none"
            />
            <Pressable style={styles.eyeButton} onPress={() => setShowConfirmPassword((v) => !v)}>
              <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color={tokens.ink3} />
            </Pressable>
          </View>
        )}

        {error && (
          <Mono dim size={10} style={{ textTransform: "none", marginBottom: 8, color: "red" }}>
            {error}
          </Mono>
        )}

        <Pressable style={[styles.submit, loading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitLabel}>{loading ? "..." : isLogin ? "Log in" : "Sign up"}</Text>
        </Pressable>

        {isLogin && (
          <Pressable style={styles.forgotButton} onPress={() => { setError(null); setForgotMode(true); }}>
            <Text style={styles.forgotLabel}>Forgot password?</Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.bg,
  },
  back: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backArrow: {
    fontFamily: fonts.body,
    fontSize: 24,
    color: tokens.ink,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: tokens.line2,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontFamily: fonts.body,
    fontSize: 15,
    color: tokens.ink,
    backgroundColor: tokens.surface,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  inputFlex: {
    flex: 1,
    marginBottom: 0,
    paddingRight: 44,
  },
  eyeButton: {
    marginLeft: -44,
    padding: 12,
  },
  rules: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  submit: {
    height: 56,
    borderRadius: 999,
    backgroundColor: tokens.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  submitLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    color: tokens.ink,
  },
  forgotButton: {
    alignItems: "center",
    marginTop: 20,
  },
  forgotLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: tokens.ink2,
  },
  outlineButton: {
    height: 52,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: tokens.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: tokens.ink,
  },
});
