import { connectToDB } from "../db.js";

export const getAllClients = async (req, res) => {
    try {
        const connection = await connectToDB();
        const result = await connection.execute("SELECT * FROM CLIENTES_ITO");
        await connection.close();
        const data = result.rows.map(row => {
            const obj = {};
            result.metaData.forEach((column, index) => {
                obj[column.name] = row[index];
            });
            return obj;
        });
        res.json(data);
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error.message);
        res.status(500).json({ error: 'Error al ejecutar la consulta.' });
    }
}

//Obtener Clientes
export const getClients = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await connectToDB();
        const result = await connection.execute("SELECT * FROM CLIENTES_ITO WHERE CLI_ID = :id", [id]);
        await connection.close();
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Cliente no encontrado' });
        } else {
            const clientData = {};
            result.metaData.forEach((column, index) => {
                clientData[column.name] = result.rows[0][index];
            });
            res.json(clientData);
        }
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error.message);
        res.status(500).json({ error: 'Error al ejecutar la consulta.' });
    }
}

//Delete Clientes 
export const deleteClients = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await connectToDB();
        const result = await connection.execute('DELETE FROM CLIENTES_ITO WHERE CLI_ID = :id', [id], { autoCommit: true });
        await connection.close();
        res.status(200).send('Cliente eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el cliente:', error.message);
        res.status(500).json({ error: 'Error al eliminar el cliente.' });
    }
}

//Insertar Clientes
export const insertClient = async (req, res) => {
    try {
        const connection = await connectToDB();
        const sql = "INSERT INTO CLIENTES_ITO (CLI_NIT, CLI_PRIMERNOMBRE, CLI_SEGUNDONOMBRE, CLI_PRIMERAPELLIDO, CLI_SEGUNDOAPELLIDO, CLI_NCASA, CLI_CALLE, CLI_ZONA, CLI_AVENIDA, CLI_MUNICIPIO, CLI_DEPARTAMENTO) VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11)";
        const valores = [
            req.body.cli_nit,
            req.body.cli_primernombre,
            req.body.cli_segundonombre,
            req.body.cli_primerapellido,
            req.body.cli_segundoapellido,
            req.body.cli_casa,
            req.body.cli_calle,
            req.body.cli_zona,
            req.body.cli_avenida,
            req.body.cli_municipio,
            req.body.cli_departamento
        ];
        const result = await connection.execute(sql, valores, { autoCommit: true });
        await connection.close();
        res.json(result);
    } catch (error) {
        console.error("Error al insertar en la base de datos Oracle:", error);
        res.status(500).json("Error en el servidor");
    }
}

//Actualizar Cliente 
export const updateClient = async (req, res) => {
    try {
        const connection = await connectToDB();
        const sql = `
            UPDATE CLIENTES_ITO 
            SET 
                CLI_NIT = :2,
                CLI_PRIMERNOMBRE = :3, 
                CLI_SEGUNDONOMBRE = :4, 
                CLI_PRIMERAPELLIDO = :5, 
                CLI_SEGUNDOAPELLIDO = :6, 
                CLI_NCASA = :7, 
                CLI_CALLE = :8, 
                CLI_ZONA = :9,
                CLI_AVENIDA = :10,
                CLI_MUNICIPIO = :11, 
                CLI_DEPARTAMENTO = :12 
                
            WHERE 
                CLI_ID = :id
        `;
        const valores = [
            req.body.cli_nit,
            req.body.cli_primernombre,
            req.body.cli_segundonombre,
            req.body.cli_primerapellido,
            req.body.cli_segundoapellido,
            req.body.cli_casa,
            req.body.cli_calle,
            req.body.cli_zona,
            req.body.cli_avenida,
            req.body.cli_municipio,
            req.body.cli_departamento,
            req.params.id
        ];
        const result = await connection.execute(sql, valores, { autoCommit: true });
        await connection.close();
        res.json(result);
    } catch (error) {
        console.error("Error al actualizar en la base de datos Oracle:", error);
        res.status(500).json("Error en el servidor");
    }
}