import express from 'express';
import {
  getAllProjetos,
  createProjeto,
  getProjetoById,
  updateProjeto,
  deleteProjeto,
  concluirProjeto,
  getUltimoPostePorProjeto,
} from '../controllers/projetoController.mjs';

const router = express.Router();

// Define as rotas
router.get('/consultar', getAllProjetos);
router.post('/novo', createProjeto);
router.get('/:id', getProjetoById);
router.put('/:id', updateProjeto);
router.delete('/:id', deleteProjeto);
router.post('/concluir-projeto/:id', concluirProjeto);
router.get('/:projetoId/ultimo-poste', getUltimoPostePorProjeto);

export default router;
