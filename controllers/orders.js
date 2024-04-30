import { connectToDB } from "../db.js";

export const getAllOrders = async (req, res) => {
    try {
      const connection = await connectToDB();
      const result = await connection.execute("SELECT * FROM ORDENES_ITO");
      await connection.close();
      const data = result.rows.map((row) => {
        const obj = {};
        result.metaData.forEach((column, index) => {
            let value = row[index];
            if (column.name === "ORD_FECHA") {
                const date = new Date(value);
                value = date.toISOString().split('T')[0];
            }
            obj[column.name] = value;
        });
        return obj;
      });
      res.json(data);
    } catch (error) {
      console.error("Error al ejecutar la consulta:", error.message);
      res.status(500).json({ error: "Error al ejecutar la consulta." });
    }
}
//Obtener Ordenes
export const getOrders = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await connectToDB();
        const result = await connection.execute("SELECT * FROM ORDENES_ITO WHERE ORD_ID = :id", [id]);
        await connection.close();
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Orden no encontrado' });
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
//Eliminar Ordenes
export const deleteOrders = async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await connectToDB();
      const result = await connection.execute(
        "DELETE FROM ORDENES_ITO WHERE ORD_ID = :id",
        [id],
        { autoCommit: true }
      );
      await connection.close();
      res.status(200).send("Orden eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la orden:", error.message);
      res.status(500).json({ error: "Error al eliminar la orden." });
    }
}
//Insertar Ordenes
export const insertOrders = async (req, res) => {
    try {
        const connection = await connectToDB();
        const sql = "INSERT INTO ORDENES_ITO (OFI_ID, ORD_FECHA, ORD_CANTIDAD) VALUES (:1, :2, :3)";
        const valores = [
            req.body.ofi_id,
            req.body.ord_fecha,
            req.body.ord_cantidad
        ];
        const result = await connection.execute(sql, valores, { autoCommit: true });
        await connection.close();
        res.json(result);
    } catch (error) {
        console.error("Error al insertar en la base de datos Oracle:", error);
        res.status(500).json("Error en el servidor");
    }
}
//Actualizar Ordenes
export const updateOrders = async (req, res) => {
    try {
        const connection = await connectToDB();
        const sql = `
            UPDATE ORDENES_ITO 
            SET  
                OFI_ID = :2, 
                ORD_FECHA = :3, 
                ORD_CANTIDAD = :4
            WHERE 
                ORD_ID = :id
        `;
        const valores = [
            req.body.ofi_id,
            req.body.ord_fecha,
            req.body.ord_cantidad,
            req.params.id
        ];
        console.log("Valores: ", valores);
        const result = await connection.execute(sql, valores, { autoCommit: true });
        await connection.close();
        res.json(result);
    } catch (error) {
        console.error("Error al actualizar en la base de datos Oracle:", error);
        res.status(500).json("Error en el servidor");
    }
}