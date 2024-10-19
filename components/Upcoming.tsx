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
import { getToday, getNextYear } from "../utils/getDates";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // Base URL for images

const Upcoming = () => {
  const {
    data: movies,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useTMDB("/discover/movie", {
    include_video: true,
    language: "en-US",
    "primary_release_date.gte": getToday(), // Set's min (today)
    "primary_release_date.lte": getNextYear(), // Set's max (a year)
    with_companies: "372|33|25|174|4|7|2|37|5|18|168|24|101|9996|9994", // Important companies
    sort_by: "popularity.desc",
  });

  const upcomingMovies = movies?.pages.flatMap((page) => page.results);

  // Filter movies to exclude those without neccesary information
  const filteredMovies = upcomingMovies?.filter(
    ({ poster_path, backdrop_path, overview, genre_ids }) =>
      poster_path && backdrop_path && overview && genre_ids
  );

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
      <Text style={styles.title}>Upcoming</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredMovies}
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
    marginBottom: 8,
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
    marginVertical: 8,
  },
});

export default Upcoming;
