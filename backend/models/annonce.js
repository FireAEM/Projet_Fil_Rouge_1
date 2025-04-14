const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

class Annonce {
    static async getAllAnnonce() {
        const result = await pool.query('SELECT * FROM annonce');
        return result.rows;
    }
    
    static async getAnnonceById(id_annonce) {
        const result = await pool.query('SELECT * FROM annonce WHERE id_annonce = $1', [id_annonce]);
        return result.rows[0];
    }

    static async getAnnonceByCategorie(id_categorie) {
        const result = await pool.query('SELECT * FROM annonce WHERE id_categorie = $1', [id_categorie]);
        return result.rows;
    }

    static async getAnnonceByUtilisateur(id_utilisateur) {
        const result = await pool.query('SELECT * FROM annonce WHERE id_utilisateur = $1', [id_utilisateur]);
        return result.rows;
    }

    static async createAnnonce({ titre, description, prix, localisation, image_annonce, date_creation, id_categorie, id_utilisateur }) {
        const result = await pool.query(
            'INSERT INTO annonce (titre, description, prix, localisation, image_annonce, date_creation, id_categorie, id_utilisateur) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [titre, description, prix, localisation, image_annonce, date_creation, id_categorie, id_utilisateur]
        );
        return result.rows[0];
    }

    static async updateAnnonce(id_annonce, { titre, description, prix, localisation, image_annonce, date_creation, id_categorie, id_utilisateur }) {
        const result = await pool.query(
            'UPDATE annonce SET titre = $1, description = $2, prix = $3, localisation = $4, image_annonce = $5, date_creation = $6, id_categorie = $7, id_utilisateur = $8 WHERE id_annonce = $9 RETURNING *',
            [titre, description, prix, localisation, image_annonce, date_creation, id_categorie, id_utilisateur, id_annonce]
        );
        return result.rows[0];
    }

    static async deleteAnnonce(id_annonce) {
        await pool.query(
            'DELETE FROM annonce WHERE id_annonce = $1',
            [id_annonce]
        );
    }
}

module.exports = Annonce;