import pool from '../../db/config.js';

const COLUNAS = 'id, fk_usuario_id, titulo, descricao, status, created_at, updated_at';

export async function getAll() {
    const [rows] = await pool.query(
        `SELECT ${COLUNAS} FROM tarefas ORDER BY created_at DESC`
    );

    return rows;
}

export async function getById(id) {
    const [rows] = await pool.execute(
        `SELECT ${COLUNAS} FROM tarefas WHERE id = ?`,
        [id]
    );

    return rows[0] || null;
}

export async function create(dados) {
    const [resultado] = await pool.execute(
        `INSERT INTO tarefas (fk_usuario_id, titulo, descricao, status)
         VALUES (?, ?, ?, ?)`,
        [
            dados.fk_usuario_id,
            dados.titulo,
            dados.descricao ?? null,
            dados.status ?? 'PENDENTE'
        ]
    );

    return resultado.insertId;
}

export async function update(id, dados) {
    const tarefaExistente = await getById(id);

    if (!tarefaExistente) {
        return null;
    }

    const campos = [];
    const valores = [];

    if (dados.fk_usuario_id !== undefined) {
        campos.push('fk_usuario_id = ?');
        valores.push(dados.fk_usuario_id);
    }

    if (dados.titulo !== undefined) {
        campos.push('titulo = ?');
        valores.push(dados.titulo);
    }

    if (dados.descricao !== undefined) {
        campos.push('descricao = ?');
        valores.push(dados.descricao);
    }

    if (dados.status !== undefined) {
        campos.push('status = ?');
        valores.push(dados.status);
    }

    if (campos.length === 0) {
        return null;
    }

    valores.push(id);

    await pool.execute(
        `UPDATE tarefas SET ${campos.join(', ')} WHERE id = ?`,
        valores
    );

    return getById(id);
}

export async function remove(id) {
    const [resultado] = await pool.execute(
        'DELETE FROM tarefas WHERE id = ?',
        [id]
    );

    return resultado.affectedRows > 0;
}

