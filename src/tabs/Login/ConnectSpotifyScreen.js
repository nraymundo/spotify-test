import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ResponseType, useAuthRequest, makeRedirectUri, exchangeCodeAsync } from "expo-auth-session";
import { tokens, fonts } from "../../lib/tokens";
import { registerConnection } from "../../lib/supabase";
import { CLIENT_ID, saveRefreshToken } from "../../lib/spotify";
import SpotifyLogo from "../../components/SpotifyLogo";
import Box from "../../components/ui/Box";
import Body from "../../components/ui/Body";
import Mono from "../../components/ui/Mono";
import LineChart from "../../components/ui/LineChart";

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const redirectUri = makeRedirectUri({ scheme: "com.nraymundo.spotifystats", path: "callback" });
const STATIC_POINTS = [12, 18, 24, 31, 45, 52, 60, 72, 85, 90];

export default function ConnectSpotifyScreen({ setToken, setIsSpotifyConnected }) {
  const insets = useSafeAreaInsets();

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      clientId: CLIENT_ID,
      scopes: [
        "user-read-currently-playing",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-top-read",
        "user-modify-playback-state",
        "streaming",
        "user-read-email",
        "user-read-private",
      ],
      usePKCE: true,
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success" && request?.codeVerifier) {
      exchangeCodeAsync(
        {
          clientId: CLIENT_ID,
          code: response.params.code,
          redirectUri,
          extraParams: { code_verifier: request.codeVerifier },
        },
        discovery
      )
        .then(async (tokenResponse) => {
          registerConnection({
            accessToken: tokenResponse.accessToken,
            refreshToken: tokenResponse.refreshToken,
          }).catch((e) => console.log("connect error", e.message));
          await saveRefreshToken(tokenResponse.refreshToken);
          setToken(tokenResponse.accessToken);
          setIsSpotifyConnected(true);
        })
        .catch((e) => console.log("token exchange error", e.message));
    }
  }, [response]);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 14 }]}>
      <View style={styles.content}>
        <Box style={styles.card}>
          <Mono size={9} style={{ marginBottom: 8 }}>EXAMPLE</Mono>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 4, marginBottom: 10 }}>
            <Body size={38} weight={800} style={{ letterSpacing: -1 }}>487</Body>
            <Mono size={14} style={{ paddingBottom: 6 }}>min</Mono>
          </View>
          <LineChart points={STATIC_POINTS} height={80} fill />
        </Box>

        <Body size={28} weight={800} style={styles.headline}>
          See where your minutes go.
        </Body>
        <Body size={14} weight={400} style={styles.body}>
          Track listening time across week, month and 6 months. Spot patterns, peaks and quiet days.
        </Body>
      </View>

      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 8 }]}>
        <Pressable style={styles.spotifyButton} onPress={() => promptAsync()}>
          <SpotifyLogo size={22} color="#000" />
          <Text style={styles.spotifyLabel}>Connect Spotify</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  card: {
    padding: 16,
    marginBottom: 24,
  },
  headline: {
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  body: {
    color: tokens.ink2,
    lineHeight: 21,
  },
  buttonContainer: {
    paddingHorizontal: 24,
  },
  spotifyButton: {
    height: 56,
    borderRadius: 999,
    backgroundColor: "#1ED760",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  spotifyLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    color: "#000",
  },
});
