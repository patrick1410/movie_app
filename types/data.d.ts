interface Movie {
  id: number | string;
  title: string;
  overview: string;
  vote_average: number;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  genre_ids: number[];
}
