import { connectToDB } from "../db.js";


export const getAllOrderDetail = async (req, res) => {
        try {
            const connection = await connectToDB();
            const result = await connection.execute("SELECT * FROM DETALLEORDENES_ITO");
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
//Obtener DetalleOrden
export const getOrderDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await connectToDB();
        const result = await connection.execute("SELECT * FROM DETALLEORDENES_ITO WHERE DTO_ID = :id", [id]);
        await connection.close();
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Orden no encontrado' });
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
//Eliminar DetalleOrden
export const deleteOrderDetail = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID Eliminado: ", id);
        const connection = await connectToDB();
        const result = await connection.execute('DELETE FROM DETALLEORDENES_ITO WHERE DTO_ID = :id', [id], { autoCommit: true });
        await connection.close();
        res.status(200).send('Orden eliminada correctamente');
    } catch (error) {
        console.error('Error al eliminar el Orden:', error.message);
        res.status(500).json({ error: 'Error al eliminar el Orden.' });
    }
}
//Insertar DetalleOrden
export const insertOrderDetail = async (req, res) => {
    try {
        // Consulta SQL para Oracle
        const connection = await connectToDB();
        const sql = "INSERT INTO DETALLEORDENES_ITO (DTO_ID, ORD_ID, PRO_ID, DTO_GRANTOTAL) VALUES (:1, :2, :3, :4)";

        // Valores para la consulta
        const valores = [
            req.body.dto_id,
            req.body.ord_id,
            req.body.pro_id,
            req.body.grantotal
        ];
        const result = await connection.execute(sql, valores, { autoCommit: true });
        await connection.close();
        res.json(result);
    } catch (error) {
        console.error("Error al insertar en la base de datos Oracle:", error);
        res.status(500).json("Error en el servidor");
    }
}
//Actualizar DetalleOrden
export const updateOrderDetail = async (req, res) => {
    try {
        const connection = await connectToDB();
        // Consulta SQL para Oracle
        const sql = `
            UPDATE DETALLEORDENES_ITO 
            SET 
                ORD_ID = :2, 
                PRO_ID = :3, 
                DTO_GRANTOTAL = :4
            WHERE 
                DTO_ID = :id
        `;

        // Valores para la consulta
        const valores = [
            req.body.ord_id,
            req.body.pro_id,
            req.body.dto_grantotal,
            req.params.id // Aquí utilizamos el parámetro de la URL para identificar el Producto a actualizar
        ];
        console.log("Valores: ", valores);
        const result = await connection.execute(sql, valores, { autoCommit: true });
        await connection.close();
        res.json(result);
    } catch (error) {
        console.error("Error al actualizar en la base de datos Oracle:", error);
        res.status(500).json("Error en el servidor");
    }
}