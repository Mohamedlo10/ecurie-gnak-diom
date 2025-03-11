import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sql from '../config/db.js';

import UtilisateurModel from "../models/utilisateurModel.js";

export const createUtilisateur = async (req, res) => {
    try {
        const { nom, prenom, email, motdepasse } = req.body;
        const utilisateur = await UtilisateurModel.createUtilisateur({ nom, prenom, email, motdepasse });
        res.status(201).json({ message: "Utilisateur ajouté avec succès", data: utilisateur });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllUtilisateurs = async (req, res) => {
    try {
        const utilisateurs = await UtilisateurModel.getAllUtilisateurs();
        res.status(200).json(utilisateurs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUtilisateurById = async (req, res) => {
    try {
        const utilisateur = await UtilisateurModel.getUtilisateurById(req.params.id);
        if (!utilisateur) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.status(200).json(utilisateur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUtilisateur = async (req, res) => {
    try {
        const updatedUtilisateur = await UtilisateurModel.updateUtilisateur(req.params.id, req.body);
        res.status(200).json(updatedUtilisateur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUtilisateur = async (req, res) => {
    try {
        const result = await UtilisateurModel.deleteUtilisateur(req.params.id);
        res.status(200).json({ message: "Utilisateur supprimé avec succès", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUtilisateur = async (req, res) => {
  try {
      const {email, motdepasse } = req.body;
      const utilisateur = await UtilisateurModel.loginUtilisateur({email, motdepasse });
      
      const token = jwt.sign(
        { id: utilisateur.id, role: utilisateur.role },
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }  
    );
    res.status(200).json({
        message: "Utilisateur connecté avec succès",
        token,
        utilisateur
    });
} catch (error) {
    res.status(400).json({ error: error.message });
}
};

