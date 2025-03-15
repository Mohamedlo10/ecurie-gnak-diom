import sql from "../config/db.js";

// , , 
// 
export const addEtudiant = async (idcours, idutilisateur) => {
    try {
        const query = await sql`
            INSERT INTO suivre (idcours, idutilisateur)
            VALUES (${idcours}, ${idutilisateur})
            RETURNING *;
        `;  
        return query[0]; 
    } catch (error) {
        throw new Error("Erreur lors de l'inscription de l'étudiant au cours");
    }
};

export const getCoursByIdEtudiant = async (idutilisateur) => {
    try {
        const query = await sql`
            SELECT 
                suivre.idcours, 
                cours.nomcours, 
                utilisateur.nom, 
                utilisateur.prenom, 
                utilisateur.email
            FROM suivre
            JOIN cours ON suivre.idcours = cours.idcours
            JOIN professeur ON cours.idutilisateur = professeur.idutilisateur
            JOIN utilisateur ON professeur.idutilisateur = utilisateur.idutilisateur
            WHERE suivre.idutilisateur = ${idutilisateur};
        `;
        return query;
    } catch (error) {
        throw new Error("Erreur lors de la récupération des cours suivis par l'étudiant");
    }
};

export const getEtudiantByIdCours = async (idcours) => {
    try {
        const query = await sql`
            SELECT 
                utilisateur.idutilisateur, 
                utilisateur.nom, 
                utilisateur.prenom, 
                utilisateur.email, 
                etudiant.ine
            FROM suivre
            JOIN etudiant ON suivre.idutilisateur = etudiant.idutilisateur
            JOIN utilisateur ON etudiant.idutilisateur = utilisateur.idutilisateur
            WHERE suivre.idcours = ${idcours};
        `;
        return query;
    } catch (error) {
        throw new Error("Erreur lors de la récupération des étudiants inscrits au cours");
    }
};


export const getOne = async (idcours, idEtudiant) => {
    try {
        const query = await sql`
            SELECT 
                suivre.idcours, 
                cours.nomcours, 
                utilisateur.idutilisateur, 
                utilisateur.nom, 
                utilisateur.prenom, 
                utilisateur.email
            FROM suivre
            JOIN etudiant ON suivre.idutilisateur = etudiant.idutilisateur
            JOIN utilisateur ON etudiant.idutilisateur = utilisateur.idutilisateur
            JOIN cours ON suivre.idcours = cours.idcours
            WHERE suivre.idcours = ${idcours} AND suivre.idutilisateur = ${idEtudiant};
        `;

        return query.length > 0 ? query[0] : null; // Retourne un seul résultat ou `null`
    } catch (error) {
        throw new Error("Erreur lors de la récupération du suivi.");
    }
};

export const exclureEtudiant = async (idCours,idutilisateur) => {
    try {
    const query = await sql`
        DELETE FROM suivre
        WHERE
        idcours = ${idCours} 
        AND
        idutilisateur =${idutilisateur} 
        RETURNING*
    `;
         
        return query[0]; 
    } catch (error) {
        throw new Error('Erreur lors de l\'exclusion de l\'étudiant du cours');
    }
};