import { connectToDB } from "../db.js";

export const getAllOffice = async (req, res) => {
    try {
      const connection = await connectToDB();
      const result = await connection.execute("SELECT * FROM OFICINAS_ITO");
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
export const getOffice = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await connectToDB();
        const result = await connection.execute("SELECT * FROM OFICINAS_ITO WHERE OFI_ID = :id", [id]);
        await connection.close();
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Oficina no encontrada' });
        } else {
            const clientData = {};
            result.metaData.forEach((column, index) => {
                clientData[column.name] = result.rows[0][index];
            });
            res.json(clientData);
        }
    } catch (error) {
        console.error('Error al ejecutar la Consulta:', error.message);
        res.status(500).json({ error: 'Error al ejecutar la consulta.' });
    }
}
export const deleteOffice = async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await connectToDB();
      const result = await connection.execute(
        "DELETE FROM OFICINAS_ITO WHERE OFI_ID = :id",
        [id],
        { autoCommit: true }
      );
      await connection.close();
      res.status(200).send("Proveedor eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar la oficina:", error.message);
      res.status(500).json({ error: "Error al eliminar la oficina." });
    }
}
export const insertOffice = async (req, res) => {
    try {
        const connection = await connectToDB();
        const sql = "INSERT INTO Oficinas_ITO (OFI_NOMBRE, OFI_NUMERO, OFI_CALLE, OFI_ZONA, OFI_AVENIDA, OFI_MUNICIPIO, OFI_DEPARTAMENTO) VALUES (:1, :2, :3, :4, :5, :6, :7)";
        const valores = [
            req.body.ofi_nombre,
            req.body.ofi_numero,
            req.body.ofi_calle,
            req.body.ofi_avenida,
            req.body.ofi_zona,
            req.body.ofi_municipio,
            req.body.ofi_departamento
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
export const updateOffice = async (req, res) => {
    try {
      const connection = await connectToDB();
      const sql = `
            UPDATE OFICINAS_ITO 
            SET 
                OFI_NOMBRE = :1, 
                OFI_NUMERO = :2, 
                OFI_CALLE = :3, 
                OFI_AVENIDA = :4, 
                OFI_ZONA = :5,
                OFI_MUNICIPIO = :6,
                OFI_DEPARTAMENTO = :7
            WHERE 
                OFI_ID = :id
        `;
        const valores = [
            req.body.ofi_nombre,
            req.body.ofi_numero,
            req.body.ofi_calle,
            req.body.ofi_zona,
            req.body.ofi_avenida,
            req.body.ofi_municipio,
            req.body.ofi_departamento,
            req.params.id
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