import CoursModel from "../models/coursModel.js";

export const createCours = async (req, res) => {
    try {
        const { nomcours, idutilisateur } = req.body;
        const cours = await CoursModel.createCours({ nomcours, idutilisateur });
        res.status(201).json({ message: "Cours ajouté avec succès", data: cours });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllCours = async (req, res) => {
    try {
        const cours = await CoursModel.getAllCours();
        res.status(200).json(cours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCoursById = async (req, res) => {
    try {
        const cours = await CoursModel.getCoursById(req.params.id);
        if (!cours) return res.status(404).json({ message: "Cours non trouvé" });
        res.status(200).json(cours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCours = async (req, res) => {
    try {
        const updatedCours = await CoursModel.updateCours(req.params.id, req.body);
        res.status(200).json(updatedCours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteCours = async (req, res) => {
    try {
        const result = await CoursModel.deleteCours(req.params.id);
        res.status(200).json({ message: "Cours supprimé avec succès", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
