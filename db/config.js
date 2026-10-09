import mysql from 'mysql2'

const pool = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gerenciador_tarefas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 10
});