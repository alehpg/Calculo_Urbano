import express from 'express';
import { createPoste, getUltimoPostePorProjeto } from '../controllers/posteController.js'; // Unifiquei as importações e corrigi a extensão para .js

const router = express.Router();

// Rota para criar um novo poste
router.post("/novo-poste", createPoste);

// Rota para obter o último poste de um projeto
router.get('/ultimo-poste', getUltimoPostePorProjeto);

export default router;
