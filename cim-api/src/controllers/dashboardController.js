import pool from "../config/db.js";

export const getDashboard = async (req, res) => {
  try {
    const totalCustomers = await pool.query(
      "SELECT COUNT(*) FROM customers WHERE isDeleted = false",
    );
    const totalInvoices = await pool.query("SELECT COUNT(*) FROM invoices");
    const totalAmount = await pool.query(
      "SELECT COALESCE(SUM(totalAmount), 0) AS total FROM invoices",
    );
    res.json({
      totalCustomers: parseInt(totalCustomers.rows[0].count),
      totalInvoices: parseInt(totalInvoices.rows[0].count),
      totalAmount: parseFloat(totalAmount.rows[0].total),
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Dashboard error" });
  }
};
