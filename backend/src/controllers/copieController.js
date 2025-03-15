import * as copieModel from "../models/copieModel.js";
import supabase from "../config/supabase.js";

export const addCopie = async (req, res) => {
  try {
    const { idutilisateur, idsujet } = req.body;
    console.log(idutilisateur, idsujet);
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Fichier manquant !" });
    }

    const copie = await copieModel.addCopie(idutilisateur, idsujet, 'à ngeinteih plutard');
    const fileName = `${copie.idcopie}.pdf`;

    const { error } = await supabase.storage
      .from('copies')
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) throw error;

    const fileUrl = supabase.storage.from('copies').getPublicUrl(fileName).data.publicUrl;
    const updatedCopie = await copieModel.updateCopie(copie.idcopie, fileUrl);

    res.status(201).json({ data: updatedCopie });
  } catch (error) {
    console.error("Erreur création copie :", error);
    res.status(500).json({ error: error.message });
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