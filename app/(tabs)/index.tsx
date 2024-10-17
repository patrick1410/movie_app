import PopularMovies from "../../components/PopularMovies";
import TopRatedMovies from "../../components/TopRatedMovies";
import InfiniteList from "../../components/InfinteList";
import { ScrollView } from "react-native";
const HomePage = () => {
  return (
    <ScrollView>
      <PopularMovies />
      <TopRatedMovies />
      <InfiniteList />
    </ScrollView>
  );
};

export default HomePage;
