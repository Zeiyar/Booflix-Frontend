import { useEffect, useState } from "react";

export default function Series (){
    const [episode,setEpisode] = useState([]);
    const [video,setVideo] = useState("");

    useEffect(()=>{
        async function list() {
            const res = await fetch("https://bubleflix-backend.onrender.com/episodes");
            const data = await res.json();
            setEpisode(data.files);
            
            if(data.files.length > 0){
                loadEpisode(data.files[0]);
            }
        }
        list();
    },[])

    async function loadEpisode(fileKey){
        const res = await fetch(`https://bubleflix-backend.onrender.com/signed-url?file=${encodeURIComponent(fileKey)}`);
        const data = await res.json();
        setVideo(data.url);
    }
        
    return(
        <div>
            <h1>Dragon Ball !!!</h1>
            <video src={video} controls width="640"/>
            <p>c est tout ce que nous avons pour l instant woohooo</p>
        <select id="episodeSelect" onChange={(e)=>loadEpisode(e.target.value)}>
            {episode && episode.map((ep)=>(<option key={ep} value={ep}>{ep.split("/").pop()}</option>))}
        </select>
        </div>
    )
}

