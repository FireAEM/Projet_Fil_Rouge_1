const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');


const Utilisateur = require('./models/utilisateur');



require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

// Configuration de la session
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // true si vous êtes en HTTPS
        maxAge: 60 * 60 * 1000 // 1 heure
    }
}));



// Endpoints utilisateur

app.get('/utilisateur', async (req, res) => {
    try {
        const utilisateur = await Utilisateur.getAllUser();
        res.status(200).json(utilisateur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/utilisateur/:id_utilisateur', async (req, res) => {
    try {
        const utilisateur = await Utilisateur.getUserById(req.params.id_utilisateur);
        utilisateur ? res.status(200).json(utilisateur) : res.status(404).json({ message: "Utilisateur non trouvé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/utilisateur/connexion', async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;
        const utilisateur = await Utilisateur.getUserByEmail(email);

        if (utilisateur && await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe)) {
            // Création de la session utilisateur
            req.session.userId = utilisateur.id_utilisateur;
            res.status(200).json({ message: "Connexion réussie", utilisateur });
        } else {
            res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/utilisateur/deconnexion', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la déconnexion" });
        }
        res.status(200).json({ message: "Déconnexion réussie" });
    });
});

app.post('/utilisateur', async (req, res) => {
    try {
        const { nom, prenom, email, mot_de_passe, role } = req.body;
        // On hash le mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);
        
        const newUser = await Utilisateur.createUser({
            nom,
            prenom,
            email,
            mot_de_passe: hashedPassword,
            role
        });
        res.status(201).json({ newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/utilisateur/:id_utilisateur', async (req, res) => {
    try {
        const updateUser = await Utilisateur.updateUser(req.params.id_utilisateur, req.body);
        res.status(200).json({ updateUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/utilisateur/:id_utilisateur', async (req, res) => {
    try {
        await Utilisateur.deleteUser(req.params.id_utilisateur);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/utilisateur/:id_utilisateur/role', async (req, res) => {
    try {
        const role = await Utilisateur.getUserRoleById(req.params.id_utilisateur);
        if (role) {
            res.status(200).json({ role });
        } else {
            res.status(404).json({ message: "Utilisateur non trouvé" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});