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
import useTMDB from "../hooks/useFetch"; // Adjust the path as necessary

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // Base URL for images

//https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&primary_release_year=2024&sort_by=popularity.desc'
const TopRatedMovies = () => {
  const {
    data: movies,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useTMDB("/discover/movie", {
    include_video: true,
    primary_release_year: 2024,
    sort_by: "vote_count.desc",
    language: "en-US",
  });

  const onReachEnd = () => {
    if (hasNextPage) fetchNextPage();
  };

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;

  if (error)
    return (
      <Text style={styles.errorText}>
        Error fetching movies: {error.message}
      </Text>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Rated 2024</Text>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={movies?.pages.flatMap((page) => page.results)}
        onEndReached={onReachEnd}
        onEndReachedThreshold={0.5}
        keyExtractor={(item, i) => `${item.id.toString()}${i}`}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/movies/[id]",
                params: {
                  id: item.id,
                  title: item.title,
                  overview: item.overview,
                  vote_average: item.vote_average,
                  release_date: item.release_date,
                  backdrop_path: item.backdrop_path,
                  genre_ids: item.genre_ids,
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
        )}
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

export default TopRatedMovies;
