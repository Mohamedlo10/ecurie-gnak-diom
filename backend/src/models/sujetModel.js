
import sql from "../config/db.js";

export const createSujet = async (nomSujet, urlSujet, idCours, datesoumission) => {
  const query = await sql`
    INSERT INTO sujet(nomSujet, urlSujet, idCours, datesoumission)
    VALUES(${nomSujet}, ${urlSujet}, ${idCours},${datesoumission})
    RETURNING *;
  `;
  return query[0];
};

export const getAllSujetByIdCours = async (idCours) => {
  return (await sql`SELECT * FROM sujet WHERE idCours=${idCours};`);
};

export const getAllSujetByIdProf = async (idutilisateur) => {
  return (await sql`SELECT sujet.*, cours.nomcours,cours.idcours
    FROM sujet
    JOIN cours on sujet.idcours=cours.idcours
    JOIN utilisateur on cours.idutilisateur=utilisateur.idutilisateur 
    WHERE cours.idutilisateur=${idutilisateur};`);
};

export const getAllSujetByIdEtudiant = async (idutilisateur) => {
  return (await sql`SELECT sujet.*, cours.nomcours,cours.idcours
    FROM sujet
    JOIN suivre on sujet.idcours=suivre.idcours
    JOIN cours on suivre.idcours=cours.idcours
    JOIN utilisateur on suivre.idutilisateur=utilisateur.idutilisateur 
    WHERE suivre.idutilisateur=${idutilisateur};`);
};

export const getSujetById = async (idSujet) => {
  return (await sql`SELECT * FROM sujet WHERE idSujet=${idSujet};`)[0];
};

export const updateSujet = async (idSujet, fileUrl, datesoumission) => {
  return (await sql`
    UPDATE sujet SET urlsujet = ${fileUrl}, datesoumission=${datesoumission}
    WHERE idSujet=${idSujet} RETURNING *;
  `)[0];
};

export const deleteSujet = async (idSujet) => {
  return (await sql`DELETE FROM sujet WHERE idSujet=${idSujet} RETURNING *;`)[0];
};
