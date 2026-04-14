import { useEffect, useState } from "react";
import api from "../../api/apiClient";

import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortModel, setSortModel] = useState([]);

  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const [form, setForm] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
  });

  const [formError, setFormError] = useState("");

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "phonenumber", headerName: "Phone", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
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
            onClick={() => handleDeleteClick(params.row.customerid)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/customers", {
        params: {
          page: page + 1,
          pageSize,
          search,
          sortBy: sortModel[0]?.field || null,
          sortDir: sortModel[0]?.sort || null,
        },
      });

      setCustomers(res.data.data);
      setRowCount(res.data.totalCount);
    } catch (err) {
      console.log("Customer Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    setIsEdit(true);
    setSelectedId(row.customerid);

    setForm({
      name: row.name,
      address: row.address,
      phoneNumber: row.phonenumber,
      email: row.email,
    });

    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/customers/${selectedId}`);

      setDeleteOpen(false);
      setSelectedId(null);

      setSnackbar({
        open: true,
        message: "Customer deleted successfully",
      });

      fetchCustomers();
    } catch (err) {
      console.log("Delete error", err);
    }
  };

  const handleSubmit = async () => {
    try {
      setFormError("");

      if (!form.name || !form.address || !form.phoneNumber || !form.email) {
        setFormError("All fields are required");
        return;
      }

      if (isEdit) {
        await api.put(`/customers/${selectedId}`, form);

        setSnackbar({
          open: true,
          message: "Customer updated successfully",
        });
      } else {
        await api.post("/customers", form);

        setSnackbar({
          open: true,
          message: "Customer added successfully",
        });
      }

      setOpen(false);
      setIsEdit(false);
      setSelectedId(null);

      setForm({
        name: "",
        address: "",
        phoneNumber: "",
        email: "",
      });

      fetchCustomers();
    } catch (err) {
      if (err.response?.status === 400) {
        setFormError("Email already exists");
      } else {
        setFormError("Something went wrong");
      }
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, pageSize, search, sortModel]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Customers
      </Typography>

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
            setIsEdit(false);
            setOpen(true);
          }}
        >
          Add Customer
        </Button>
      </Box>

      <DataGrid
        rows={customers}
        columns={columns}
        getRowId={(row) => row.customerid}
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

      {/* Add/Edit Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{isEdit ? "Edit Customer" : "Add Customer"}</DialogTitle>

        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {formError && <Typography color="error">{formError}</Typography>}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {isEdit ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete this customer?
          </Typography>
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
    </Box>
  );
}
