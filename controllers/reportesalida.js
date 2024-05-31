import { connectToDB } from "../db.js";

export const getRoutputs = async (req, res) => {
  let connection;
  try {
    const { fechaInicio, fechaFin, cliente, producto } = req.query;
    connection = await connectToDB();

    let query = `
        SELECT 
        e.sal_id, 
        p.pro_nombre,
        e.sal_fechasalida, 'DD/MM/YYYY' AS sal_fechasalida,
        CASE 
            WHEN e.sal_movimiento = 1 THEN 'Venta'
            WHEN e.sal_movimiento = 2 THEN 'Devolución'
            ELSE 'Otro'
        END AS movimiento,
        e.sal_unidadmedida,
        e.sal_cantidad, 
        e.sal_preciosalida,
        e.sal_serie,
        e.sal_nfel,
        c.cli_primernombre || ' ' || c.cli_segundonombre || ' ' || c.cli_primerapellido || ' ' || c.cli_segundoapellido AS Cliente
    FROM salida_ito e
    LEFT JOIN producto_ito p ON e.pro_id = p.pro_id
    LEFT JOIN clientes_ito c ON e.cli_id = c.cli_id
    WHERE 1=1
    `;

    const queryParams = {};

    if (fechaInicio) {
      query += " AND e.sal_fechasalida >= TO_DATE(:fechaInicio, 'YYYY-MM-DD')";
      queryParams.fechaInicio = fechaInicio;
    }

    if (fechaFin) {
      query += " AND e.sal_fechasalida <= TO_DATE(:fechaFin, 'YYYY-MM-DD')";
      queryParams.fechaFin = fechaFin;
    }

    if (cliente) {
      query += ' AND LOWER(c.cli_primernombre || \' \' || c.cli_segundonombre || \' \' || c.cli_primerapellido || \' \' || c.cli_segundoapellido) LIKE LOWER(:cliente)';
      queryParams.cliente = `%${cliente}%`;
    }

    if (producto) {
      query += ' AND LOWER(p.pro_nombre) LIKE LOWER(:producto)';
      queryParams.producto = `%${producto}%`;
    }

    query += ' ORDER BY e.sal_fechasalida ASC';

    const result = await connection.execute(query, queryParams);

    const data = result.rows.map(row => {
      const obj = {};
      result.metaData.forEach((column, index) => {
        let value = row[index];
        if (column.name === "SAL_FECHASALIDA") {
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
