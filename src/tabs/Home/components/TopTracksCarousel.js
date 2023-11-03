import { View, Text, StyleSheet } from "react-native";
import CardCarousel from '../../../components/CardCarousel';

export default function TopTracksCarousel({topTracks}) {
  return (
    <View style={styles.container}>
      <View style={styles.topTracksHeaderContainer}>
        <Text style={styles.topTracksHeader}>
          Your top tracks
        </Text>
      </View>
      <CardCarousel
        list={topTracks}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    gap: 10,
    height: 200,
  },
  topTracksHeaderContainer: {
    paddingLeft: 20,
  },
  topTracksHeader: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'left',
    fontWeight: 'bold',
  }
});