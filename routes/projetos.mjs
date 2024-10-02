import express from 'express';
import {
    deleteProjeto,
    concluirProjeto,
    getAllProjetos,
    getProjetoById,
    createProjeto,
    updateProjeto
} from '../controllers/projetoController.mjs';

const router = express.Router();

// Rota para obter todos os projetos
router.get('/consultar', getAllProjetos);

// Rota para obter um projeto pelo ID
router.get('/:id', getProjetoById);

// Rota para criar um novo projeto
router.post('/novo', createProjeto);

// Rota para atualizar um projeto existente
router.put('/:id', updateProjeto);

// Rota para deletar um projeto pelo ID
router.delete('/:id/excluir', deleteProjeto);  // Rota para excluir projeto

// Rota para concluir um projeto (atualizar o status para 'finalizado')
router.put('/:id/concluir', concluirProjeto);  // Corrigi a rota para PUT aqui também

export default router;
