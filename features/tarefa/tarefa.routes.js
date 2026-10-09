
import express from 'express';
import * as tarefa from './tarefa.service.js';

const router = express.Router();

// Listar todas as tarefas
router.get('/', async (req, res) => {
    try {
        const tarefas = await tarefa.getAll();
        return res.status(200).json(tarefas);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
});

// Buscar tarefa por ID
router.get('/:id', async (req, res) => {
    try {
        const tarefaEncontrada = await tarefa.getById(Number(req.params.id));

        if (!tarefaEncontrada) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        return res.status(200).json(tarefaEncontrada);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar tarefa' });
    }
});

// Criar tarefa
router.post('/', async (req, res) => {
    try {
        const id = await tarefa.create(req.body);

        return res.status(201).json({
            message: 'Tarefa criada com sucesso',
            id
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
});

// Atualizar tarefa
router.put('/:id', async (req, res) => {
    try {
        const tarefaAtualizada = await tarefa.update(
            Number(req.params.id),
            req.body
        );

        if (!tarefaAtualizada) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        return res.status(200).json({
            message: 'Tarefa atualizada com sucesso',
            tarefa: tarefaAtualizada
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
});

// Deletar tarefa
router.delete('/:id', async (req, res) => {
    try {
        const tarefaDeletada = await tarefa.remove(Number(req.params.id));

        if (!tarefaDeletada) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        return res.status(200).json({
            message: 'Tarefa deletada com sucesso'
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao deletar tarefa' });
    }
});

export default router;

