import pool from "../config/db.js";
import BaseRepository from "./baseRepository.js";

class InvoiceRepository extends BaseRepository {
  async getNextInvoiceNumber() {
    const result = await this.executeFunction("fn_getNextInvoiceNumber");
    return result[0]?.nextinvoicenumber;
  }

  async createInvoice(data) {
    const { customerId, invoiceDate, dueDate, terms, totalAmount } = data;

    const query = `
      SELECT * FROM fn_createInvoice(
        $1::INT,
        $2::DATE,
        $3::DATE,
        $4::INT,
        $5::NUMERIC
      )
    `;

    const result = await pool.query(query, [
      customerId,
      invoiceDate,
      dueDate,
      terms,
      totalAmount,
    ]);

    return result.rows;
  }

  async createInvoiceLine(data) {
    const { invoiceId, description, quantity, unitPrice, lineTotal } = data;

    return await this.executeNonQuery("fn_createInvoiceLine", [
      invoiceId,
      description,
      quantity,
      unitPrice,
      lineTotal,
    ]);
  }

  async getInvoices(page, pageSize) {
    return await this.executeFunction("fn_getInvoices", [page, pageSize]);
  }

  async getInvoiceDetails(invoiceId) {
    return await this.executeFunction("fn_getInvoiceDetails", [invoiceId]);
  }

  async updateInvoice(id, data) {
    const query = `
    UPDATE invoices
    SET customerid = $1,
        invoicedate = $2,
        duedate = $3,
        totalamount = $4
    WHERE invoiceid = $5
    RETURNING *;
  `;

    const values = [
      data.customerId,
      data.invoiceDate,
      data.dueDate,
      data.totalAmount,
      id,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async deleteInvoice(id) {
    const query = `
    UPDATE invoices
    SET is_deleted = true
    WHERE invoiceid = $1
    RETURNING *;
  `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async deleteInvoiceLines(invoiceId) {
    const query = `
    DELETE FROM invoicelines
    WHERE invoiceid = $1
  `;

    await pool.query(query, [invoiceId]);
  }
}

export default new InvoiceRepository();
