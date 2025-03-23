import jwt from 'jsonwebtoken';
import sql from '../config/db.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
  
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Non autorisé, token manquant' });
    }
    
    // Vérifier le token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  // fii woroul dara apres ma deff ko ci ci .env

      // Vérifier si l'utilisateur existe dans la base de données
      const { data: users, error } = await supabase
        .from("utilisateur")
        .select("id, nom, prenom, email, role, INE")
        .eq("id", decoded.id)
        .single();
      
      if (error || !users) {
        return res.status(401).json({ message: 'Utilisateur non trouvé ou token invalide' });
      }
      
      // Attacher l'utilisateur dans req.user
      req.user = users;
      next();  // Passe à la prochaine étape du middleware ou de la route
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