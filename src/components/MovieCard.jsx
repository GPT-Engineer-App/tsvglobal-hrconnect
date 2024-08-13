import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MovieCard = ({ movie }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{movie.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
        <p className="text-sm text-gray-600 mb-2">{movie.overview.slice(0, 100)}...</p>
        <div className="flex justify-between items-center">
          <Badge variant="secondary">{movie.release_date.split('-')[0]}</Badge>
          <span className="text-yellow-500">★ {movie.vote_average.toFixed(1)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;