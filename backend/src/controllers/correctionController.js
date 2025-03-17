import * as correctionModel from '../models/correctionModel.js';
import * as sujetModel from '../models/sujetModel.js'; // Permet de récupérer l'URL du sujet
import supabase from "../config/supabase.js";
import pdfParse from 'pdf-parse';
import PDFDocument from 'pdfkit';
import axios from 'axios';
import fs from 'fs';

export const generateCorrection = async (req, res) => {
  const { idSujet } = req.params;

  try {
    // 1️⃣ Récupérer l'URL du sujet dans la base de données
    const sujet = await sujetModel.getSujetById(idSujet);
    if (!sujet || !sujet.urlsujet) {
      return res.status(404).json({ error: "Sujet introuvable" });
    }
    
    const sujetUrl = sujet.urlsujet; 

    // 2️⃣ Télécharger le sujet depuis Supabase
    const response = await axios.get(sujetUrl, { responseType: "arraybuffer" });
    
    // 3️⃣ Extraction du texte du PDF
    let extractedText = " ";
    const pdfBuffer = Buffer.from(response.data);
    try {
      const pdfData = await pdfParse(pdfBuffer);
      extractedText = pdfData.text;
      console.log("✅ Texte extrait du PDF :", extractedText);
    } catch (error) {
      console.error("Erreur d'extraction du texte :", error.message);
      return res.status(500).json({ error: "Impossible de lire le fichier PDF." });
    }
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
      model: "deepseek-r1:1.5b",
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

        // 7️⃣ Enregistrer l’URL dans la base
        const correction = await correctionModel.createCorrection(idSujet, data.path);

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
  const { idCorrection } = req.params;
  const { file } = req;

  try {
    if (!file) {
      return res.status(400).json({ error: "Aucun fichier reçu pour mise à jour." });
    }

    const pdfContent = fs.readFileSync(file.path);
    const newPath = `updated-correction-${idCorrection}.pdf`;

    // Mettre à jour le fichier sur Supabase
    const { data, error } = await supabase
      .storage
      .from('corrections')
      .update(newPath, pdfContent, { contentType: 'application/pdf' });

    if (error) throw error;

    // Mettre à jour l'URL dans la base de données
    const correction = await correctionModel.updateCorrection(idCorrection, data.path);
    fs.unlinkSync(file.path);

    res.status(200).json({ message: "Corrigé mis à jour avec succès", data: correction });

  } catch (error) {
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