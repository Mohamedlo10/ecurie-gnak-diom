import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import sql from './config/db.js';
// import PdfParse from 'pdf-parse';
import correctionRoutes from './routes/correctionRoutes.js';
import coursRoutes from './routes/coursRoutes.js';
import sujetRoutes from './routes/sujetRoutes.js';
import utilisateurRoutes from './routes/utilisateurRoutes.js';
import copieRoutes from './routes/copieRoutes.js';
import etudiantRoutes from './routes/etudiantRoutes.js';
import professeurRoutes from './routes/professeurRoutes.js';
import plagiatRoutes from './routes/plagiatRoutes.js';
import plagiatCopieRoutes from './routes/plagiatCopieRoutes.js';
import suivreRoutes from './routes/suivreRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test de connexion à la base de données
(async () => {
  try {
    await sql`SELECT 1`;
    console.log(process.env.JWT_SECRET);
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
app.use('/api/cours', coursRoutes);
app.use('/api/sujet', sujetRoutes);
app.use('/api/correction', correctionRoutes);
app.use('/api/copie', copieRoutes);
app.use('/api/etudiant', etudiantRoutes);
app.use('/api/professeur', professeurRoutes);
app.use('/api/plagiat', plagiatRoutes);
app.use('/api/plagiat-copie', plagiatCopieRoutes);
app.use('/api/suivre', suivreRoutes);

// Gestion des routes inexistantes
app.use('*', (req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});




/*

const app = express();
app.use(express.json());

// Routes API
app.use("/api/sujets", sujetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});

*/