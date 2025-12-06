import app from "./app";
import config from "./config";
import pool from "./db";
import "./jobs/autoUpdateStatus.job";

const port = config.port || 8080;

const startServer = async () => {
  try {
    const db = await pool.query("SELECT NOW()");
    console.log("Connected to Neon:", db.rows[0]);
  } catch (error) {
    console.error("DB Error: ", error);
  }
};

startServer();

export default app;
