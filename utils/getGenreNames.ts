import { GENRES } from "../constants/genres";

// Function to convert genre IDs to names
export const getGenreNames = (genreIds: any) => {
  // Create a mapping of genre IDs to names for quick lookup
  const genreMap = GENRES.reduce((acc: any, genre: any) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});

  // Map the provided genre IDs to their names
  return genreIds.map((id: any) => genreMap[id]);
};
