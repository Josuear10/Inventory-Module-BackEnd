import { connectToDB } from "../db.js";

export const getAllRequisition = async (req, res) => {
    try {
        const connection = await connectToDB();
        const result = await connection.execute("SELECT * FROM REQUISICION_ITO");
        await connection.close();
        
        const data = result.rows.map(row => {
            const obj = {};
            result.metaData.forEach((column, index) => {
                let value = row[index];
                if (column.name === "REQ_FECHA") {
                    const date = new Date(value);
                    value = date.toISOString().split('T')[0];
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
export const getRequisition = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await connectToDB();
        const result = await connection.execute("SELECT * FROM REQUISICION_ITO WHERE REQ_ID = :id", [id]);
        await connection.close();
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Requisicion no encontrado' });
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
export const deleteRequisition = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await connectToDB();
        const result = await connection.execute('DELETE FROM REQUISICION_ITO WHERE REQ_ID = :id', [id], { autoCommit: true });
        await connection.close();
        res.status(200).send('Requisicion eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el requisicion:', error.message);
        res.status(500).json({ error: 'Error al eliminar el requisicion.' });
    }
}
export const insertRequisition = async (req, res) => {
    try {
        const connection = await connectToDB();
        const sql = "INSERT INTO REQUISICION_ITO (REQ_FECHA, PRO_ID, REQ_CANTIDAD, EMP_ID, OFI_ID) VALUES (:1, :2, :3, :4, :5)";
        const valores = [
            req.body.req_fecha,
            req.body.pro_id,
            req.body.req_cantidad,
            req.body.emp_id,
            req.body.ofi_id
        ];
        const result = await connection.execute(sql, valores, { autoCommit: true });
        await connection.close();
        res.json(result);
    } catch (error) {
        console.error("Error al insertar en la base de datos Oracle:", error);
        res.status(500).json("Error en el servidor");
    }
}
export const updateRequisition = async (req, res) => {
    try {
        const connection = await connectToDB();
        const sql = `
            UPDATE REQUISICION_ITO 
            SET 
            REQ_FECHA = :2,
            PRO_ID = :3,
            REQ_CANTIDAD = :4,
            EMP_ID = :5,
            OFI_ID = :6
            WHERE 
                REQ_ID = :id
        `;
        const valores = [
            req.body.req_fecha,
            req.body.pro_id,
            req.body.req_cantidad,
            req.body.emp_id,
            req.body.ofi_id,
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