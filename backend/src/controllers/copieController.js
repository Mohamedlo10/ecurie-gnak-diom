import axios from "axios";
import pdfParse from 'pdf-parse';
import supabase from "../config/supabase.js";
import * as copieModel from "../models/copieModel.js";
import * as correctionModel from "../models/correctionModel.js";
import correctionQueue from '../services/fileCorrection.js';
import * as notifController  from "./notifController.js";


export const addCopie = async (req, res) => {
  try {
    const { idutilisateur, idsujet } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Fichier manquant !" });
    }
    console.log(idutilisateur, idsujet);
    const copie = await copieModel.addCopie(idutilisateur, idsujet, 'à ngeinteih plutard');
    const fileName = `${copie.idcopie}`;
    console.log(fileName);

    const { error } = await supabase.storage.from('copies').upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) throw error;

    const fileUrl = supabase.storage.from('copies').getPublicUrl(fileName).data.publicUrl;
    console.log(copie.idcopie, fileUrl);
    const updatedCopie = await copieModel.updateCopie(copie.idcopie, fileUrl);
    console.log(updatedCopie.idcopie, updatedCopie.urlcopie, idsujet);
    correctionQueue.add(() => corrigerCopie(updatedCopie.idcopie, updatedCopie.urlcopie, idsujet))
      .then(resultCorrection => {
        console.log("✅ Correction terminée pour la copie : ", updatedCopie.idcopie);
      })
      .catch(err => {
        console.error("❌ Erreur lors de la correction de la copie : ", updatedCopie.idcopie, err);
      });

    return res.status(201).json({
      message: "Copie créée et correction en cours.",
      data: updatedCopie
    });

  } catch (error) {
    console.error("Erreur création copie :", error);
    return res.status(500).json({ error: error.message });
  }
};




