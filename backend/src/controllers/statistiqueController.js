import * as StatistiqueModel from "../models/statistiqueModel.js";

export const afficherStatistiquesProfesseur = async (req, res) => {
    const { idutilisateur } = req.params; // <= correction ici
    console.log("idutilisateur reçu :", idutilisateur);

    try {
        const notesSujets = await StatistiqueModel.getStatistiquesNotesSujetsProf(idutilisateur);
        const nbEtudiantsParSujet = await StatistiqueModel.getNombreEtudiantsParSujetProf(idutilisateur);
        const moyennesEtudiants = await StatistiqueModel.getMoyenneGeneraleEtudiantsProf(idutilisateur);
        const moyennesParCours = await StatistiqueModel.getMoyenneCoursParEtudiantProf(idutilisateur);
        const sujetsTraitesParEtudiant = await StatistiqueModel.getNombreSujetsTraitesParEtudiantProf(idutilisateur);
        const nbInscritsCours = await StatistiqueModel.getNombreEtudiantsInscritsParCoursProf(idutilisateur);
        console.log(nbEtudiantsParSujet, nbEtudiantsParSujet, moyennesEtudiants,moyennesParCours,sujetsTraitesParEtudiant,nbInscritsCours);


        res.json({
            notesSujets,
            nbEtudiantsParSujet,
            moyennesEtudiants,
            moyennesParCours,
            sujetsTraitesParEtudiant,
            nbInscritsCours
        });

    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "Aucune statistique n'a été trouvée" });
    }
};
