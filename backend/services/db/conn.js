import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";

const connectionString = 
  process.env.NODE_ENV === "test" 
  ? 
  // use the memorry db uri
    process.env.TEST_MONGO_DB_SERVER_URI 
  : 
  // use the real db uri
    JSON.parse( 
      fs.readFileSync(path.resolve(import.meta.dirname, "./auth.json"), "utf-8")
    ).connectionString
;

export function connectToDatabase() {
  return mongoose.connect(connectionString, {
    appName: "app",
    dbName: process.env.DB_NAME
  })
  .then(res => {
    console.log(`Connected to database`);
  })
  .catch(error => {
    console.log(`Failed to connect to database`, error);
  });
}


export function disconnectFromDataBase() {
  return mongoose.disconnect()
  .then(res => {
    console.log(`Disconnected from database`);
  })
  .catch(error => {
    console.log(`Failed to disconnect from database`, error);
  });
}


