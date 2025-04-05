import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import sql from './config/db.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import copieRoutes from './routes/copieRoutes.js';
import correctionRoutes from './routes/correctionRoutes.js';
import coursRoutes from './routes/coursRoutes.js';
import etudiantRoutes from './routes/etudiantRoutes.js';
// import plagiatCopieRoutes from './routes/plagiatCopieRoutes.js';
// import plagiatRoutes from './routes/plagiatRoutes.js';
import professeurRoutes from './routes/professeurRoutes.js';
import statistiqueRoutes from './routes/statistiqueRoutes.js';
import suivreRoutes from './routes/suivreRoutes.js';
import sujetRoutes from './routes/sujetRoutes.js';
import utilisateurRoutes from './routes/utilisateurRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: '*', // ou '*' en développement
  credentials: true
}));

// Session Middleware
app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Test connexion PostgreSQL
(async () => {
  try {
    await sql`SELECT 1`;
    console.log("✅ Connexion à PostgreSQL réussie !");
  } catch (error) {
    console.error("❌ Erreur de connexion à PostgreSQL :", error);
    process.exit(1);
  }
})();

// Routes
app.get('/', (req, res) => {
  res.send("🚀 Serveur Node.js avec PostgreSQL en ligne !");
});

app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/cours', coursRoutes);
app.use('/api/sujet', sujetRoutes);
app.use('/api/correction', correctionRoutes);
app.use('/api/copie', copieRoutes);
app.use('/api/etudiant', etudiantRoutes);
app.use('/api/professeur', professeurRoutes);
// app.use('/api/plagiat', plagiatRoutes);
// app.use('/api/plagiat-copie', plagiatCopieRoutes);
app.use('/api/suivre', suivreRoutes);
app.use('/api', chatbotRoutes);
app.use('/api/statistiques', statistiqueRoutes);

// Route introuvable
app.use('*', (req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
