

export const getSujetByidCours = async (idCours:string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACK}/api/sujet/cours/${idCours}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des cours du prof");
    return res.json();
  };

  export const creerSujet = async (nomSujet: string, idCours: string, file: File,datesoumission:string) => {
    try {
      const formData = new FormData();
      formData.append('nomSujet', nomSujet);
      formData.append('idCours', idCours);
      formData.append('datesoumission', datesoumission);
      formData.append('file', file);
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACK}/api/sujet`,
        {
          method: 'POST',
          body: formData, 
        }
      );
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la création du sujet:', error);
      throw error; 
    }
  };
  

  export const supprimerSujet = async (idSujet: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACK}/api/sujet/${idSujet}`,
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
      console.error("Erreur lors de la suppression du sujet:", error);
      throw error; // Pour gérer l'erreur dans `handleAuth`
    }
  };
