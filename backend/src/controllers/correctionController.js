import axios from 'axios';
import sql from '../config/db.js';


// Générer une correction pour un sujet
export const generateCorrection = async (req, res) => {
  const { idsujet } = req.body;

  try {
    // Récupérer l'URL du sujet
    const sujetResult = await sql`
      SELECT urlsujet FROM sujet WHERE idsujet = ${idsujet}
    `;

    if (sujetResult.length === 0) {
      return res.status(404).json({ error: 'Sujet non trouvé' });
    }

    const sujetUrl = sujetResult[0].urlsujet;

    // Télécharger le PDF du sujet
    const response = await axios.get(sujetUrl, { responseType: 'arraybuffer' });
    const pdfBuffer = response.data;

    // Extraire le texte du PDF
    const data = await pdfBuffer;

    // Envoyer le texte à l'API OpenRouter pour générer un corrigé
    const openRouterResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-r1-zero:free', // Modèle DeepSeek via OpenRouter
        messages: [
          {
            role: 'user',
            content: `Génère un corrigé type pour le sujet suivant : ${data}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer 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`, // Clé API OpenRouter
          'HTTP-Referer': 'https://votresite.com', // Optionnel : URL de votre site
          'X-Title': 'Votre Site', // Optionnel : Nom de votre site
          'Content-Type': 'application/json',
        },
      }
    );

    // Extraire le texte de la réponse de l'API OpenRouter
    const correctionText = openRouterResponse.data.choices[0].message.content;
    console.log(correctionText)
/* 
    // Créer un PDF à partir du texte de correction
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    page.drawText(correctionText, {
      x: 50, 
      y: height - 50,
      size: 12,
    });

    const pdfBytes = await pdfDoc.save();

    // Uploader le PDF dans le bucket Supabase
    const fileName = `correction_${idsujet}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('correction') // Nom du bucket
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
      });

    if (uploadError) {
      throw new Error(`Erreur lors de l'upload du PDF : ${uploadError.message}`);
    }

    // Récupérer l'URL du fichier PDF
    const { data: urlData } = supabase.storage
      .from('correction')
      .getPublicUrl(fileName);

    const pdfUrl = urlData.publicUrl;

    // Enregistrer l'URL du PDF dans la table correction
    const result = await sql`
      INSERT INTO correction (idsujet, urlcorrection)
      VALUES (${idsujet}, ${pdfUrl})
      RETURNING *
    `;
 */
    res.status(201).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la génération de la correction' });
  }
};




// Récupérer une correction par son ID
export const getCorrectionById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql`
      SELECT * FROM correction WHERE id = ${id}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Correction non trouvée' });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération de la correction' });
  }
};