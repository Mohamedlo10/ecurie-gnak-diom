import * as suivreModel from "../models/suivreModel.js";
import * as notifController from "./notifController.js";

export const addEtudiant = async (req, res) => {
    try {
        const { idcours, email } = req.body;
        console.log(idcours, email, "ajout etudiant au cours");
        if (!idcours || !email) {
            return res.status(400).json({ error: "Les identifiants du cours et de l'utilisateur sont requis." });
        }

        const newSuivre = await suivreModel.addEtudiant(idcours, email);
        const user = await suivreModel.getUserByEmail(email);
        console.log(user.email, user.idutilisateur);
        const notif = await notifController.notifAjoutCours(user.idutilisateur, idcours);
        return res.status(201).json({
            message: "Étudiant inscrit avec succès au cours.",
            data: newSuivre, cours: notif,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const getCoursByIdEtudiant = async (req, res) => {
    const { idutilisateur } = req.params; // Récupération de l'ID depuis l'URL
    console.log(idutilisateur);
    try {
        if (!idutilisateur) {
            return res.status(400).json({ error: "L'identifiant de l'utilisateur est requis." });
        }

        const cours = await suivreModel.getCoursByIdEtudiant(idutilisateur);

        if (cours.length === 0) {
            return res.status(404).json({ message: "Aucun cours trouvé pour cet étudiant." });
        }

        return res.status(200).json(cours);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const getEtudiantByIdCours = async (req, res) => {
    try {
        const { idcours } = req.params;

        if (!idcours) {
            return res.status(400).json({ error: "L'identifiant du cours est requis." });
        }
        const etudiants = await suivreModel.getEtudiantByIdCours(idcours);

        if (etudiants.length === 0) {
            return res.status(404).json({ message: "Aucun étudiant trouvé pour ce cours." });
        }

        return res.status(200).json(etudiants);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const getOne = async (req, res) => {
    try {
        const { idcours, idutilisateur } = req.params;

        // Vérifier si les deux paramètres sont fournis
        console.log(idcours, idutilisateur);
        if (!idcours || !idutilisateur) {
            return res.status(400).json({ error: "Les identifiants du cours et de l'étudiant sont requis." });
        }

        // Récupérer le suivi spécifique
        const suivre = await suivreModel.getOne(idcours, idutilisateur);

        // Vérifier si un résultat a été trouvé
        if (!suivre) {
            return res.status(404).json({ message: "Suivi non trouvé" });
        }

        return res.status(200).json(suivre);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const exclureEtudiant  = async (req, res) => {
    try {
        const { idCours, idutilisateur } = req.body;
        const result = await suivreModel.exclureEtudiant (idCours, idutilisateur);
        res.status(200).json({ message: "Suivi supprimé avec succès", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
