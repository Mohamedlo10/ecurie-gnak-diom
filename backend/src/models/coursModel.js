import sql from "../config/db.js";

export const createCours = async (nomCours,idutilisateur) => {
    try {
        const query = await sql`
        INSERT INTO cours(nomCours, idutilisateur)
        VALUES(${nomCours},${idutilisateur})
        RETURNING *`; 

        return query[0];
    } catch (error) {
        throw new Error('Erreur lors de la création de la classe : ' + error.message);
    }
};
export const getCoursById = async (idCours) => {
    try {
        const query = await sql`
        SELECT 
                cours.idCours, 
                cours.nomcours, 
                cours.created_at, 
                utilisateur.nom, 
                utilisateur.prenom, 
                utilisateur.email,
                utilisateur.idutilisateur
        FROM cours
        JOIN professeur ON cours.idutilisateur = professeur.idutilisateur
        JOIN utilisateur ON professeur.idutilisateur = utilisateur.idutilisateur
        WHERE idCours = ${idCours}`;
        ; 
        return query[0];
    } catch (error) {
        throw new Error('Erreur lors de la création de la classe : ' + error.message);
    }
};
export const getCoursByIdProfesseur = async (idutilisateur) => {
    try {
        const query = await sql`
        SELECT * FROM cours WHERE idutilisateur = ${idutilisateur}`;
        ; 
        return query;
    } catch (error) {
        throw new Error('Erreur lors de la création de la classe : ' + error.message);
    }
};
export const getAllCours = async (idCours) => {
    try {
        const query = await sql`
        SELECT * FROM cours `;
        ; 
        return query;
    } catch (error) {
        throw new Error('Erreur lors de la création de la classe : ' + error.message);
    }
};

export const updateCours = async (idCours, nomCours) => {
    try {

        
        const result = await sql`
        UPDATE cours
        SET 
        nomCours = ${nomCours}
            WHERE idCours = ${idCours}
        RETURNING idCours, nomCours, idutilisateur
            `;
            
            // Vérifie si un utilisateur a été mis à jour
            // if (result.length === 0) {
            //     throw new Error('Aucun cours trouvé avec cet ID');
            // }
            
            return result[0]; // Retourne l'utilisateur mis à jour
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour de l\'utilisateur : ' + error.message);
        }
    };
    
    export const deleteCours = async (idCours) => {
        try {
            const query = await sql`
            DELETE FROM cours WHERE idCours = ${idCours} RETURNING *`;
            ; 
            return query[0];
        } catch (error) {
            throw new Error('Erreur lors de la création de la classe : ' + error.message);
        }
    };