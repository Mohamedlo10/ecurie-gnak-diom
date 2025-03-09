import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import sql from './config/db.js';
import utilisateurRoutes from './routes/utilisateurRoutes.js';
import classeRoutes from './routes/classeRoutes.js';
import bcrypt from 'bcrypt';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test de connexion à la base de données
(async () => {
  try {
    await sql`SELECT 1`;
    console.log("✅ Connexion à PostgreSQL réussie !");
  } catch (error) {
    console.error("❌ Erreur de connexion à PostgreSQL :", error);
    process.exit(1);
  }
})();

// Routes de base
app.get('/', (req, res) => {
  res.send("🚀 Serveur Node.js avec PostgreSQL en ligne !");
});

// Utilisation des routes API
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/classe', classeRoutes);

// Gestion des routes inexistantes
app.use('*', (req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});