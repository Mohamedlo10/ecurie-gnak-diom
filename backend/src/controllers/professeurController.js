import ProfesseurModel from "../models/professeurModel.js";

export const createProfesseur = async (req, res) => {
    try {
        const { idutilisateur } = req.body;
        const professeur = await ProfesseurModel.createProfesseur({ idutilisateur });
        res.status(201).json({ message: "Professeur ajouté avec succès", data: professeur });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllProfesseurs = async (req, res) => {
    try {
        const professeurs = await ProfesseurModel.getAllProfesseurs();
        res.status(200).json(professeurs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProfesseurById = async (req, res) => {
    try {
        const professeur = await ProfesseurModel.getProfesseurById(req.params.id);
        if (!professeur) return res.status(404).json({ message: "Professeur non trouvé" });
        res.status(200).json(professeur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteProfesseur = async (req, res) => {
    try {
        const result = await ProfesseurModel.deleteProfesseur(req.params.id);
        res.status(200).json({ message: "Professeur supprimé avec succès", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
