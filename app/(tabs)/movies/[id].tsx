import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const MoviePage = () => {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Movie Page - {id}</Text>
    </View>
  );
};

export default MoviePage;
