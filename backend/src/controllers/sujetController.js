import sql from '../config/db.js';
import * as sujetModel from "../models/sujetModel.js";
import supabase from "../config/supabase.js";


export const createSujet = async (req, res) => {
  try {
      const { nomSujet, idCours } = req.body;
      const file = req.file;
      const sujet = await sujetModel.createSujet(nomSujet, '', idCours);
      const fileName = sujet.idsujet; // <-- plus d'extension, juste l'id

      const { error } = await supabase.storage
        .from('sujets')
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (error) throw error;
      const fileUrl = supabase.storage.from('sujets').getPublicUrl(fileName).data.publicUrl;
      const updatedSujet = await sujetModel.updateSujet(sujet.idsujet, nomSujet, fileUrl);
      res.status(201).json({ data: updatedSujet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllSujetByIdCours = async (req, res) => {
  const sujets = await sujetModel.getAllSujetByIdCours(req.params.idCours);
  res.status(200).json(sujets);
};

export const getSujetById = async (req, res) => {
  const sujet = await sujetModel.getSujetById(req.params.idSujet);
  res.status(200).json(sujet);
};

export const updateSujet = async (req, res) => {
  try {
    const { idSujet } = req.params;
    const { nomSujet } = req.body;
    const file = req.file;

    let sujet = await sujetModel.getSujetById(idSujet);
    let fileUrl = sujet.urlSujet;

    if (file) {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${idSujet}.${fileExt}`;

      await supabase.storage.from('sujets').remove([fileName]); 

      const { data, error } = await supabase.storage
        .from('sujets')
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (error) throw error;
      fileUrl = supabase.storage.from('sujets').getPublicUrl(fileName).data.publicUrl;
    }
    sujet = await sujetModel.updateSujet(idSujet, nomSujet, fileUrl);
    res.status(200).json(sujet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSujet = async (req, res) => {
  const sujet = await sujetModel.deleteSujet(req.params.idSujet);
  res.status(200).json(sujet);
};
