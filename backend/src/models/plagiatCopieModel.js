import sql from "../config/db.js";

export const createPlagiatCopie = async (idplagiat, idutilisateur, idsujet, idcopie, similarity) => {
    
    // Requête SQL pour insérer dans la table plagiatcopie
    const query = await sql`
      INSERT INTO plagiatcopie (idplagiat, idutilisateur, idsujet, idcopie, pourcentage)
      VALUES (${idplagiat}, ${idutilisateur}, ${idsujet}, ${idcopie}, ${similarity})
      RETURNING *;
    `;
    // On renvoie la première ligne insérée
    return query[0];
  };