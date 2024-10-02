import express from 'express'; // Correção da importação
import { createForca } from '../controllers/forcaController.mjs'; // Certifique-se de que o caminho está correto

const router = express.Router();

// Rota para criar uma nova força
router.post("/", createForca);

export default router;
