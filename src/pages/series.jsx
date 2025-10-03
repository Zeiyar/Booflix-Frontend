import { useEffect, useState, useRef } from "react";
import dragonBallPoster from "../image/Dragon-Ball-Wallpaper-dragon-ball-35542008-1280-1024-1967529842.jpg";
import { useSearchParams } from "react-router-dom";

export default function Series (){
    const [episode,setEpisode] = useState([]);
    const [video,setVideo] = useState("");
    const [progress,setProgress] = useState(0);
    const videoRef = useRef(null);
    const userId = localStorage.getItem("userId");
    const [title,setTitle] = useState("");
    const [poster,setPoster] = useState("");
    const [searchParams] = useSearchParams();
    const fileKey = searchParams.get("file");

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
        setPoster(dragonBallPoster);
        setTitle(fileKey.split("/").pop())

    const progRes = await fetch(`https://bubleflix-backend.onrender.com/watchlist/${userId}`);
    const progData = await progRes.json();
    const saved = progData.find((item)=>item.file===fileKey);
    setProgress(saved ? saved.progress : 0);
    }
        
    return(
        <div>
            <h1>Dragon Ball !!!</h1>
            <video
            ref={videoRef} 
            src={video} 
            controls
            width="640" 
            onLoadedMetadata={()=>{
                if (progress && videoRef.current) videoRef.current.currentTime = progress;
            }}
            onTimeUpdate={(e)=>{
                const currentTime = e.target.currentTime;
                if (currentTime>30){
                    fetch(`https://bubleflix-backend.onrender.com/watchlist`,{
                        method:"POST",
                        headers:({"Content-Type":"application/json"}),
                        body: JSON.stringify({
                            userId,
                            file : fileKey,
                            progress : currentTime,
                            poster,
                            title
                        })
                    });
                }
            }}
            />

            <p>c est tout ce que nous avons pour l instant woohooo</p>
        <select id="episodeSelect" onChange={(e)=>loadEpisode(e.target.value)}>
            {episode && 
                episode.map((ep)=>(
                <option key={ep} value={ep}>{ep.split("/").pop()}</option>
                )
            )}
        </select>
        </div>
    )
}

