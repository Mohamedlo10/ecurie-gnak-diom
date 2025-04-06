 
import sql from "../config/db.js";

export const createPlagiat = async (similarity) => {
    // Requête SQL pour insérer dans la table plagiat
    const query = await sql`
      INSERT INTO plagiat (pourcentageplagiat)
      VALUES (${similarity})
      RETURNING *;
    `;
    // query est un tableau de résultats ; on renvoie la première ligne
    return query[0];
  };