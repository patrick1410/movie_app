import Header from "../../components/Header";
import PopularMovies from "../../components/PopularMovies";
import TopRatedMovies from "../../components/TopRatedMovies";
import { ScrollView } from "react-native";

const HomePage = () => {
  return (
    <ScrollView>
      <Header />
      <PopularMovies />
      <TopRatedMovies />
    </ScrollView>
  );
};

export default HomePage;
