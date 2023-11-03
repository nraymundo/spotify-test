import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import TopArtistsCarousel from './components/TopArtistsCarousel';
import TopTracksCarousel from './components/TopTracksCarousel';
import RecentlyPlayedCarousel from './components/RecentlyPlayedCarousel';

export default function HomeScreen({topArtists, topTracks6Months, recentlyPlayed, topTracks4Months, topTracksAllTime}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topArtistsContainer}>
        <TopArtistsCarousel topArtists={topArtists}/>
      </View>
      <View style={styles.topTracksContainer}>
        <TopTracksCarousel topTracks6Months={topTracks6Months} topTracks4Months={topTracks4Months} topTracksAllTime={topTracksAllTime}/>
      </View>
      <View style={styles.recentlyPlayedContainer}>
        <RecentlyPlayedCarousel recentlyPlayed={recentlyPlayed}/>
      </View>
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