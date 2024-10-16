import { useLocalSearchParams } from "expo-router";
import { Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  return (
    <SafeAreaView>
      <View>
        <Text>Movie Page - {id}</Text>
        <Text>title - {title}</Text>
        <Text>overview - {overview}</Text>
        <Text>rating - {Number(vote_average).toFixed(1)}</Text>
        <Text>release_date - {release_date}</Text>
        <Text>genres {genre_ids}</Text>
        <Image
          source={{ uri: `${TMDB_IMAGE_BASE_URL}${backdrop_path}` }}
          resizeMode="cover"
          style={{ width: "100%", height: 200 }} // Adjust size as needed
        />
      </View>
    </SafeAreaView>
  );
};

export default MoviePage;
