import * as React from 'react';
import { StyleSheet, Alert, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState } from "react";
import HomeScreen from './src/tabs/Home/HomeScreen';
import LoginScreen from './src/tabs/Login/LoginScreen';
import TopTracksScreen from './src/windows/TopTracks/TopTracksScreen';
import TopArtistsScreen from './src/windows/TopArtists/TopArtistsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();

const MainStack = createNativeStackNavigator();

function MyTabs() {
  const [topArtists4Weeks, setTopArtists4Weeks] = useState([]);
  const [topArtists6Months, setTopArtists6Months] = useState([]);
  const [topArtistsAllTime, setTopArtistsAllTime] = useState([]);
  const [topTracks6Months, setTopTracks6Months] = useState([]);
  const [topTracks4Weeks, setTopTrack4Weeks] = useState([]);
  const [topTracksAllTime, setTopTracksAllTime] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#535353',
        tabBarStyle: {
          backgroundColor: '#121212',
          // borderTopWidth: 0,
          borderTopColor: '#212121',
        },
      }}
    >
      <Tab.Screen
        name="Login"
        children={() => (
          <LoginScreen
            setIsLoggedIn={setIsLoggedIn}
            setTopArtists4Weeks={setTopArtists4Weeks}
            setTopArtists6Months={setTopArtists6Months}
            setTopArtistsAllTime={setTopArtistsAllTime}
            setTopTrack4Weeks={setTopTrack4Weeks}
            setTopTracksAllTime={setTopTracksAllTime}
            setTopTracks6Months={setTopTracks6Months}
            setRecentlyPlayed={setRecentlyPlayed}
          />
        )}
      />
      <Tab.Screen
        name="Home"
        listeners={{
          tabPress: e => {
            if (!isLoggedIn) {
              Alert.alert('Please log in');
              e.preventDefault(); // <-- this function blocks navigating to screen
            }
          },
        }}
        children={() => (
          <MainStack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <MainStack.Screen
              name="Main" 
              children={() => (
                <HomeScreen
                  topArtists4Weeks={topArtists4Weeks}
                  topArtists6Months={topArtists6Months}
                  topArtistsAllTime={topArtistsAllTime}
                  topTracks6Months={topTracks6Months}
                  topTracks4Weeks={topTracks4Weeks}
                  topTracksAllTime={topTracksAllTime}
                  recentlyPlayed={recentlyPlayed}
                />
              )}
            />
            <MainStack.Screen
              name="Top Artists"
              component={TopArtistsScreen}
              options={{
                headerShown: true,
                title: 'Your top artists',
                headerStyle: {
                  backgroundColor: '#121212',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontSize: 22,
                  fontWeight: 'bold',
                },
              }}
            />
            <MainStack.Screen
              name="Top Tracks"
              component={TopTracksScreen}
              options={{
                headerShown: true,
                title: 'Your top tracks',
                headerStyle: {
                  backgroundColor: '#121212',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontSize: 22,
                  fontWeight: 'bold',
                },
              }}
            />
          </MainStack.Navigator>
        )}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flex: 1,
    backgroundColor: 'orange',
  },
});