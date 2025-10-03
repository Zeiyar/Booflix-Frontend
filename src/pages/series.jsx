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
    const [hasTimed,setHasTimed] = useState(0);

    useEffect(()=>{
        async function list() {

            const res = await fetch("https://bubleflix-backend.onrender.com/episodes");
            const data = await res.json();
            setEpisode(data.files);

            if(fileKey && data.files.includes(fileKey)){
                loadEpisode(fileKey);
            }
            else if(data.files.length > 0){
                loadEpisode(data.files[0]);
            }
        }
        list();
    },[fileKey])

    async function loadEpisode(fileKey){

        try{const res = await fetch(`https://bubleflix-backend.onrender.com/signed-url?file=${encodeURIComponent(fileKey)}`);
        const data = await res.json();

        setVideo(data.url);
        setPoster(dragonBallPoster);
        setTitle(fileKey.split("/").pop())

    const progRes = await fetch(`https://bubleflix-backend.onrender.com/watchlist/${userId}`);
    const progData = await progRes.json();
    const saved = progData.find((item)=>item.file===fileKey);
    setProgress(saved ? saved.progress : 0);
    setHasTimed(0);} 
    catch (err) {
      console.error(err);
    }
  }

    const handleTimeUpdate = (e,fileKey) => {
        const currentTime = e.target.currentTime;
            if (currentTime - hasTimed >10){
                setHasTimed(currentTime);
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
                    }).catch(console.error);
                }
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
                if (progress && videoRef.current) 
                    videoRef.current.currentTime = progress;
            }}
            onTimeUpdate={(e)=> handleTimeUpdate(e,fileKey)}
            autoPlay/>

            <p>c est tout ce que nous avons pour l instant woohooo</p>
        <select id="episodeSelect" value={fileKey || (episode[0] ?? "") } 
        onChange={(e)=>loadEpisode(e.target.value)}>

            {episode && 
                episode.map((ep)=>(
                <option key={ep} value={ep}>{ep.split("/").pop()}</option>
                )
            )}

        </select>
        </div>
    )
}

