import sql from '../config/db.js';

export const createProfesseur = async (idutilisateur) => {
    try {
    const query = await sql`
        INSERT INTO professeur (idutilisateur)
        VALUES (${idutilisateur})
        RETURNING *
    `;  // L'utilisation de "await" exécute la requête SQL
        return query[0]; // Retourne l'étudiant inséré
    } catch (error) {
        throw new Error('Erreur lors de l\'inscription de professeur');
    }
};



export const isProfesseur = async (idutilisateur) => {
    try {
    const query =  await sql`
        SELECT idutilisateur
        FROM professeur
        WHERE idutilisateur = ${idutilisateur}
        LIMIT 1
    `;

    return query[0]; // Retourne l'étudiant inséré
} catch (error) {
   return null;
}
};




export const getAllProfesseurs = async () => {
    const query = sql`
        SELECT * FROM professeur
    `;

    try {
        const { rows } = await query;  // On utilise "await query" ici pour exécuter la requête
        return rows; // Retourne tous les étudiants
    } catch (error) {
        throw new Error('Erreur lors de la récupération des étudiants');
    }
};



export const getProfesseurById = async (idutilisateur) => {
    const query = sql`
        SELECT *
        FROM professeur
        WHERE idutilisateur = ${idutilisateur}
        LIMIT 1
    `;

    try {
        const { rows } = await query;  // Utilisation de "await" pour exécuter la requête
        if (rows.length === 0) {
            throw new Error('Étudiant non trouvé');
        }
        return rows[0]; // Retourne l'étudiant trouvé
    } catch (error) {
        throw new Error('Erreur lors de la récupération de l\'étudiant');
    }
};


export const deleteProfesseur = async (idutilisateur) => {
    const query = sql`
        DELETE FROM utilisateur
        WHERE idutilisateur = ${idutilisateur}
        RETURNING *
    `;

    try {
        const { rows } = await query;  // Exécution de la requête
        return rows[0]; // Retourne l'étudiant supprimé
    } catch (error) {
        throw new Error('Erreur lors de la suppression de l\'étudiant');
    }
};
