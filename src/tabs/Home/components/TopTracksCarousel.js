import { View, Text, StyleSheet, Pressable } from "react-native";
import CardCarousel from '../../../components/CardCarousel';
import { useNavigation } from '@react-navigation/native';

export default function TopTracksCarousel({topTracks6Months, topTracks4Months, topTracksAllTime}) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.topTracksHeaderContainer}>
        <Pressable onPress={() => navigation.navigate('Top Tracks', { topTracks6Months: topTracks6Months, topTracks4Months: topTracks4Months, topTracksAllTime: topTracksAllTime })}>
          <Text style={styles.topTracksHeader}>Your top tracks</Text>
        </Pressable>
      </View>
      <CardCarousel
        list={topTracks6Months}
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