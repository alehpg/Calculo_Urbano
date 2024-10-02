import express from 'express';
import { createPosteInternal } from '../controllers/posteController.mjs'; // Verifique a extensão .js
import { createForcaInternal } from '../controllers/forcaController.mjs';

const router = express.Router();

// Rota combinada para salvar tanto o poste quanto as forças
router.post('/', async (req, res) => {
    try {
        const { numeroPoste, tipoPoste, altura, capacidade, projetoId, forcas } = req.body;

        if (!forcas || forcas.length === 0) {
            return res.status(400).json({ success: false, message: 'Nenhuma força foi fornecida.' });
        }

        // Salva o poste
        const posteResult = await createPosteInternal({
            numeroPoste,
            tipoPoste,
            altura,
            capacidade,
            projetoId
        });

        const posteId = posteResult.id;

        // Salva as forças associadas ao poste
        for (const forca of forcas) {
            await createForcaInternal({ ...forca, posteId });
        }

        res.status(201).json({ success: true, message: 'Poste e forças salvos com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro ao salvar poste e forças.', error });
    }
});

export default router;
