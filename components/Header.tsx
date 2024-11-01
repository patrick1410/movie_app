import { View, Text, StyleSheet } from "react-native";
import { SvgUri } from "react-native-svg";

const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Trailerflix</Text>

      <SvgUri
        style={styles.logo}
        fill={"rgba(34,193,195,1)"}
        uri="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  text: { color: "#E50914", textAlign: "center", fontSize: 32 },
  logo: { width: 100, height: 75 },
});

export default Header;
