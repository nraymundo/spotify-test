import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, StyleSheet, KeyboardAvoidingView, Text, Pressable } from "react-native";
import { Button } from "react-native-elements";
import { useEffect, useState } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import axios from "axios";
// import { useDispatch } from 'react-redux';

const discovery = {
  authorizationEndpoint: 
  "https://accounts.spotify.com/authorize",
  tokenEndpoint: 
  "https://accounts.spotify.com/api/token",
};

export default function LoginScreen({ setArtist, setAlbumImage, setTopArtists }) {
  // const dispatch = useDispatch();
  const [token, setToken] = useState('');
  let topArtists = [];
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
      // In order to follow the "Authorization Code Flow" 
      // to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: "exp://192.168.10.228:8081",
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    if (token) {
      // axios(
      //   "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=3", {
      //   method: "GET",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //     Authorization: "Bearer " + token,
      //   },
      // })
      //   .then((response) => {
      //     // console.log('response.items', response.data.items[1].album.images[0].url);
      //     // console.log('response name', response.data.items[1].artists[0].name);
      //     setArtist(response.data.items[1].artists[0].name);
      //     setAlbumImage(response.data.items[1].album.images[0].url);
      //     // dispatch(songAction.addTopSongs(response));
      //   })
      //   .catch((error) => {
      //     console.log("error", error.message);
      //   });
      axios(
        "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          // console.log('response', response.data.items);
          // topArtists = response.data.items.map(item => { return item.name });
          setTopArtists(response.data.items.map(item => { return item.images[2].url }));
          setArtist(response.data.items.map(item => { return item.name }));
          // console.log('topArtists', topArtists);
          // for (const property in response.data) {
          //   console.log(`${property}: ${object[property]}`);
          // }
        })
        .catch((error) => {
          console.log("error", error.message);
        });
    }
  }, [token]);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <View
        style={styles.buttonContainer}
      >
        {/* <Button
          title="Login with Spotify"
          style={styles.button}
          onPress={() => {
            promptAsync();
          }}
        /> */}
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
    backgroundColor: "#212121",
  },
  buttonContainer: {
    width: 320,
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
  },
});