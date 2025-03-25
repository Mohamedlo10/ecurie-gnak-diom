import sql from "../config/db.js";


export const createCorrection = async (idSujet, urlCorrection) => {
  try {
    const result = await sql`
      INSERT INTO correction(idsujet, urlcorrection)
      VALUES (${idSujet}, ${urlCorrection})
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    throw new Error('Erreur lors de la création du corrigé : ' + error.message);
  }
};

export const getCorrectionByIdSujet = async (idSujet) => {
  try {
    const result = await sql`
      SELECT * FROM correction WHERE idsujet = ${idSujet};
    `;
    return result[0];
  } catch (error) {
    throw new Error('Erreur lors de la récupération du corrigé : ' + error.message);
  }
};
export const getCorrectionById = async (idcorrection) => {
  try {
    const result = await sql`
      SELECT * FROM correction WHERE idcorrection = ${idcorrection};
    `;
    return result[0];
  } catch (error) {
    throw new Error('Erreur lors de la récupération du corrigé : ' + error.message);
  }
};

export const updateCorrection = async (idCorrection, urlCorrection) => {
  try {
    const result = await sql`
      UPDATE correction
      SET urlcorrection = ${urlCorrection}
      WHERE idcorrection = ${idCorrection}
      RETURNING *;
    `;
    return result[0];
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour du corrigé : ' + error.message);
  }
};

export const supprimerCorrection = async (idCorrection) => {
  try {
    await sql`
      DELETE FROM correction WHERE idcorrection = ${idCorrection};
    `;
    return true;
  } catch (error) {
    throw new Error('Erreur lors de la suppression du corrigé : ' + error.message);
  }
};
