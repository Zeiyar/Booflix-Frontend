import { useNavigate,useState } from "react";

function Login (){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
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
        navigate("/home")}
        else {
        alert(data.msg || "Erreur lors du login");
      }
        
    }  catch(err){
        console.error(err);
    }} 

    return(
        <form onSubmit={handleSubmit} className="login">
        <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder="doulbi@gmail.com" required/>
        <input type="password" onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="type your password here..." required/>
        <button type="submit">Lez goooo</button>
        <button type="button" onClick={()=>navigate("/register")}>Register?</button>
        </form>
    )
};

export default Login;