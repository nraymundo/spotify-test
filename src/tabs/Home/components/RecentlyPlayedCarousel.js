import { View, Text, StyleSheet } from "react-native";
import CardCarousel from '../../../components/CardCarousel';

export default function RecentlyPlayedCarousel({recentlyPlayed}) {
  return (
    <View style={styles.container}>
      <View style={styles.recentlyPlayedHeaderContainer}>
        <Text style={styles.recentlyPlayedHeader}>
          Recently played
        </Text>
      </View>
      <CardCarousel
        list={recentlyPlayed}
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
  recentlyPlayedHeaderContainer: {
    paddingLeft: 20,
  },
  recentlyPlayedHeader: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'left',
    fontWeight: 'bold',
  }
});