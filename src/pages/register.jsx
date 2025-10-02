import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";

function Register(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [same,setSame] = useState("");
    const navigate = useNavigate();

    const rules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
        if(same!==password){
            return alert("les deux mots de passe doivent être les mêmes");
        }
        if(!rules){
            return alert("les règles du mot de passe ne sont pas respecter");
        }
        const res = await fetch("https://bubleflix-backend.onrender.com/api/auth/register",{
            method:"POST",
            headers: ({"Content-Type":"application/json"}),
            body: JSON.stringify({email,password}),
        })
        const data = await res.json();

        if (res.ok){
            navigate("/")
        }
        else {
        alert(data.msg || "Erreur lors du login");
        }
    }catch(err){
        console.error(err);
    }}

    return (
        <form onSubmit={handleSubmit} className="login">
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="doulbi@gmail.com"/>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="1234&abcD"/>
            {!rules && (<strong>minimum 8 caractères 1 caractère spécial 1 numéro majuscule et minuscule</strong>)}
            <input type="password" value={same} onChange={(e)=>setSame(e.target.value)} required placeholder="1234&abcD"/>
            {same!==password && (<strong>doit être le même mot de passe</strong>)}
            <button type="submit">S'inscrire maintenannnnt!</button>
            <small>Déjà un compte ? <Link to="/">se connecter</Link></small>
        </form>
    )
}

export default Register;