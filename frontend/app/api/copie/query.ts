

export const getCopieByidSujet = async (idSujet:string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACK}/api/copie/sujet/${idSujet}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des copies du sujet");
    return res.json();
  };


  export const getCopieByidSujetAndIdUser = async (idsujet:string,idutilisateur:string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACK}/api/copie/${idsujet}/${idutilisateur}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération de la copie");
    return res.json();
  };

  export const creerCopie = async (idsujet: string, idutilisateur: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('idsujet', idsujet);
      formData.append('idutilisateur', idutilisateur);
      formData.append('file', file);
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACK}/api/copie`,
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
