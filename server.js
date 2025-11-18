const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Config PostgreSQL via variables d'environnement
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'db',
  user: process.env.POSTGRES_USER || 'user',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'mydb',
  port: 5432
});

app.use(express.json());

// Route pour tester la DB
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur DB');
  }
});

// Ajouter un utilisateur
app.post('/users', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query('INSERT INTO users(name) VALUES($1) RETURNING *', [name]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur DB');
  }
});

if (require.main === module) {
  app.listen(port, () => console.log(`App running on port ${port}`));
}

module.exports = app;
