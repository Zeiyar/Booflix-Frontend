import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function See() {
  const [movie, setMovie] = useState(null);
  const { id } = useParams();
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
    )
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
    )
      .then((res) => res.json())
      .then((data) => {
        const trailer = data.results.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );
        if (trailer) setVideoUrl(trailer.key);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!movie) return <p>Chargement...</p>;

  return (
    <div className="movieSee">
      {videoUrl ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoUrl}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="trailer"
          frameBorder="0"
          width="800"
          height="450"
        />
      ) : (
        <p>Aucun trailer disponible</p>
      )}

      <div className="descriptif">
        <h1>{movie.title}</h1>
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/fallback.jpg"
          }
          alt={movie.title}
        />
        <p>{movie.overview}</p>
        <div>{movie.genres?.map((g) => g.name).join(", ")}</div>
        <strong>
          {movie.vote_average}/10 avec {movie.vote_count} votants
        </strong>
      </div>
    </div>
  );
}

export default See;
