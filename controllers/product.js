import { connectToDB } from "../db.js";


export const getAllProducts = async (req, res) => {
        try {
            const connection = await connectToDB();
            const result = await connection.execute("SELECT * FROM PRODUCTO_ITO");
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
//Obtener Productos
export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await connectToDB();
        const result = await connection.execute("SELECT * FROM PRODUCTO_ITO WHERE PRO_ID = :id", [id]);
        await connection.close();
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Producto no encontrado' });
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
//Eliminar Productos
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID Eliminado: ", id);
        const connection = await connectToDB();
        const result = await connection.execute('DELETE FROM PRODUCTO_ITO WHERE PRO_ID = :id', [id], { autoCommit: true });
        await connection.close();
        res.status(200).send('Producto eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el Producto:', error.message);
        res.status(500).json({ error: 'Error al eliminar el Producto.' });
    }
}
//Insertar Productos
export const insertProduct = async (req, res) => {
    try {
        // Consulta SQL para Oracle
        const connection = await connectToDB();
        const sql = "INSERT INTO PRODUCTO_ITO (PRO_NOMBRE, PRO_UNIDADDEMEDIDA, PRO_DESCRIPCION,  PRO_CANTIDAD, PRO_VALOR, OFI_ID ) VALUES (:1, :2, :3, :4, :5, :6)";

        // Valores para la consulta
        const valores = [
            req.body.pro_nombre,
            req.body.pro_unidaddemedida,
            req.body.pro_descripcion,
            req.body.pro_cantidad,
            req.body.pro_valor,
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
//Actualizar Producto
export const updateProduct = async (req, res) => {
    try {
        const connection = await connectToDB();
        // Consulta SQL para Oracle
        const sql = `
            UPDATE PRODUCTO_ITO 
            SET 
                PRO_NOMBRE = :2, 
                PRO_UNIDADDEMEDIDA = :3, 
                PRO_DESCRIPCION = :4, 
                PRO_CANTIDAD = :5,
                PRO_VALOR = :6,
                OFI_ID = :7
            WHERE 
                PRO_ID = :id
        `;

        // Valores para la consulta
        const valores = [
            req.body.pro_nombre,
            req.body.pro_unidaddemedida,
            req.body.pro_descripcion,
            req.body.pro_cantidad,
            req.body.pro_valor,
            req.body.ofi_id,
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