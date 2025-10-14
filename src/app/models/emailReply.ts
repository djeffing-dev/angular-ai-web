export interface EmailReply{
    name:string,
    destinataire:string,
    receivedEmail:string,
    replayGoal:string,
    langue: string,
    taille: string,
    style: string,
    ton: string,
    humer: string,
    emoji: string
}

export const initEmailReplay = (emailReply : any): EmailReply => {
    return {
        name: emailReply.name ?? "",
        destinataire: emailReply.destinataire ?? "",
        receivedEmail: emailReply.receivedEmail ?? "",
        replayGoal: emailReply.replayGoal ?? "",
        langue: emailReply.langue ?? "fr",
        taille: emailReply.taille ?? "moyen",
        style: emailReply.style ?? "auto",
        ton: emailReply.ton ?? "neutre",
        humer: emailReply.humer ?? "neutre",
        emoji: emailReply.emoji ?? "modere"
    };
}