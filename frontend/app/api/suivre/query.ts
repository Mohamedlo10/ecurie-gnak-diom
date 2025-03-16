
  export const insererEtudiantDansCours = async (idcours: string, email: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACK}/api/suivre`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idcours, email }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'etudiant:", error);
      throw error; // Pour gérer l'erreur dans `handleAuth`
    }
  };





  export const supprimerEtudiantInCours = async (idCours: string,idutilisateur:string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACK}/api/suivre`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idCours, idutilisateur }),
        }
        
      );
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors du retrait de l'eleve:", error);
      throw error; // Pour gérer l'erreur dans `handleAuth`
    }
  };


