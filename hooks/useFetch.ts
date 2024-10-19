import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

// Base URL for the TMDB API
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "ebce74cb934fc3d8fd8572292fb217a9"; // Replace with your actual API key

// Function to fetch data from the TMDB API
const fetchFromTMDB = async (
  endpoint: string,
  pageParam: number = 1,
  params: Record<string, any> = {}
) => {
  const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
    params: {
      api_key: API_KEY,
      page: pageParam,
      ...params,
    },
  });
  return response.data;
};

// Custom hook for fetching data from TMDB
const useTMDB = (endpoint: string, params: Record<string, any> = {}) => {
  const queryKey = [endpoint, params];

  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => fetchFromTMDB(endpoint, pageParam, params),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length + 1,
  });
};

export default useTMDB;
