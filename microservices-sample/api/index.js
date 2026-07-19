require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.PGHOST || 'postgres',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'sampledb',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT,10) : 5432,
});

async function initDb(){
  const client = await pool.connect();
  try{
    await client.query(`CREATE TABLE IF NOT EXISTS tasks (id SERIAL PRIMARY KEY, title TEXT NOT NULL)`);
  } finally { client.release(); }
}

app.get('/api/health', (req,res) => res.json({status:'ok'}));

app.get('/api/tasks', async (req,res) => {
  const { rows } = await pool.query('SELECT id,title FROM tasks ORDER BY id DESC LIMIT 100');
  res.json(rows);
});

app.post('/api/tasks', async (req,res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({error:'title required'});
  const { rows } = await pool.query('INSERT INTO tasks(title) VALUES($1) RETURNING id,title', [title]);
  res.status(201).json(rows[0]);
});

const port = process.env.PORT || 3000;
initDb().then(()=>{
  app.listen(port, ()=> console.log('API listening on', port));
}).catch(err=>{ console.error('DB init failed', err); process.exit(1); });
