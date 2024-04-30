import { connectToDB } from "../db.js";

export const getAllEmployees = async (req, res) => {
    try {
        const connection = await connectToDB();
        const result = await connection.execute("SELECT * FROM EMPLEADOS_ITO");
        await connection.close();
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
    }
}
export const getEmployees = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await connectToDB();
        const result = await connection.execute("SELECT * FROM EMPLEADOS_ITO WHERE EMP_ID = :id", [id]);
        await connection.close();
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Empleado no encontrado' });
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
export const deleteEmployees = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await connectToDB();
        const result = await connection.execute('DELETE FROM EMPLEADOS_ITO WHERE EMP_ID = :id', [id], { autoCommit: true });
        await connection.close();
        res.status(200).send('Empleado eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el empleado:', error.message);
        res.status(500).json({ error: 'Error al eliminar el cliente.' });
    }
}
export const insertEmployees = async (req, res) => {
    try {
        const connection = await connectToDB();
        const sql = "INSERT INTO EMPLEADOS_ITO (EMP_PRIMERNOMBRE, EMP_SEGUNDONOMBRE, EMP_PRIMERAPELLIDO, EMP_SEGUNDOAPELLIDO, EMP_PUESTO) VALUES (:1, :2, :3, :4, :5)";
        const valores = [
            req.body.emp_primernombre,
            req.body.emp_segundonombre,
            req.body.emp_primerapellido,
            req.body.emp_segundoapellido,
            req.body.emp_puesto
        ];
        const result = await connection.execute(sql, valores, { autoCommit: true });
        await connection.close();
        res.json(result);
    } catch (error) {
        console.error("Error al insertar en la base de datos Oracle:", error);
        res.status(500).json("Error en el servidor");
    }
}
export const updateEmployees = async (req, res) => {
    try {
        const connection = await connectToDB();
        const sql = `
            UPDATE EMPLEADOS_ITO 
            SET 
                EMP_PRIMERNOMBRE = :1, 
                EMP_SEGUNDONOMBRE = :2,
                EMP_PRIMERAPELLIDO = :3,
                EMP_SEGUNDOAPELLIDO = :4,
                EMP_PUESTO = :5
            WHERE 
                EMP_ID = :6
        `;
        
       
        const valores = [
            req.body.emp_primernombre,
            req.body.emp_segundonombre,
            req.body.emp_primerapellido,
            req.body.emp_segundoapellido,
            req.body.emp_puesto,
            req.params.id  
        ];
        
        const result = await connection.execute(sql, valores, { autoCommit: true });
        await connection.close();
        
        res.json(result);
    } catch (error) {
        console.error("Error al actualizar en la base de datos Oracle:", error);
        res.status(500).json("Error en el servidor");
    }
}