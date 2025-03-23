

export const getCorrrectionByidSujet = async (idSujet:string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACK}/api/correction/sujet/${idSujet}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération de la correction pour ce sujet");
    return res.json();
  };



  export const genererCorrection = async (idSujet:string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACK}/api/correction/generate/${idSujet}`,{
          method:"POST"
        }
      );
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la generation de correction:', error);
      throw error; 
    }
  };
  

  export const supprimerCorrection = async (idCorrection: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACK}/api/correction/${idCorrection}`,
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
      console.error("Erreur lors de la suppression de la correction:", error);
      throw error; // Pour gérer l'erreur dans `handleAuth`
    }
  };
