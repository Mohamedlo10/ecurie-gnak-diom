import sql from '../config/db.js';  // Importation de la connexion à la base de données

// Création d'une nouvelle classe
export const createClasse = async (req, res) => {
    const { nom, idprofesseur } = req.body;
    try {
        await sql`
        INSERT INTO classe (nom, idprofesseur, created_at, updated_dat) 
        VALUES (${nom}, ${idprofesseur}, NOW(), NOW())
        `;
        res.status(201).json({ message: 'Classe créée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de la classe' });
    }
};

// Récupérer toutes les classes
export const getAllClasses = async (req, res) => {
    try {
        const result = await sql`SELECT * FROM classe`;
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des classes' });
    }
};

// Récupérer une classe par son ID
export const getClasseById = async (req, res) => {
    const { id } = req.params;
    try {
    const result = await sql`SELECT * FROM classe WHERE id = ${id}`;
    if (result.length === 0) {
        return res.status(404).json({ message: 'Classe non trouvée' });
    }
    res.status(200).json(result[0]);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la classe' });
    }
};


export const getClasseByIdProfesseur = async (req, res) => {
    const { idUtilisateur} = req.params;
    try {
        const result = await sql`SELECT * FROM classe WHERE idprofesseur = ${idUtilisateur}`;
        if (result.length === 0) {
            return res.status(404).json({ message: 'ki diangaleih wull dh' });
        }
        res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Problème amna nk ' });
    }
};


// Mettre à jour une classe
export const updateClasse = async (req, res) => {
    const { id } = req.params;
    const { nom, idprofesseur } = req.body;
    try {
        const result = await sql`UPDATE classe SET nom = ${nom}, idprofesseur = ${idprofesseur}, updated_dat = NOW() WHERE id = ${id}`;
        if (result.count === 0) {
            return res.status(404).json({ message: 'Classe non trouvée' });
        }
        res.status(200).json({ message: 'Classe à jour  nice' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'sé anillerrr dou am' });
    }
};

// Supprimer une classe
export const deleteClasse = async (req, res) => {
    const { id } = req.params;
    try {
        // Effectuer la suppression
        const result = await sql`DELETE FROM classe WHERE id = ${id}`;
        
        // Vérifiez si des lignes ont été supprimées
        if (result.count === 0 || result.rowCount === 0) {
            return res.status(404).json({ message: 'Classe non trouvée' });
        }

        res.status(200).json({ message: 'Classe supprimée avec succès' });
    } catch (error) {
        console.error("Erreur de suppression:", error);  // Affichez l'erreur pour faciliter le débogage
        res.status(500).json({ message: 'Erreur lors de la suppression de la classe' });
    }
};

