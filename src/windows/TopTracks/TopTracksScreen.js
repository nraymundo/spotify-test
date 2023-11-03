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

function TopTracksComponent({ topTracks, dateFilter }) {
  return (
    <View style={styles.topTracksContainer}>
      <View style={styles.topTracksHeaderContainer}>
        {/* <Text style={styles.topTracksHeader}>Your top tracks</Text> */}
        <Text style={styles.topTracksDateFilterHeader}>{dateFilter}</Text>
      </View>
      <CardCarousel
        list={topTracks}
      />
    </View>
  )
}

export default function TopTracksScreen({ route }) {
  const { topTracks6Months, topTracks4Months, topTracksAllTime } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <TopTracksComponent topTracks={topTracks4Months} dateFilter='Last 4 weeks' />
      <TopTracksComponent topTracks={topTracks6Months} dateFilter='Last 6 months' />
      <TopTracksComponent topTracks={topTracksAllTime} dateFilter='All time' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topTracksContainer: {
    gap: 10,
    height: 200,
    paddingTop: 20,
  },
  headerContainer: {
    paddingTop: 20,
  },
  topTracksHeaderContainer: {
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  topTracksHeader: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  topTracksDateFilterHeader: {
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