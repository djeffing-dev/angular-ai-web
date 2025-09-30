export interface EmailRequest {
    nom: string,
    destinataire: string
    objet: string,
    context: string,
    objectif: string,
    langue: string,
    taille: string,
    style: string,
    ton: string,
    humer: string,
    emoji: string
}

export const initEmailRequest = (): EmailRequest => {
    return {
        nom: "",
        destinataire: "",
        objet: "",
        context: "",
        objectif: "",
        langue: "fr",
        taille: "moyen",
        style: "auto",
        ton: "neutre",
        humer: "neutre",
        emoji: "modere"
    };
}

export const toEmailRequest = (currentEmail: any): EmailRequest => {
    return {
        nom: currentEmail.nom,
        destinataire: currentEmail.destinataire,
        objet: currentEmail.objet,
        context: currentEmail.context,
        objectif: currentEmail.objectif,
        langue: currentEmail.langue,
        taille: currentEmail.taille,
        style: currentEmail.style,
        ton: currentEmail.ton,
        humer: currentEmail.humer,
        emoji: currentEmail.emoji,
    };
}