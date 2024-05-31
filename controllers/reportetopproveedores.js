import { connectToDB } from "../db.js";

export const getTopProveedores = async (req, res) => {
  let connection;
  try {
    connection = await connectToDB();

    const query = `
        SELECT 
            P.PRV_Nombre,
            COUNT(E.ENT_ID) AS TotalEntradas
        FROM 
            Entrada_ITO E
        JOIN 
            Proveedor_ITO P ON E.PRV_ID = P.PRV_ID
        GROUP BY 
            P.PRV_Nombre
        ORDER BY 
            TotalEntradas DESC
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
