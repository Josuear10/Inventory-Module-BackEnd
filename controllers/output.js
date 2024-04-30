import { connectToDB } from "../db.js";

export const getAllOutputs = async (req, res) => {
    try {
      const connection = await connectToDB();
      const result = await connection.execute("SELECT * FROM SALIDA_ITO");
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

export const getOutputs = async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await connectToDB();
      const result = await connection.execute(
        "SELECT * FROM SALIDA_ITO WHERE SAL_ID = :id",
        [id]
      );
      await connection.close();
      if (result.rows.length === 0) {
        res.status(404).json({ error: "Salida no encontrada" });
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

export const deleteOutputs = async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await connectToDB();
      const result = await connection.execute(
        "DELETE FROM SALIDA_ITO WHERE SAL_ID = :id",
        [id],
        { autoCommit: true }
      );
      await connection.close();
      res.status(200).send("Salida eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar el Proveedor:", error.message);
      res.status(500).json({ error: "Error al eliminar el Proveedor." });
    }
  }

export const insertOutputs = async (req, res) => {
    try {
      const connection = await connectToDB();
      const sql =
        "INSERT INTO SALIDA_ITO (PRO_ID, SAL_FECHASALIDA, SAL_MOVIMIENTO, SAL_UNIDADMEDIDA, SAL_CANTIDAD, SAL_PRECIOSALIDA, CLI_ID) VALUES (:1, :2, :3, :4, :5, :6, :7)";
      const valores = [
        req.body.pro_id,
        req.body.sal_fechasalida,
        req.body.sal_movimiento,
        req.body.sal_unidadmedida,
        req.body.sal_cantidad,
        req.body.sal_preciosalida,
        req.body.cli_id,
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

export const updateOutputs = async (req, res) => {
    try {
      const connection = await connectToDB();
      const sql = `
            UPDATE SALIDA_ITO 
            SET 
                PRO_ID = :1,
                SAL_FECHASALIDA = :2, 
                SAL_MOVIMIENTO = :3, 
                SAL_UNIDADMEDIDA = :4, 
                SAL_CANTIDAD = :5, 
                SAL_PRECIOSALIDA = :6, 
                SAL_SERIE = :7, 
                SAL_NFEL = :8,
                CLI_ID = :9
                
            WHERE 
                SAL_ID = :id
        `;
      const valores = [
        req.body.pro_id,
        req.body.sal_fechasalida,
        req.body.sal_movimiento,
        req.body.sal_unidadmedida,
        req.body.sal_cantidad,
        req.body.sal_preciosalida,
        req.body.sal_serie,
        req.body.sal_nfel,
        req.body.cli_id,
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