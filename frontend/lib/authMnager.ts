


export function getSupabaseUser() {
    const sessionData = localStorage.getItem('user_session');
    return sessionData ? JSON.parse(sessionData) : null;
  }
 /*  async function getToken() {
    try {
      const response = await fetch('/api/token');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }
  
  // Simuler la réponse de /api/token
  const originalFetch = window.fetch;
  
  window.fetch = new Proxy(originalFetch, {
    apply: async function (target, thisArg, argumentsList) {
      if (argumentsList.length > 0 && typeof argumentsList[0] === 'string' && argumentsList[0] === '/api/token') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ token: localStorage.getItem('token') }),
        });
      } else {
        return target.apply(thisArg, argumentsList as [RequestInfo, RequestInit?]);
      }
    },
  });
  
  // Exemple d'utilisation
  export async function utiliserToken() {
    const token = await getToken();
    if (token) {
      console.log('Token récupéré:', token);
    } else {
      console.log('Impossible de récupérer le token.');
    }
  }
  
   */