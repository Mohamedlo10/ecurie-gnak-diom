import dotenv from 'dotenv';
import postgres from 'postgres';

// Charger les variables d'environnement
dotenv.config();

// Vérifier si DATABASE_URL est bien chargé
/* if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL est introuvable ! Vérifie ton fichier .env");
  process.exit(1);
}
 */
const connectionString = "postgresql://postgres.vvkgkijzjazoehellugh:AliouneDiallo@aws-0-eu-central-1.pooler.supabase.com:6543/postgres";
const sql = postgres(connectionString);

export default sql;
