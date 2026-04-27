import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ResponseType, useAuthRequest, makeRedirectUri, exchangeCodeAsync } from "expo-auth-session";
import axios from "axios";
import Marquee from "../../components/Marquee";
import SpotifyLogo from "../../components/SpotifyLogo";
import { registerConnection } from "../../lib/supabase";
import { CLIENT_ID, saveRefreshToken } from "../../lib/spotify";

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const clientId = CLIENT_ID;
const redirectUri = makeRedirectUri({ scheme: "com.nraymundo.spotifystats", path: "callback" });

const TOP_ALBUMS_FEED = "https://rss.applemarketingtools.com/api/v2/us/music/most-played/25/albums.json";

export default function LoginScreen({ setIsLoggedIn, setToken }) {
  const insets = useSafeAreaInsets();
  const [albums, setAlbums] = useState([]);

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      clientId,
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
    axios(TOP_ALBUMS_FEED)
      .then((res) => {
        const items = res.data.feed.results.map((a) => ({
          name: a.name,
          image: a.artworkUrl100.replace("100x100", "300x300"),
        }));
        setAlbums(items);
      })
      .catch((error) => console.log("marquee fetch error", error.message));
  }, []);

  useEffect(() => {
    if (response?.type === "success" && request?.codeVerifier) {
      exchangeCodeAsync(
        {
          clientId,
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
          }).catch((error) => {
            console.log("connect error", error.message);
          });
          await saveRefreshToken(tokenResponse.refreshToken);
          setToken(tokenResponse.accessToken);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          console.log("token exchange error", error.message);
        });
    }
  }, [response]);

  const half = Math.ceil(albums.length / 2);
  const row1 = albums.slice(0, half);
  const row2 = albums.slice(half);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.wordmark}>reverb</Text>
      </View>
      <View style={styles.marqueeStack}>
        <Marquee items={row1} direction="left" speed={35} />
        <View style={styles.rowGap} />
        <Marquee items={row2} direction="right" speed={35} />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => promptAsync()}>
          <SpotifyLogo size={24} color="#fff" />
          <Text style={styles.buttonLabel}>Log in with Spotify</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  wordmark: {
    fontFamily: "ClimateCrisis_400Regular",
    color: "#FFD166",
    fontSize: 36,
    letterSpacing: 1,
  },
  marqueeStack: {
    flex: 1,
    justifyContent: "center",
  },
  rowGap: {
    height: 12,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  button: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1ED760",
    gap: 10,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
