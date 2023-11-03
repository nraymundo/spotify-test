import { View, StyleSheet, SafeAreaView, ScrollView, Button } from "react-native";
import TopArtistsCarousel from './components/TopArtistsCarousel';
import TopTracksCarousel from './components/TopTracksCarousel';
import RecentlyPlayedCarousel from './components/RecentlyPlayedCarousel';

export default function HomeScreen({topArtists, topTracks, recentlyPlayed}) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.topArtistsContainer}>
          <TopArtistsCarousel topArtists={topArtists}/>
        </View>
        <View style={styles.topTracksContainer}>
          <TopTracksCarousel topTracks={topTracks}/>
        </View>
        <View style={styles.recentlyPlayedContainer}>
          <RecentlyPlayedCarousel recentlyPlayed={recentlyPlayed}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topArtistsContainer: {
    paddingTop: 20,
  },
});