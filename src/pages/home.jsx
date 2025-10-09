import {useState,useEffect} from "react";
import {useNavigate,useParams} from "react-router-dom";

function Home (){
    const [movies,setMovies] = useState([]);
    const [page,setPage] = useState(1);
    const [year,setYear]= useState(2025);
    const [watchlist,setWatchlist]= useState([]);
    const navigate = useNavigate();
    const {genreId} = useParams();
    const userId = localStorage.getItem("userId");
    const [videoUrl,setVideoUrl] = useState(null);

    useEffect(()=>{
        fetch(`https://bubleflix-backend.onrender.com/watchlist/${userId}`)
        .then(res=>res.json())
        .then(data=>{
            setWatchlist(data)
        })
        .catch(err=>console.error(err));
    },[userId]);

    useEffect(()=>{
            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_APP_TMDB_API_KEY}&language=fr-FR&sort_by=popularity.desc&page=${page}&primary_release_year=${year}${genreId ? `&with_genres=${genreId}` : ""}`)
            .then(res => res.json())
            .then(data => {
                setMovies(data.results || [])
            })
            .catch(err=>console.error(err))
        },[genreId,page,year]);

    useEffect(() => {
        if (!movies.length) return;
    fetch(
      `https://api.themoviedb.org/3/movie/${movies[0].id}/videos?api_key=${import.meta.env.VITE_APP_TMDB_API_KEY}&language=fr-FR`
    )
      .then((res) => res.json())
      .then((data) => {
        const trailer = data.results.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );
        if (trailer) setVideoUrl(trailer.key);
        else {setVideoUrl(null);
        }})
      
      .catch((err) => console.error(err));
  }, [movies]);

    const handleDelete = async(id) => {
        try {const res = await fetch(`https://bubleflix-backend.onrender.com/watchlist/${userId}/${id}`,{
            method: "DELETE",
        });
        if (!res.ok){
            throw new Error("Erreur lors de la suppression");
        };

        const data = await res.json();
        console.log(data.message);
        setWatchlist((prev)=>prev.filter((a)=>a._id !== id));
    }catch(err){
            console.error(err);
        }
    }

    return(
        <>

        <main>
            <p>Regarder les meilleurs films par années !!</p>
            <input type="number" 
            onChange={(e)=>setYear(e.target.value)} 
            value={year}
            />

            {videoUrl ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoUrl}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="trailer"
          frameBorder="0"
          width="800"
          height="450"
          autoPlay
        />):
            (movies[0] && (
            <section className="homePoster">
                <a onClick={()=>navigate(`/see/${movies[0].id}`)}>
                    <img src={`https://image.tmdb.org/t/p/w500${movies[0].poster_path}`} alt={movies[0].title}/>
                </a>
            </section>
        ))}

            {watchlist && <section>
                <h2>Continuer à Regarder</h2>
                <div className="watchlistContainer">
                    {watchlist.map((item)=>(
                        <>
                        <div key={item.file} 
                            onClick={()=>navigate(`/series?file=${encodeURIComponent(item.file)}`)}>
                                <img className="watchlistImg" src={item.poster} alt={item.title}/>
                                <p>{item.title}</p>
                        </div>
                        <button style={{
                            height:"30px", width:"30px"}} onClick={()=>handleDelete(item._id)}>X</button>
                        </>
            ))}
                </div>
            </section>}


            <section className="movieContainer">
                {movies.map((movie)=>(
                    <div key={movie.id} className="movie">
                        <a onClick={()=>movie && navigate(`/see/${movie.id}`)}>
                        <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                        alt={movie.title} />
                        <h3>{movie.title}</h3></a>
                    </div>
                ))}
            </section>
            <section style={{width: "20px", height: "20px"}}>
                <button onClick={()=>{page>1 && setPage(page-1)}}>{page-1}</button>
                <span>{page}</span>
                <button onClick={()=>setPage(page+1)}>{page+1}</button>
            </section>
        </main>
        </>
    )
}

export default Home;