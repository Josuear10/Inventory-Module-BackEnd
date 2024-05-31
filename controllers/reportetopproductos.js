import { connectToDB } from "../db.js";

export const getTopProducts = async (req, res) => {
  let connection;
  try {
    connection = await connectToDB();

    const query = `
        SELECT 
            P.PRO_Nombre,
            SUM(S.SAL_Cantidad) AS TotalVendidos
        FROM 
            Salida_ITO S
        JOIN 
            Producto_ITO P ON S.PRO_ID = P.PRO_ID
        GROUP BY 
            P.PRO_Nombre
        ORDER BY 
            TotalVendidos DESC
        FETCH FIRST 5 ROWS ONLY
    `;

    const result = await connection.execute(query);

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
