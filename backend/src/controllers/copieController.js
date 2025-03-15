// copieController.js
export const addCopie = async (req, res) => {
  try {
    const { idutilisateur, idsujet } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Fichier manquant !" });
    }
    console.log(file)
    const copie = await copieModel.createCopie(idutilisateur, idsujet, '');
    const fileName = copie.idcopie; // <-- juste l'id, sans extension originale

    const { error } = await supabase.storage
      .from('copies')
      .upload(fileName, file.buffer, { contentType: file.mimetype });
    if (error) throw error;

    const fileUrl = supabase.storage.from('copies').getPublicUrl(fileName).data.publicUrl;
    const updatedCopie = await copieModel.updateCopie(copie.idcopie, fileUrl);
    res.status(201).json({ data: updatedCopie });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAllCopieByIdSujet = async (req, res) => {
  const copies = await copieModel.getAllCopieByIdSujet(req.params.idsujet);
  res.status(200).json(copies);
};

export const getCopieByIdSujetAndUser = async (req, res) => {
  const { idsujet, idutilisateur } = req.params;
  const copie = await copieModel.getCopieByIdSujetAndUser(idsujet, idutilisateur);
  res.status(200).json(copie);
};

export const deleteCopie = async (req, res) => {
  const copie = await copieModel.deleteCopie(req.params.idcopie);

  const fileName = copie.urlcopie.split('/').pop();
  await supabase.storage.from('copies').remove([fileName]); // supprimer fichier

  res.status(200).json(copie);
};

export const updateCopie = async (req, res) => {
  try {
    const { idcopie } = req.params;
    const file = req.file;

    await supabase.storage.from('copies').remove([idcopie]);
    const { error } = await supabase.storage
      .from('copies')
      .upload(idcopie, file.buffer, { contentType: file.mimetype });
    if (error) throw error;

    const fileUrl = supabase.storage.from('copies').getPublicUrl(idcopie).data.publicUrl;
    res.status(200).json({ idcopie, urlcopie: fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};