const pool = require('./db');
const bcrypt = require('bcryptjs');

async function initDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS hackathons (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            status VARCHAR(50) DEFAULT 'Active',
            start_date DATE,
            end_date DATE,
            participants INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS teams (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            hackathon_id INT REFERENCES hackathons(id) ON DELETE CASCADE,
            created_by VARCHAR(100),
            max_members INT DEFAULT 4,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS team_members (
            id SERIAL PRIMARY KEY,
            team_id INT REFERENCES teams(id) ON DELETE CASCADE,
            user_name VARCHAR(100) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS problems (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT NOT NULL,
            difficulty VARCHAR(20) DEFAULT 'Medium',
            hackathon_id INT REFERENCES hackathons(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS submissions (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT NOT NULL,
            github VARCHAR(500) NOT NULL,
            demo VARCHAR(500),
            file_path VARCHAR(500),
            hackathon_id INT REFERENCES hackathons(id) ON DELETE CASCADE,
            submitted_by VARCHAR(100) NOT NULL,
            score INT,
            submitted_at TIMESTAMP DEFAULT NOW()
        );
    `);

    const adminExists = await pool.query("SELECT id FROM users WHERE email = 'admin@hack.com'");
    if (adminExists.rows.length === 0) {
        const hash = await bcrypt.hash('admin', 10);
        await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
            ['Admin', 'admin@hack.com', hash, 'admin']
        );
        await pool.query(
            "INSERT INTO hackathons (title, description, status) VALUES ($1, $2, $3), ($4, $5, $6)",
            ['AI Innovation Challenge 2024', 'Build innovative AI solutions', 'Active',
             'Web3 Hackathon', 'Explore decentralized technologies', 'Active']
        );
    }

    console.log('Database initialized');
}

module.exports = initDB;
