import * as correctionModel from '../models/correctionModel.js';
import * as sujetModel from '../models/sujetModel.js'; // Permet de récupérer l'URL du sujet
import supabase from "../config/supabase.js";
import pdf from 'pdf-parse';
import PDFDocument from 'pdfkit';
import axios from 'axios';
import fs from 'fs';

const pdfParse = pdf.default ? pdf.default : pdf;
export const generateCorrection = async (req, res) => {
  const { idSujet } = req.params;

  try {
    const sujet = await sujetModel.getSujetById(idSujet);
    if (!sujet || !sujet.urlsujet) {
      return res.status(404).json({ error: "Sujet introuvable" });
    }
    
    const sujetUrl = sujet.urlsujet; 
    // pdfBuffer = null;
    const response = await axios.get(sujetUrl, { responseType: "arraybuffer" });  
    
    console.log(response);
    let extractedText = " ";
    let pdfBuffer = Buffer.from(response.data);
    let reussite = false;
    let essai = 0;
    const maxEssai = 5; 

    while (!reussite && essai < maxEssai) {
      try {
        essai += 1;
        const pdfData = await pdfParse(pdfBuffer);
        extractedText = pdfData.text;
        console.log("✅ Texte extrait du PDF :", extractedText);
        reussite = true;

      } catch (error) {
        console.error(`❌ Erreur d'extraction du texte (Essai ${essai}) :`, error.message);
        
        if (essai >= maxEssai) {
          console.error("Nombre maximum d'essais atteint.");
          return res.status(500).json({ error: "Impossible de lire le fichier PDF après plusieurs tentatives." });
        }

        // Optionnel : attendre un peu avant de réessayer (par ex. 1s)
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Nettoyage après extraction réussie
    pdfBuffer.fill(0);
    pdfBuffer = null;

    const prompt = `
    
      You are an expert teacher , responsible for creating concise answer key for the following exam:
      ${extractedText}
      Instructions:
      - Language of the Answer Key: Write the answer key in the same language as the exam text provided above.
      - Structure of the Answer Key : Present the answers clearly and systematically, following the order of the questions. Use headings and subheadings for each section, and incorporate bullet points or numbered lists where appropriate.
      - Content of Answers: Provide comprehensive and precise answers, If a question has multiple parts, ensure each is addressed separately.
      - Clarity and Conciseness : Be clear and concise in your explanations, avoiding unnecessary repetition and digressions.
      - Adherence to Instructions : Do not repeat the questions or include unsolicited information. Refrain from applying any special formatting styles (e.g., bold, italics, colors).
      - Language and Tone : Use academic language suitable for [students' education level], maintaining a formal and professional tone.
    `;

    const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
      model: process.env.MODELE_IA,
      prompt: prompt,
      stream: false
    });

    const correctionText = ollamaResponse.data.response.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    // const correctionText = 'bonjour je marche';

    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);


      const fileName = `correction-${idSujet}.pdf`;
      const { data, error } = await supabase
        .storage
        .from('corrections')
        .upload(fileName, pdfBuffer, { contentType: 'application/pdf' });

      if (!data || error) {
          console.error(" Erreur d'upload sur Supabase :", error?.message);
          return res.status(500).json({ error: "Erreur lors de l'upload sur Supabas e" });
      }
      const fileUrl = supabase.storage.from('corrections').getPublicUrl(fileName).data.publicUrl;
      const correction = await correctionModel.createCorrection(idSujet, fileUrl);

      res.status(201).json({ message: "nice guynss", data: correction });
    });
    //niokhh le texte
    doc.fontSize(12).text(correctionText, { align: 'justify' });
    doc.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCorrectionByIdSujet = async (req, res) => {
  const { idSujet } = req.params;

  try {
    const correction = await correctionModel.getCorrectionByIdSujet(idSujet);
    if (!correction) {
      return res.status(404).json({ error: "Aucun corrigé trouvé pour ce sujet." });
    }
    res.status(200).json(correction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getCorrectionById = async (req, res) => {
  const { idCorrection } = req.params;

  try {
    const correction = await correctionModel.getCorrectionById(idCorrection);
    if (!correction) {
      return res.status(404).json({ error: "Aucun corrigé trouvé pour ce sujet." });
    }
    res.status(200).json(correction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const modifierCorrection = async (req, res) => {
  try {
    const { idCorrection } = req.params; 
    const file = req.file; 
    let correction = await correctionModel.getCorrectionById(idCorrection);
    let fileUrl = correction.urlcorrection; 

    if (file) {
      const newFileName = `${idCorrection}.pdf`; 
      if (fileUrl && fileUrl.trim() !== "") {
        const oldFileName = fileUrl.split('/').pop(); 
        const { error: removeError } = await supabase.storage
          .from('corrections')
          .remove([oldFileName]);

        if (removeError) {
          console.error("Erreur suppression fichier existant :", removeError);
          throw removeError; 
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('corrections')
        .upload(newFileName, file.buffer, { contentType: file.mimetype });

      if (uploadError) {
        console.error("Erreur upload fichier :", uploadError);
        throw uploadError;
      }
      fileUrl = supabase.storage.from('corrections').getPublicUrl(newFileName).data.publicUrl;
    }
    correction = await correctionModel.updateCorrection(idCorrection, fileUrl);
    res.status(200).json(correction);
  } catch (error) {
    console.error("Erreur mise à jour correction :", error);
    res.status(500).json({ error: error.message });
  }
};



export const supprimerCorrection = async (req, res) => {
  const { idCorrection } = req.params;

  try {
    const correction = await correctionModel.getCorrectionById(idCorrection);
    if (!correction) {
      return res.status(404).json({ error: "Corrigé introuvable." });
    }
    const { error } = await supabase.storage
      .from('corrections')
      .remove([correction.urlcorrection]);

    if (error) throw error;

    await correctionModel.supprimerCorrection(idCorrection);
    res.status(200).json({ message: "Corrigé supprimé avec succès" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const corrigerCopie = async (idcopie, urlcopie, idsujet) => {
  try {
    // Récupération du corrigé type pour ce sujet
    const correction = await correctionModel.getCorrectionByIdSujet(idsujet);
    if (!correction || !correction.urlcorrection) {
      throw new Error("Corrigé type non trouvé pour ce sujet.");
    }

    // Télécharger et extraire le texte de la copie
    let copieText = "";
    try {
      const copieResponse = await axios.get(urlcopie, { responseType: "arraybuffer" });
      const pdfData = await pdfParse(Buffer.from(copieResponse.data));
      copieText = pdfData.text;
      console.log(copieText);
    } catch (err) {
      throw new Error("Impossible d'extraire le texte de la copie: " + err.message);
    }

    // Télécharger et extraire le texte du corrigé
    let correctionText = "";
    try {
      const correctionResponse = await axios.get(correction.urlcorrection, { responseType: "arraybuffer" });
      const pdfDataCorrection = await pdfParse(Buffer.from(correctionResponse.data));
      correctionText = pdfDataCorrection.text;
      console.log(correctionText);
    } catch (err) {
      throw new Error("Impossible d'extraire le texte du corrigé type: " + err.message);
    }

    // Construire le prompt pour Ollama / process.env.MODELE_IA
    const prompt = `
      Vous êtes un professeur expérimenté chargé d'évaluer une copie d'examen en comparant la réponse de l'étudiant avec le corrigé type.
      Corrigé type:
      ${correctionText}

      Copie de l'étudiant:
      ${copieText}

      Instructions:
      - Analysez la copie en la comparant au corrigé type.
      - Attribuez une note sur 20 en tenant compte de la qualité, de la précision et de la complétude des réponses.
      - Fournissez un commentaire détaillé indiquant les points forts et les axes d'amélioration.
      Répondez uniquement sous forme de JSON avec le format suivant:
      {"note": <note_sur_20>, "commentaire": "<votre commentaire>"}
    `;

    // Appel à Ollama
    const ollamaResponse = await axios.post("http://localhost:11434/api/generate", {
      model: process.env.MODELE_IA,
      prompt: prompt,
      stream: false
    });

    // Nettoyage et parsing de la réponse
    let aiResponse = ollamaResponse.data.response.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    let evaluation;
    try {
      evaluation = JSON.parse(aiResponse);
    } catch (err) {
      throw new Error("La réponse de l'IA n'est pas au format JSON attendu: " + err.message);
    }

    // Vérifier qu'on a bien une note et un commentaire
    if (typeof evaluation.note === "undefined" || typeof evaluation.commentaire === "undefined") {
      throw new Error("La réponse de l'IA ne contient pas note ou commentaire.");
    }

    // Mise à jour de la copie en base (note + commentaire)
    // Assure-toi d'avoir une fonction dans copieModel (par ex. updateNoteCopie)
    const finalCopie = await copieModel.updateNoteCopie(idcopie, evaluation.note, evaluation.commentaire);

    // On peut retourner l'objet final, ou juste la note/commentaire
    return {
      note: evaluation.note,
      commentaire: evaluation.commentaire,
      copie: finalCopie
    };

  } catch (error) {
    // On relance l'erreur pour qu'elle soit gérée par l'appelant
    throw error;
  }
};

// 2) Fonction addCopie, qui appelle corrigerCopie à la fin
export const addCopie = async (req, res) => {
  try {
    const { idutilisateur, idsujet } = req.body;
    console.log("Reçu:", idutilisateur, idsujet);

    // Vérifier la présence du fichier
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Fichier manquant !" });
    }

    // Création de la copie en base
    // (placeholder "à ngeinteih plutard" pour coller à ton code)
    const copie = await copieModel.addCopie(idutilisateur, idsujet, "à ngeinteih plutard");
    const fileName = `${copie.idcopie}.pdf`;

    // Upload dans le bucket "copies"
    const { error } = await supabase.storage
      .from("copies")
      .upload(fileName, file.buffer, { contentType: file.mimetype });
    if (error) throw error;

    // Récupérer l'URL publique
    const fileUrl = supabase.storage.from("copies").getPublicUrl(fileName).data.publicUrl;
    const updatedCopie = await copieModel.updateCopie(copie.idcopie, fileUrl);

    // Appeler la fonction de correction (on lui passe l'idcopie, l'url et le sujet)
    let resultCorrection;
    try {
      resultCorrection = await corrigerCopie(updatedCopie.idcopie, updatedCopie.urlcopie, idsujet);
    } catch (err) {
      // S'il y a un souci lors de la correction, on peut renvoyer la copie créée
      // mais indiquer l'erreur de correction
      return res.status(500).json({
        message: "Copie créée, mais erreur lors de la correction.",
        copie: updatedCopie,
        error: err.message
      });
    }

    // Si tout s'est bien passé, on renvoie la copie finale avec la note/commentaire
    return res.status(201).json({
      message: "Copie créée et corrigée avec succès.",
      note: resultCorrection.note,
      commentaire: resultCorrection.commentaire,
      data: resultCorrection.copie
    });

  } catch (error) {
    console.error("Erreur création + correction copie :", error);
    return res.status(500).json({ error: error.message });
  }
};