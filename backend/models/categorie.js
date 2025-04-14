const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

class Categorie {
    static async getAllCategorie() {
        const result = await pool.query('SELECT * FROM categorie');
        return result.rows;
    }

    static async getCategorieById(id_categorie) {
        const result = await pool.query('SELECT * FROM categorie WHERE id_categorie = $1', [id_categorie]);
        return result.rows[0];
    }

    static async createCategorie({ nom }) {
        const result = await pool.query(
            'INSERT INTO categorie (nom) VALUES ($1) RETURNING *',
            [nom]
        );
        return result.rows[0];
    }

    static async updateCategorie(id_categorie, { nom }) {
        const result = await pool.query(
            'UPDATE categorie SET nom = $1 WHERE id_categorie = $2 RETURNING *',
            [nom, id_categorie]
        );
        return result.rows[0];
    }

    static async deleteCategorie(id_categorie) {
        await pool.query(
            'DELETE FROM categorie WHERE id_categorie = $1',
            [id_categorie]
        );
    }
}

module.exports = Categorie;
