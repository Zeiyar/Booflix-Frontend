import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgVideo from "../image/Space-Run-Art-GIF-by-PERFECTL00P.mp4";
import vidBg from "../image/Running-Man-Space-GIF.mp4";


function Login (){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    let jwtDecode;
    if (typeof window !== "undefined") {
        jwtDecode = require("jwt-decode"); // CommonJS require dynamique
    }
    
    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const res = await fetch("https://bubleflix-backend.onrender.com/api/auth/login",{
            method:"POST",
            headers: ({"Content-Type":"application/json"}),
            body: JSON.stringify({email, password}),
            credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
        const token = data.accessToken;
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        localStorage.setItem("userId",userId);
        localStorage.setItem("token",token);

        setLoading(true);
        setTimeout(()=>navigate("/home"),2000)
        }
        else {
            alert(data.msg || "Erreur lors du login");
      }
        
    }  catch(err){
        console.error(err);
    }} 

    return(
        <>
        {loading && (
            <video className="loadingGIF" 
            autoPlay muted loop src={bgVideo} type="video/mp4"/>
        )}
        <div className="login">
            <video src={vidBg} autoPlay muted loop type="video/mp4" className="vidbg"/>
            <form onSubmit={handleSubmit} >
                <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder="doulbi@gmail.com" required/>
                <input type="password" onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="type your password here..." required/>
                <button type="submit">Lez goooo</button>
                <button type="button" onClick={()=>navigate("/register")}>Register?</button>
        </form></div></>
    )
};

export default Login;