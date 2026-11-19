import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

import usuarioRoutes from '../features/usuario/usuario.routes.js';
import * as usuario from '../features/usuario/usuario.service.js';

vi.mock('../features/usuario/usuario.service.js', () => ({
    getAll: vi.fn(),
    getById: vi.fn(),
    getByEmail: vi.fn(),
    create: vi.fn(),
    login: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
}));

const app = express();

app.use(express.json());
app.use('/usuarios', usuarioRoutes);

describe('Rotas de usuários', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // Teste 1: listar usuários
    it('deve listar todos os usuários', async () => {
        usuario.getAll.mockResolvedValue([
            { id: 1, nome: 'João', email: 'joao@email.com' },
            { id: 2, nome: 'Maria', email: 'maria@email.com' }
        ]);

        const resposta = await request(app)
            .get('/usuarios');

        expect(resposta.status).toBe(200);
        expect(resposta.body).toHaveLength(2);
        expect(resposta.body[0].nome).toBe('João');
    });

    // Teste 2: cadastrar usuário
    it('deve cadastrar um usuário', async () => {
        usuario.create.mockResolvedValue(1);

        const resposta = await request(app)
            .post('/usuarios')
            .send({
                nome: 'João',
                email: 'joao@email.com',
                senha: '123456'
            });

        expect(resposta.status).toBe(201);
        expect(resposta.body.id).toBe(1);
        expect(usuario.create).toHaveBeenCalledWith({
            nome: 'João',
            email: 'joao@email.com',
            senha: '123456'
        });
    });

    // Teste 3: buscar usuário por ID
    it('deve buscar um usuário pelo ID', async () => {
        usuario.getById.mockResolvedValue({
            id: 1,
            nome: 'João',
            email: 'joao@email.com'
        });

        const resposta = await request(app)
            .get('/usuarios/1');

        expect(resposta.status).toBe(200);
        expect(resposta.body.id).toBe(1);
        expect(resposta.body.nome).toBe('João');
    });
});

