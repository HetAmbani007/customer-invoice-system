import { useState } from "react";
import api from "../../api/apiClient";
import { useNavigate, Link } from "react-router-dom";

import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setError("");
      setLoading(true);

      // Validation
      if (
        !form.firstName ||
        !form.email ||
        !form.phoneNumber ||
        !form.password
      ) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      await api.post("/auth/register", form);

      navigate("/login");
    } catch (err) {
      console.log("REGISTER ERROR:", err);

      if (err.response?.status === 400) {
        setError(err.response.data?.message || "Email already exists");
      } else if (err.request) {
        setError("Server not responding");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #eef2f3, #dfe9f3)",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          {/* Title */}
          <Typography variant="h5" textAlign="center" mb={3} fontWeight="bold">
            Create Account 🚀
          </Typography>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* First Name */}
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            value={form.firstName}
            onChange={(e) => {
              setForm({ ...form, firstName: e.target.value });
              setError("");
            }}
          />

          {/* Email */}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              setError("");
            }}
          />

          {/* Phone */}
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={form.phoneNumber}
            onChange={(e) => {
              setForm({ ...form, phoneNumber: e.target.value });
              setError("");
            }}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              setError("");
            }}
          />

          {/* Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.2 }}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Register"
            )}
          </Button>

          {/* Login Link */}
          <Typography mt={3} textAlign="center">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              Login
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
