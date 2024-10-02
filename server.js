import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projetoRouter from './routes/projeto.mjs';
import posteRouter from './routes/postes.mjs'; // Certifique-se de importar o arquivo de rotas corretamente
import db from './db.mjs'; // Importa a conexão do banco de dados

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Verificar conexão com o banco de dados
db.connect().then(() => {
  console.log('Banco de dados conectado com sucesso!');
}).catch((err) => {
  console.error('Erro ao conectar ao banco de dados:', err);
});

// Define as rotas
app.use('/api/projetos', projetoRouter); // Use o roteador de projetos
app.use('/api/postes', posteRouter);     // Use o roteador de postes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
