import * as coursModel from "../models/coursModel.js";
import * as professeurModel from "../models/professeurModel.js";
export const createCours = async (req, res) => {
    
    try {
        const { nomCours, idutilisateur } = req.body;
        const testProfesseur= await professeurModel.isProfesseur(idutilisateur);
        if (!testProfesseur) {
            throw new Error('Seul un professeur  peut créer une classe');
        }
        console.log(testProfesseur);
        const cours = await coursModel.createCours(nomCours, idutilisateur);
        console.log(notif);
        res.status(201).json({ message: "Cours ajouté avec succès", data: coursModel});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllCours = async (req, res) => {
    try {
        const cours = await coursModel.getAllCours();
        res.status(200).json(cours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCoursById = async (req, res) => {
    try {
        const cours = await coursModel.getCoursById(req.params.id);
        if (!cours) return res.status(404).json({ message: "Cours non trouvé" });
        res.status(200).json(cours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getCoursByIdProfesseur = async (req, res) => {
    try {
        const cours = await coursModel.getCoursByIdProfesseur(req.params.id);
        if (!cours) return res.status(404).json({ message: "Aucun cours trouvé pour ce prof" });
        res.status(200).json(cours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCours = async (req, res) => {
    try {
        const { idCours, nomCours } = req.body;
        const updatedCours = await coursModel.updateCours(idCours, nomCours);
        res.status(200).json(updatedCours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteCours = async (req, res) => {
    try {
        const result = await coursModel.deleteCours(req.params.id);
        res.status(200).json({ message: "Cours supprimé avec succès", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
