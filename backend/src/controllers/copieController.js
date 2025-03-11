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