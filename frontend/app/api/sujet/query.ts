

export const getSujetByidCours = async (idCours:string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACK}/api/sujet/cours/${idCours}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des cours du prof");
    return res.json();
  };

  export const creerSujet = async (nomSujet: string, idCours: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('nomSujet', nomSujet);
      formData.append('idCours', idCours);
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
  