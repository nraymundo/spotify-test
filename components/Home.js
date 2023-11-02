import { View, Text, StyleSheet, Alert, Image, Dimensions } from "react-native";
import Button from './Button';
import Carousel from 'react-native-reanimated-carousel';

function CarouselItem({index, topArtists, artist}) {
  // const placeholderImageSource = { uri: 'https://sportshub.cbsistatic.com/i/r/2023/10/30/252b479e-b4f3-4549-96d8-c5f06ee5a4bc/thumbnail/1200x675/8991da6a51045f8a6271e0f6c471ac02/102923-stephcurry.jpg' }
  // const imageSource = url ? { uri: url } : placeholderImageSource;
  console.log('carousel items', index);
  console.log(topArtists);
  // const topArtistsImages = topArtists.map((url) => <Image source={{ uri: url }} style={styles.image} />);
  return (
    <View
      style={styles.artistCard}
    >
      <View style={styles.artistNameContainer}>
        <Text style={{ textAlign: 'center', fontSize: 30 }}>
          {artist[index]}
        </Text>
      </View>
      <Image source={{uri: topArtists[index]}} style={styles.image} />
      {/* {topArtistsImages} */}
    </View>
);
}

export default function HomeScreen({artist, albumImage, topArtists}) {
  const artistName = 'artist here';
  // console.log('artist', artist);
  // console.log('albumImage', albumImage);
  // console.log('topArtists', topArtists);
  const placeholderImageSource = { uri: 'https://sportshub.cbsistatic.com/i/r/2023/10/30/252b479e-b4f3-4549-96d8-c5f06ee5a4bc/thumbnail/1200x675/8991da6a51045f8a6271e0f6c471ac02/102923-stephcurry.jpg' }
  const imageSource = albumImage ? { uri: albumImage } : placeholderImageSource;
  // const topArtistsList = topArtists.map((artist) => <Text style={styles.text}>{artist}</Text>);
  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>{artist}</Text> */}
      {/* {topArtistsList} */}
      {/* <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />
      </View> */}
      <Carousel
        loop
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        width={320}
        height={400}
        autoPlay={false}
        data={topArtists}
        scrollAnimationDuration={1000}
        renderItem={({ index }) => <CarouselItem index={index} topArtists={topArtists} artist={artist} />}
      />
      {/* <Button label='Button' onPress={() => Alert.alert('clicked')} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121',
    gap: 10,
  },
  text: {
    fontSize: 40,
  },
  imageContainer: {
    // flex: 1,
    // paddingTop: 58,
  },
  image: {
    width: 320,
    height: 320,
    // borderRadius: 18,
    // width: null,
    // height: null,
    // resizeMode: 'contain'
  },
  artistCard: {
    flex: 1,
    borderWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    border: 'none',
    backgroundColor: 'white',
  },
  artistNameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});