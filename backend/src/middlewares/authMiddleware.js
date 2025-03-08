import jwt from 'jsonwebtoken';
import sql from '../config/db.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Vérifier si le token existe dans les headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Non autorisé, token manquant' });
    }
    
    // Vérifier le token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Récupérer l'utilisateur sans le mot de passe
      const users = await sql`
        SELECT id, nom, prenom, email, role, "INE"
        FROM utilisateur
        WHERE id = ${decoded.id}
      `;
      
      if (users.length === 0) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }
      
      req.user = users[0];
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Accès refusé: le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource`
      });
    }
    next();
  };
};