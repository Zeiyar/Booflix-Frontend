import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import See from "./pages/see";
import Params from "./pages/params";
import Register from "./pages/register";
import { useState, useEffect} from "react";
import { useLocation } from "react-router-dom";

const NavigationBar = () =>{
    const [listOfCategory,setListOfCategory] = useState([]);
    const [research,setResearch] = useState([]);
    const [search,setSearch] = useState("");
    const [showResult,setShowResult] = useState(false);
    const [navbar,setNavbar] = useState(false);
    const location = useLocation();

    useEffect(()=>{
        if(location.pathname === "/" || location.pathname === "/register"){
            setNavbar(false);
        }
        else{
            setNavbar(true);
        }
    },[location])

    useEffect(()=>{
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_APP_TMDB_API_KEY}&language=fr-FR&page=1`)
        .then(res=>res.json())
        .then(data=>{
            setListOfCategory(data.genres)
        })
    },[]);

    useEffect(()=>{
        if(search.length>0){
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_APP_TMDB_API_KEY}&language=fr-FR&query=${search}&sort_by=popularity.desc&page=1`)
            .then(res => res.json())
            .then(data => {
                setResearch(data.results);
                setShowResult(true);
            })
            .catch(err=>console.error(err))
        } else {
            setResearch([]);
            setShowResult(false);
        }
    },[search]);

    return(
        <>
        {navbar && (<nav className="navigationBar">
        <Link to="/home">Home</Link>
        <Link to="/params">⚙️</Link>
        <div className="toolpip">
            <p>Category <span className="arrow">{">"}</span></p>
            <ul>
            {listOfCategory&& listOfCategory.map(list=><Link key={list.id} to={`/home/${list.id}`}><li>{list.name}</li></Link>)}
            </ul>
        </div>
        <div>
            <input onChange={(e)=>setSearch(e.target.value)} value={search}/>
            <div className="research" style={{display: showResult ? "block" : "none"}}>{research.map((film)=><Link to={`/see/${film.id}`}><div className="research-item"><img src={`https://image.tmdb.org/t/p/w200${film.poster_path}`} alt={film.title}/><p>{film.name}</p></div></Link>)}</div>
        </div>
        </nav>)}</>
    )
}

function App (){
    return(
    <>
        <NavigationBar />
        <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="/home/:genreId" element={<Home />}/>
            <Route path="/home" element={<Home />}/>
            <Route path="/see/:id" element={<See />}/>
            <Route path="/params" element={<Params />}/>
            <Route path="/register" element={<Register />}/>
        </Routes>
    </>)
}

export default App;