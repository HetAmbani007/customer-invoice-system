import customerRepository from "../repositories/customerRepository.js";
class CustomerService {
  async createCustomer(data) {
    return await customerRepository.createCustomer(data);
  }
  async getCustomers(query) {
    return await customerRepository.getCustomers(query);
  }
  async getCustomerById(id) {
    const result = await customerRepository.getCustomerById(id);
    return result[0];
  }
  async updateCustomer(id, data) {
    return await customerRepository.updateCustomer(id, data);
  }
  async deleteCustomer(id) {
    const customer = await customerRepository.deleteCustomer(id);

    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  }
  async getCustomerDropdown() {
    return await customerRepository.getCustomerDropdown();
  }
}

export default new CustomerService();
