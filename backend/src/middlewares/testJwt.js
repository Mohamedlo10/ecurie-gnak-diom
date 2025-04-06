import express from 'express';
import jwt from 'jsonwebtoken';
import { protect, authorize } from './authMiddleware.js';  // Assure-toi que le chemin est correct pour tes middlewares
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
app.use(express.json());  // Pour analyser les requêtes JSON

// Utilisateur simulé pour le test
const utilisateur = {
    id: 1,
    nom: 'John',
    prenom: 'Doe',
    email: 'john.doe@example.com',
    mot_de_passe: 'password', // 'password' crypté
    role: 'admin',
    INE: '123456789'
  };

// export const authorize = (...roles) => {
//     return (req, res, next) => {
//       if (!roles.includes(req.user.role)) {
//         return res.status(403).json({ 
//           message: `Accès refusé: le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource`
//         });
//       }
//       next();  // Si le rôle est autorisé, on passe à la route suivante
//     };
//   };
  
  // Route de connexion pour obtenir un token JWT
  app.post('/login', (req, res) => {
    const { email, motdepasse } = req.body;
  
    // Vérifie si l'utilisateur est valide (ici, c'est une simulation)
    if (email === utilisateur.email &&utilisateur.mot_de_passe) {
      const token = jwt.sign(
        { id: utilisateur.id, role: utilisateur.role },
        process.env.SECRET_JWT,  // Le secret est directement défini ici
        { expiresIn: '1d' }
      );
      
      res.status(200).json({
        token,
        utilisateur: { id: utilisateur.id, nom: utilisateur.nom, prenom: utilisateur.prenom, email: utilisateur.email, role: utilisateur.role }
      });
    } else {
      res.status(400).json({ message: 'Identifiants invalides' });
    }
  });
  
  // Route protégée accessible uniquement pour les utilisateurs authentifiés
  app.get('/protected', protect, (req, res) => {
    res.status(200).json({ message: 'Accès autorisé à la route protégée', user: req.user });
  });
  
  // Route protégée, accessible uniquement pour un rôle "admin"
  app.get('/admin', protect, authorize('admin'), (req, res) => {
    res.status(200).json({ message: 'Accès autorisé à la route admin', user: req.user });
  });
  
  // Démarrer le serveur
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });