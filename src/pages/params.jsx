import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

function Params (){
    const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY);
    const [oldPassword,setOldPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const [message,setMessage] = useState("Ton mot de passe est toujours le même");
    const [same,setSame] = useState("");
    const [abo,setAbo] = useState("Gratuit");
    const navigate = useNavigate();
    /*const [temps,] = useState("1 Semaine");*/
    
    const rules = newPassword ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(newPassword): false;
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")||"{}");
    const email = user?.email;

    const handleModify = async(e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("Demande de changement");

        try {
        const res = await fetch(`https://bubleflix-backend.onrender.com/api/auth/change-password`,{
            method: "PUT",
            headers: {"Content-Type":"application/json",
                Authorization: `Bearer ${token}`},
            body: JSON.stringify({oldPassword,newPassword}),
        });

        const data = await res.json();
        if (res.ok) {setMessage("Ton mot de passe à changé avec succès !! Redirection pour reconnection...");
            logout();
        }

        else {setMessage(`${data.message}`);}

    }   catch(err){
            setMessage("Erreur de connexion au serveur");
    }   finally {
            setLoading(false);
    }
    }

    const handleSubscription = async(plan) => {
        const token = localStorage.getItem("token");
        setLoading(true);
        const res = await fetch(`https://bubleflix-backend.onrender.com/api/subscription/create-checkout-session`,{
            method: "POST",
            headers: {"Content-Type":"application/json", Authorization: `Bearer ${token}`},
            body: JSON.stringify({plan}),
            credentials: "include",
        });
        const data = await res.json();
        const stripe = await stripePromise;

        setAbo(plan);
        
        console.log(data.url);
        window.location.href = data.url;
        setTimeout(()=>{setLoading(false)},2000);
    } 

    function logout(){
        fetch("/logout",({
            method:"POST",
            credentials: "include",
        }))
        .then(()=>{
            localStorage.removeItem("token");
            navigate("/");
        })
    }
/*<p>Vous avez actuellement l abonnement {abo} et il vous reste {temps} pour changer d adresse ip</p>
 mettre dans abo quand probleme et solution trouvé
*/
    return (
        <main className="optionsPage">
        <header>
            <h1>MOUHAHAHAHA</h1>
            <p>Welcome to params</p>
            <a href="#abo">Abonnement</a>
            <a href="#mdp">Changer de mdp</a>
            <p>N'hésiter pas a nous poster vos problèmes sur ce <a href="https://reablog.netlify.app/">blog</a> 
            que j ai créer uniquement pour ça (ouiouioui) si vous voulez que je rajoute des films ou séries aussi !</p>
        </header>
        
        <section>
            <h2 id="abo">Change d'Abonnement</h2>
            <strong>vous pouvez changer d adresse autant que vous voulez pendant 1 semaine</strong>
            <p>Vous avez actuellement l abonnement {abo}</p>
            <div>
                <h3>Basic</h3>
                <p>limitation a 1 adresse ip que vous choisissez en vous connectant</p>
                <p>possibilité de la changer tout les 6 mois (comme basicfit lol)</p>
                <p>4.99e</p>
                <button onClick={() =>handleSubscription("Basic")} disabled={loading||abo==="Basic"}>{loading ? "Chargement..." : "Choisir"}</button>
            </div>

            <div>
                <h3>Stylé</h3>
                <p>3 adresse ip qui seront aussi choisi en vous connectant avec les trois adresse</p>
                <p>changer aussi tout les 6 mois mais pour les trois dcp 3 changement tout les 6 mois</p>
                <p>6.99</p>
                <button onClick={() =>handleSubscription("Styled")} disabled={loading||abo==="Styled"}>{loading ? "Chargement..." : "Choisir"}</button>
            </div>

            <div>
                <h3>A décider de miser sur soi même et toute sa famille</h3>
                <p>6 adresse ip wowwww je ne veux pas dire mais c est surement la meilleur offre</p>
                <p>changer autant de fois que vous voulez même les voisins peuvent se connecter et partager l abonnement!!</p>
                <p>recevez aussi une casquette broder (porter par le dévelloppeur du site clin d oeil)</p>
                <p>si vous aimez les danseur bg et muscler je m engage personnellement a venir danser chez vous</p>
                <strong>9.99e!!!</strong><strong> ̶ ̶1̶4̶.̶9̶9̶</strong>
                <button onClick={()=>handleSubscription("Premium")} disabled={loading||abo==="Premium"}>{loading ? "Chargement..." : "Choisir"}</button>
            </div>
        </section>

        <section>
            <h2 id="mdp">Change de mot de passe</h2>
            <span>{email}</span>
            <form onSubmit={handleModify}>
                
                <input
                    type="password"
                    placeholder="Ancien mot de passe"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                {!rules && newPassword &&
                (<strong>minimum 8 caractères 1 caractère spécial 1 numéro majuscule et minuscule</strong>)}

                <input 
                    type="password" 
                    value={same} 
                    onChange={(e)=>setSame(e.target.value)} 
                    required placeholder="1234&abcD"/>
                {same!==newPassword && (<strong>doit être le même mot de passe</strong>)}
                
            
                <button type="submit" disabled={!rules || !oldPassword || !newPassword || loading || same!==newPassword}>
                        {loading ? "Changement..." : "Modifier"}
                </button>
                    {message && <p>{message}</p>}
            </form>
        </section>
        <button style={{background: "red",height:"50px",width:"100px"}} onClick={logout}>Déconnexion</button>
        </main>
    )
}
export default Params;