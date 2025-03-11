import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as utilisateurModel from '../models/utilisateurModel.js';
import * as etudiantModel from '../models/etudiantModel.js';
import * as professeurModel from '../models/professeurModel.js';

// Inscription d'un utilisateur
export const registerUtilisateur = async (req, res) => {
    try {
        const { nom, prenom, email, motdepasse, role, ine } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await utilisateurModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(motdepasse, salt);

        // Créer l'utilisateur
        const newUser = await utilisateurModel.createUser(nom, prenom, email, hashedPassword);

        // En fonction du rôle, insérer dans `etudiant` ou `professeur`
        if (role === 'etudiant') {
            await etudiantModel.createEtudiant(newUser.idutilisateur);
        } else if (role === 'professeur') {
            await professeurModel.createProfesseur(newUser.idutilisateur);
        }

        res.status(201).json({ message: 'Utilisateur créé avec succès', utilisateur: newUser, role });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Connexion d'un utilisateur
export const loginUtilisateur = async (req, res) => {
    try {
        const { email, motdepasse } = req.body;

        // Vérifier si l'utilisateur existe
        const utilisateur = await utilisateurModel.findUserByEmail(email);
        if (!utilisateur) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(motdepasse, utilisateur.motdepasse);
        if (!isMatch) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }

        // Vérifier si c'est un étudiant ou un professeur
        const isEtudiant = await etudiantModel.isEtudiant(utilisateur.idutilisateur);
        const isProfesseur = await professeurModel.isProfesseur(utilisateur.idutilisateur);

        let role = '';
        let redirectURL = '';
        if (isEtudiant) {
            role = 'etudiant';
            redirectURL = '/dashboard/etudiant';
        } else if (isProfesseur) {
            role = 'professeur';
            redirectURL = '/dashboard/professeur';
        }

        // Créer un token JWT
        const token = jwt.sign(
            { id: utilisateur.idutilisateur, role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Connexion réussie',
            token,
            utilisateur: {
                id: utilisateur.idutilisateur,
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                email: utilisateur.email,
                role
            },
            redirectURL
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
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



