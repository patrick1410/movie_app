import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import useTMDB from "../hooks/useFetch"; // Adjust the path as necessary

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // Base URL for images

const TopRatedMovies = () => {
  const { data, error, isLoading } = useTMDB("/movie/top_rated", {
    primary_release_year: 2024,
    language: "en-US",
    page: 1,
  });

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;

  if (error)
    return (
      <Text style={styles.errorText}>
        Error fetching movies: {error.message}
      </Text>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Rated</Text>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={data.results.slice(0, 10)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: `${TMDB_IMAGE_BASE_URL}${item.poster_path}` }}
              style={styles.poster}
              resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  );
};

// Basic styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginHorizontal: 8,
  },
});

export default TopRatedMovies;
