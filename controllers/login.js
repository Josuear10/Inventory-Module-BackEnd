import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { connectToDB } from "../db.js";

dotenv.config();
const secretKey = process.env.SECRET_KEY;

export const postLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  let connection;

  try {
    connection = await connectToDB();

    const result = await connection.execute(
      `SELECT * FROM Usuarios_ITO WHERE USU_USUARIO = :username`,
      [username]
    );

    console.log("Query result:", result.rows);

    if (result.rows.length === 0) {
      console.log("No user found");
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const user = result.rows[0];
    console.log("User data:", user);

    const storedPassword = user[2]; // Asegúrate de que este índice sea correcto
    console.log("Stored password:", storedPassword);

    // Log de la contraseña ingresada
    console.log("Entered password:", password);

    const passwordMatch = await bcrypt.compare(password, storedPassword);
    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      console.log("Passwords do not match");
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user[0], username: user[1] }, secretKey, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful.", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

