import PopularMovies from "../../components/PopularMovies";
import TopRatedMovies from "../../components/TopRatedMovies";
import { ScrollView } from "react-native";
const HomePage = () => {
  return (
    <ScrollView>
      <PopularMovies />
      <TopRatedMovies />
    </ScrollView>
  );
};

export default HomePage;
