import { config } from "dotenv";
import { existsSync } from "node:fs";
import http from "node:http";
import path from "node:path";

// .env config
config();

// .env.local config
const envLocalFilePath = path.resolve(import.meta.dirname, ".env.local")
if(existsSync(envLocalFilePath)) { // .env.local exists
  config({ path: envLocalFilePath })
};

// App import and database connection fn import
const app = await import("./backend/app/index.js");
const { connectToDatabase } = await import("./backend/services/db/conn.js");


const { PORT, IP, PROTOCOL } = process.env;

// Create the server
const server = http.createServer(app.default);

await connectToDatabase();

// Set a server host
process.env.SERVER_HOST_URL = `${PROTOCOL}://${IP}:${PORT}`;

// Listen
server.listen(PORT, IP, () => {
  console.log(`Server is running on port ${IP}:${PORT}`);
});
