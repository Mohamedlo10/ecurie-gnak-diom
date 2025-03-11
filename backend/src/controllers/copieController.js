import axios from 'axios';
import pdf from 'pdf-parse';
import sql from '../config/db.js';

// Soumettre une copie
export const submitCopie = async (req, res) => {
  const { idsujet, idetudiant, urlCopie } = req.body;

  try { 
    // Extraire le texte du PDF
    const response = await axios.get(urlCopie, { responseType: 'arraybuffer' });
    const data = await pdf(response.data);
    const texte = data.text;

    // Insérer la copie dans la base de données
    const result = await sql`
      INSERT INTO copie (texte, id sujet, idetudiant, urlcopie)
      VALUES (${texte}, ${idsujet}, ${idetudiant}, ${urlCopie})
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la soumission de la copie' });
  }
};

// Mettre à jour une copie par son ID
export const updateCopie = async (req, res) => {
  const { id } = req.params;
  const { texte, idsujet, idetudiant, urlCopie } = req.body;

  try {
    // Vérifier si la copie existe
    const result = await sql`
      SELECT * FROM copie WHERE id = ${id}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Copie non trouvée' });
    }

    // Mettre à jour la copie dans la base de données
    const updatedResult = await sql`
      UPDATE copie
      SET texte = ${texte}, idsujet = ${idsujet}, idetudiant = ${idetudiant}, urlcopie = ${urlCopie}
      WHERE id = ${id}
      RETURNING *
    `;

    res.status(200).json(updatedResult[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la copie' });
  }
};


// Récupérer une copie par son ID
export const getCopieById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql`
      SELECT * FROM copie WHERE id = ${id}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Copie non trouvée' });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération de la copie' });
  }
};

// Récupérer toutes les copies d'un sujet par son ID
export const getAllCopieByIdSujet = async (req, res) => {
  const { idsujet } = req.params;

  try {
    const result = await sql`
      SELECT * FROM copie WHERE idsujet = ${idsujet}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Aucune copie trouvée pour ce sujet' });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des copies' });
  }
};


// Récupérer les copies d'un étudiant pour un sujet donné
export const getCopieByEtudiantAndSujet = async (req, res) => {
  const { idetudiant, idsujet } = req.params;

  try {
    const result = await sql`
      SELECT * FROM copie WHERE idetudiant = ${idetudiant} AND idsujet = ${idsujet}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Aucune copie trouvée pour cet étudiant sur ce sujet' });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des copies de l\'étudiant pour ce sujet' });
  }
};

// Récupérer toutes les copies d'un étudiant par son ID
export const getAllCopiesByIdEtudiant = async (req, res) => {
  const { idetudiant } = req.params;

  try {
    const result = await sql`
      SELECT * FROM copie WHERE idetudiant = ${idetudiant}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Aucune copie trouvée pour cet étudiant' });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des copies de l\'étudiant' });
  }
};


// Corriger une copie automatiquement avec l'IA
export const evaluateCopie = async (req, res) => {
  const { idCopie } = req.body;

  try {
    // Récupérer le texte de la copie et du corrigé
    const copieResult = await sql`
      SELECT texte, idsujet FROM copie WHERE id = ${idCopie}
    `;

    if (copieResult.length === 0) {
      return res.status(404).json({ error: 'Copie non trouvée' });
    }

    const copieText = copieResult[0].texte;
    const idsujet = copieResult[0].idsujet;

    const correctionResult = await sql`
      SELECT texte FROM correction WHERE idsujet = ${idsujet}
    `;

    if (correctionResult.length === 0) {
      return res.status(404).json({ error: 'Correction non trouvée pour ce sujet' });
    }

    const correctionText = correctionResult[0].texte;

    // Envoyer à l'IA pour évaluation
    const evaluation = await axios.post('http://localhost:11434/api/generate', {
      model: 'deepseek',
      prompt: `Évalue la copie suivante par rapport au corrigé type :\n\nCorrigé : ${correctionText}\n\nCopie : ${copieText}`,
    });


    
    // Mettre à jour la copie avec la note et le commentaire
    const noteIa = parseFloat(evaluation.data.note);
    const commentaire = evaluation.data.commentaire;

    await sql`
      UPDATE copie
      SET noteia = ${noteIa}, commentaire = ${commentaire}
      WHERE id = ${idCopie}
    `;

    res.status(200).json({ message: 'Copie évaluée avec succès', noteIa, commentaire });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'évaluation de la copie' });
  }
};




// Supprimer une copie par son ID
export const deleteCopie = async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier si la copie existe
    const result = await sql`
      SELECT * FROM copie WHERE id = ${id}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Copie non trouvée' });
    }

    // Supprimer la copie de la base de données
    await sql`
      DELETE FROM copie WHERE id = ${id}
    `;

    res.status(200).json({ message: 'Copie supprimée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression de la copie' });
  }
};
