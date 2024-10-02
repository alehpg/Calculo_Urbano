import express from 'express';
import cors from 'cors';
import router from './routes/projetos.mjs'; // Certifique-se de que o caminho esteja correto
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();

// Middleware para permitir CORS
app.use(cors());
app.use(express.json()); // Para interpretar requisições com JSON

// Extrai as partes da URL do banco de dados
const dbUrl = new URL(process.env.DATABASE_URL);

// Configuração de conexão com o banco de dados
const connectionConfig = {
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace('/', ''),  // Remove a barra inicial do nome do banco
  port: dbUrl.port || 3306,  // Usa a porta padrão do MySQL se não estiver especificada
};

// Função assíncrona para inicializar a conexão e o servidor
async function startServer() {
  try {
    // Cria a conexão com o MySQL
    const db = await mysql.createConnection(connectionConfig);
    console.log('Conexão com o banco de dados estabelecida');

    // Define o roteamento principal
    app.use('/api', router);

    // Inicia o servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1); // Encerra o processo se a conexão falhar
  }
}

// Inicia o servidor e a conexão com o banco de dados
startServer();

export default app;

