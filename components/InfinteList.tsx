import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";

const items = Array.from({ length: 100 }).map((_, i) => ({
  id: i,
  name: `Item ${i}`,
}));

type Item = (typeof items)[0];

const LIMIT = 10;

export function fetchItems({ pageParam }: { pageParam: number }): Promise<{
  data: Item[];
  currentPage: number;
  nextPage: number | null;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: items.slice(pageParam, pageParam + LIMIT),
        currentPage: pageParam,
        nextPage: pageParam + LIMIT < items.length ? pageParam + LIMIT : null,
      });
    }, 1000);
  });
}

export default function InfinteList() {
  const {
    data,
    error,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  if (status === "pending") {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={styles.container}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal={true}
        data={data.pages.flatMap((page) => page.data)} // Flatten the pages into one array
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()} // Unique key for each item
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage(); // Fetch more when the end is reached
          }
        }}
        onEndReachedThreshold={0.9} // Trigger onEndReached when within 50% of the bottom
      />
      {isFetchingNextPage && <Text>Loading...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  itemContainer: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    height: 250,
    width: 150,
  },
  itemText: {
    fontSize: 16,
  },
  footer: {
    padding: 16,
  },
});
