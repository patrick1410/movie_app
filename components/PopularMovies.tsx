import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import useTMDB from "../hooks/useFetch";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // Base URL for images

const PopularMovies = () => {
  const {
    data: movies,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useTMDB("/movie/popular");

  const onReachEnd = () => {
    if (hasNextPage) fetchNextPage();
  };

  const renderItem = ({ item }: any) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/movies/[id]",
          params: {
            id: item.id,
          },
        })
      }
    >
      <View>
        <Image
          source={{ uri: `${TMDB_IMAGE_BASE_URL}${item.poster_path}` }}
          style={styles.poster}
          resizeMode="cover"
        />
      </View>
    </Pressable>
  );

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;

  if (error)
    return (
      <Text style={styles.errorText}>
        Error fetching movies: {error.message}
      </Text>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular Movies</Text>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={movies?.pages.flatMap((page) => page.results)}
        onEndReached={onReachEnd}
        onEndReachedThreshold={0.5}
        keyExtractor={(item, i) => `${item.id.toString()}${i}`}
        renderItem={renderItem}
      />
    </View>
  );
};

// Basic styling
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginLeft: 8,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  poster: {
    width: 150, // Set width for the poster
    height: 225, // Set height for the poster
    borderRadius: 8, // Optional: Round the corners
    marginHorizontal: 8,
  },
});

export default PopularMovies;