export const corrigerCopie = async (idcopie, urlcopie, idsujet) => {
  try {
    const correction = await correctionModel.getCorrectionByIdSujet(idsujet);
    if (!correction || !correction.urlcorrection) {
      throw new Error("Corrigé type non trouvé pour ce sujet.");
    }
    let copieText = "";
    while (true) {
      try {
        const copieResponse = await axios.get(urlcopie, { responseType: "arraybuffer" });
        const pdfData = await pdfParse(Buffer.from(copieResponse.data));
        copieText = pdfData.text;
        // console.log(copieText);
        break; 
      } catch (err) {
        console.error("Impossible d'extraire le texte de la copie: " + err.message);
        // Attendre 1 seconde avant de réessayer
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Extraction du corrigé
    let correctionText = "";
    while (true) {
      try {
        const correctionResponse = await axios.get(correction.urlcorrection, { responseType: "arraybuffer" });
        const pdfDataCorrection = await pdfParse(Buffer.from(correctionResponse.data));
        correctionText = pdfDataCorrection.text;
        // console.log(correctionText);
        break; // Extraction réussie, on sort de la boucle
      } catch (err) {
        console.error("Impossible d'extraire le texte du corrigé: " + err.message);
        // Attendre 1 seconde avant de réessayer
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const prompt = `
    You are an experienced exam evaluator. You are provided with two texts: a "Model Answer" and a "Student Submission". Your task is to carefully compare the Student Submission with the Model Answer and evaluate its overall quality based on the following criteria:
    - Accuracy: How correct are the answers compared to the model answer?
    - Completeness: Does the submission address all parts of the exam question?
    - Clarity and Organization: Is the response well-structured and easy to follow?
    - Depth and Reasoning: Does the submission demonstrate thorough understanding with clear reasoning?
    Based on your analysis, assign a grade between 0 and 20 and provide a detailed evaluation comment that highlights strengths, points out weaknesses, and offers specific suggestions for improvement.
    IMPORTANT:
    - Your response MUST be a single, valid JSON object.
    - DO NEVER NEVER NEVER include any extra text,  markdown formatting, triple backticks(\`\`\`), or any other characters outside the JSON.
    - The JSON object MUST contain EXACTLY two keys: "noteia" (a number between 0 and 20) and "commentaire" (a string). Use "comment" (not "commentaire").
    - Your entire output must consist ONLY of the JSON object, starting with { and ending with }.
    -just do somethinks like this nothing else:(DONT WRITE 'JSON' )
    {
      "noteia":<0..20> ,
      "commentaire": " "
    }
    Not adding any style in all file.
    




    Student Submission:
    ${copieText}





    Model Answer:
    ${correctionText}
    




  `;
  console.log(prompt);

    


  let evaluation;
  while (true) {
    try {
      const ollamaResponse = await axios.post(
        "http://localhost:11434/api/generate",
        {
          model: process.env.MODELE_IA,
          prompt: prompt,
          stream: false
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );

      let aiResponse = ollamaResponse.data.response
        .replace(/<think>[\s\S]*?<\/think>/gi, "") // Supprime le contenu entre <think> et </think>
        .replace(/```/g, "")                        // Supprime uniquement les marqueurs ```
        .trim();

      console.log(aiResponse);

      evaluation = JSON.parse(aiResponse);
      break; // La réponse est au format JSON, on sort de la boucle
    } catch (err) {
      console.error("La réponse de l'IA n'est pas au format JSON attendu: " + err.message);
      // Optionnel : attendre 1 seconde avant de réessayer
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const finalCopie = await copieModel.updateNoteCopie(idcopie, evaluation.noteia, evaluation.commentaire);

  
  return {
    copie: finalCopie
  };

  } catch (error) {
    throw error;
  }
};




export const getAllCopieByIdSujet = async (req, res) => {
  try {
    const copies = await copieModel.getAllCopieByIdSujet(req.params.idsujet);
    res.status(200).json(copies);
  } catch (error) {
    console.error("Erreur récupération copies :", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllCopieByIdUser = async (req, res) => {
  try {
    const copies = await copieModel.getAllCopieByIdUser(req.params.idutilisateur);
    res.status(200).json(copies);
  } catch (error) {
    console.error("Erreur récupération copies :", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCopieByIdSujetAndUser = async (req, res) => {
  try {
    const { idsujet, idutilisateur } = req.params;
    const copie = await copieModel.getCopieByIdSujetAndUser(idsujet, idutilisateur);
    res.status(200).json(copie);
  } catch (error) {
    console.error("Erreur récupération copie :", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateCopie = async (req, res) => {
  try {
    const { idcopie } = req.params;
    const file = req.file;

    let copie = await copieModel.getCopieById(idcopie);
    let fileUrl = copie.urlcopie;

    if (file) {
      const newFileName = `${idcopie}.pdf`;

      if (fileUrl && fileUrl.trim() !== "") {
        const oldFileName = fileUrl.split('/').pop();
        const { error: removeError } = await supabase.storage
          .from('copies')
          .remove([oldFileName]);

        if (removeError) {
          console.error("Erreur suppression fichier existant :", removeError);
          throw removeError;
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('copies')
        .upload(newFileName, file.buffer, { contentType: file.mimetype });

      if (uploadError) {
        console.error("Erreur upload fichier :", uploadError);
        throw uploadError;
      }

      fileUrl = supabase.storage.from('copies').getPublicUrl(newFileName).data.publicUrl;
    }

    copie = await copieModel.updateCopie(idcopie, fileUrl);
    res.status(200).json(copie);
  } catch (error) {
    console.error("Erreur mise à jour copie :", error);
    res.status(500).json({ error: error.message });
  }
};

export const confirmNoteCopie = async (req, res) => {
  try {
      const { notefinal} = req.body;
      const { idcopie } = req.params;
      console.log(req.body);
      const updatedCopie = await copieModel.confirmNoteCopie(idcopie, notefinal);
      const notification = await notifController.notifCopieCorrigee(idcopie, notefinal);
      res.status(200).json(updatedCopie, notification);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

export const deleteCopie = async (req, res) => {
  try {
    const { idcopie } = req.params;
    const copie = await copieModel.getCopieById(idcopie);

    if (copie && copie.urlcopie && copie.urlcopie.trim() !== "") {
      const oldFileName = copie.urlcopie.split('/').pop();

      const { error: removeError } = await supabase.storage
        .from('copies')
        .remove([oldFileName]);

      if (removeError) {
        console.error("Erreur suppression fichier copie :", removeError);
        throw removeError;
      }
    }

    const deletedCopie = await copieModel.deleteCopie(idcopie);
    res.status(200).json(deletedCopie);
  } catch (error) {
    console.error("Erreur suppression copie :", error);
    res.status(500).json({ error: error.message });
  }
};

