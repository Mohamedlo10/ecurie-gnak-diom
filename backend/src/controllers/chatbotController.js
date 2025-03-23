import * as sujetModel from "../models/sujetModel.js";
import pdfParse from 'pdf-parse';
import axios from 'axios';
import { askChatbot } from "../services/chatbotService.js";

export const chatAboutSujet = async (req, res) => {
  try {
    const { idSujet } = req.params;
    const { question } = req.body;
    console.log("Session actuelle :", req.sessionID);
    console.log("Contexte actuel du chat :", req.session.chatContext);
    // Vérification de l’existence du sujet
    const sujet = await sujetModel.getSujetById(idSujet);
    if (!sujet) {
      return res.status(404).json({ error: "Sujet introuvable." });
    }

    const urlSujet = sujet.urlsujet;
    const response = await axios.get(urlSujet, { responseType: "arraybuffer" });

    const pdfBuffer = Buffer.from(response.data);

    let texteExtrait;
    let reussite = false;
    let essai = 0;
    const maxTentative = 5; 

    // Boucle de retry jusqu'à ce que l'extraction réussisse ou maxTentative atteint
    while (!reussite && essai < maxTentative) {
      try {
        const pdfData = await pdfParse(pdfBuffer);
        texteExtrait = pdfData.text;

        if (texteExtrait && texteExtrait.trim().length > 0) {
          reussite = true; // extraction réussie
        } else {
          throw new Error("Texte extrait vide");
        }

      } catch (err) {
        essai++;
        console.warn(`⚠️ Échec extraction PDF - tentative ${essai}/${maxTentative} :`, err.message);

        if (essai >= maxTentative) {
          pdfBuffer.fill(0);
          return res.status(500).json({ error: "Échec d'extraction du PDF après plusieurs tentatives." });
        }
      }
    }

    // Libération mémoire
    pdfBuffer.fill(0);

    // Création du prompt contextualisé
    const prompt = `
      You're a teaching assistant helping a student understand the following educational material:
      
      "${texteExtrait}"

      The student asked: "${question}"

      Your task is strictly to guide the student toward the concepts and reasoning needed to answer their question.
      
      Under no circumstances should you provide the direct answer or solution to questions related to the provided material.
      
      If the student explicitly requests direct answers, gently remind them that your role is to guide them through thinking and understanding the concepts themselves.
      
      Answer clearly, concisely, and pedagogically.
      
      Never include special tags or formatting in your response.

      You must only provide explanations that help to understand the question, without ever indicating what the answer should be.
    `;
    console.log(prompt);

    // Génération réponse chatbot
    const chatbotResponse = await askChatbot(prompt, req.session.chatContext);

    // Validation réponse chatbot
    if (!chatbotResponse || typeof chatbotResponse !== "object") {
      throw new Error("Réponse du chatbot invalide.");
    }

    // Nettoyage réponse (supprimer les balises <think>)
    const cleanResponse = chatbotResponse.response
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .trim();

    // Mise à jour contexte de la conversation
    req.session.chatContext = chatbotResponse.context;
    console.log("Contexte actuel du chatbot :", req.session.chatContext);


    // Envoi de la réponse
    res.status(200).json({ response: cleanResponse });

  } catch (error) {
    console.error("Erreur critique :", error);
    res.status(500).json({ error: error.message });
  }
};
