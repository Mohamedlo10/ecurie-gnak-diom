import sql from "../config/db.js";

export const  addCopie = async (idUtilisateur, idsujet, urlcopie) => {
  const query = await sql`
    INSERT INTO copie(idutilisateur, idsujet, urlcopie)
    VALUES(${idUtilisateur}, ${idsujet}, ${urlcopie})
    RETURNING *;
  `;
  return query[0];
};

export const getAllCopieByIdSujet = async (idsujet) => {
  return (await sql`
    SELECT copie.*, utilisateur.nom, utilisateur.prenom
    FROM copie
    JOIN utilisateur ON copie.idutilisateur = utilisateur.idutilisateur
    WHERE copie.idsujet=${idsujet};
  `);
};

export const getAllCopieByIdUser = async (idutilisateur) => {
  return (await sql`
    SELECT copie.idcopie,copie.notefinal,copie.commentaire,copie.urlcopie,copie.created_at, utilisateur.nom, utilisateur.prenom,sujet.nomsujet,sujet.idsujet,cours.nomcours,cours.idcours
    FROM copie
    JOIN utilisateur ON copie.idutilisateur = utilisateur.idutilisateur
    JOIN sujet ON copie.idsujet=sujet.idsujet
    JOIN cours ON sujet.idcours = cours.idcours
    WHERE copie.idutilisateur=${idutilisateur};
  `);
};

export const getCopieById = async (idcopie) => {
  return (await sql`SELECT * FROM copie WHERE idcopie=${idcopie};`)[0];
};

export const getCopieByIdSujetAndUser = async (idsujet, idutilisateur) => {
  return (await sql`
    SELECT copie.*, utilisateur.nom, utilisateur.prenom
    FROM copie
    JOIN utilisateur ON copie.idutilisateur = utilisateur.idutilisateur
    WHERE idsujet=${idsujet} AND utilisateur.idutilisateur=${idutilisateur};
  `)[0];
};

export const updateCopie = async (idcopie, urlcopie) => {
  return (await sql`
    UPDATE copie SET urlcopie=${urlcopie}
    WHERE idcopie=${idcopie} RETURNING *;
  `)[0];
};
export const updateNoteCopie = async(idcopie,noteia,commentaire) =>{
  return (await sql`
    UPDATE copie SET noteia=${noteia}, commentaire=${commentaire}
    WHERE idcopie=${idcopie} RETURNING *;
    `)[0];
};

export const confirmNoteCopie = async(idcopie,notefinal) =>{
  return (await sql`
    UPDATE copie SET notefinal=${notefinal}
    WHERE idcopie=${idcopie} RETURNING *;
    `)[0];
};

export const deleteCopie = async (idcopie) => {
  return (await sql`
    DELETE FROM copie WHERE idcopie=${idcopie} RETURNING *;
  `)[0];
};
