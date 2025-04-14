const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');


const Utilisateur = require('./models/utilisateur');
const Categorie = require('./models/categorie');
const Annonce = require('./models/annonce');
const Favori = require('./models/favori');



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



//EndPoint categorie

app.post('/categorie', async (req, res) => {
    try {
        const newCategorie = await Categorie.createCategorie(req.body);
        res.status(201).json({ newCategorie });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/categorie', async (req, res) => {
    try {
        const categories = await Categorie.getAllCategorie();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/categorie/:id_categorie', async (req, res) => {
    try {
        const categorie = await Categorie.getCategorieById(req.params.id_categorie);
        categorie ? res.status(200).json(categorie) : res.status(404).json({ message: "Catégorie non trouvée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/categorie/:id_categorie', async (req, res) => {
    try {
        const updatedCategorie = await Categorie.updateCategorie(req.params.id_categorie, req.body);
        res.status(200).json({ updatedCategorie });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/categorie/:id_categorie', async (req, res) => {
    try {
        await Categorie.deleteCategorie(req.params.id_categorie);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



//EndPoint annonce

app.post('/annonce', async (req, res) => {
    try {
        const newAnnonce = await Annonce.createAnnonce(req.body);
        res.status(201).json({ newAnnonce });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/annonce', async (req, res) => {
    try {
        const annonces = await Annonce.getAllAnnonce();
        res.status(200).json(annonces);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/annonce/:id_annonce', async (req, res) => {
    try {
        const annonce = await Annonce.getAnnonceById(req.params.id_annonce);
        annonce ? res.status(200).json(annonce) : res.status(404).json({ message: "Annonce non trouvée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/annonce/categorie/:id_categorie', async (req, res) => {
    try {
        const annonces = await Annonce.getAnnonceByCategorie(req.params.id_categorie);
        annonces.length > 0 ? res.status(200).json(annonces) : res.status(404).json({ message: "Aucune annonce trouvée pour cette catégorie" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/annonce/utilisateur/:id_utilisateur', async (req, res) => {
    try {
        const annonces = await Annonce.getAnnonceByUtilisateur(req.params.id_utilisateur);
        annonces.length > 0 ? res.status(200).json(annonces) : res.status(404).json({ message: "Aucune annonce trouvée pour cet utilisateur" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/annonce/:id_annonce', async (req, res) => {
    try {
        const updatedAnnonce = await Annonce.updateAnnonce(req.params.id_annonce, req.body);
        res.status(200).json({ updatedAnnonce });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/annonce/:id_annonce', async (req, res) => {
    try {
        await Annonce.deleteAnnonce(req.params.id_annonce);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



//EndPoint favori

app.get('/favori', async (req, res) => {
    try {
        const favoris = await Favori.getAllFavori();
        res.status(200).json(favoris);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/favori/:id_favori', async (req, res) => {
    try {
        const favori = await Favori.getFavoriById(req.params.id_favori);
        favori ? res.status(200).json(favori) : res.status(404).json({ message: "Favori non trouvé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/favori/utilisateur/:id_utilisateur', async (req, res) => {
    try {
        const favoris = await Favori.getFavoriByUtilisateur(req.params.id_utilisateur);
        favoris.length > 0 ? res.status(200).json(favoris) : res.status(404).json({ message: "Aucun favori trouvé pour cet utilisateur" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/favori', async (req, res) => {
    try {
        const newFavori = await Favori.createFavori(req.body);
        res.status(201).json({ newFavori });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/favori/:id_favori', async (req, res) => {
    try {
        const updatedFavori = await Favori.updateFavori(req.params.id_favori, req.body);
        res.status(200).json({ updatedFavori });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/favori/:id_favori', async (req, res) => {
    try {
        await Favori.deleteFavori(req.params.id_favori);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});