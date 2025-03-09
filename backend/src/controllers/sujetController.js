import SujetModel from "../models/sujetModel.js";


export const getAllSujetsByClasse = async (req, res) => {
    try {
        const sujets = await SujetModel.getAllByClasse(req.params.idclasse);
        res.status(200).json(sujets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getOneSujetByClasse = async (req, res) => {
    try {
        const { idclasse, id } = req.params;
        const sujet = await SujetModel.getOneByClasse(idclasse, id);
        if (!sujet) return res.status(404).json({ message: "Sujet non trouvé pour cette classe" });
        res.status(200).json(sujet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const createSujetForClasse = async (req, res) => {
    try {
        const { nom, urlsujet, date_soumission } = req.body;
        const newSujet = await SujetModel.createForClasse(req.params.idclasse, {
            nom,
            urlsujet,
            date_soumission
        });
        res.status(201).json(newSujet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const deleteSujetsByClasse = async (req, res) => {
    try {
        const message = await SujetModel.deleteByClasse(req.params.idclasse);
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
