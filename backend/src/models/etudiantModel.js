import sql from '../config/db.js';


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
        FROM etudiant natural join utilisateur
        WHERE idutilisateur = ${idutilisateur}
        LIMIT 1
    `;
        return query[0];  
    } catch (error) {
        return null;
    }
};




export const getAllEtudiants = async () => {
    try {
    const query = await sql`
        SELECT * FROM etudiant natural join utilisateur
    `;
     // On utilise "await query" ici pour exécuter la requête
        return query; 
    } catch (error) {
        throw new Error('Erreur lors de la récupération des étudiants');
    }
};



export const getEtudiantById = async (idutilisateur) => {
    try {
    const query = await sql`
        SELECT *
        FROM etudiant natural join utilisateur
        WHERE idutilisateur = ${idutilisateur}
        LIMIT 1
    `;
    if (query.length === 0) {
        throw new Error('Étudiant non trouvé');
    }
    return query[0]; 
    } catch (error) {
        throw new Error('Erreur lors de la récupération de l\'étudiant');
    }
};


export const deleteEtudiant = async (idutilisateur) => {
    try {
    const query = await sql`
        DELETE FROM utilisateur
        WHERE idutilisateur = ${idutilisateur}
        RETURNING *
    `;
        return query[0]; 
    } catch (error) {
        throw new Error('Erreur lors de la suppression de l\'étudiant');
    }
};

