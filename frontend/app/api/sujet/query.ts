

export const getSujetByidCours = async (idCours:string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACK}/api/sujet/cours/${idCours}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des cours du prof");
    return res.json();
  };


 