import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

export default function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    totalCustomers: 0,
    totalInvoices: 0,
    totalAmount: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");

      setData({
        totalCustomers: res.data.totalCustomers,
        totalInvoices: res.data.totalInvoices,
        totalAmount: res.data.totalAmount,
      });
    } catch (err) {
      console.log("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#f5f6fa",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1100px", px: 3, py: 5 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={5}
        >
          <Typography variant="h4" fontWeight="bold">
            Dashboard
          </Typography>

          <Box display="flex" gap={2}>
            <Button variant="contained" onClick={() => navigate("/customers")}>
              Customers
            </Button>

            <Button variant="contained" onClick={() => navigate("/invoices")}>
              Invoices
            </Button>

            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>

        {/* Cards */}
        <Grid container spacing={4} justifyContent="center">
          {/* Card 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                gap: 3,
                height: "130px",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <PeopleIcon sx={{ fontSize: 45, color: "#1976d2" }} />

              <Box>
                <Typography color="text.secondary" mb={1}>
                  Total Customers
                </Typography>

                <Typography variant="h5" fontWeight="bold">
                  {data.totalCustomers}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Card 2 */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                gap: 3,
                height: "130px",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <ReceiptIcon sx={{ fontSize: 45, color: "#9c27b0" }} />

              <Box>
                <Typography color="text.secondary" mb={1}>
                  Total Invoices
                </Typography>

                <Typography variant="h5" fontWeight="bold">
                  {data.totalInvoices}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Card 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                gap: 3,
                height: "130px",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CurrencyRupeeIcon sx={{ fontSize: 45, color: "#2e7d32" }} />

              <Box>
                <Typography color="text.secondary" mb={1}>
                  Total Revenue
                </Typography>

                <Typography variant="h5" fontWeight="bold">
                  ₹ {data.totalAmount}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
