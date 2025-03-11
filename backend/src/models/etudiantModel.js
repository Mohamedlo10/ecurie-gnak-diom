import sql from '../config/db.js';

// Fonction pour insérer un étudiant
export const createEtudiant = async (idutilisateur) => {
    const query = sql`
        INSERT INTO etudiant (idutilisateur)
        VALUES (${idutilisateur})
        RETURNING *
    `;

    try {
        const { rows } = await query;  // L'utilisation de "await" exécute la requête SQL
        return rows[0]; // Retourne l'étudiant inséré
    } catch (error) {
        throw new Error('Erreur lors de l\'inscription de l\'étudiant');
    }
};



export const isEtudiant = async (idutilisateur) => {
    const query = sql`
        SELECT idutilisateur
        FROM etudiant
        WHERE idutilisateur = ${idutilisateur}
        LIMIT 1
    `;

    try {
        const { rows } = await query;
        return rows.length > 0 ? rows[0] : null;  // Si l'utilisateur est un étudiant
    } catch (error) {
        return null;
    }
};




export const getAllEtudiants = async () => {
    const query = sql`
        SELECT * FROM etudiant
    `;

    try {
        const { rows } = await query;  // On utilise "await query" ici pour exécuter la requête
        return rows; // Retourne tous les étudiants
    } catch (error) {
        throw new Error('Erreur lors de la récupération des étudiants');
    }
};



export const getEtudiantById = async (idutilisateur) => {
    const query = sql`
        SELECT *
        FROM etudiant
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


export const deleteEtudiant = async (idutilisateur) => {
    const query = sql`
        DELETE FROM etudiant
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

