

export const getCoursByidProf = async (idProf:string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACK}/api/cours/professeur/${idProf}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des cours du prof");
    return res.json();
  };


  export const getCoursByidEtudiant = async (idEtudiant:string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACK}/api/suivre/cours/${idEtudiant}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des cours de l'tudiant");
    return res.json();
  };

  export const getEtudiantsByIdCours = async (coursId:string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACK}/api/suivre/etudiant/${coursId}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des cours de l'tudiant");
    return res.json();
  };

  export const getCoursByid = async (idCours:string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACK}/api/cours/${idCours}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération du cours");
    return res.json();
  };

  export const creerCours = async (nomCours: string, idutilisateur: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACK}/api/cours`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nomCours, idutilisateur }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la creation du cours:", error);
      throw error; // Pour gérer l'erreur dans `handleAuth`
    }
  };
  export const modifierCours = async (idCours: string, nomCours: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACK}/api/cours`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idCours, nomCours }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la creation du cours:", error);
      throw error; // Pour gérer l'erreur dans `handleAuth`
    }
  };
  





  export const suprimerCours = async (idCours: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACK}/api/cours/${idCours}`,
        {
          method: "DELETE",
        }
      );
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la suppression du cours:", error);
      throw error; // Pour gérer l'erreur dans `handleAuth`
    }
  };


