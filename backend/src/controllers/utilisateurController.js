import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sql from '../config/db.js';

// Récupérer tous les utilisateurs
export const getAllUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await sql`
      SELECT id, nom, prenom, email, role, created_at, "INE"
      FROM utilisateur
    `;
    res.status(200).json(utilisateurs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un utilisateur par ID
export const getUtilisateurById = async (req, res) => {
  try {
    const { id } = req.params;
    const utilisateur = await sql`
      SELECT id, nom, prenom, email, role, created_at, "INE"
      FROM utilisateur
      WHERE id = ${id}
    `;
    
    if (utilisateur.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.status(200).json(utilisateur[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer un nouvel utilisateur
export const createUtilisateur = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, role, INE } = req.body;
    
    // Vérifier si l'email existe déjà
    const existingUser = await sql`
      SELECT id FROM utilisateur WHERE email = ${email}
    `;
    
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);
    
    // Insérer l'utilisateur
    const newUser = await sql`
      INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role, "INE")
      VALUES (${nom}, ${prenom}, ${email}, ${hashedPassword}, ${role}, ${INE})
      RETURNING id, nom, prenom, email, role, created_at, "INE"
    `;
    
    res.status(201).json(newUser[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un utilisateur
export const updateUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, role, INE } = req.body;
    
    // Vérifier si l'utilisateur existe
    const existingUser = await sql`
      SELECT id FROM utilisateur WHERE id = ${id}
    `;
    
    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Mettre à jour l'utilisateur
    const updatedUser = await sql`
      UPDATE utilisateur
      SET 
        nom = COALESCE(${nom}, nom),
        prenom = COALESCE(${prenom}, prenom),
        email = COALESCE(${email}, email),
        role = COALESCE(${role}, role),
        "INE" = COALESCE(${INE}, "INE"),
        updated_dat = NOW()
      WHERE id = ${id}
      RETURNING id, nom, prenom, email, role, "INE", created_at, updated_dat
    `;
    
    res.status(200).json(updatedUser[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un utilisateur
export const deleteUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedUser = await sql`
      DELETE FROM utilisateur
      WHERE id = ${id}
      RETURNING id
    `;
    
    if (deletedUser.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Connexion d'un utilisateur
export const loginUtilisateur = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    
    // Vérifier si l'utilisateur existe
    const utilisateurs = await sql`
      SELECT id, nom, prenom, email, mot_de_passe, role, "INE"
      FROM utilisateur
      WHERE email = ${email}
    `;
    
    if (utilisateurs.length === 0) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }
    
    const utilisateur = utilisateurs[0];
    
    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }
    
    // Créer un token JWT
    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role },
        process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Ne pas renvoyer le mot de passe dans la réponse
    delete utilisateur.mot_de_passe;
    
    res.status(200).json({
      token,
      utilisateur
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};