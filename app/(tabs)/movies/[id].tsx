import { useLocalSearchParams } from "expo-router";
import { Text, View, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getGenreNames } from "../../../utils/getGenreNames";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WebView } from "react-native-webview";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MoviePage = () => {
  const {
    id,
    genre_ids,
    title,
    overview,
    vote_average,
    release_date,
    backdrop_path,
  } = useLocalSearchParams();

  const rating = Number(vote_average);

  const genresArray =
    typeof genre_ids === "string" &&
    [...genre_ids.split(",")].map((str) => Number(str));
  const genreNames = getGenreNames(genresArray);

  const fetchTrailer = async () => {
    const response = await axios.get(`
https://api.themoviedb.org/3/movie/${id}/videos?api_key=ebce74cb934fc3d8fd8572292fb217a9`);
    return response.data;
  };

  const movieId = id;

  const {
    data: trailer,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["trailer", movieId],
    queryFn: fetchTrailer,
    gcTime: 0,
  });
  console.log("ID:", movieId);
  // const officialTrailer = trailer?.results?.filter(
  //   (result) => result?.name === "Trailer"
  // );

  // console.log("ID:", id);

  // trailerKey is undefined the first time rendering thats why can't filter
  const trailerKey = trailer?.results[0].key;
  console.log("KEY:", trailerKey);

  return (
    <SafeAreaView style={styles.container}>
      {/* Backdrop IMG */}
      <View>
        <Image
          source={{ uri: `${TMDB_IMAGE_BASE_URL}${backdrop_path}` }}
          resizeMode="cover"
          style={styles.backdropImage} // Adjust size as needed
        />
      </View>

      {/* Details */}
      <View>
        <Text>Movie Page - {id}</Text>
        <Text>title - {title}</Text>
        <Text>overview - {overview}</Text>
        {rating !== 0 && <Text>rating - {rating.toFixed(1)}</Text>}
        <Text>release_date - {release_date}</Text>
        <Text>
          {genreNames.length > 1 ? "Genres:" : "Genre:"} {genreNames.join(", ")}
        </Text>
      </View>

      {/*States & Trailer */}
      {isLoading && (
        <View>
          <Text style={styles.loadingText}>Loading Trailer...</Text>
        </View>
      )}

      {error && (
        <View>
          <Text style={styles.errorText}>
            Error fetching Trailer: {error.message}
          </Text>
        </View>
      )}

      {trailerKey && (
        <WebView
          source={{ uri: `https://www.youtube.com/embed/${trailerKey}` }}
          style={styles.webView}
        />
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
