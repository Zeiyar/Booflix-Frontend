import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import See from "./pages/see";
import Params from "./pages/params";
import Register from "./pages/register";
import { useState, useEffect} from "react";

const NavigationBar = () =>{
    const [listOfCategory,setListOfCategory] = useState([]);
    const [research,setResearch] = useState([]);
    const [search,setSearch] = useState("");

    useEffect(()=>{
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&page=1`)
        .then(res=>res.json())
        .then(data=>{
            setListOfCategory(data.genres)
        })
    },[]);

    useEffect(()=>{
        if(search.length>0){
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&query=${search}&page=1`)
            .then(res => res.json())
            .then(data => {
                setResearch(data.results)
            })
            .catch(err=>console.error(err))
        } else {
            setResearch([]);
        }
    },[search]);

    return(
        <nav className="navigationBar">
        <Link to="/">Home</Link>
        <Link to="/params">⚙️</Link>
        <div className="toolpip">
            <p>Category <span className="arrow">{">"}</span></p>
            <ul>
            {listOfCategory&& listOfCategory.map(list=><Link key={list.id} to={`/home/${list.id}`}><li>{list.name}</li></Link>)}
            </ul>
        </div>
        <div>
            <input onChange={(e)=>setSearch(e.target.value)} value={search}/>
            {research.map((film)=><div className="research"><img src={`https://image.tmdb.org/t/p/w200${film.poster_path}`} alt={film.title}/><p>{film.name}</p></div>)}
        </div>
        </nav>
    )
}

function App (){
    return(
    <Router>
        <NavigationBar />
        <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="/home/:genreId" element={<Home />}/>
            <Route path="/see/:id" element={<See />}/>
            <Route path="/params" element={<Params />}/>
            <Route path="/register" element={<Register />}/>
        </Routes>
    </Router>)
}

export default App;