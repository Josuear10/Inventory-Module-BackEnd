import { connectToDB } from "../db.js";

export const getAllProviders = async (req, res) => {
    try {
      const connection = await connectToDB();
      const result = await connection.execute("SELECT * FROM PROVEEDOR_ITO");
      await connection.close();
      const data = result.rows.map((row) => {
        const obj = {};
        result.metaData.forEach((column, index) => {
          obj[column.name] = row[index];
        });
        return obj;
      });
      res.json(data);
    } catch (error) {
      console.error("Error al ejecutar la consulta:", error.message);
      res.status(500).json({ error: "Error al ejecutar la consulta." });
    }
}
//Obtener Proveedores
export const getProviders = async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await connectToDB();
      const result = await connection.execute(
        "SELECT * FROM PROVEEDOR_ITO WHERE PRV_ID = :id",
        [id]
      );
      await connection.close();
      if (result.rows.length === 0) {
        res.status(404).json({ error: "Proveedor no encontrado" });
      } else {
        const clientData = {};
        result.metaData.forEach((column, index) => {
          clientData[column.name] = result.rows[0][index];
        });
        res.json(clientData);
      }
    } catch (error) {
      console.error("Error al ejecutar la consulta:", error.message);
      res.status(500).json({ error: "Error al ejecutar la consulta." });
    }
}
//Eliminar Proveedores
export const deleteProviders = async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await connectToDB();
      const result = await connection.execute(
        "DELETE FROM PROVEEDOR_ITO WHERE PRV_ID = :id",
        [id],
        { autoCommit: true }
      );
      await connection.close();
      res.status(200).send("Proveedor eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el Proveedor:", error.message);
      res.status(500).json({ error: "Error al eliminar el Proveedor." });
    }
}
//Agregar Proveedores
export const insertProviders = async (req, res) => {
    try {
      const connection = await connectToDB();
      const sql =
        "INSERT INTO PROVEEDOR_ITO (PRV_NIT, PRV_RAZONSOCIAL, PRV_NOMBRE, PRV_NLOCAL, PRV_CALLE, PRV_ZONA, PRV_AVENIDA, PRV_MUNICIPIO, PRV_DEPARTAMENTO) VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9)";
      const valores = [
        req.body.prv_nit,
        req.body.prv_razonsocial,
        req.body.prv_nombre,
        req.body.prv_nlocal,
        req.body.prv_calle,
        req.body.prv_zona,
        req.body.prv_avenida,
        req.body.prv_municipio,
        req.body.prv_departamento,
      ];
      const result = await connection.execute(sql, valores, {
        autoCommit: true,
      });
      await connection.close();
      res.json(result);
    } catch (error) {
      console.error("Error al insertar en la base de datos Oracle:", error);
      res.status(500).json("Error en el servidor");
    }
}
//Actualizar Proveedores 
export const updateProviders =  async (req, res) => {
    try {
      const connection = await connectToDB();
      const sql = `
            UPDATE PROVEEDOR_ITO 
            SET 
                PRV_NIT = :1,
                PRV_RAZONSOCIAL = :2, 
                PRV_NOMBRE = :3, 
                PRV_NLOCAL = :4, 
                PRV_CALLE = :5, 
                PRV_ZONA = :6, 
                PRV_AVENIDA = :7, 
                PRV_MUNICIPIO = :8,
                PRV_DEPARTAMENTO = :9
                
            WHERE 
                PRV_ID = :id
        `;
      const valores = [
        req.body.prv_nit,
        req.body.prv_razonsocial,
        req.body.prv_nombre,
        req.body.prv_nlocal,
        req.body.prv_calle,
        req.body.prv_zona,
        req.body.prv_avenida,
        req.body.prv_municipio,
        req.body.prv_departamento,
        req.params.id,
      ];
      const result = await connection.execute(sql, valores, {
        autoCommit: true,
      });
      await connection.close();
      res.json(result);
    } catch (error) {
      console.error("Error al actualizar en la base de datos Oracle:", error);
      res.status(500).json("Error en el servidor");
    }
}