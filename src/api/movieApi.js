const API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your actual TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (searchTerm) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=1&include_adult=false`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  
  const data = await response.json();
  return data.results;
};