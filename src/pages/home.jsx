import {useState,useEffect} from "react";
import {useNavigate,useParams} from "react-router-dom";

function Home (){
    const [movies,setMovies] = useState([]);
    const [page,setPage] = useState(1);
    const [year,setYear]= useState(2025);
    const [watchlist,_]= useState(null);
    const navigate = useNavigate();
    const {genreId} = useParams();

    useEffect(()=>{
            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_APP_TMDB_API_KEY}&language=fr-FR&sort_by=popularity.desc&page=${page}&primary_release_year=${year}${genreId ? `&with_genres=${genreId}` : ""}`)
            .then(res => res.json())
            .then(data => {
                setMovies(data.results || [])
            })
            .catch(err=>console.error(err))
        },[genreId,page,year]);

    return(
        <>

        <main>
            <p>Regarder les meilleurs films par années !!</p>
            <input type="number" 
            onChange={(e)=>setYear(e.target.value)} 
            value={year}
            />

            {movies[0] && (
            <section className="homePoster">
                <a onClick={()=>navigate(`/see/${movies[0].id}`)}>
                    <img src={`https://image.tmdb.org/t/p/w500${movies[0].poster_path}`} alt={movies[0].title}/>
                </a>
            </section>
        )}
            {watchlist && <section>
                <h2>Continuer à Regarder</h2>
                <div>{watchlist.map((movie)=><img src={`${movie.poster_path}`}/>)}</div>
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
            <section>
                <button onClick={()=>{page>1 && setPage(page-1)}}>{page-1}</button>
                <span>{page}</span>
                <button onClick={()=>setPage(page+1)}>{page+1}</button>
            </section>
        </main>
        </>
    )
}

export default Home;