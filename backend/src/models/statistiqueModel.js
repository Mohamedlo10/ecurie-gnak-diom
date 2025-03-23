import sql from "../config/db.js";

// STATISTIQUES POUR LE PROFESSEUR CONNECTÉ

// Moyenne, Min, Max, Écart-type des notes par sujet du professeur connecté
export const getStatistiquesNotesSujetsProf = async (idUtilisateur) => {
    console.log(idUtilisateur);
    const query = await sql`
        SELECT
            s.idsujet,
            s.nomsujet,
            AVG(c.notefinal) AS moyenne,
            MIN(c.notefinal) AS note_min,
            MAX(c.notefinal) AS note_max,
            STDDEV(c.notefinal) AS ecart_type,
            COUNT(CASE WHEN c.notefinal >= 10 THEN 1 END) AS nombre_eleves_ayant_moyenne,
            COUNT(CASE WHEN c.notefinal < 10 THEN 1 END) AS nombre_eleves_sans_moyenne
        FROM sujet s
        INNER JOIN cours co ON s.idcours = co.idcours
        LEFT JOIN copie c ON s.idsujet = c.idsujet
        WHERE co.idutilisateur = ${idUtilisateur}
        GROUP BY s.idsujet, s.nomsujet;
    `;
    return query;
};

// Nombre d'étudiants ayant soumis une copie par sujet du professeur connecté
export const getNombreEtudiantsParSujetProf = async (idUtilisateur) => {
    return await sql`
        SELECT
            s.idsujet,
            s.nomsujet,
            COUNT(DISTINCT c.idutilisateur) AS nombre_etudiants
        FROM sujet s
        INNER JOIN cours co ON s.idcours = co.idcours
        LEFT JOIN copie c ON s.idsujet = c.idsujet
        WHERE co.idutilisateur = ${idUtilisateur}
        GROUP BY s.idsujet, s.nomsujet;
    `;
};

// Moyenne générale par étudiant (toutes matières confondues) pour les étudiants du professeur connecté
export const getMoyenneGeneraleEtudiantsProf = async (idUtilisateur) => {
    return await sql`
        SELECT
            u.idutilisateur,
            u.nom,
            u.prenom,
            AVG(c.notefinal) AS moyenne_generale
        FROM utilisateur u
        INNER JOIN copie c ON u.idutilisateur = c.idutilisateur
        INNER JOIN sujet s ON c.idsujet = s.idsujet
        INNER JOIN cours co ON s.idcours = co.idcours
        WHERE co.idutilisateur = ${idUtilisateur}
        GROUP BY u.idutilisateur, u.nom, u.prenom;
    `;
};

// Moyenne par cours suivis par étudiant pour les cours du professeur connecté
export const getMoyenneCoursParEtudiantProf = async (idUtilisateur) => {
    return await sql`
        SELECT
            u.idutilisateur,
            u.nom,
            u.prenom,
            co.idcours,
            co.nomcours,
            AVG(c.notefinal) AS moyenne_cours
        FROM utilisateur u
        INNER JOIN copie c ON u.idutilisateur = c.idutilisateur
        INNER JOIN sujet s ON c.idsujet = s.idsujet
        INNER JOIN cours co ON s.idcours = co.idcours
        WHERE co.idutilisateur = ${idUtilisateur}
        GROUP BY u.idutilisateur, u.nom, u.prenom, co.idcours, co.nomcours;
    `;
};

// Nombre de sujets traités par étudiant dans les cours du professeur connecté
export const getNombreSujetsTraitesParEtudiantProf = async (idUtilisateur) => {
    return await sql`
        SELECT
            u.idutilisateur,
            u.nom,
            u.prenom,
            COUNT(DISTINCT c.idsujet) AS nombre_sujets_traites
        FROM utilisateur u
        INNER JOIN copie c ON u.idutilisateur = c.idutilisateur
        INNER JOIN sujet s ON c.idsujet = s.idsujet
        INNER JOIN cours co ON s.idcours = co.idcours
        WHERE co.idutilisateur = ${idUtilisateur}
        GROUP BY u.idutilisateur, u.nom, u.prenom;
    `;
};

// Nombre d'étudiants inscrits par cours du professeur connecté
export const getNombreEtudiantsInscritsParCoursProf = async (idUtilisateur) => {
    return await sql`
        SELECT 
            co.idcours,
            co.nomcours,
            COUNT(DISTINCT sv.idutilisateur) AS nombre_etudiants_inscrits
        FROM cours co
        LEFT JOIN suivre sv ON co.idcours = sv.idcours
        WHERE co.idutilisateur = ${idUtilisateur}
        GROUP BY co.idcours, co.nomcours;
    `;
};
