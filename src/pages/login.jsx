import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgVideo from "../image/Space-Run-Art-GIF-by-PERFECTL00P.mp4"

function Login (){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

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
        console.log(data.accessToken)
        setLoading(true);
        setTimeout(()=>{return navigate("/home")},2000)
        }
        else {
        alert(data.msg || "Erreur lors du login");
      }
        
    }  catch(err){
        console.error(err);
    }} 

    return(
        <>
        {loading && (<video className="loadingGIF" autoPlay muted loop src={bgVideo} type="video/mp4"/>)}
        <form onSubmit={handleSubmit} className="login">
        <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder="doulbi@gmail.com" required/>
        <input type="password" onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="type your password here..." required/>
        <button type="submit">Lez goooo</button>
        <button type="button" onClick={()=>navigate("/register")}>Register?</button>
        </form></>
    )
};

export default Login;