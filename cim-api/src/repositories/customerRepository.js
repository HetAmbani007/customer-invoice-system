import pool from "../config/db.js";
import BaseRepository from "./baseRepository.js";

class CustomerRepository extends BaseRepository {
  async createCustomer(data) {
    const { name, address, phoneNumber, email } = data;

    console.log("Repository Data:", data);
    return await this.executeFunction("fn_createCustomer", [
      name,
      address,
      phoneNumber,
      email,
    ]);
  }

  async getCustomers({ search, sortBy, sortDir, page, pageSize }) {
    return await this.executeFunction("fn_getCustomers", [
      search || null,
      sortBy || "createdAt",
      sortDir || "desc",
      page || 1,
      pageSize || 10,
    ]);
  }

  async getCustomerById(id) {
    return await this.executeFunction("fn_getCustomerById", [id]);
  }

  async updateCustomer(id, data) {
    const { name, address, phoneNumber, email } = data;

    return await this.executeNonQuery("fn_updateCustomer", [
      id,
      name,
      address,
      phoneNumber,
      email,
    ]);
  }

  async deleteCustomer(id) {
    const query = `
    UPDATE customers
    SET is_deleted = true
    WHERE customerid = $1
    RETURNING *;
  `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  async getCustomerDropdown() {
    const query = `
    SELECT customerid, name, email
    FROM customers
    WHERE is_deleted = false
    ORDER BY name;
  `;

    const result = await pool.query(query);
    return result.rows;
  }
}

export default new CustomerRepository();
