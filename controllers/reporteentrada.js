import { connectToDB } from "../db.js";
export const getRentrys = async (req, res) => {
    let connection;
    try {
        const { fechaInicio, fechaFin, proveedor, producto } = req.query;
        connection = await connectToDB();

        let query = `
            SELECT 
                e.ent_id, 
                p.pro_nombre,
                e.ent_fechaentrada,
                CASE 
                    WHEN e.ent_movimiento = 1 THEN 'Compra'
                    WHEN e.ent_movimiento = 2 THEN 'Devolución'
                    ELSE 'Otro'
                END AS movimiento,
                e.ent_unidadmedida,
                e.ent_cantidad, 
                e.ent_preciosalida, 
                v.prv_nombre 
            FROM entrada_ito e
            LEFT JOIN producto_ito p ON e.pro_id = p.pro_id
            LEFT JOIN proveedor_ito v ON e.prv_id = v.prv_id
            WHERE 1=1
        `;

        const queryParams = {};

        if (fechaInicio) {
            query += ' AND e.ent_fechaentrada >= TO_DATE(:fechaInicio, \'YYYY-MM-DD\')';
            queryParams.fechaInicio = fechaInicio;
        }

        if (fechaFin) {
            query += ' AND e.ent_fechaentrada <= TO_DATE(:fechaFin, \'YYYY-MM-DD\')';
            queryParams.fechaFin = fechaFin;
        }

        if (proveedor) {
            query += ' AND LOWER(v.prv_nombre) LIKE LOWER (:proveedor)';
            queryParams.proveedor = `%${proveedor}%`;
        }

        if (producto) {
            query += ' AND LOWER(p.pro_nombre) LIKE LOWER(:producto)';
            queryParams.producto = `%${producto}%`;
        }

        query += ' ORDER BY e.ent_fechaentrada ASC';

        const result = await connection.execute(query, queryParams);

        const data = result.rows.map(row => {
            const obj = {};
            result.metaData.forEach((column, index) => {
                let value = row[index];
                if (column.name === "ENT_FECHAENTRADA") {
                    const date = new Date(value);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    value = `${day}/${month}/${year}`;
                }
                obj[column.name] = value;
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
