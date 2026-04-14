import invoiceService from "../services/invoiceService.js";

class InvoiceController {
  async create(req, res) {
    try {
      console.log("REQUEST BODY:", req.body);
      const result = await invoiceService.createInvoice(req.body);
      res.status(201).json({
        message: "Invoice created successfully",
        data: result,
      });
    } catch (error) {
      console.error("CREATE INVOICE ERROR FULL:", error);
      res.status(500).json({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  async getAll(req, res) {
    try {
      const result = await invoiceService.getInvoices(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching invoices" });
    }
  }
  async getDetails(req, res) {
    try {
      const id = parseInt(req.params.id);
      const result = await invoiceService.getInvoiceDetails(id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching invoice details" });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const result = await invoiceService.updateInvoice(id, req.body);
      if (!result) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.status(200).json({
        message: "Invoice updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating invoice" });
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const result = await invoiceService.deleteInvoice(id);
      if (!result) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.status(200).json({
        message: "Invoice deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting invoice" });
    }
  }
}

export default new InvoiceController();
