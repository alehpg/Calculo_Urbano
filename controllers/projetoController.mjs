import db from '../db.mjs';  // Importa a conexão com o banco de dados

// Função para obter um projeto pelo ID
export const getProjetoById = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM projetos WHERE id = ?";

  try {
    const [results] = await db.query(sql, [id]);
    if (results.length === 0) {
      return res.status(404).json({ success: false, error: "Projeto não encontrado." });
    }
    res.json({ success: true, data: results[0] });
  } catch (err) {
    console.error('Erro ao buscar projeto:', err);
    return res.status(500).json({ success: false, error: "Erro ao buscar projeto." });
  }
};

// Função para criar um novo projeto
export const createProjeto = async (req, res) => {
  const { nome_projeto, cidade, empresa, concessionaria, status } = req.body;

  if (!nome_projeto || !cidade || !empresa || !concessionaria || !status) {
    return res.status(400).json({ success: false, error: "Todos os campos são obrigatórios." });
  }

  try {
    const sql = 'INSERT INTO projetos (nome_projeto, cidade, empresa, concessionaria, status) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [nome_projeto, cidade, empresa, concessionaria, status]);
    res.status(201).json({ success: true, message: 'Projeto criado com sucesso.', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    res.status(500).json({ success: false, error: 'Erro ao criar projeto.' });
  }
};

// Função para atualizar um projeto existente
export const updateProjeto = async (req, res) => {
  const { id } = req.params;
  const { nome_projeto, cidade, empresa, concessionaria, status } = req.body;

  if (!nome_projeto || !cidade || !empresa || !concessionaria || !status) {
    return res.status(400).json({ success: false, error: "Todos os campos são obrigatórios." });
  }

  const sql = "UPDATE projetos SET nome_projeto = ?, cidade = ?, empresa = ?, concessionaria = ?, status = ? WHERE id = ?";
  try {
    const [result] = await db.query(sql, [nome_projeto, cidade, empresa, concessionaria, status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Projeto não encontrado." });
    }
    res.status(200).json({ success: true, message: "Projeto atualizado com sucesso!" });
  } catch (err) {
    console.error('Erro ao atualizar projeto:', err);
    return res.status(500).json({ success: false, error: "Erro ao atualizar projeto." });
  }
};

// Função para deletar um projeto
export const deleteProjeto = async (req, res) => {
  const { id } = req.params;
  console.log(`Tentando excluir projeto com ID: ${id}`);
  
  const sql = "DELETE FROM projetos WHERE id = ?";

  try {
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      console.log('Projeto não encontrado.');
      return res.status(404).json({ success: false, error: "Projeto não encontrado." });
    }

    console.log('Projeto excluído com sucesso!');
    res.json({ success: true, message: 'Projeto deletado com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar projeto:', err);
    return res.status(500).json({ success: false, error: 'Erro ao deletar projeto.' });
  }
};

// Função para buscar todos os projetos
export const getAllProjetos = async (req, res) => {
  const sql = "SELECT * FROM projetos";

  try {
    const [results] = await db.query(sql);
    if (results.length === 0) {
      return res.status(404).json({ success: false, error: "Nenhum projeto encontrado." });
    }
    res.json({ success: true, data: results });
  } catch (err) {
    console.error('Erro ao buscar projetos:', err);
    return res.status(500).json({ success: false, error: "Erro ao buscar projetos." });
  }
};

// Função para atualizar o status de um projeto para 'finalizado'
export const concluirProjeto = async (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE projetos SET status = 'finalizado' WHERE id = ?";

  try {
    const [result] = await db.query(sql, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Projeto não encontrado." });
    }
    res.status(200).json({ success: true, message: "Projeto concluído com sucesso!" });
  } catch (err) {
    console.error('Erro ao concluir projeto:', err);
    return res.status(500).json({ success: false, error: "Erro ao concluir projeto." });
  }
};

// Função para obter o último poste salvo de um projeto específico
export const getUltimoPostePorProjeto = async (req, res) => {
  const { projetoId } = req.params;
  const sql = "SELECT * FROM postes WHERE projetoId = ? ORDER BY id DESC LIMIT 1";

  try {
    const [results] = await db.query(sql, [projetoId]);
    if (results.length === 0) {
      return res.status(404).json({ success: false, error: "Nenhum poste encontrado para este projeto." });
    }
    res.json({ success: true, data: results[0] });
  } catch (err) {
    console.error('Erro ao buscar o último poste:', err);
    return res.status(500).json({ success: false, error: "Erro ao buscar o último poste." });
  }
};
