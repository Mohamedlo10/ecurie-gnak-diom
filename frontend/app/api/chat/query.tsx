export const EnvoyerMessage = async (idsujet: string, question: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BACK}/api/chat/${idsujet}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Erreur lors de la création du sujet:", error);
    throw error;
  }
};
