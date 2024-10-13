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
        name="users/[id]"
        options={{
          headerTitle: "User Page",
          headerTitleAlign: "center",
          title: `User`,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
