import { API_KEY } from "@env"; // import API_KEY
import { useLocalSearchParams } from "expo-router";
import { Text, View, Image, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WebView } from "react-native-webview";
import { contentRating } from "../../../constants/contentRating";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// types
type RatingProps = { name: string; icon: string };
type ItemProp = { name: string };
type TrailerProp = {
  name: string;
};

const MoviePage = () => {
  // get id
  const { id } = useLocalSearchParams();

  // render genres for flatlist
  const renderGenres = ({ item }: { item: ItemProp }) => (
    <View>
      <Text>{item.name}</Text>
    </View>
  );

  // funcs
  const fetchMovieById = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching movie by id: ", error);
    }
  };

  const fetchCertification = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching certifications: ", error);
    }
  };

  const fetchTrailer = async () => {
    try {
      const response = await axios.get(`
https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching trailer: ", error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get(`
https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}&include_image_language=en&language=en,null`);
      return response.data;
    } catch (error) {
      console.error("Error fetching logo: ", error);
    }
  };

  // queries
  const movie = useQuery({
    queryKey: ["movie", id],
    queryFn: fetchMovieById,
    gcTime: 0,
  });
  const images = useQuery({
    queryKey: ["images", id],
    queryFn: fetchImages,
    gcTime: 0,
  });
  const certifications = useQuery({
    queryKey: ["certification", id],
    queryFn: fetchCertification,
    gcTime: 0,
  });
  const trailer = useQuery({
    queryKey: ["trailer", id],
    queryFn: fetchTrailer,
    gcTime: 0,
  });

  const DE_certification = certifications?.data?.results?.filter(
    (certi: any) => certi.iso_3166_1 === "DE"
  );

  const age = DE_certification?.[0]?.release_dates?.[0]?.certification;

  const descriptors = DE_certification?.[0]?.release_dates?.[0]?.descriptors;

  const logo_path = images?.data?.logos[0]?.file_path;
  console.log(images?.data?.logos);

  // Find the corresponding content rating icon based on the age
  const ageRatingIcon = contentRating.find(
    (rating: RatingProps) => rating.name === age
  )?.icon;

  const rating = movie?.data?.vote_average;
  const runtime = movie?.data?.runtime;

  const contentRatingIcon = (descriptor: string) =>
    contentRating.find((rating) => rating.name === descriptor)?.icon;

  const trailerUrl = trailer?.data?.results?.find(
    (trailer: TrailerProp) =>
      trailer.name.includes("Official Trailer") ||
      trailer.name.includes("Trailer")
  );

  // loading state
  if (
    movie.isLoading ||
    images.isLoading ||
    certifications.isLoading ||
    trailer.isLoading
  )
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );

  // error state
  if (
    movie.isError ||
    images.isError ||
    certifications.isError ||
    trailer.isError
  )
    return (
      <SafeAreaView>
        <Text>
          Error:
          {movie.isError && movie.error.message}
          {images.isError && images.error.message}
          {certifications.isError && certifications.error.message}
          {trailer.isError && trailer.error.message}
        </Text>
      </SafeAreaView>
    );

  // screen
  return (
    <SafeAreaView style={styles.container}>
      {/* Backdrop Image */}
      <View>
        <Image
          source={{
            uri: `${TMDB_IMAGE_BASE_URL}${movie?.data?.backdrop_path}`,
          }}
          style={styles.backdropImage}
        />
      </View>

      {/* LOGO / CONTENT RATING */}
      <View style={styles.contentIconBox}>
        <View>
          <Image
            source={{ uri: `${TMDB_IMAGE_BASE_URL}${logo_path}` }}
            style={{ width: 150, height: 75 }}
            resizeMode="contain"
          />
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
                .reduce((uniqueIcons: string[], descriptor: string) => {
                  const icon = contentRatingIcon(descriptor); // Get the icon for each descriptor
                  // Check if the icon is not already in the uniqueIcons array
                  if (
                    icon &&
                    !uniqueIcons.some(
                      (uniqueIcon: string) => uniqueIcon === icon
                    )
                  ) {
                    uniqueIcons.push(icon); // Add the unique icon to the array
                  }
                  return uniqueIcons; // Return the array of unique icons
                }, [])
                .map((icon: string, i: number) => (
                  <Image
                    key={i} // Use index as key, though ideally, a unique identifier is better
                    source={{ uri: icon }} // Render the icon
                    style={{ width: 24, height: 24 }}
                  />
                ))}
            </View>
          )}
        </View>
      </View>

      {/* OTHER DETAILS */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 8,
        }}
      >
        <View style={{ paddingHorizontal: 8 }}>
          <Text>
            Rating: {rating === 0 ? "T.B.A." : Number(rating).toFixed(1)}
          </Text>
          <Text>
            Runtime: {runtime === 0 ? "T.B.A." : `${runtime} minutes`}
          </Text>
          <Text>Country: {movie?.data?.origin_country[0]}</Text>
          <Text>Language: {movie?.data?.original_language.toUpperCase()}</Text>
        </View>

        <View style={{ flexDirection: "column", marginHorizontal: 8 }}>
          <Text>Genres:</Text>
          <FlatList data={movie?.data?.genres} renderItem={renderGenres} />
          <Text>Release Date: {movie?.data?.release_date}</Text>
        </View>
      </View>

      {/* Overview */}
      <View>
        <Text style={styles.overview}>Overview: {movie?.data?.overview}</Text>
      </View>

      {/* Trailer */}
      {trailerUrl ? (
        <WebView
          source={{ uri: `https://www.youtube.com/embed/${trailerUrl?.key}` }}
          style={styles.webView}
        />
      ) : (
        <Text style={{ textAlign: "center" }}>No trailer available</Text>
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
    paddingHorizontal: 8,
  },
  overview: {
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MoviePage;
