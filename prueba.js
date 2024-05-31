import bcrypt from "bcryptjs";
import { connectToDB } from "./db.js";

async function insertUser(username, plainPassword) {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  let connection;

  try {
    connection = await connectToDB();
    await connection.execute(
      `INSERT INTO Usuarios_ITO (USU_USUARIO, USU_CONTRASEÑA) VALUES (:username, :password)`,
      [username, hashedPassword],
      { autoCommit: true }
    );
    console.log("User inserted successfully");
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

insertUser("superadministrator", "AdminInventario"); // Cambia los valores según sea necesario
