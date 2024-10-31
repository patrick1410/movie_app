import { useLocalSearchParams } from "expo-router";
import { Text, View, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WebView } from "react-native-webview";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MoviePage = () => {
  const { id } = useLocalSearchParams();

  console.log(id);

  const fetchMovieById = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=ebce74cb934fc3d8fd8572292fb217a9`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching movie by id: ", error);
    }
  };

  const fetchCerti = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=ebce74cb934fc3d8fd8572292fb217a9`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching certifications: ", error);
    }
  };

  const fetchTrailer = async () => {
    try {
      const response = await axios.get(`
https://api.themoviedb.org/3/movie/${id}/videos?api_key=ebce74cb934fc3d8fd8572292fb217a9`);
      return response.data;
    } catch (error) {
      console.error("Error fetching trailer: ", error);
    }
  };

  const {
    data: movie,
    isLoading: movieLoader,
    error: movieError,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: fetchMovieById,
    gcTime: 0,
  });

  const {
    data: certi,
    isLoading: certiLoader,
    error: certiError,
  } = useQuery({
    queryKey: ["certi", id],
    queryFn: fetchCerti,
    gcTime: 0,
  });

  const {
    data: trailer,
    error: trailerError,
    isLoading: trailerLoader,
  } = useQuery({
    queryKey: ["trailer", id],
    queryFn: fetchTrailer,
    gcTime: 0,
  });

  const certifi = certi?.results?.filter(
    (certi: any) => certi.iso_3166_1 === "DE"
  );

  // Or using optional chaining to make it more concise
  const age = certifi?.[0]?.release_dates?.[0]?.certification;
  const descriptors = certifi?.[0]?.release_dates?.[0]?.descriptors;
  console.log(descriptors);

  console.log("ID:", id);

  // trailerKey is undefined the first time rendering thats why can't filter
  const trailerKey = trailer?.results[0]?.key;
  console.log("KEY:", trailerKey);

  console.log(movie);

  if (movieLoader || certiLoader || trailerLoader)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  if (movieError || certiError || trailerError)
    return (
      <View>
        <Text>
          Error: {movieError ? movieError.message : trailerError?.message}
        </Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* Image */}
      <View>
        <Image
          source={{ uri: `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` }}
          style={styles.backdropImage}
        />
      </View>

      {/* Details */}
      <View>
        <Text>Title: {movie.title}</Text>
        <Text>
          {movie.production_companies.length > 1 ? "Companies: " : "Company: "}
          {movie.production_companies.map(({ name }: any) => name).join(", ")}
        </Text>
        <Text>Rating: {Number(movie.vote_average).toFixed(1)}</Text>
        <Text>Runtime: {movie.runtime} minutes</Text>
        <Text>Country: {movie.origin_country[0]}</Text>
        <Text>Language: {movie.original_language.toUpperCase()}</Text>
        <Text>Overview: {movie.overview}</Text>
        <Text>
          Genres: {movie.genres.map(({ name }: any) => name).join(", ")}
        </Text>
        <Text>Release Date: {movie.release_date}</Text>
        <Text>IMDB-ID: {movie.imdb_id}</Text>
        {age && <Text>{age}</Text>}
        {descriptors && <Text>{descriptors}</Text>}
      </View>

      {/* Trailer */}
      {trailerKey ? (
        <WebView
          source={{ uri: `https://www.youtube.com/embed/${trailerKey}` }}
          style={styles.webView}
        />
      ) : (
        <Text>No trailer available</Text>
      )}
    </SafeAreaView>
  );
};

// Basic styling
const styles = StyleSheet.create({
  container: { flex: 1 },
  backdropImage: { width: "100%", height: 200 },
  loadingText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  webView: { height: "100%", width: "100%", backgroundColor: "default" },
});

export default MoviePage;
