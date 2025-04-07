import * as mailer from "../utils/mailer.js";
import * as utilisateurModel from "../models/utilisateurModel.js";
import * as coursModel from "../models/coursModel.js";
import * as suivreModel from "../models/suivreModel.js";
import * as copieModel from "../models/copieModel.js";

// Notification : ajout à un cours
export const notifAjoutCours = async (idUtilisateur, idCours) => {
    try {
        const user = await utilisateurModel.findUserById(idUtilisateur);
        const cours = await coursModel.getCoursById(idCours);
        console.log("User:", user);  // Affiche l'utilisateur dans la console
        if (user?.email) {
            const contenuMail = `
                <p>Bonjour ${user.prenom},</p>
                <p>Vous avez été inscrit au cours <strong>${cours.nomcours}</strong>.</p>
                <p>Connectez-vous à la plateforme pour accéder aux contenus.</p>`
            ;
            console.log("Email Content:", contenuMail);  // Affiche le contenu de l'email dans la console
            const envoi = await mailer.sendMail(user.email, "📚 Nouveau cours", contenuMail);
            console.log("Email Sent:", envoi); // Affiche le résultat de l'envoi dans la console

            return {
                success: true,
                destinataire: user.email,
                message: "Notification d'ajout envoyée",
            };
        } else {
            return {
                success: false,
                destinataire: null,
                message: "Utilisateur sans email",
            };
        }
    } catch (err) {
        return {
            success: false,
            message: `Erreur lors de l'envoi : ${err.message}`,
        };
    }
};

// Notification : sujet publié
export const notifAjoutSujet = async (idCours, nomSujet) => {
    let count = 0;
    const etudiants = await suivreModel.getEtudiantByIdCours(idCours);
    const cours = await coursModel.getCoursById(idCours);
    if (!etudiants) {
        return {
            success: false,
            message: "Aucun étudiant trouvé pour ce cours",
        };
    }
    for (const etu of etudiants) {
        const user = await utilisateurModel.findUserById(etu.idutilisateur);
        if (user?.email) {
            const contenuMail = `
            <p>Bonjour ${user.prenom},</p>
            <p>Un nouveau sujet <strong>${nomSujet}</strong> est disponible dans votre cours de <strong>${cours.nomcours}</strong>.</p>
            <p>Connectez-vous à la plateforme pour le consulter.</p>
            <p><strong>Bonne Chance  ! ! ! </strong></p>`
        ;
        console.log("Email Content:", contenuMail);  // Affiche le contenu de l'email dans la console
        const envoi = await mailer.sendMail(user.email, "🆕 Nouveau sujet publié", contenuMail);
        console.log("Email Sent:", envoi); 

        count++;
        }
    }
    return {
        success: true,
        totalEtudiants: etudiants.length,
        mailsEnvoyes: count,
    };
};

// Notification : copie corrigée
export const notifCopieCorrigee = async (idcopie, note) => {
    try {
        // const user = await utilisateurModel.findUserById(idUtilisateur);
        const user = await copieModel.findUserByIdCopie(idcopie);
        // console.log( "objet user ");
        // console.log(user);
        console.log(idcopie);
        const sujet = await copieModel.getSujetByIdCopie(idcopie);
        console.log(sujet)
        console.log("nom Sujet :")
        console.log(sujet.nomsujet);
        const cours = await coursModel.getCoursById(sujet.idcours);
        console.log(user.email, user.nom, cours.nomcours, note);

        if (user?.email) {
            const contenuMail = (
                user.email,
                "📝 Votre copie a été corrigée",
                `<p>Bonjour ${user.prenom} ${user.nom},</p>
                <p>Votre copie pour le sujet ${sujet.nomsujet} du cours de ${cours.nomcours} a été corrigée</p>
                <p><strong>Note :</strong> ${note}/20</p>`
            );
            console.log("Email Content:", contenuMail);  // Affiche le contenu de l'email dans la console
            const envoi = await mailer.sendMail(user.email, "📝 Votre copie a été corrigée", contenuMail);
            console.log("Email Sent:", envoi);  // Affiche le résultat de l'envoi dans la console
            // <p><strong>Commentaire :</strong> ${commentaire}</p>`
            return {
                success: true,
                data: {
                    destinataire: user.email,
                    note: note,
                },
                message: "Notification de correction envoyée",
            };
        } else {
            return {
                success: false,
                destinataire: null,
                message: "Utilisateur sans email",
            };
        }
    } catch (err) {
        return {
        success: false,
        message: `Erreur lors de l'envoi : ${err.message}`,
        };
    }
}; 

