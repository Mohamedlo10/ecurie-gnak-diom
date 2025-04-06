import  PlagiatModel from "../models/plagiatModel.js";

export const createPlagiat = async (req, res) => {
    try {
        const { idplagiat, pourcentageplagiat } = req.body;
        const plagiat = await PlagiatModel.createPlagiat({ idplagiat, pourcentageplagiat });
        res.status(201).json({ message: "Plagiat ajouté avec succès", data: plagiat });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllPlagiats = async (req, res) => {
    try {
        const plagiats = await PlagiatModel.getAllPlagiats();
        res.status(200).json(plagiats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPlagiatById = async (req, res) => {
    try {
        const plagiat = await PlagiatModel.getPlagiatById(req.params.id);
        if (!plagiat) return res.status(404).json({ message: "Plagiat non trouvé" });
        res.status(200).json(plagiat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePlagiat = async (req, res) => {
    try {
        const updatedPlagiat = await PlagiatModel.updatePlagiat(req.params.id, req.body);
        res.status(200).json(updatedPlagiat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deletePlagiat = async (req, res) => {
    try {
        const result = await PlagiatModel.deletePlagiat(req.params.id);
        res.status(200).json({ message: "Plagiat supprimé avec succès", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
