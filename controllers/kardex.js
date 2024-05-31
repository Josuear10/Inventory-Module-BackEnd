import { connectToDB } from "../db.js";

export const getKardex = async (req, res) => {
    let connection;
    try {
        let { producto } = req.query;

        connection = await connectToDB();

        let query = `
            SELECT 
                e.ent_fechaentrada AS fecha,
                p.pro_nombre AS producto,
                e.ent_cantidad AS entrada,
                e.ent_preciosalida AS precio_salida,
                e.ent_serie AS serie,
                e.ent_nfel AS nfel,
                pr.prv_nombre AS proveedor_cliente,
                NULL AS salida,
                NULL AS sal_precio_salida
            FROM entrada_ito e
            LEFT JOIN producto_ito p ON e.pro_id = p.pro_id
            LEFT JOIN proveedor_ito pr ON e.prv_id = pr.prv_id
            WHERE LOWER(p.pro_nombre) LIKE LOWER(:producto)
            UNION ALL
            SELECT 
                s.sal_fechasalida AS fecha,
                p.pro_nombre AS producto,
                NULL AS entrada,
                NULL AS precio_salida,
                s.sal_serie AS serie,
                s.sal_nfel AS nfel,
                c.cli_primernombre || ' ' || c.cli_segundonombre || ' ' || c.cli_primerapellido || ' ' || c.cli_segundoapellido AS proveedor_cliente,
                s.sal_cantidad AS salida,
                s.sal_preciosalida AS sal_precio_salida
            FROM salida_ito s
            LEFT JOIN producto_ito p ON s.pro_id = p.pro_id
            LEFT JOIN clientes_ito c ON s.cli_id = c.cli_id
            WHERE LOWER(p.pro_nombre) LIKE LOWER(:producto)
            ORDER BY producto,fecha  ASC
        `;

        let queryParams = {
            producto: `%${producto}%`
        };

        const result = await connection.execute(query, queryParams);

        const saldoPorProducto = {};
        const data = result.rows.map((row) => {
            const obj = {};
            result.metaData.forEach((column, index) => {
                let value = row[index];
                if (column.name === "FECHA") {
                    const date = new Date(value);
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = date.getFullYear();
                    value = `${day}/${month}/${year}`;
                }
                obj[column.name.toLowerCase()] = value;
            });

            if (!saldoPorProducto[obj.producto]) {
                saldoPorProducto[obj.producto] = 0;
            }

            if (obj.entrada !== null) {
                saldoPorProducto[obj.producto] += obj.entrada;
            } else if (obj.salida !== null) {
                saldoPorProducto[obj.producto] -= obj.salida;
            }

            obj.saldo = saldoPorProducto[obj.producto];
            return obj;
        });

        res.json(data);
    } catch (error) {
        console.error("Error al ejecutar la consulta:", error.message);
        res.status(500).json({ error: "Error al ejecutar la consulta." });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error("Error al cerrar la conexión:", closeError.message);
            }
        }
    }
};
