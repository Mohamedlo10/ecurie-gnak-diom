import sql from '../config/db.js'; 
import bcrypt from 'bcryptjs';
  
// Fonction pour vérifier si un utilisateur existe déjà par email
export const findUserByEmail = async (email) => {
    try {
        // Construire la requête SQL avec les paramètres
        const query = sql`
            SELECT idutilisateur, nom, prenom, email, motdepasse
            FROM utilisateur
            WHERE email = ${email}  
            LIMIT 1
        `;

        // Exécuter la requête et obtenir les résultats
        const result = await query;  // Ici, 'query' est déjà une fonction qui exécute la requête.

        // Vérifie si des utilisateurs ont été trouvés
        // if (result.length === 0) {
        //     throw new Error('Utilisateur non trouvé');
        // }

        // Retourne le premier utilisateur trouvé
        return result[0];  // Si trouvé, retourne l'utilisateur
    } catch (error) {
        // Gestion des erreurs
        throw new Error(error.message);
    }
};
export const getAllUtilisateurs = async () => {
    try {
        // Construire la requête SQL avec les paramètres
        const query = sql`
            SELECT idutilisateur, nom, prenom, email, motdepasse
            FROM utilisateur`;

        // Exécuter la requête et obtenir les résultats
        const result = await query;  // Ici, 'query' est déjà une fonction qui exécute la requête.

        // Vérifie si des utilisateurs ont été trouvés
        if (result.length === 0) {
            throw new Error('Aucun utilisateur trouvé');
        }

        // Retourne le premier utilisateur trouvé
        return result;  // Si trouvé, retourne l'utilisateur
    } catch (error) {
        // Gestion des erreurs
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



// Fonction pour trouver un utilisateur par ID
export const findUserById = async (idutilisateur) => {
    // Requête SQL pour récupérer un utilisateur par son ID
    const query = sql`
        SELECT *
        FROM utilisateur
        WHERE idutilisateur = ${idutilisateur}
        LIMIT 1
    `;

    try {
        // Exécution de la requête SQL
        const { rows } = await query;  // Exécution de la requête avec "await"

        if (rows.length === 0) {
            throw new Error('Utilisateur non trouvé');
        }

        // Retourne le premier utilisateur trouvé
        return rows[0];  // Renvoie l'utilisateur trouvé
    } catch (error) {
        throw new Error(error.message);
    }
};





