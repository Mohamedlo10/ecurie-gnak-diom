import Cookies from 'js-cookie';


export const fetchUtilisateurs = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACK}/api/utilisateurs`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
    return res.json();
  };


  export const userConnection = async (email: string, motdepasse: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACK}/api/utilisateurs/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, motdepasse }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      const userJson = JSON.stringify(data.utilisateur);

      Cookies.set('user', userJson, { expires: 1 });
      Cookies.set('token', data.token, { expires: 1 });

    
      return data;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error; // Pour gérer l'erreur dans `handleAuth`
    }
  };
  


  export const userDeConnection = () => {
    try {
      Cookies.remove('user');
      Cookies.remove('token');
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
    const userJson = JSON.stringify(data.utilisateur);
    Cookies.set('user', userJson, { expires: 1 });
    Cookies.set('token', data.token, { expires: 1 });

    return data;
  } catch (error) {
    console.error("Erreur:", error);
    throw error; 
  }
};


