import * as StatistiqueModel from "../models/statistiqueModel.js";

export const afficherStatistiquesProfesseur = async (req, res) => {
  const { idutilisateur } = req.params; // <= correction ici
  console.log("idutilisateur reçu :", idutilisateur);

  try {
    const notesSujets = await StatistiqueModel.getStatistiquesNotesSujetsProf(
      idutilisateur
    );
    const nbEtudiantsParSujet =
      await StatistiqueModel.getNombreEtudiantsParSujetProf(idutilisateur);
    const moyennesEtudiants =
      await StatistiqueModel.getMoyenneGeneraleEtudiantsProf(idutilisateur);
    const moyennesParCours =
      await StatistiqueModel.getMoyenneCoursParEtudiantProf(idutilisateur);
    const sujetsTraitesParEtudiant =
      await StatistiqueModel.getNombreSujetsTraitesParEtudiantProf(
        idutilisateur
      );
    const nbInscritsCours =
      await StatistiqueModel.getNombreEtudiantsInscritsParCoursProf(
        idutilisateur
      );
    console.log(
      nbEtudiantsParSujet,
      nbEtudiantsParSujet,
      moyennesEtudiants,
      moyennesParCours,
      sujetsTraitesParEtudiant,
      nbInscritsCours
    );

    res.json({
      notesSujets,
      nbEtudiantsParSujet,
      moyennesEtudiants,
      moyennesParCours,
      sujetsTraitesParEtudiant,
      nbInscritsCours,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Aucune statistique n'a été trouvée" });
  }
};

export const afficherStatistiquesEtudiant = async (req, res) => {
  const { idutilisateur } = req.params; // <= correction ici
  console.log("idutilisateur reçu :", idutilisateur);

  try {
    const nbCours = await StatistiqueModel.getNombreCoursEtudiant(
      idutilisateur
    );
    const nbSujet = await StatistiqueModel.getNombreSujetEtudiant(
      idutilisateur
    );
    const nbCopie = await StatistiqueModel.getNombreCopieEtudiant(
      idutilisateur
    );
    const moyennesParCours = await StatistiqueModel.getMoyenneParCoursEtudiant(
      idutilisateur
    );
    const moyenneGeneral = await StatistiqueModel.getMoyenneGeneraleEtudiant(
      idutilisateur
    );

    const bestNotes = await StatistiqueModel.getTop5MeilleuresNoteEtudiant(
      idutilisateur
    );

    res.json({
      nbCours,
      nbSujet,
      nbCopie,
      moyennesParCours,
      moyenneGeneral,
      bestNotes,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Aucune statistique n'a été trouvée" });
  }
};
