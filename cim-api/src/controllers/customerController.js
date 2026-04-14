import customerService from "../services/customerService.js";

class CustomerController {
  async create(req, res) {
    try {
      console.log("Request Body:", req.body);
      await customerService.createCustomer(req.body);
      res.status(201).json({ message: "Customer created successfully" });
    } catch (error) {
      console.error("Create Customer Error:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const data = await customerService.getCustomers(req.query);
      res.status(200).json({
        data,
        totalCount: data[0]?.totalcount || 0,
        page: Number(req.query.page || 1),
        pageSize: Number(req.query.pageSize || 10),
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching customers" });
    }
  }

  async getById(req, res) {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ message: "Error fetching customer" });
    }
  }

  async update(req, res) {
    try {
      await customerService.updateCustomer(req.params.id, req.body);
      res.status(200).json({ message: "Customer updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating customer" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const data = await customerService.deleteCustomer(id);
      if (!data) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.status(200).json({
        message: "Customer deleted successfully",
        data,
      });
    } catch (error) {
      console.error("Delete Customer Error:", error);
      res.status(500).json({
        message: error.message || "Error deleting customer",
      });
    }
  }
  async getDropdown(req, res) {
    try {
      const data = await customerService.getCustomerDropdown();
      res.status(200).json(data);
    } catch (error) {
      // THIS LINE IS CRITICAL
      console.error("Dropdown Error FULL:", error);
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

export default new CustomerController();
