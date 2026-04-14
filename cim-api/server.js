import cors from "cors";
// import "dotenv/config";0
import express from "express";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import customerRoutes from "./src/routes/customerRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import invoiceRoutes from "./src/routes/invoiceRoutes.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

connectDB();

app.use("/api/customers", customerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});
app.post("/api/auth/register", (req, res) => {
  res.send("Direct route hit");
});
