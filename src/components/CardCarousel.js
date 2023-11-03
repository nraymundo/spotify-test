import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";

function CarouselItem({index, list}) {
  return (
    <View
      style={styles.artistCard}
      key={index}
    >
      <TouchableOpacity onPress={() => Linking.openURL(list[index].url)} activeOpacity={0.8}>
        <Image source={{uri: list[index].image}} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.artistNameContainer}>
        <Text style={styles.artistName} numberOfLines={2} ellipsizeMode={'tail'}>
          {list[index].name}
        </Text>
      </View>
    </View>
  );
}

export default function CardCarousel({list}) {
  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        ItemSeparatorComponent={() => <View style={{width: 20}} />}
        renderItem={({ index }) => <CarouselItem index={index} list={list}/>}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    paddingLeft: 20,
    paddingRight: 20,
    height: '100%',
  },
  image: {
    width: 100,
    height: 100,
  },
  artistCard: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: 100,
  },
  artistNameContainer: {
    paddingTop: 10,
    flexGrow: 1,
    flexDirection: 'row',
  },
  artistName: {
    fontSize: 12,
    lineHeight: 12,
    color: '#fff',
    flex: 1,
    width: 1,
  },
  item: {
    height: 100,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    gap: 10,
  },
  flatList: {
    height: 150,
    flexGrow: 0,
  }
});