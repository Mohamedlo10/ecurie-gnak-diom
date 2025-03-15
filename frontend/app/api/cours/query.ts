

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
  


  export const userDeConnection = () => {
    try {
      localStorage.removeItem('role_user');
      localStorage.removeItem('user_session');
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error; // Pour gérer l'erreur dans `handleAuth`
    }
  };



export const userInscription = async (
  email: string,
  motdepasse: string,
  nom: string,
  prenom: string,
  role: string,
  ine?: string
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BACK}/api/utilisateurs/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          motdepasse,
          role,
          ine: ine || null,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur:", error);
    throw error; 
  }
};


