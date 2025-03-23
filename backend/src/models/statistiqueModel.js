import sql from "../config/db.js";

// Statistiques par sujet

// Moyenne, Min, Max et Ecart-type des notes pour CHAQUE sujet
export const getStatistiquesNotesSujets = async () => {
    return await sql`
        SELECT 
            s.idsujet,
            s.nomsujet,
            AVG(c.notefinal) AS moyenne,
            MIN(c.notefinal) AS note_min,
            MAX(c.notefinal) AS note_max,
            STDDEV(c.notefinal) AS ecart_type
        FROM sujet s
        LEFT JOIN copie c ON s.idsujet = c.idsujet
        GROUP BY s.idsujet, s.nomsujet;
    `;
};

// Nombre d'étudiants ayant soumis une copie pour CHAQUE sujet
export const getNombreEtudiantsSujets = async () => {
    return await sql`
        SELECT 
            s.idsujet,
            s.nomsujet,
            COUNT(DISTINCT c.idutilisateur) AS nombre_etudiants
        FROM sujet s
        LEFT JOIN copie c ON s.idsujet = c.idsujet
        GROUP BY s.idsujet, s.nomsujet;
    `;
};

// Statistiques par étudiant

// Moyenne générale de CHAQUE étudiant toutes matières confondues
export const getMoyenneGeneraleEtudiants = async () => {
    return await sql`
        SELECT 
            u.idutilisateur,
            u.nom,
            u.prenom,
            AVG(c.notefinal) AS moyenne_generale
        FROM utilisateur u
        INNER JOIN copie c ON u.idutilisateur = c.idutilisateur
        GROUP BY u.idutilisateur, u.nom, u.prenom;
    `;
};

// Moyenne par cours suivis par CHAQUE étudiant
export const getMoyenneCoursEtudiants = async () => {
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
        GROUP BY u.idutilisateur, u.nom, u.prenom, co.idcours, co.nomcours;
    `;
};

// Nombre de sujets traités par CHAQUE étudiant
export const getNombreSujetsTraitesEtudiants = async () => {
    return await sql`
        SELECT
            u.idutilisateur,
            u.nom,
            u.prenom,
            COUNT(DISTINCT c.idsujet) AS nombre_sujets_traites
        FROM utilisateur u
        INNER JOIN copie c ON u.idutilisateur = c.idutilisateur
        GROUP BY u.idutilisateur, u.nom, u.prenom;
    `;
};

// Statistiques par cours

// Nombre d'étudiants inscrits par CHAQUE cours
export const getNombreEtudiantsCours = async () => {
    return await sql`
        SELECT 
            co.idcours,
            co.nomcours,
            COUNT(DISTINCT s.idutilisateur) AS nombre_etudiants_inscrits
        FROM cours co
        LEFT JOIN suivre s ON co.idcours = s.idcours
        GROUP BY co.idcours, co.nomcours;
    `;
};
