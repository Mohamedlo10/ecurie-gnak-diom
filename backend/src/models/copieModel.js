import sql from "../config/db.js";

export const createCopie = async (idutilisateur, idsujet, urlcopie) => {
  const query = await sql`
    INSERT INTO copie(idutilisateur, idsujet, urlcopie)
    VALUES(${idutilisateur}, ${idsujet}, ${urlcopie})
    RETURNING *;
  `;
  return query[0];
};

export const getAllCopieByIdSujet = async (idsujet) => {
  const query = await sql`
    SELECT copie.*, utilisateur.nom, utilisateur.prenom
    FROM copie
    JOIN utilisateur ON copie.idutilisateur = utilisateur.idutilisateur
    WHERE copie.idsujet=${idsujet};
  `;
  return query;
};

export const getCopieByIdSujetAndUser = async (idsujet, idutilisateur) => {
  const query = await sql`
    SELECT copie.*
    FROM copie
    WHERE copie.idsujet=${idsujet} AND copie.idutilisateur=${idutilisateur};
  `;
  return query[0];
};

export const updateCopie = async (idcopie, urlcopie) => {
  const query = await sql`
    UPDATE copie SET urlcopie=${urlcopie}
    WHERE idcopie=${idcopie}
    RETURNING *;
  `;
  return query[0];
};

export const deleteCopie = async (idcopie) => {
  const query = await sql`
    DELETE FROM copie WHERE idcopie=${idcopie} RETURNING *;
  `;
  return query[0];
};
