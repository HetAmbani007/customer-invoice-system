import invoiceRepository from "../repositories/invoiceRepository.js";

class InvoiceService {
  async createInvoice(data) {
    console.log("createInvoice called");
    const { customerId, invoiceDate, terms, lineItems } = data;

    // 1 Generate invoice number
    console.log("Before invoice number");
    const invoiceNumber = await invoiceRepository.getNextInvoiceNumber();

    console.log("After invoice number:", invoiceNumber);

    // 2 Calculate due date
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + terms);

    // 3 Calculate total amount
    let totalAmount = 0;

    const processedItems = lineItems.map((item) => {
      const lineTotal = item.quantity * item.unitPrice;
      totalAmount += lineTotal;

      return { ...item, lineTotal };
    });

    // 4️⃣ Create invoice
    const invoiceResult = await invoiceRepository.createInvoice({
      customerId,
      invoiceDate,
      dueDate,
      terms,
      totalAmount,
    });

    const invoiceId = invoiceResult[0]?.invoiceid;

    // 5️⃣ Insert line items
    for (const item of processedItems) {
      await invoiceRepository.createInvoiceLine({
        invoiceId,
        ...item,
      });
    }

    return {
      invoiceId,
      invoiceNumber,
      totalAmount,
    };
  }

  async getInvoices(query) {
    const { page = 1, pageSize = 10 } = query;
    const result = await invoiceRepository.getInvoices(page, pageSize);
    return {
      data: result,
      totalCount: result[0]?.totalcount || 0,
      page,
      pageSize,
    };
  }

  async getInvoiceDetails(invoiceId) {
    return await invoiceRepository.getInvoiceDetails(invoiceId);
  }
  async updateInvoice(id, data) {
    const { customerId, invoiceDate, dueDate, totalAmount, lineItems } = data;

    // 1. Update invoice
    await invoiceRepository.updateInvoice(id, {
      customerId,
      invoiceDate,
      dueDate,
      totalAmount,
    });

    // 2. Delete old line items
    await invoiceRepository.deleteInvoiceLines(id);

    // 3. Insert new line items
    for (const item of lineItems) {
      await invoiceRepository.createInvoiceLine({
        invoiceId: id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
      });
    }

    return { message: "Invoice updated successfully" };
  }

  async deleteInvoice(id) {
    return await invoiceRepository.deleteInvoice(id);
  }
}

export default new InvoiceService();
