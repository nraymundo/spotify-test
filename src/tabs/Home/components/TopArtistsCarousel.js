import { View, Text, StyleSheet, Pressable, Button } from "react-native";
import CardCarousel from '../../../components/CardCarousel';

export default function TopArtistsCarousel({topArtists}) {
  return (
    <View style={styles.container}>
      <View style={styles.topArtistsHeaderContainer}>
        <Text style={styles.topArtistsHeader}>
          Your top artists
        </Text>
      </View>
      <CardCarousel
        list={topArtists}
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
  topArtistsHeaderContainer: {
    paddingLeft: 20,
  },
  topArtistsHeader: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'left',
    fontWeight: 'bold',
  },
});