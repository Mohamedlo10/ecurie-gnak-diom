import 'dotenv/config'; // Charge automatiquement les variables d'environnement du fichier .env
import sql from './db.js'; // Importer la connexion à la base de données

async function testConnection() {
  try {
    const result = await sql`SELECT NOW();`;
    console.log('Connexion réussie ! Date du serveur :', result[0].now);
  } catch (error) {
    console.error('Erreur de connexion :', error);
  } finally {
    await sql.end(); // Fermer la connexion proprement
  }
}

testConnection();