import crypto from "crypto";
import fs from "fs";

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // Genera una clave de 32 bytes
const iv = crypto.randomBytes(16); // Genera un IV de 16 bytes

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

const connectionString = JSON.stringify({
  user: "Admin_INV",
  password: "1234",
  connectString: "localhost/orcl",
});

const encrypted = encrypt(connectionString);

// Guarda la clave y el IV en un archivo seguro
fs.writeFileSync(
  "key.json",
  JSON.stringify({ key: key.toString("hex"), iv: encrypted.iv })
);
fs.writeFileSync("encryptedConnectionString.txt", encrypted.encryptedData);

console.log(
  "La cadena de conexión ha sido cifrada y guardada en los archivos key.json y encryptedConnectionString.txt"
);
