import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, StyleSheet, KeyboardAvoidingView, Text, Pressable, Image, TouchableOpacity, Linking } from "react-native";
import { useEffect, useState } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import axios from "axios";

const discovery = {
  authorizationEndpoint: 
  "https://accounts.spotify.com/authorize",
  tokenEndpoint: 
  "https://accounts.spotify.com/api/token",
};

export default function LoginScreen({
  setIsLoggedIn, setTopArtists4Weeks, setTopArtists6Months, setTopArtistsAllTime, 
  setTopTrack4Weeks, setTopTracks6Months, setTopTracksAllTime, setRecentlyPlayed,
}) {
  const [token, setToken] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "622441cd35fa43e383c923ce4d76f026",
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
      usePKCE: false,
      redirectUri: "exp://192.168.10.228:8081",
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
      setIsLoggedIn(true);
    }
  }, [response]);

  useEffect(() => {
    if (token) {
      axios(
        "https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          setUserInfo({
            display_name: response.data.display_name,
            profile_url: response.data.external_urls.spotify,
            profile_image: response.data.images[1].url,
          })
        })
        .catch((error) => {
          console.log("error", error.message);
        });
      axios(
        "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          setTopTrack4Weeks(response.data.items.map(item => {
            return {
              name: item.name,
              image: item.album.images[1].url,
              url: item.external_urls.spotify,
            }
          }));
        })
        .catch((error) => {
          console.log("error", error.message);
        });
      axios(
        "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          setTopTracks6Months(response.data.items.map(item => {
            return {
              name: item.name,
              image: item.album.images[1].url,
              url: item.external_urls.spotify,
            }
          }));
        })
        .catch((error) => {
          console.log("error", error.message);
        });
      axios(
        "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=20", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          setTopTracksAllTime(response.data.items.map(item => {
            return {
              name: item.name,
              image: item.album.images[1].url,
              url: item.external_urls.spotify,
            }
          }));
        })
        .catch((error) => {
          console.log("error", error.message);
        });
      axios(
        "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=20", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          setTopArtists4Weeks(response.data.items.map(item => {
            return {
              name: item.name,
              image: item.images[2].url,
              url: item.external_urls.spotify,
            }
          }));
        })
        .catch((error) => {
          console.log("error", error.message);
        });
      axios(
        "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=20", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          setTopArtists6Months(response.data.items.map(item => {
            return {
              name: item.name,
              image: item.images[2].url,
              url: item.external_urls.spotify,
            }
          }));
        })
        .catch((error) => {
          console.log("error", error.message);
        });
      axios(
        "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=20", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          setTopArtistsAllTime(response.data.items.map(item => {
            return {
              name: item.name,
              image: item.images[2].url,
              url: item.external_urls.spotify,
            }
          }));
        })
        .catch((error) => {
          console.log("error", error.message);
        });
      axios(
        "https://api.spotify.com/v1/me/player/recently-played?limit=10", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          setRecentlyPlayed(response.data.items.map(item => {
            const artists = [];
            item.track.artists.map(artist => {
              artists.push(artist.name);
            });
            return {
              name: item.track.name,
              image: item.track.album.images[1].url,
              artist: artists,
              url: item.track.external_urls.spotify,
            }
          }));
        })
        .catch((error) => {
          console.log("error", error.message);
        });
    }
  }, [token]);

  const imageSource = userInfo ? userInfo.profile_image : 'https://i.scdn.co/image/ab6761610000e5eb58efbed422ab46484466822b';
  const displayName = userInfo ? userInfo.display_name : '';

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <View styles={styles.userInfoContainer}>
        <TouchableOpacity onPress={userInfo ? () => Linking.openURL(userInfo.profile_url) : null} activeOpacity={0.8} style={styles.imageContainer}>
          <Image source={{ uri: imageSource}} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.detailsContainer}>
          <Text style={styles.displayName}>{displayName}</Text>
        </View>
      </View>
      <View
        style={styles.buttonContainer}
      >
        <Pressable
          style={[styles.button, { backgroundColor: "#1db954" }]}
          onPress={() => { promptAsync() }}
        >
          <Text style={[styles.buttonLabel, { color: "#fff" }]}>Sign in with Spotify</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121212",
    gap: 20,
  },
  buttonContainer: {
    width: 200,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  userInfoContainer: {
    gap: 40,
  },
  imageContainer: {
    height: 160,
    width: 160,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  detailsContainer: {
    paddingTop: 20,
  },
  displayName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});