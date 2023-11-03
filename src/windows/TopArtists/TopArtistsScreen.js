import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  Button,
  Pressable,
} from "react-native";
import CardCarousel from '../../components/CardCarousel';
import { useState } from "react";

function TopArtistsComponent({ topArtists, dateFilter }) {
  return (
    <View style={styles.topArtistsContainer}>
      <View style={styles.topArtistsHeaderContainer}>
        {/* <Text style={styles.topTracksHeader}>Your top tracks</Text> */}
        <Text style={styles.topArtistsDateFilterHeader}>{dateFilter}</Text>
      </View>
      <CardCarousel
        list={topArtists}
      />
    </View>
  )
}

export default function TopArtistsScreen({ route }) {
  const { topArtists4Weeks, topArtists6Months, topArtistsAllTime } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <TopArtistsComponent topArtists={topArtists4Weeks} dateFilter='Last 4 weeks' />
      <TopArtistsComponent topArtists={topArtists6Months} dateFilter='Last 6 months' />
      <TopArtistsComponent topArtists={topArtistsAllTime} dateFilter='All time' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topArtistsContainer: {
    gap: 10,
    height: 200,
    paddingTop: 20,
  },
  headerContainer: {
    paddingTop: 20,
  },
  topArtistsHeaderContainer: {
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  topArtistsHeader: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  topArtistsDateFilterHeader: {
    fontSize: 15,
    color: '#b3b3b3',
  },
  dateFilterButtonsContainer: {
    // flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateFilterButton: {},
  button: {
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 14,
  },
});