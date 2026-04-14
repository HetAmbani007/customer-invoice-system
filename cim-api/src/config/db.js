import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cim_db",
  password: "testing",
  port: 5432,
});

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log("DB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1);
  }
};

export default pool;
