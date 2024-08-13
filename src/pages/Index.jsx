import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MovieList from '../components/MovieList';
import SearchBar from '../components/SearchBar';
import { fetchMovies } from '../api/movieApi';

const Index = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['movies', searchTerm],
    queryFn: () => fetchMovies(searchTerm),
    enabled: !!searchTerm,
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {isLoading && <p className="text-center mt-8">Loading movies...</p>}
      {error && <p className="text-center mt-8 text-red-500">Error: {error.message}</p>}
      {movies && <MovieList movies={movies} />}
    </div>
  );
};

export default Index;