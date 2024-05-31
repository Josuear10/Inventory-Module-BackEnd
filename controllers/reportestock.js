import { connectToDB } from "../db.js";

export const getProductStock = async (req, res) => {
    let connection;
    try {
        const { bodega, producto } = req.query;
        connection = await connectToDB();

        let query = `
            SELECT 
                o.ofi_nombre AS bodega,
                o.ofi_numero AS numero_telefono, 
                p.pro_nombre AS producto, 
                p.pro_cantidad AS stock,
                dt.dtp_stockminimo AS stock_minimo
            FROM 
                producto_ito p
            JOIN 
                oficinas_ito o ON p.ofi_id = o.ofi_id
            JOIN 
                detalleproducto_ito dt ON p.pro_id = dt.pro_id
            WHERE 1=1
        `;

        const queryParams = {};

        if (bodega) {
            query += ' AND LOWER(o.ofi_nombre) LIKE LOWER(:bodega)';
            queryParams.bodega = `%${bodega}%`;
        }

        if (producto) {
            query += ' AND LOWER(p.pro_nombre) LIKE LOWER(:producto)';
            queryParams.producto = `%${producto}%`;
        }

        const result = await connection.execute(query, queryParams);

        const data = result.rows.map(row => {
            const obj = {};
            result.metaData.forEach((column, index) => {
                obj[column.name.toLowerCase()] = row[index];
            });
            return obj;
        });

        res.json(data);
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error.message);
        res.status(500).json({ error: 'Error al ejecutar la consulta.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión:', closeError.message);
            }
        }
    }
};
