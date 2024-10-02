import db from '../db.mjs'; // Certifique-se de que está importando o arquivo de configuração do banco de dados




// Função para obter o último poste de um projeto
export const getUltimoPostePorProjeto = async (req, res) => {
    const { projetoId } = req.params;
  
    try {
      const [results] = await db.query('SELECT * FROM postes WHERE projetoId = ? ORDER BY id DESC LIMIT 1', [projetoId]);
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Nenhum poste encontrado para este projeto.' });
      }
  
      res.status(200).json(results[0]);
    } catch (error) {
      console.error('Erro ao buscar o último poste:', error);
      res.status(500).json({ error: 'Erro ao buscar o último poste.' });
    }
  };
  


