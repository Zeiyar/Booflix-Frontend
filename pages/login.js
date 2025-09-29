import { useNavigate,useState } from "react";

function Login (){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/home")
    }
    return(
        <form onSubmit={()=>handleSubmit} className="login">
        <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder="doulbi@gmail.com"/>
        <input type="password" onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="type your password here..."/>
        <button type="submit">Lez goooo</button>
        </form>
    )
};

export default Login;