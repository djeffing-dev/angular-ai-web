export interface EmailGenerator {
    id: number,
    nom: string,
    destinataire: string,
    objet: string,
    context: string,
    objectif: string,
    langue: string,
    taille: string,
    style: string,
    ton: string,
    humer: string,
    emoji: string,
    content: string
    user: UserMail,
    createdAt: string,
    updatedAt: string
}

export interface UserMail{
    id: number,
    username: string,
    email: string
}