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

const Upcoming = () => {
  const { data, error, isLoading } = useTMDB("/movie/upcoming", {
    language: "en-US",
    page: 1,
  });

  // CODE FOR LATER!
  // Get today's date
  //  const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format

  // Filter movies that are not yet released
  //const upcomingMovies = data.results.filter(movie => movie.release_date >= today);

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
        showsHorizontalScrollIndicator={false}
        data={data.results}
        keyExtractor={(item) => item.id.toString()}
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
