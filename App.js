import * as React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState } from "react";
import HomeScreen from './src/tabs/Home/HomeScreen';
import LoginScreen from './src/tabs/Login/LoginScreen';

const Tab = createBottomTabNavigator();

function MyTabs() {
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
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
            setTopArtists={setTopArtists}
            setTopTracks={setTopTracks}
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
          <HomeScreen
            topArtists={topArtists}
            topTracks={topTracks}
            recentlyPlayed={recentlyPlayed}
          />
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