import supabase from "../config/supabase.js";
import * as sujetModel from "../models/sujetModel.js";


export const createSujet = async (req, res) => {
  try {
      const { nomSujet, idCours,datesoumission } = req.body;
      const file = req.file;
      console.log(nomSujet, idCours, datesoumission);
      const sujet = await sujetModel.createSujet(nomSujet, '', idCours, datesoumission);
      const fileName = sujet.idsujet; 

      const { error } = await supabase.storage
        .from('sujets')
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (error) throw error;
      const fileUrl = supabase.storage.from('sujets').getPublicUrl(fileName).data.publicUrl;
      const updatedSujet = await sujetModel.updateSujet(sujet.idsujet, fileUrl, datesoumission);
      res.status(201).json({ data: updatedSujet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllSujetByIdCours = async (req, res) => {
  const sujets = await sujetModel.getAllSujetByIdCours(req.params.idCours);
  res.status(200).json(sujets);
};

export const getAllSujetByIdProf = async (req, res) => {
  const sujets = await sujetModel.getAllSujetByIdProf(req.params.idutilisateur);
  res.status(200).json(sujets);
};

export const getAllSujetByIdEtudiant = async (req, res) => {
  const sujets = await sujetModel.getAllSujetByIdEtudiant(req.params.idutilisateur);
  res.status(200).json(sujets);
};

export const getSujetById = async (req, res) => {
  const sujet = await sujetModel.getSujetById(req.params.idSujet);
  res.status(200).json(sujet);
};

export const updateSujet = async (req, res) => {
  try {
    const { idSujet } = req.params;
    const { datesoumission } = req.body;
    const file = req.file;

    let sujet = await sujetModel.getSujetById(idSujet);
    let fileUrl = sujet.urlsujet;
    if (file) {
      let newFileName = `${idSujet}`; // <-- extension explicite

      if (fileUrl && fileUrl.trim() !== "") {
        // const oldFileName = fileUrl.split('/').pop();
        
        // Vérifie que l'ancien fichier est exactement celui que tu veux supprimer
        //console.log("Ancien fichier à supprimer:", oldFileName);

        const { error: removeError } = await supabase.storage
          .from('sujets')
          .remove([newFileName]);
        console.log(newFileName);
        if (removeError) {
          console.error("Erreur suppression fichier existant :", removeError);
          throw removeError;
        }
      }
      const { error: uploadError } = await supabase.storage
        .from('sujets')
        .upload(newFileName, file.buffer, { contentType: file.mimetype });

      if (uploadError) {
        console.error("Erreur lors de l'upload :", uploadError);
        throw uploadError;
      }
    }

    // console.log(idSujet, datesoumission);
    sujet = await sujetModel.updateSujet(idSujet, fileUrl, datesoumission);
    res.status(200).json(sujet);

  } catch (error) {
    console.error("Erreur finale :", error);
    res.status(500).json({ error: error.message });
  }
};


export const deleteSujet = async (req, res) => {
  try {
    const { idSujet } = req.params; 

    let sujet = await sujetModel.getSujetById(idSujet);
    let fileUrl = sujet.urlsujet;

    if (fileUrl && fileUrl.trim() !== "") {
      const oldFileName = fileUrl.split('/').pop();
      console.log("Ancien fichier à supprimer:", oldFileName);

      const { error: removeError } = await supabase.storage
        .from('sujets')
        .remove([oldFileName]);

      if (removeError) {
        console.error("Erreur suppression ancien fichier:", removeError);
        throw removeError;
      }
    }

    const suppression = await sujetModel.deleteSujet(idSujet);
    res.status(200).json(suppression);

  } catch (error) {
    console.error("Erreur finale :", error);
    res.status(500).json({ error: error.message });
  }
};

