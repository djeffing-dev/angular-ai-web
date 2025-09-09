import { HttpHeaders } from "@angular/common/http"

//export const isUserConnected = () : boolean => !! localStorage.getItem("token");

// Vérifie si le user est connecté ET que le token JWT est valide
export const isUserConnected = ():boolean =>{
    const token = localStorage.getItem("token");
    if(!token) return false;

    try{
        const payload = JSON.parse(atob(token.split(".")[1])); // Décoder la partie "payload" du JWT

        // Vérifier la date d'expiration (exp est en secondes → Date.now() est en ms)
        if(payload.exp && Date.now() >= payload.exp*1000){  
            localStorage.removeItem("token"); // Token expiré → on le supprime
            return false;
        } 
        return true; // Token présent et valide
    }catch(err){
        console.error("Token invalide : ", err);
        localStorage.removeItem("token");
        return false;
    }
}

export const httpOption = () =>{
    return {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        })
    }
};

export const userConnected = () =>{
    const user = localStorage.getItem('user'); 
    return (isUserConnected() && user)? JSON.parse(user) : null
}