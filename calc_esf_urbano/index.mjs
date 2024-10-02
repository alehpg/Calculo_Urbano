import functions from 'firebase-functions';
import mysql from 'mysql2/promise';
import express from 'express';
import cors from 'cors';



// Configuração de conexão ao banco de dados
const dbConfig = {
  host: 'junction.proxy.rlwy.net',
  user: 'root',
  password: 'gXpcxqgczzShiILURRhvfHERFlTtrnfz',
  database: 'railway',
  port: 27494
};

// Criar instância do Express e middleware CORS
const app = express();
app.use(cors({ origin: true }));
app.use(express.json()); // Para permitir parsing de JSON nas requisições

// Função para testar a conexão ao banco de dados
export const testDatabaseConnection = functions.https.onRequest(async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
    res.status(200).send(`A solução é: ${rows[0].solution}`);
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    res.status(500).send('Erro ao conectar ao banco de dados.');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Funções CRUD para "Projetos"

// Função para buscar todos os projetos
// Função para buscar todos os projetos com filtro de status e pesquisa
app.get('/projetos', async (req, res) => {
  const { status, query } = req.query;
  let connection;
  try {
      connection = await mysql.createConnection(dbConfig);

      let sql = 'SELECT * FROM projetos WHERE 1=1';
      const queryParams = [];

      if (status) {
          sql += ' AND status = ?';
          queryParams.push(status);
      }

      if (query) {
          sql += ' AND (cidade LIKE ? OR empresa LIKE ? OR concessionaria LIKE ?)';
          const searchTerm = `%${query}%`;
          queryParams.push(searchTerm, searchTerm, searchTerm);
      }

      const [results] = await connection.query(sql, queryParams);
      res.json(results);
  } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      res.status(500).json({ error: 'Erro ao buscar projetos.' });
  } finally {
      if (connection) await connection.end();
  }
});


// Função para obter um projeto pelo ID
app.get('/projetos/:id', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.query('SELECT * FROM projetos WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }
    res.json(results[0]);
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    res.status(500).json({ error: 'Erro ao buscar projeto.' });
  } finally {
    if (connection) await connection.end();
  }
});

// Função para criar um novo projeto
app.post('/projetos', async (req, res) => {
  const { nome_projeto, cidade, empresa, concessionaria, status } = req.body;

  // Verifique se todos os campos obrigatórios foram fornecidos
  if (!nome_projeto || !cidade || !empresa || !concessionaria || !status) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  let connection;
  try {
    // Cria a conexão com o banco de dados
    connection = await mysql.createConnection(dbConfig);

    // Insere o novo projeto no banco de dados
    const [result] = await connection.query(
      'INSERT INTO projetos (nome_projeto, cidade, empresa, concessionaria, status) VALUES (?, ?, ?, ?, ?)',
      [nome_projeto, cidade, empresa, concessionaria, status]
    );

    // Retorna sucesso e o ID do projeto criado
    res.status(201).json({ success: true, message: 'Projeto criado com sucesso', id: result.insertId });

  } catch (error) {
    // Log de erro detalhado
    console.error('Erro ao criar projeto:', error);

    // Retorna uma resposta de erro
    res.status(500).json({ error: 'Erro ao criar projeto.' });
  } finally {
    // Encerra a conexão com o banco de dados
    if (connection) await connection.end();
  }
});


// Função para atualizar um projeto
app.put('/projetos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome_projeto, cidade, empresa, concessionaria, status } = req.body;
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query(
      'UPDATE projetos SET nome_projeto = ?, cidade = ?, empresa = ?, concessionaria = ?, status = ? WHERE id = ?',
      [nome_projeto, cidade, empresa, concessionaria, status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }
    res.status(200).json({ success: true, message: 'Projeto atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    res.status(500).json({ error: 'Erro ao atualizar projeto.' });
  } finally {
    if (connection) await connection.end();
  }
});

// Função para deletar um projeto
app.delete('/projetos/:id/excluir', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query('DELETE FROM projetos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }
    res.json({ message: 'Projeto deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    res.status(500).json({ error: 'Erro ao deletar projeto.' });
  } finally {
    if (connection) await connection.end();
  }
});

// Função para concluir um projeto
app.put('/projetos/:id/concluir', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query('UPDATE projetos SET status = ? WHERE id = ?', ['finalizado', id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }
    res.status(200).json({ success: true, message: 'Projeto concluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao concluir projeto:', error);
    res.status(500).json({ error: 'Erro ao concluir projeto.' });
  } finally {
    if (connection) await connection.end();
  }
});

// Função para obter o último poste de um projeto
app.get('/postes/:projetoId/ultimoPoste', async (req, res) => {
  const { projetoId } = req.params;
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.query('SELECT * FROM postes WHERE projetoId = ? ORDER BY id DESC LIMIT 1', [projetoId]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Nenhum poste encontrado para este projeto.' });
    }
    res.json(results[0]);
  } catch (error) {
    console.error('Erro ao buscar último poste:', error);
    res.status(500).json({ error: 'Erro ao buscar o último poste.' });
  } finally {
    if (connection) await connection.end();
  }
});



// Exportar todas as rotas como uma função HTTP do Firebase
export const api = functions.https.onRequest(app);
