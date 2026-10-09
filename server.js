import express from 'express';
import cors from 'cors';

import tarefaRoutes from './features/tarefa/tarefa.routes.js';
import usuarioRoutes from './features/usuario/usuario.routes.js';

export const api = express();

const PORT = 3000;

// Middlewares básicos
api.use(cors());
api.use(express.json());

// Rotas
api.use('/tarefas', tarefaRoutes);
api.use('/usuarios', usuarioRoutes);

// Verificar se a API está funcionando
api.get('/health', (_req, res) => {
    return res.status(200).json({
        status: 'UP'
    });
});

// Iniciar servidor
api.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});

