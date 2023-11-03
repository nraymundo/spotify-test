import { View, Text, StyleSheet, Pressable, Button } from "react-native";
import CardCarousel from '../../../components/CardCarousel';
import { useNavigation } from '@react-navigation/native';

export default function TopArtistsCarousel({ topArtists4Weeks, topArtists6Months, topArtistsAllTime }) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.topArtistsHeaderContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate(
              'Top Artists',
              {
                topArtists4Weeks: topArtists4Weeks,
                topArtists6Months: topArtists6Months,
                topArtistsAllTime: topArtistsAllTime,
              }
            )
          }}
        >
          <Text style={styles.topArtistsHeader}>Your top artists</Text>
        </Pressable>
      </View>
      <CardCarousel
        list={topArtists6Months}
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