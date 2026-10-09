import pool from '../../db/config.js';
import bcrypt from 'bcrypt';

const COLUNAS_PUBLICAS = 'id, email, nome';

// Listar todos os usuários
export async function getAll() {
    const [rows] = await pool.query(
        `SELECT ${COLUNAS_PUBLICAS} FROM usuarios`
    );

    return rows;
}

// Buscar usuário por ID
export async function getById(id) {
    const [rows] = await pool.execute(
        `SELECT ${COLUNAS_PUBLICAS} FROM usuarios WHERE id = ?`,
        [id]
    );

    return rows[0] || null;
}

// Buscar usuário por e-mail
export async function getByEmail(email) {
    const [rows] = await pool.execute(
        `SELECT ${COLUNAS_PUBLICAS} FROM usuarios WHERE email = ?`,
        [email]
    );

    return rows[0] || null;
}

// Realizar login
export async function login(email, senha) {
    const [rows] = await pool.execute(
        'SELECT id, email, nome, senha FROM usuarios WHERE email = ?',
        [email]
    );

    const usuario = rows[0];

    if (!usuario) {
        return null;
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
        return null;
    }

    return {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome
    };
}

// Criar usuário
export async function create(dados) {
    const usuarioExistente = await getByEmail(dados.email);

    if (usuarioExistente) {
        return false;
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    const [resultado] = await pool.execute(
        'INSERT INTO usuarios (email, nome, senha) VALUES (?, ?, ?)',
        [dados.email, dados.nome, senhaHash]
    );

    return resultado.insertId;
}

// Atualizar usuário
export async function update(id, dados) {
    const usuarioExistente = await getById(id);

    if (!usuarioExistente) {
        return false;
    }

    const campos = [];
    const valores = [];

    if (dados.email !== undefined) {
        const donoDoEmail = await getByEmail(dados.email);

        if (
            donoDoEmail &&
            Number(donoDoEmail.id) !== Number(id)
        ) {
            return false;
        }

        campos.push('email = ?');
        valores.push(dados.email);
    }

    if (dados.nome !== undefined) {
        campos.push('nome = ?');
        valores.push(dados.nome);
    }

    if (dados.senha !== undefined && dados.senha !== '') {
        const senhaHash = await bcrypt.hash(dados.senha, 10);

        campos.push('senha = ?');
        valores.push(senhaHash);
    }

    if (campos.length === 0) {
        return false;
    }

    valores.push(id);

    await pool.execute(
        `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`,
        valores
    );

    return true;
}

// Deletar usuário
export async function remove(id) {
    const usuarioExistente = await getById(id);

    if (!usuarioExistente) {
        return false;
    }

    const conexao = await pool.getConnection();

    try {
        await conexao.beginTransaction();

        await conexao.execute(
            'DELETE FROM tarefas WHERE fk_usuario_id = ?',
            [id]
        );

        await conexao.execute(
            'DELETE FROM usuarios WHERE id = ?',
            [id]
        );

        await conexao.commit();

        return true;
    } catch (error) {
        await conexao.rollback();
        throw error;
    } finally {
        conexao.release();
    }
}

