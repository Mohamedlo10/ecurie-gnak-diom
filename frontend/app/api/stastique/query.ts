export const getStatistiqueProfesseur = async (idprofesseur: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACK}/api/statistiques/professeur/${idprofesseur}`
  );
  if (!res.ok)
    throw new Error(
      "Erreur lors de la récupération des statistique de ce professeur"
    );
  return res.json();
};

export const getStatistiqueEtudiant = async (idetudiant: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACK}/api/statistiques/etudiant/${idetudiant}`
  );
  if (!res.ok)
    throw new Error(
      "Erreur lors de la récupération des statistique de ce professeur"
    );
  return res.json();
};
