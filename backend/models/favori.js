const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

class Favori {
    static async getAllFavori() {
        const result = await pool.query('SELECT * FROM favori');
        return result.rows;
    }

    static async getFavoriById(id_favori) {
        const result = await pool.query('SELECT * FROM favori WHERE id_favori = $1', [id_favori]);
        return result.rows[0];
    }

    static async getFavoriByUtilisateur(id_utilisateur) {
        const result = await pool.query('SELECT * FROM favori WHERE id_utilisateur = $1', [id_utilisateur]);
        return result.rows;
    }

    static async createFavori({ id_annonce, id_utilisateur }) {
        const result = await pool.query(
            'INSERT INTO favori (id_annonce, id_utilisateur) VALUES ($1, $2) RETURNING *',
            [id_annonce, id_utilisateur]
        );
        return result.rows[0];
    }

    static async updateFavori(id_favori, { id_annonce, id_utilisateur }) {
        const result = await pool.query(
            'UPDATE favori SET id_annonce = $1, id_utilisateur = $2 WHERE id_favori = $3 RETURNING *',
            [id_annonce, id_utilisateur, id_favori]
        );
        return result.rows[0];
    }    

    static async deleteFavori(id_favori) {
        await pool.query(
            'DELETE FROM favori WHERE id_favori = $1',
            [id_favori]
        );
    }
}

module.exports = Favori;