import { connectToDB } from "../db.js";

export const getAllEntrys = async (req, res) => {
    try {
        const connection = await connectToDB();
        const result = await connection.execute("SELECT * FROM ENTRADA_ITO");
        await connection.close();
        const data = result.rows.map(row => {
            const obj = {};
            result.metaData.forEach((column, index) => {
                let value = row[index];
                if (column.name === "ENT_FECHAENTRADA") {
                    const date = new Date(value);
                    value = date.toISOString().split('T')[0];
                }
                else if (!req.body.ent_fechaentrada) {
                    req.body.ent_fechaentrada = new Date().toISOString().split('T')[0];
                }
                obj[column.name] = value;
            });
            return obj;
        });
        res.json(data);
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error.message);
        res.status(500).json({ error: 'Error al ejecutar la consulta.' });
    }
}
//Obtener Entrada
export const getEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await connectToDB();
        const result = await connection.execute("SELECT * FROM ENTRADA_ITO WHERE ENT_ID = :id", [id]);
        await connection.close();
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Entrada no encontrado' });
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
//Delete Entrada
export const deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await connectToDB();
        const result = await connection.execute('DELETE FROM ENTRADA_ITO WHERE ENT_ID = :id', [id], { autoCommit: true });
        await connection.close();
        res.status(200).send('Entrada eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el Entrada:', error.message);
        res.status(500).json({ error: 'Error al eliminar el Entrada.' });
    }
}
//Insertar Entrada
export const insertEntry = async (req, res) => {
    try {
        // Consulta SQL para Oracle
        const connection = await connectToDB();
        const sql = "INSERT INTO ENTRADA_ITO (PRO_ID, ENT_FECHAENTRADA, ENT_MOVIMIENTO,  ENT_UNIDADMEDIDA, ENT_CANTIDAD, ENT_PRECIOSALIDA, PRV_ID ) VALUES (:1, :2, :3, :4, :5, :6, :7)";

        // Valores para la consulta
        const valores = [
            req.body.pro_id,
            req.body.ent_fechaentrada,
            req.body.ent_movimiento,
            req.body.ent_unidadmedida,
            req.body.ent_cantidad,
            req.body.ent_preciosalida,
            req.body.prv_id
        ];
        const result = await connection.execute(sql, valores, { autoCommit: true });
        await connection.close();
        res.json(result);
    } catch (error) {
        console.error("Error al insertar en la base de datos Oracle:", error);
        res.status(500).json("Error en el servidor");
    }
}
//Actualizar Entrada
export const updateEntry = async (req, res) => {
    try {
        const connection = await connectToDB();
        // Consulta SQL para Oracle
        const sql = `
            UPDATE ENTRADA_ITO
            SET
            PRO_ID = :2,
            ENT_FECHAENTRADA = TO_DATE(:3, 'YYYY-MM-DD'),
            ENT_MOVIMIENTO = :4,
            ENT_UNIDADMEDIDA = :5,
            ENT_CANTIDAD = :6,
            ENT_PRECIOSALIDA = :7,
            PRV_ID = :8
        WHERE
            ENT_ID = :id
        `;
        console.log('Consulta SQL:', sql);

        // Valores para la consulta
        const valores = [
            req.body.pro_id,
            req.body.ent_fechaentrada,
            req.body.ent_movimiento,
            req.body.ent_unidadmedida,
            req.body.ent_cantidad,
            req.body.ent_preciosalida,
            req.body.prv_id,
            req.params.id // Aquí utilizamos el parámetro de la URL para identificar el Producto a actualizar
        ];
        const result = await connection.execute(sql, valores, { autoCommit: true });
        await connection.close();
        res.json(result);
    } catch (error) {
        console.error("Error al actualizar en la base de datos Oracle:", error);
        res.status(500).json("Error en el servidor");
    }
}
