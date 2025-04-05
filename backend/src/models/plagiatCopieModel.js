import sql from "../config/db.js";

export const createPlagiatCopie = async (
  idplagiat,
  idutilisateur1,
  idsujet1,
  idcopie1,
  similarity1,
  idutilisateur2,
  idsujet2,
  idcopie2,
  similarity2
) => {
  // Requête d'insertion en une seule fois pour les deux copies
  const query = await sql`
    INSERT INTO plagiatcopie (idplagiat, idutilisateur, idsujet, idcopie, pourcentage)
    VALUES 
      (${idplagiat}, ${idutilisateur1}, ${idsujet1}, ${idcopie1}, ${similarity1}),
      (${idplagiat}, ${idutilisateur2}, ${idsujet2}, ${idcopie2}, ${similarity2})
    RETURNING *;
  `;
  return query[0]; // Retourne le premier résultat inséré
};
export const checkIfPlagiatExist = async (idcopie1, idcopie2) => {
  const query = await sql`
    SELECT * FROM plagiatcopie
    WHERE (idcopie = ${idcopie1} AND idcopie = ${idcopie2})
       OR (idcopie = ${idcopie2} AND idcopie = ${idcopie1})
    LIMIT 1;
  `;
  return query.length > 0; // Si une entrée existe, la longueur du tableau sera > 0
};