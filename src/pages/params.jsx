import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

function Params (){
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const cancel = searchParams.get("cancel");

    const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY);
    const [oldPassword,setOldPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const [message,setMessage] = useState("Ton mot de passe est toujours le même");
    const [same,setSame] = useState("");
    const navigate = useNavigate();
    /*const [temps,] = useState("1 Semaine");*/
    
    const rules = newPassword ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(newPassword): false;
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")||"{}");
    const abo = localStorage.getItem("abo")
    const email = user?.email;

    useEffect(() => {
    if (cancel) {
        alert("Paiement annulé :(");
        return;
    }
    if (sessionId) {
        console.log("Session ID récupéré:", sessionId);
        
        const token = localStorage.getItem("token");

        let attempts = 0;         
        const maxAttempts = 10;     
        const interval = 2000;

        const polling = setInterval(async () => {
            attempts++;

            try {
                const res = await fetch(`https://bubleflix-backend.onrender.com/api/subscription`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();
                console.log("Polling :", data);

                if (data?.plan!==localStorage.getItem("abo") && data?.plan) {
                    localStorage.setItem("abo", data.plan);
                    console.log("Plan trouvé :", data.plan);
                    clearInterval(polling);
                if (!data?.plan){
                    localStorage.setItem("abo","Gratuit");
                    console.log("Utilisateur désabonné, plan mis à Free");
                }
                } else if (attempts >= maxAttempts) {
                    console.warn("Plan non disponible après plusieurs essais");
                    clearInterval(polling);
                }
            } catch (err) {
                console.error("Erreur polling :", err);
                clearInterval(polling);
            }
        }, interval);

        return () => clearInterval(polling);
    }
}, [sessionId, cancel]);


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
        console.log("Bouton cliqué pour plan:", plan);
        console.log("Token:", token);

        if (!token) {
            alert("Vous devez être connecté pour vous abonner");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
            "https://bubleflix-backend.onrender.com/api/subscription/create-checkout-session",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ plan }),
                credentials: "include",
            }
        );

        if (!res.ok) {
            const errData = await res.json();
            console.error("Erreur création session:", errData);
            alert(errData.msg || "Impossible de créer la session");
            setLoading(false);
            return;
        }

        const data = await res.json();
        console.log("Réponse Stripe:", data);

        if (!data.url) {
            console.error("URL Stripe manquante:", data);
            alert("Impossible de créer la session Stripe");
            setLoading(false);
            return;
        }


        const stripe = await stripePromise;
        console.log("Stripe object:", stripe);

        window.location.href = data.url;

    } catch (err) {
        console.error("Erreur réseau:", err);
        alert("Erreur réseau ou serveur");
        setLoading(false);
    }
};
    const handleDeleteSubsciption = async()=>{
        const confirm = window.confirm("Voulez vous vraiment annulez votre abonnement ?")
        if (!confirm) return;

        try {
            fetch("https://bubleflix-backend.onrender.com/api/subscription/unsubscibe",{
                method: "DELETE",
                headers: ({"Content-Type":"application/json",
                    Authorization: `Bearer ${token}`,
                })
            })
            if (!res.ok) {
            const data = await res.json();
            alert(data.msg || "Erreur lors de la désinscription");
            return;
            }

            alert("Abonnement annulé avec succès !");
            localStorage.setItem("abo", "Gratuit");
        } catch (err) {
            console.error(err);
            alert("Erreur réseau");
  }
};

    function logout(){
        fetch("https://bubleflix-backend.onrender.com/api/auth/logout",({
            method:"POST",
            credentials: "include",
        }))
        .then(()=>{
            localStorage.removeItem("token");
            localStorage.removeItem("abo");
            navigate("/");
        })
        .catch(console.error);
    }
/*<p>Vous avez actuellement l abonnement {abo} et il vous reste {temps} pour changer d adresse ip</p>
 mettre dans abo quand probleme et solution trouvé
*/
    return (
        <main className="optionsPage">
        <header>
            <br/><br/>
            <p><a href="#abo">Abonnement    </a>   <a href="#mdp">    Changer de mdp</a></p><br/>
            <p>N'hésiter pas a nous poster vos problèmes sur ce <a href="https://reablog.netlify.app/" target="_blank">blog</a> 
             que j ai créer uniquement pour ça (ouiouioui) si vous voulez que je rajoute des films ou séries aussi !</p>
        </header>
        
        <section>
            <h2 id="abo">Changez d'Abonnement</h2><br/>
            <strong>vous pouvez changer d adresse autant que vous voulez pendant 1 semaine</strong>
            <p>Vous avez actuellement l abonnement <strong>{abo}</strong></p><br/>
            <div>
                <h3>Basic</h3>
                <p>limitation a 1 adresse ip que vous choisissez en vous connectant</p>
                <p>possibilité de la changer tout les 6 mois (comme basicfit lol)</p>
                <p>4.99e</p>
                <button onClick={()=>{(abo==="Basic")? handleDeleteSubsciption()
                : handleSubscription("Basic")}} 
                disabled={loading}>{loading ? "Chargement..." : abo==="Basic"?"Se désabonner":"Choisir"}</button>
            </div>

            <div>
                <h3>Stylé</h3>
                <p>3 adresse ip qui seront aussi choisi en vous connectant avec les trois adresse</p>
                <p>changer aussi tout les 6 mois mais pour les trois dcp 3 changement tout les 6 mois</p>
                <p>6.99e</p>
                <button onClick={()=>{(abo==="Styled")? handleDeleteSubsciption()
                : handleSubscription("Styled")}} 
                disabled={loading}>{loading ? "Chargement..." : abo==="Styled"?"Se désabonner":"Choisir"}</button>
            </div>

            <div>
                <h3>A décider de miser sur soi même et toute sa famille</h3><br/>
                <p>6 adresse ip wowwww je ne veux pas dire mais c est surement la meilleur offre</p>
                <p>changer autant de fois que vous voulez même les voisins peuvent se connecter et partager l abonnement!!</p>
                <p>recevez aussi une casquette broder (porter par le dévelloppeur du site clin d oeil)</p>
                <strong>9.99e!!!</strong><p>    </p><p>1̶4̶.̶9̶9̶e </p>
                <button onClick={()=>{(abo==="Premium")? handleDeleteSubsciption()
                : handleSubscription("Premium")}} 
                disabled={loading}>{loading ? "Chargement..." : abo==="Premium"?"Se désabonner":"Choisir"}</button>
            </div>
        </section>

        <section>
            <h2 id="mdp">Change de mot de passe juste ici {email} !</h2>
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
        <button style={{background: "red",height:"50px",width:"150px"}} onClick={logout}>Déconnexion</button>
        </main>
    )
}
export default Params;