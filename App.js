import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState } from "react";
import HomeScreen from './components/Home';
import DetailsScreen from './components/Details';
import LoginScreen from './components/LoginScreen';

const Tab = createBottomTabNavigator();

// function MyTabBar({ state, descriptors, navigation }) {
//   return (
//     <View style={{ flexDirection: 'row' }}>
//       {state.routes.map((route, index) => {
//         const { options } = descriptors[route.key];
//         const label =
//           options.tabBarLabel !== undefined
//             ? options.tabBarLabel
//             : options.title !== undefined
//             ? options.title
//             : route.name;

//         const isFocused = state.index === index;

//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name);
//           }
//         };

//         return (
//           <TouchableOpacity
//             accessibilityRole="button"
//             accessibilityState={isFocused ? { selected: true } : {}}
//             accessibilityLabel={options.tabBarAccessibilityLabel}
//             testID={options.tabBarTestID}
//             onPress={onPress}
//             style={styles.tabBar}
//           >
//             <Text style={{ color: isFocused ? 'green' : 'red' }}>
//               {label}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// }

function MyTabs() {
  const [artist, setArtist] = useState([]);
  const [albumImage, setAlbumImage] = useState('');
  const [topArtists, setTopArtists] = useState([]);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // tabBarActiveBackgroundColor: 'red',
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#535353',
        tabBarStyle: {
          backgroundColor: '#212121',
        },
      }}
      // tabBar={(props) => <MyTabBar {...props}/>}
    >
      <Tab.Screen
        name="Login"
        // component={LoginScreen}
        children={() => <LoginScreen setArtist={setArtist} setAlbumImage={setAlbumImage} setTopArtists={setTopArtists}/>}
      />
      <Tab.Screen
        name="Home"
        // component={HomeScreen}
        children={() => <HomeScreen artist={artist} albumImage={albumImage} topArtists={topArtists}/>}
      />
      {/* <Tab.Screen name="Details" component={DetailsScreen} /> */}
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
    // height: 50,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: 'orange',
  },
});