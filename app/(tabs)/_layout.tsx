import { Tabs } from "expo-router";

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
        name="comingSoon"
        options={{
          headerTitle: "Coming Soon",
          headerTitleAlign: "center",
          title: `Coming Soon`,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
