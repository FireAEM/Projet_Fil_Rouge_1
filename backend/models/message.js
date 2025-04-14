const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

class Message {
    static async getAllMessages() {
        const result = await pool.query('SELECT * FROM message');
        return result.rows;
    }

    static async getMessageById(id_message) {
        const result = await pool.query('SELECT * FROM message WHERE id_message = $1', [id_message]);
        return result.rows[0];
    }

    static async getMessagesByExpediteur(id_expediteur) {
        const result = await pool.query('SELECT * FROM message WHERE id_expediteur = $1', [id_expediteur]);
        return result.rows;
    }

    static async getMessagesByRecepteur(id_recepteur) {
        const result = await pool.query('SELECT * FROM message WHERE id_recepteur = $1', [id_recepteur]);
        return result.rows;
    }

    static async getConversation(id_utilisateur1, id_utilisateur2) {
        const result = await pool.query(
            `SELECT * FROM message 
             WHERE (id_expediteur = $1 AND id_recepteur = $2) 
             OR (id_expediteur = $2 AND id_recepteur = $1)
             ORDER BY date_envoi ASC`,
            [id_utilisateur1, id_utilisateur2]
        );
        return result.rows;
    }

    static async createMessage({ contenu, date_envoi, id_expediteur, id_recepteur }) {
        const result = await pool.query(
            'INSERT INTO message (contenu, date_envoi, id_expediteur, id_recepteur) VALUES ($1, $2, $3, $4) RETURNING *',
            [contenu, date_envoi, id_expediteur, id_recepteur]
        );
        return result.rows[0];
    }
    
    static async updateMessage(id_message, { contenu, date_envoi }) {
        const result = await pool.query(
            'UPDATE message SET contenu = $1, date_envoi = $2 WHERE id_message = $3 RETURNING *',
            [contenu, date_envoi, id_message]
        );
        return result.rows[0];
    }

    static async deleteMessage(id_message) {
        await pool.query(
            'DELETE FROM message WHERE id_message = $1',
            [id_message]
        );
    }
}

module.exports = Message;
