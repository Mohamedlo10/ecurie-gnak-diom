import sql from '../config/db.js'; 

  
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
        if (result.length === 0) {
            throw new Error('Utilisateur non trouvé');
        }

        // Retourne le premier utilisateur trouvé
        return result[0];  // Si trouvé, retourne l'utilisateur
    } catch (error) {
        // Gestion des erreurs
        throw new Error(error.message);
    }
};
// Fonction pour créer un nouvel utilisateur
export const createUser = async (nom, prenom, email, motdepasse) => {
    // Requête SQL pour insérer un nouvel utilisateur
    const query = sql`
        INSERT INTO utilisateur (nom, prenom, email, motdepasse)
        VALUES (${nom}, ${prenom}, ${email}, ${motdepasse})
        RETURNING idutilisateur, nom, prenom, email
    `;

    try {
        // Exécution de la requête SQL
        const { rows } = await query;  // L'utilisation de "await" ici permet d'attendre que la requête soit exécutée

        // Si l'utilisateur a été inséré, retourne les données de l'utilisateur
        return rows[0];  // Retourne le premier utilisateur inséré
    } catch (error) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
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





