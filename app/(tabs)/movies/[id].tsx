import { useLocalSearchParams } from "expo-router";
import { Text, View, Image } from "react-native";
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
    poster_path,
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

  const {
    data: trailer,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["trailer"],
    queryFn: () => fetchTrailer(),
  });

  const officialTrailer = trailer?.results?.filter(
    (result) => result?.name === "Official Trailer"
  );

  console.log("id:", id);
  console.log("trailerkey:", officialTrailer[0].key);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Backdrop IMG */}
      <View>
        <Image
          source={{ uri: `${TMDB_IMAGE_BASE_URL}${backdrop_path}` }}
          resizeMode="cover"
          style={{ width: "100%", height: 200 }} // Adjust size as needed
        />
      </View>

      {/* Details */}
      <View>
        <Text>Movie Page - {id}</Text>
        <Text>title - {title}</Text>
        <Text>overview - {overview}</Text>
        {rating !== 0 && <Text>rating - {rating.toFixed(1)}</Text>}
        <Text>release_date - {release_date}</Text>
        <Text>genres {genreNames.join(", ")}</Text>
      </View>

      {/* Trailer */}
      <WebView
        source={{ uri: "https://reactnative.dev/" }}
        style={{ height: "100%", width: "100%" }}
      />
    </SafeAreaView>
  );
};

export default MoviePage;
