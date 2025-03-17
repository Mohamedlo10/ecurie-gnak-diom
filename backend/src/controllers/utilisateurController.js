import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as etudiantModel from '../models/etudiantModel.js';
import * as professeurModel from '../models/professeurModel.js';
import * as utilisateurModel from '../models/utilisateurModel.js';

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
            await etudiantModel.createEtudiant(newUser.idutilisateur, ine);
        } else if (role === 'professeur') {
            await professeurModel.createProfesseur(newUser.idutilisateur);
        }
        newUser.role = role;
        res.status(201).json({ message: 'Utilisateur créé avec succès', utilisateur: newUser, role });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUtilisateur = async (req, res) => {
    try {
        const { email, motdepasse } = req.body;

        // Vérifier si l'utilisateur existe
        const utilisateur = await utilisateurModel.findUserByEmail(email);
        if (!utilisateur) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }
        console.log("Mot de passe fourni :", motdepasse);
        console.log("Mot de passe stocké (hashé) :", utilisateur.motdepasse);

        // Vérifier le mot de passe avec bcrypt (SANS REHASHER)
        const isMatch = await bcrypt.compare( motdepasse, utilisateur.motdepasse);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        // Vérifier si c'est un étudiant ou un professeur
        const isEtudiant = await etudiantModel.isEtudiant(utilisateur.idutilisateur);
        const isProfesseur = await professeurModel.isProfesseur(utilisateur.idutilisateur);
        console.log(isEtudiant ,isProfesseur);

        let role = "";
        let redirectURL = "";
        if (isEtudiant) {
            role = 'etudiant';
            redirectURL = '/dashboard/etudiant';
        } else if (isProfesseur) {
            role = "professeur";
            redirectURL = "/dashboard/professeur";
        }

        // Créer un token JWT
        const token = jwt.sign(
            { id: utilisateur.idutilisateur, role },
            'process.env.JWT_SECRET',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Connexion réussie',
            token,
            utilisateur: {
                idutilisateur: utilisateur.idutilisateur,
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                email: utilisateur.email,
                created_at: utilisateur.created_at,
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
        const utilisateurs = await utilisateurModel.getAllUtilisateurs();
        res.status(200).json(utilisateurs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUtilisateurById = async (req, res) => {
    try {
        const utilisateur = await utilisateurModel.findUserById(req.params.id);
        if (!utilisateur) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.status(200).json(utilisateur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUtilisateur = async (req, res) => {
    try {
        const { idutilisateur, nom, prenom, email, password } = req.body;
        // console.log(req.body);
        const updatedUtilisateur = await utilisateurModel.updateUtilisateur(idutilisateur, nom, prenom, email, password);
        res.status(200).json(updatedUtilisateur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUtilisateur = async (req, res) => {
    try {
        const result = await utilisateurModel.deleteUtilisateur(req.params.id);
        res.status(200).json({ message: "Utilisateur supprimé avec succès", data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



