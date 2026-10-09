import { z } from 'zod';

const titulo = z
    .string()
    .trim()
    .min(1, 'Informe o título')
    .max(100, 'Máximo 100 caracteres');

const descricao = z
    .string()
    .max(2000, 'Máximo 2000 caracteres')
    .nullish();

const status = z.enum(['PENDENTE', 'CONCLUIDA']);

export const criarTarefaSchema = z.object({
    titulo,
    descricao,
    status: status.optional().default('PENDENTE'),
    fk_usuario_id: z.coerce.number().int().positive()
});

export const atualizarTarefaSchema = z
    .object({
        titulo: titulo.optional(),
        descricao: descricao.optional(),
        status: status.optional()
    })
    .refine(
        (dados) => Object.keys(dados).length > 0,
        { message: 'Informe ao menos um campo para atualizar' }
    );

export const idParamsSchema = z.object({
    id: z.coerce.number().int().positive('ID inválido')
});
