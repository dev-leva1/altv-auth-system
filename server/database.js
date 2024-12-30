import mysql from 'mysql2/promise';

const dbConfig = {
    host: '',
    user: '',
    password: '',
    database: ''
};

let connection = null;

export async function initDatabase() {
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP NULL
            )
        `);
    } catch (error) {
        throw error;
    }
}

export async function findUserByUsername(username) {
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
}

export async function findUserByEmail(email) {
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
}

export async function createUser(username, email, passwordHash) {
    try {
        const [result] = await connection.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, passwordHash]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

export async function updateLastLogin(userId) {
    try {
        await connection.execute(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [userId]
        );
        return true;
    } catch (error) {
        throw error;
    }
} 