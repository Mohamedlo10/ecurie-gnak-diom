import bcrypt from 'bcrypt';
import sql from '../config/db.js';
// Fonction pour vérifier si un utilisateur existe déjà par email
export const findUserByEmail = async (email) => {
    try {
        // Construire la requête SQL avec les paramètres
        const query = await sql`
            SELECT *
            FROM utilisateur
            WHERE email = ${email}  
            LIMIT 1
        `;
        // Vérifie si des utilisateurs ont été trouvés
        // if (result.length === 0) {
        //     throw new Error('Utilisateur non trouvé');
        // }

        // Retourne le premier utilisateur trouvé
        return query[0];  // Si trouvé, retourne l'utilisateur
    } catch (error) {
        // Gestion des erreurs
        throw new Error(error.message);
    }
};
export const getAllUtilisateurs = async () => {
    try {
        // Construire la requête SQL avec les paramètres
        const query = await sql`
            SELECT idutilisateur, nom, prenom, email, motdepasse
            FROM utilisateur`;
        if (query.length === 0) {
            throw new Error('Aucun utilisateur trouvé');
        }
        return query; 
    } catch (error) {
        throw new Error(error.message);
    }
};
// Fonction pour créer un nouvel utilisateur

export const createUser = async (nom, prenom, email, hashedPassword) => {
    try {

        // Requête SQL pour insérer un nouvel utilisateur avec le mot de passe hashé
        const result = await sql`
            INSERT INTO utilisateur (nom, prenom, email, motdepasse)
            VALUES (${nom}, ${prenom}, ${email}, ${hashedPassword})
            RETURNING idutilisateur, nom, prenom, email
        `;

        return result[0]; // Retourne l'utilisateur créé
    } catch (error) {
        throw new Error('Erreur lors de la création de l\'utilisateur : ' + error.message);
    }
};

export const updateUtilisateur = async (idutilisateur, nom, prenom, email, password) => {
    try {
        // Vérifie si le mot de passe est défini
        if (!password) {
            throw new Error("Le mot de passe est requis pour la mise à jour.");
        }

        // Génération du sel et hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Requête SQL pour mettre à jour les informations d'un utilisateur
        const result = await sql`
            UPDATE utilisateur
            SET 
                nom = ${nom}, 
                prenom = ${prenom}, 
                email = ${email}, 
                motdepasse = ${hashedPassword}
            WHERE idutilisateur = ${idutilisateur}
            RETURNING idutilisateur, nom, prenom, email
        `;

        // Vérifie si un utilisateur a été mis à jour
        if (result.length === 0) {
            throw new Error('Aucun utilisateur trouvé avec cet ID');
        }

        return result[0]; // Retourne l'utilisateur mis à jour
    } catch (error) {
        throw new Error('Erreur lors de la mise à jour de l\'utilisateur : ' + error.message);
    }
};






// Fonction pour trouver un utilisateur par ID
export const findUserById = async (idutilisateur) => {
    // Requête SQL pour récupérer un utilisateur par son ID
    try {
    const query = await sql`
        SELECT *
        FROM utilisateur
        WHERE idutilisateur = ${idutilisateur}
        LIMIT 1
    `;

        // Exécution de la requête SQL
        // Exécution de la requête avec "await"

        if (query.length === 0) {
            throw new Error('Utilisateur non trouvé');
        }

        // Retourne le premier utilisateur trouvé
        return query[0];  // Renvoie l'utilisateur trouvé
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteUtilisateur = async (idutilisateur) => {
    try {
        const result = await sql`
            DELETE FROM utilisateur
            WHERE idutilisateur = ${idutilisateur}
            RETURNING idutilisateur, nom, prenom, email`;
        if (result.length === 0) {
            throw new Error('Aucun utilisateur trouvé avec cet ID');
        }

        return result[0]; // Retourne les informations de l'utilisateur supprimé
    } catch (error) {
        throw new Error('Erreur lors de la suppression de l\'utilisateur : ' + error.message);
    }
};





