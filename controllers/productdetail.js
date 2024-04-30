import { connectToDB } from "../db.js";

export const getAllProductDetails = async (req, res) => {
    try {
        const connection = await connectToDB();
        const result = await connection.execute("SELECT * FROM DETALLEPRODUCTO_ITO");
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
//Obtener Detalle Productos
export const getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await connectToDB();
        const result = await connection.execute("SELECT * FROM DETALLEPRODUCTO_ITO WHERE DTP_ID = :id", [id]);
        await connection.close();
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Detalle no encontrado' });
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
//Eliminar Detalle Producto
export const deleteProductDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await connectToDB();
        const result = await connection.execute('DELETE FROM DETALLEPRODUCTO_ITO WHERE DTP_ID = :id', [id], { autoCommit: true });
        await connection.close();
        res.status(200).send('Detalle de producto eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el detalle de producto:', error.message);
        res.status(500).json({ error: 'Error al eliminar el Detalle de producto.' });
    }
}
//Insertar Detalle Producto
export const insertProductDetails = async (req, res) => {
    try {
        const connection = await connectToDB();
        const sql = "INSERT INTO DETALLEPRODUCTO_ITO (PRO_ID, DTP_NOMBRECATEGORIA, DTP_CATEGORIA, DTP_STOCKMINIMO) VALUES (:1, :2, :3, :4)";
        const valores = [
            req.body.pro_id,
            req.body.dtp_nombrecategoria,
            req.body.dtp_categoria,
            req.body.dtp_stockminimo
        ];
        const result = await connection.execute(sql, valores, { autoCommit: true });
        await connection.close();
        res.json(result);
    } catch (error) {
        console.error("Error al insertar en la base de datos Oracle:", error);
        res.status(500).json("Error en el servidor");
    }
}
//Actualizar Detalle Producto
export const updateProductDetails = async (req, res) => {
    try {
        const connection = await connectToDB();
        const sql = `
            UPDATE DETALLEPRODUCTO_ITO 
            SET 
            PRO_ID = :2, 
            DTP_NOMBRECATEGORIA = :3,
            DTP_CATEGORIA = :4,
            DTP_STOCKMINIMO = :5    
            WHERE 
                DTP_ID = :id
        `;
        const valores = [
            req.body.pro_id,
            req.body.dtp_nombrecategoria,
            req.body.dtp_categoria,
            req.body.dtp_stockminimo,
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