import { useLocalSearchParams } from "expo-router";
import { Text, View, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WebView } from "react-native-webview";
import { contentRating } from "../../../constants/contentRating";

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

  // Find the corresponding content rating icon based on the age
  const ageRatingIcon = contentRating.find(
    (rating) => rating.name === age
  )?.icon;

  const contentRatingIcon = (descriptor: string) =>
    contentRating.find((rating) => rating.name === descriptor)?.icon;

  // trailerKey is undefined the first time rendering thats why can't filter
  const trailerKey = trailer?.results[0]?.key;
  console.log("KEY:", trailerKey);

  console.log(movie);

  if (movieLoader || certiLoader || trailerLoader)
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );

  if (movieError || certiError || trailerError)
    return (
      <SafeAreaView>
        <Text>
          Error:
          {movieError && movieError.message}
          {certiError && certiError.message}
          {trailerError && trailerError.message}
        </Text>
      </SafeAreaView>
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

      {/* TITLE / CONTENT RATING */}
      <View style={styles.contentIconBox}>
        <View>
          <Text style={styles.header}>{movie.title}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {age && (
            <View>
              {ageRatingIcon && (
                <Image
                  source={{ uri: `${ageRatingIcon}` }}
                  style={{ width: 24, height: 24 }}
                />
              )}
            </View>
          )}

          {/* Render descriptors and their corresponding icons */}
          {descriptors?.length > 0 && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Array to keep track of unique icons */}
              {descriptors
                .reduce((uniqueIcons, descriptor) => {
                  const icon = contentRatingIcon(descriptor); // Get the icon for each descriptor
                  // Check if the icon is not already in the uniqueIcons array
                  if (
                    icon &&
                    !uniqueIcons.some((uniqueIcon) => uniqueIcon === icon)
                  ) {
                    uniqueIcons.push(icon); // Add the unique icon to the array
                  }
                  return uniqueIcons; // Return the array of unique icons
                }, [])
                .map(
                  (
                    icon,
                    i // Map over unique icons to render them
                  ) => (
                    <Image
                      key={i} // Use index as key, though ideally, a unique identifier is better
                      source={{ uri: icon }} // Render the icon
                      style={{ width: 24, height: 24 }}
                    />
                  )
                )}
            </View>
          )}
        </View>
      </View>

      {/* <Text>
          {movie.production_companies?.length > 1 ? "Companies: " : "Company: "}
          {movie.production_companies?.map(({ name }: any) => name).join(", ")}
        </Text> */}

      {/* OTHER DETAILS */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 8,
        }}
      >
        <View>
          <Text>Rating: {Number(movie.vote_average).toFixed(1)}</Text>
          <Text>Runtime: {movie.runtime} minutes</Text>
          <Text>Country: {movie.origin_country[0]}</Text>
          <Text>Language: {movie.original_language.toUpperCase()}</Text>
        </View>
        <View>
          <Text>
            Genres: {movie.genres.map(({ name }: any) => name).join(", ")}
          </Text>
          <Text>Release Date: {movie.release_date}</Text>
        </View>
        {/* Render the content rating image */}
      </View>

      <View>
        <Text>Overview: {movie.overview}</Text>
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
  header: { fontSize: 24, fontWeight: "bold" },
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
  ratingIcon: {
    width: 24, // Adjust as needed
    height: 24, // Adjust as needed
  },
  contentIconBox: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default MoviePage;
