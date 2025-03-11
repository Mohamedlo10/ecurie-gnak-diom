

export const fetchUtilisateurs = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACK}/api/utilisateurs`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
    return res.json();
  };


export const userConnection = async(email:string,motdepasse:string) => {
    fetch(`${process.env.NEXT_PUBLIC_URL_BACK}/api/utilisateurs/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          motdepasse: motdepasse
        })
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error("Erreur:", error));
      
}