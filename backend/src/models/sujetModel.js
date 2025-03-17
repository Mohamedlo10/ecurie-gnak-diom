// backend/src/models/sujetModel.js
import sql from "../config/db.js";

export const createSujet = async (nomSujet, urlSujet, idCours,dateSoumission) => {
  const query = await sql`
    INSERT INTO sujet(nomSujet, urlSujet, idCours,dateSoumission)
    VALUES(${nomSujet}, ${urlSujet}, ${idCours},${dateSoumission})
    RETURNING *;
  `;
  return query[0];
};

export const getAllSujetByIdCours = async (idCours) => {
  return (await sql`SELECT * FROM sujet WHERE idCours=${idCours};`);
};

export const getSujetById = async (idSujet) => {
  return (await sql`SELECT * FROM sujet WHERE idSujet=${idSujet};`)[0];
};

export const updateSujet = async (idSujet, nomSujet, urlSujet,dateSoumission) => {
  return (await sql`
    UPDATE sujet SET nomSujet=${nomSujet}, urlSujet=${urlSujet},dateSoumission=${dateSoumission}
    WHERE idSujet=${idSujet} RETURNING *;
  `)[0];
};

export const deleteSujet = async (idSujet) => {
  return (await sql`DELETE FROM sujet WHERE idSujet=${idSujet} RETURNING *;`)[0];
};
