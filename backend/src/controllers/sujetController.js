import axios from 'axios';
import sql from '../config/db.js';

// Créer un sujet
export const createSujet = async (req, res) => {
  const { nom, idCours, urlSujet } = req.body;

  try {
    // Extraire le texte du PDF
    const response = await axios.get(urlSujet, { responseType: 'arraybuffer' });

    // Insérer le sujet dans la base de données
    const result = await sql`
      INSERT INTO sujet (nom, "idCours", urlsujet)
      VALUES (${nom}, ${idCours}, ${urlSujet})
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création du sujet' });
  }
};

// Récupérer un sujet par son ID
export const getSujetById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql`
      SELECT * FROM sujet WHERE id = ${id}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Sujet non trouvé' });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération du sujet' });
  }
};

// Lister tous les sujets
export const getAllSujets = async (req, res) => {
  try {
    const result = await sql`
      SELECT * FROM sujet
    `;
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des sujets' });
  }
}; 