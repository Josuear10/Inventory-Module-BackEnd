import oracledb from "oracledb";
import crypto from "crypto";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const algorithm = "aes-256-cbc";

function decrypt(text, key, iv) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(Buffer.from(text, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export async function connectToDB() {
  const keyData = JSON.parse(fs.readFileSync("key.json", "utf8"));
  const encryptedConnectionString = fs.readFileSync(
    "encryptedConnectionString.txt",
    "utf8"
  );

  const decryptedConnectionString = decrypt(
    encryptedConnectionString,
    keyData.key,
    keyData.iv
  );
  const connectionConfig = JSON.parse(decryptedConnectionString);

  const connection = await oracledb.getConnection(connectionConfig);
  return connection;
}
