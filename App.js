import * as React from 'react';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, ClimateCrisis_400Regular } from '@expo-google-fonts/climate-crisis';
import { Caveat_600SemiBold, Caveat_700Bold } from '@expo-google-fonts/caveat';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
} from '@expo-google-fonts/jetbrains-mono';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from './src/lib/toast';
import axios from 'axios';
import { getRefreshToken, clearRefreshToken, refreshAccessToken } from './src/lib/spotify';
import HomeScreen from './src/tabs/Home/HomeScreen';
import LoginScreen from './src/tabs/Login/LoginScreen';
import StatsScreen from './src/tabs/Stats/StatsScreen';
import RecentScreen from './src/tabs/Recent/RecentScreen';
import DayDetailScreen from './src/tabs/Recent/DayDetailScreen';
import TopTracksScreen from './src/windows/TopTracks/TopTracksScreen';
import TopArtistsScreen from './src/windows/TopArtists/TopArtistsScreen';
import FloatingTabBar from './src/components/FloatingTabBar';

const Tab = createBottomTabNavigator();
const MainStack = createNativeStackNavigator();
const RecentStack = createNativeStackNavigator();
const StatsStack = createNativeStackNavigator();

function MyTabs({
  user,
  token,
  topArtists4Weeks,
  topArtists6Months,
  topArtistsAllTime,
  topTracks4Weeks,
  topTracks6Months,
  topTracksAllTime,
  recentlyPlayed,
  onLogout,
}) {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Home"
        children={() => (
          <MainStack.Navigator screenOptions={{ headerShown: false }}>
            <MainStack.Screen
              name="Main"
              children={() => (
                <HomeScreen
                  user={user}
                  topArtists4Weeks={topArtists4Weeks}
                  topArtists6Months={topArtists6Months}
                  topArtistsAllTime={topArtistsAllTime}
                  topTracks6Months={topTracks6Months}
                  topTracks4Weeks={topTracks4Weeks}
                  topTracksAllTime={topTracksAllTime}
                  recentlyPlayed={recentlyPlayed}
                  onLogout={onLogout}
                />
              )}
            />
            <MainStack.Screen
              name="Top Artists"
              component={TopArtistsScreen}
              options={{ headerShown: false }}
            />
            <MainStack.Screen
              name="Top Tracks"
              component={TopTracksScreen}
              options={{
                headerShown: true,
                title: 'Your top tracks',
                headerStyle: { backgroundColor: '#121212' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontSize: 22, fontWeight: 'bold' },
              }}
            />
          </MainStack.Navigator>
        )}
      />
      <Tab.Screen
        name="Stats"
        children={() => (
          <StatsStack.Navigator screenOptions={{ headerShown: false }}>
            <StatsStack.Screen
              name="StatsMain"
              children={() => <StatsScreen user={user} token={token} />}
            />
            <StatsStack.Screen
              name="TopArtists"
              component={TopArtistsScreen}
            />
          </StatsStack.Navigator>
        )}
      />
      <Tab.Screen
        name="Recent"
        children={() => (
          <RecentStack.Navigator screenOptions={{ headerShown: false }}>
            <RecentStack.Screen
              name="RecentMain"
              children={() => <RecentScreen user={user} />}
            />
            <RecentStack.Screen
              name="DayDetail"
              component={DayDetailScreen}
            />
          </RecentStack.Navigator>
        )}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    ClimateCrisis_400Regular,
    Caveat_600SemiBold,
    Caveat_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
  });
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    getRefreshToken()
      .then((stored) => {
        if (!stored) return;
        return refreshAccessToken(stored)
          .then((accessToken) => {
            setToken(accessToken);
            setIsLoggedIn(true);
          })
          .catch(() => clearRefreshToken());
      })
      .catch(console.log)
      .finally(() => setAuthReady(true));
  }, []);
  const [user, setUser] = useState(null);
  const [topArtists4Weeks, setTopArtists4Weeks] = useState([]);
  const [topArtists6Months, setTopArtists6Months] = useState([]);
  const [topArtistsAllTime, setTopArtistsAllTime] = useState([]);
  const [topTracks6Months, setTopTracks6Months] = useState([]);
  const [topTracks4Weeks, setTopTrack4Weeks] = useState([]);
  const [topTracksAllTime, setTopTracksAllTime] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    if (!token) return;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    };
    const mapTrack = (item) => ({
      name: item.name,
      image: item.album.images[1]?.url,
      url: item.external_urls.spotify,
      album: { name: item.album.name, image: item.album.images[1]?.url },
      artist: item.artists?.[0]?.name,
    });
    const mapArtist = (item) => ({
      name: item.name,
      image: item.images[2]?.url,
      url: item.external_urls.spotify,
    });
    const fetchTracks = (range, setter) =>
      axios(`https://api.spotify.com/v1/me/top/tracks?time_range=${range}&limit=20`, { method: 'GET', headers })
        .then((response) => setter(response.data.items.map(mapTrack)))
        .catch((error) => console.log('error', error.message));
    const fetchArtists = (range, setter) =>
      axios(`https://api.spotify.com/v1/me/top/artists?time_range=${range}&limit=20`, { method: 'GET', headers })
        .then((response) => setter(response.data.items.map(mapArtist)))
        .catch((error) => console.log('error', error.message));

    axios('https://api.spotify.com/v1/me', { method: 'GET', headers })
      .then((response) =>
        setUser({
          id: response.data.id,
          displayName: response.data.display_name,
          image: response.data.images?.[0]?.url,
        })
      )
      .catch((error) => console.log('me error', error.message));

    fetchTracks('short_term', setTopTrack4Weeks);
    fetchTracks('medium_term', setTopTracks6Months);
    fetchTracks('long_term', setTopTracksAllTime);
    fetchArtists('short_term', setTopArtists4Weeks);
    fetchArtists('medium_term', setTopArtists6Months);
    fetchArtists('long_term', setTopArtistsAllTime);

    axios('https://api.spotify.com/v1/me/player/recently-played?limit=10', { method: 'GET', headers })
      .then((response) => {
        setRecentlyPlayed(
          response.data.items.map((item) => ({
            name: item.track.name,
            image: item.track.album.images[1]?.url,
            artist: item.track.artists.map((artist) => artist.name),
            url: item.track.external_urls.spotify,
          }))
        );
      })
      .catch((error) => console.log('error', error.message));
  }, [token]);

  function handleLogout() {
    clearRefreshToken();
    setToken('');
    setUser(null);
    setIsLoggedIn(false);
  }

  if (!fontsLoaded || !authReady) return null;

  return (
    <SafeAreaProvider>
      <ToastProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          <MyTabs
            user={user}
            token={token}
            topArtists4Weeks={topArtists4Weeks}
            topArtists6Months={topArtists6Months}
            topArtistsAllTime={topArtistsAllTime}
            topTracks4Weeks={topTracks4Weeks}
            topTracks6Months={topTracks6Months}
            topTracksAllTime={topTracksAllTime}
            recentlyPlayed={recentlyPlayed}
            onLogout={handleLogout}
          />
        ) : (
          <LoginScreen setIsLoggedIn={setIsLoggedIn} setToken={setToken} />
        )}
      </NavigationContainer>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
