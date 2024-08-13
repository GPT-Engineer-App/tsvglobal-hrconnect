import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Movie Explorer</h1>
      <SearchBar onSearch={handleSearch} />
      {isLoading && <p className="text-center mt-8">Loading movies...</p>}
      {error && <p className="text-center mt-8 text-red-500">Error: {error.message}</p>}
      {movies && <MovieList movies={movies} />}
    </div>
  );
};

export default Index;