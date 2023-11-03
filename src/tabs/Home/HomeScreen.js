import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import TopArtistsCarousel from './components/TopArtistsCarousel';
import TopTracksCarousel from './components/TopTracksCarousel';
import RecentlyPlayedCarousel from './components/RecentlyPlayedCarousel';

export default function HomeScreen({
  topArtists4Weeks, topArtists6Months, topArtistsAllTime, topTracks6Months,
  recentlyPlayed, topTracks4Weeks, topTracksAllTime,
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topArtistsContainer}>
        <TopArtistsCarousel
          topArtists4Weeks={topArtists4Weeks} topArtists6Months={topArtists6Months} topArtistsAllTime={topArtistsAllTime}
        />
      </View>
      <View style={styles.topTracksContainer}>
        <TopTracksCarousel
          topTracks4Weeks={topTracks4Weeks} topTracks6Months={topTracks6Months} topTracksAllTime={topTracksAllTime}
        />
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