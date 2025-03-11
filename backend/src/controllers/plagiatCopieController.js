import PlagiatCopieModel from "../models/plagiatcopieModel.js";

export const createPlagiatCopie = async (req, res) => {
    try {
        const { idplagiat, idcopie, pourcentageplagiat } = req.body;
        const plagiatcopie = await PlagiatCopieModel.createPlagiatCopie({ idplagiat, idcopie, pourcentageplagiat });
        res.status(201).json({ message: "PlagiatCopie ajouté avec succès", data: plagiatcopie });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllPlagiatCopies = async (req, res) => {
    try {
        const plagiatcopies = await PlagiatCopieModel.getAllPlagiatCopies();
        res.status(200).json(plagiatcopies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPlagiatCopieById = async (req, res) => {
    try {
        const plagiatcopie = await PlagiatCopieModel.getPlagiatCopieById(req.params.id);
        if (!plagiatcopie) return res.status(404).json({ message: "PlagiatCopie non trouvée" });
        res.status(200).json(plagiatcopie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deletePlagiatCopie = async (req, res) => {
    try {
        const result = await PlagiatCopieModel.deletePlagiatCopie(req.params.id);
        res.status(200).json({ message: "PlagiatCopie supprimée avec succès", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
