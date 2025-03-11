import SuivreModel from "../models/suivreModel.js";

export const createSuivre = async (req, res) => {
    try {
        const { idcours, idutilisateur } = req.body;
        const suivre = await SuivreModel.createSuivre({ idcours, idutilisateur });
        res.status(201).json({ message: "Suivi créé avec succès", data: suivre });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllSuivres = async (req, res) => {
    try {
        const suivres = await SuivreModel.getAllSuivres();
        res.status(200).json(suivres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSuivreById = async (req, res) => {
    try {
        const suivre = await SuivreModel.getSuivreById(req.params.id);
        if (!suivre) return res.status(404).json({ message: "Suivi non trouvé" });
        res.status(200).json(suivre);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteSuivre = async (req, res) => {
    try {
        const result = await SuivreModel.deleteSuivre(req.params.id);
        res.status(200).json({ message: "Suivi supprimé avec succès", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
