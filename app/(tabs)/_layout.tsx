import { Tabs } from "expo-router";
import { Alert } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Home",
          headerTitleAlign: "center",
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
        listeners={{
          tabPress: (e) => {
            // Prevent the default navigation behavior if you want to handle custom behavior
            e.preventDefault();

            // Your custom action (example: show an alert)
            Alert.alert(
              "Search Button Pressed!",
              "You can trigger any action here."
            );
          },
        }}
      />
      <Tabs.Screen
        name="comingSoon"
        options={{
          headerTitle: "Coming Soon",
          headerTitleAlign: "center",
          title: `Coming Soon`,
        }}
      />
      {/* Hide movies/[id] */}
    </Tabs>
  );
};

export default TabsLayout;
