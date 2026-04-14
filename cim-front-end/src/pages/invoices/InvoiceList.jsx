import { useEffect, useState } from "react";
import api from "../../api/apiClient";

import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import { MenuItem } from "@mui/material";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortModel, setSortModel] = useState([]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });
  const [items, setItems] = useState([
    {
      description: "",
      quantity: 1,
      unitPrice: 0,
      lineTotal: 0,
    },
  ]);

  const [totalAmount, setTotalAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    customerId: "",
    invoiceDate: "",
    terms: "",
    dueDate: "",
  });
  const [customers, setCustomers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  console.log(customers, "customers");
  // Fetch API
  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const res = await api.get("/invoices", {
        params: {
          page: page + 1,
          pageSize,
          search,
          sortBy: sortModel[0]?.field || null,
          sortDir: sortModel[0]?.sort || null,
        },
      });

      setInvoices(res.data.data);
      setRowCount(res.data.totalCount);
    } catch (err) {
      console.log("Invoice fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectedCustomer = customers.find(
    (c) => c.customerid === Number(form.customerId),
  );
  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers/dropdown");
      setCustomers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    updatedItems[index][field] = value;

    const qty = Number(updatedItems[index].quantity);
    const price = Number(updatedItems[index].unitPrice);

    updatedItems[index].lineTotal = qty * price;

    setItems(updatedItems);
  };

  const handleAddRow = () => {
    setItems([
      ...items,
      { description: "", quantity: 1, unitPrice: 0, lineTotal: 0 },
    ]);
  };
  const handleRemoveRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, pageSize, search, sortModel]);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
    setTotalAmount(total);
  }, [items]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Delete Logic
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteOpen(true);
  };

  useEffect(() => {
    fetchCustomers();
  });

  useEffect(() => {
    if (form.invoiceDate && form.terms) {
      const date = new Date(form.invoiceDate);
      date.setDate(date.getDate() + Number(form.terms));

      setForm((prev) => ({
        ...prev,
        dueDate: date.toISOString().split("T")[0],
      }));
    }
  }, [form.invoiceDate, form.terms]);

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/invoices/${selectedId}`);

      setDeleteOpen(false);
      setSelectedId(null);

      setSnackbar({
        open: true,
        message: "Invoice deleted successfully",
      });

      fetchInvoices();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  const handleEdit = async (row) => {
    try {
      setIsEdit(true);
      setEditId(row.invoiceid);
      setOpen(true);

      await fetchCustomers();

      const res = await api.get(`/invoices/${row.invoiceid}`);
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      setForm({
        customerId: data.customerid,
        invoiceDate: data.invoicedate?.split("T")[0],
        terms: data.terms || 0,
        dueDate: data.duedate?.split("T")[0],
      });

      // Handle line items safely
      if (data.lineitems && data.lineitems.length > 0) {
        setItems(
          data.lineitems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitprice,
            lineTotal: item.linetotal,
          })),
        );
      }
    } catch (err) {
      console.log("FULL ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Error loading invoice details");
    }
  };

  // const handleSubmit = async () => {
  //   try {
  //     // 🔴 Validation
  //     if (!form.invoiceDate || !form.terms) {
  //       alert("Please fill all fields");
  //       return;
  //     }

  //     if (items.length === 0) {
  //       alert("Add at least one line item");
  //       return;
  //     }
  //     if (!form.customerId) {
  //       alert("Please select customer");
  //       return;
  //     }

  //     // 🔥 Prepare payload
  //     const payload = {
  //       customerId: Number(form.customerId),
  //       invoiceDate: form.invoiceDate,
  //       dueDate: form.dueDate,
  //       terms: Number(form.terms),
  //       totalAmount: totalAmount,

  //       lineItems: items.map((item) => ({
  //         description: item.description,
  //         quantity: Number(item.quantity),
  //         unitPrice: Number(item.unitPrice),
  //         lineTotal: Number(item.lineTotal),
  //       })),
  //     };

  //     // 🔥 API CALL
  //     await api.post("/invoices", payload);

  //     // ✅ Success
  //     setSnackbar({
  //       open: true,
  //       message: "Invoice created successfully",
  //     });

  //     // 🔥 Close modal
  //     setOpen(false);

  //     // 🔥 Reset form
  //     setForm({
  //       invoiceDate: "",
  //       terms: "",
  //       dueDate: "",
  //     });

  //     setItems([{ description: "", quantity: 1, unitPrice: 0, lineTotal: 0 }]);

  //     setTotalAmount(0);

  //     // 🔥 Refresh list
  //     fetchInvoices();
  //   } catch (err) {
  //     console.log("Submit error:", err);

  //     alert(err.response?.data?.message || "Error creating invoice");
  //   }
  // };

  const handleSubmit = async () => {
    try {
      if (!form.customerId) return alert("Select customer");
      if (!form.invoiceDate || !form.terms)
        return alert("Fill required fields");

      const payload = {
        customerId: Number(form.customerId),
        invoiceDate: form.invoiceDate,
        dueDate: form.dueDate,
        terms: Number(form.terms),
        totalAmount,
        lineItems: items.map((i) => ({
          description: i.description,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
          lineTotal: Number(i.lineTotal),
        })),
      };

      if (isEdit) {
        await api.put(`/invoices/${editId}`, payload);

        setSnackbar({
          open: true,
          message: "Invoice updated successfully",
        });
      } else {
        await api.post("/invoices", payload);

        setSnackbar({
          open: true,
          message: "Invoice created successfully",
        });
      }

      // Reset everything
      setOpen(false);
      setIsEdit(false);
      setEditId(null);

      setForm({
        customerId: "",
        invoiceDate: "",
        terms: "",
        dueDate: "",
      });

      setItems([{ description: "", quantity: 1, unitPrice: 0, lineTotal: 0 }]);

      fetchInvoices();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const columns = [
    { field: "invoiceid", headerName: "Invoice ID", width: 120 },
    { field: "customername", headerName: "Customer", flex: 1 },
    { field: "invoicedate", headerName: "Invoice Date", flex: 1 },
    { field: "duedate", headerName: "Due Date", flex: 1 },
    { field: "totalamount", headerName: "Amount", flex: 1 },

    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <>
          <Button size="small" onClick={() => handleEdit(params.row)}>
            Edit
          </Button>

          <Button
            size="small"
            color="error"
            onClick={() => handleDeleteClick(params.row.invoiceid)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Invoices
      </Typography>

      <TextField
        select
        label="Customer"
        fullWidth
        margin="normal"
        value={form.customerId}
        onChange={(e) => setForm({ ...form, customerId: e.target.value })}
      >
        {customers.map((c) => (
          <MenuItem key={c.customerid} value={c.customerid}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>
      {selectedCustomer && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Email: {selectedCustomer.email}
        </Typography>
      )}
      {/* Top Bar */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Search"
          size="small"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
            fetchCustomers(); //
          }}
        >
          Add Invoice
        </Button>
      </Box>

      {/* DataGrid */}
      <DataGrid
        rows={invoices}
        columns={columns}
        getRowId={(row) => row.invoiceid}
        loading={loading}
        pagination
        paginationMode="server"
        rowCount={rowCount}
        pageSizeOptions={[5, 10, 20]}
        page={page}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => setPageSize(newSize)}
        sortingMode="server"
        onSortModelChange={(model) => setSortModel(model)}
        autoHeight
      />

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
          <Typography>Are you sure you want to delete this invoice?</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
      >
        <Alert severity="success">{snackbar.message}</Alert>
      </Snackbar>
      {/* Add Invoice Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{isEdit ? "Edit Invoice" : "Add Invoice"}</DialogTitle>

        <DialogContent>
          {/* Invoice Date */}
          <TextField
            type="date"
            label="Invoice Date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={form.invoiceDate}
            onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
          />

          {/* Terms */}
          <TextField
            label="Terms (Days)"
            type="number"
            fullWidth
            margin="normal"
            value={form.terms}
            onChange={(e) => setForm({ ...form, terms: e.target.value })}
          />

          {/* Due Date */}
          <TextField
            label="Due Date"
            fullWidth
            margin="normal"
            value={form.dueDate}
            InputProps={{ readOnly: true }}
          />

          {/* LINE ITEMS */}
          <Typography mt={2} mb={1}>
            Line Items
          </Typography>

          {items.map((item, index) => (
            <Box key={index} display="flex" gap={2} mb={2}>
              <TextField
                label="Description"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
              />

              <TextField
                label="Qty"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                sx={{ width: 80 }}
              />

              <TextField
                label="Price"
                type="number"
                value={item.unitPrice}
                onChange={(e) =>
                  handleItemChange(index, "unitPrice", e.target.value)
                }
                sx={{ width: 120 }}
              />

              <TextField
                label="Total"
                value={item.lineTotal}
                InputProps={{ readOnly: true }}
                sx={{ width: 120 }}
              />

              <Button color="error" onClick={() => handleRemoveRow(index)}>
                X
              </Button>
            </Box>
          ))}

          <Button onClick={handleAddRow}>+ Add Row</Button>

          {/* TOTAL */}
          <Typography mt={2}>Total Amount: ₹ {totalAmount}</Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setIsEdit(false);
              setEditId(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
