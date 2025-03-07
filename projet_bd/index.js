require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connexion à Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Test de l'API
app.get('/', (req, res) => {
    res.send('API de gestion des examens fonctionne !');
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
