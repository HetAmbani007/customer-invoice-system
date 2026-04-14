import pool from "../config/db.js";

class BaseRepository {
  async executeFunction(functionName, params = []) {
    try {
      const placeholders = params.map((_, i) => `$${i + 1}`).join(", ");
      const query = `SELECT * FROM ${functionName}(${placeholders})`;

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error("DB Function Error:", error);
      throw error;
    }
  }

  async executeNonQuery(functionName, params = []) {
    try {
      const placeholders = params.map((_, i) => `$${i + 1}`).join(", ");
      const query = `SELECT ${functionName}(${placeholders})`;

      await pool.query(query, params);
    } catch (error) {
      console.error("DB NonQuery Error:", error);
      throw error;
    }
  }
}

export default BaseRepository;
