import EtudiantModel from "../models/etudiantModel.js";

export const createEtudiant = async (req, res) => {
    try {
        const { idutilisateur, line } = req.body;
        const etudiant = await EtudiantModel.createEtudiant({ idutilisateur, line });
        res.status(201).json({ message: "Etudiant ajouté avec succès", data: etudiant });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllEtudiants = async (req, res) => {
    try {
        const etudiants = await EtudiantModel.getAllEtudiants();
        res.status(200).json(etudiants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEtudiantById = async (req, res) => {
    try {
        const etudiant = await EtudiantModel.getEtudiantById(req.params.id);
        if (!etudiant) return res.status(404).json({ message: "Etudiant non trouvé" });
        res.status(200).json(etudiant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteEtudiant = async (req, res) => {
    try {
        const result = await EtudiantModel.deleteEtudiant(req.params.id);
        res.status(200).json({ message: "Etudiant supprimé avec succès", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
