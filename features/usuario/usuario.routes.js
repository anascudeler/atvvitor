import express from 'express';
import * as usuario from './usuario.service.js';

const router = express.Router();

// Listar todos os usuários
router.get('/', async (req, res) => {
    try {
        const usuarios = await usuario.getAll();

        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(500).json({
            error: 'Erro ao buscar usuários'
        });
    }
});

// Buscar usuário por ID
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const usuarioEncontrado = await usuario.getById(id);

        if (!usuarioEncontrado) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }

        return res.status(200).json(usuarioEncontrado);
    } catch (error) {
        return res.status(500).json({
            error: 'Erro ao buscar usuário'
        });
    }
});

// Criar usuário
router.post('/', async (req, res) => {
    try {
        const id = await usuario.create(req.body);

        if (!id) {
            return res.status(409).json({
                error: 'E-mail já cadastrado'
            });
        }

        return res.status(201).json({
            message: 'Usuário criado com sucesso',
            id
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Erro ao criar usuário'
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const usuarioLogado = await usuario.login(
            req.body.email,
            req.body.senha
        );

        if (!usuarioLogado) {
            return res.status(401).json({
                error: 'E-mail ou senha inválidos'
            });
        }

        return res.status(200).json({
            message: 'Login realizado com sucesso',
            usuario: usuarioLogado
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Erro ao realizar login'
        });
    }
});

// Atualizar usuário
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const usuarioExistente = await usuario.getById(id);

        if (!usuarioExistente) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }

        const usuarioAtualizado = await usuario.update(id, req.body);

        if (!usuarioAtualizado) {
            return res.status(400).json({
                error: 'Não foi possível atualizar o usuário'
            });
        }

        return res.status(200).json({
            message: 'Usuário atualizado com sucesso'
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Erro ao atualizar usuário'
        });
    }
});

// Deletar usuário
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const usuarioExistente = await usuario.getById(id);

        if (!usuarioExistente) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }

        await usuario.remove(id);

        return res.status(200).json({
            message: 'Usuário deletado com sucesso'
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Erro ao deletar usuário'
        });
    }
});

export default router;

