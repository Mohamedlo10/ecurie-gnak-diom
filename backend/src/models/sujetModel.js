// backend/src/models/sujetModel.js
import sql from "../config/db.js";

export const createSujet = async (nomSujet, urlSujet, idCours,datesoumission) => {
  const query = await sql`
    INSERT INTO sujet(nomSujet, urlSujet, idCours,datesoumission)
    VALUES(${nomSujet}, ${urlSujet}, ${idCours},${datesoumission})
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

export const updateSujet = async (idSujet, nomSujet, urlSujet,datesoumission) => {
  return (await sql`
    UPDATE sujet SET nomSujet=${nomSujet}, urlSujet=${urlSujet},datesoumission=${datesoumission}
    WHERE idSujet=${idSujet} RETURNING *;
  `)[0];
};

export const deleteSujet = async (idSujet) => {
  return (await sql`DELETE FROM sujet WHERE idSujet=${idSujet} RETURNING *;`)[0];
};
