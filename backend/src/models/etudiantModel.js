import sql from '../config/db.js';

// Fonction pour insérer un étudiant
export const createEtudiant = async (idutilisateur, ine) => {
    try {
    const query = await sql`
        INSERT INTO etudiant (idutilisateur, ine)
        VALUES (${idutilisateur}, ${ine})
        RETURNING *
    `;  // L'utilisation de "await" exécute la requête SQL
        return query[0]; // Retourne l'étudiant inséré
    } catch (error) {
        throw new Error('Erreur lors de l\'inscription de l\'étudiant');
    }
};

//rectifier nako tck ca ne marchais pas quoi  ma ayy 'cest redirect url que marchais pas 

export const isEtudiant = async (idutilisateur) => {
    try {
    const query = await sql`
        SELECT idutilisateur
        FROM etudiant
        WHERE idutilisateur = ${idutilisateur}
        LIMIT 1
    `;
        return query[0];  // Si l'utilisateur est un étudiant
    } catch (error) {
        return null;
    }
};




export const getAllEtudiants = async () => {
    try {
    const query = await sql`
        SELECT * FROM etudiant
    `;
     // On utilise "await query" ici pour exécuter la requête
        return query; // Retourne tous les étudiants
    } catch (error) {
        throw new Error('Erreur lors de la récupération des étudiants');
    }
};



export const getEtudiantById = async (idutilisateur) => {
    try {
    const query = await sql`
        SELECT *
        FROM etudiant
        WHERE idutilisateur = ${idutilisateur}
        LIMIT 1
    `;

          // Utilisation de "await" pour exécuter la requête
        if (query.length === 0) {
            throw new Error('Étudiant non trouvé');
        }
        return query[0]; // Retourne l'étudiant trouvé
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

