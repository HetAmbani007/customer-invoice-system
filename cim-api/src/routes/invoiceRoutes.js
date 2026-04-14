import express from "express";
import invoiceController from "../controllers/invoiceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", invoiceController.create);
router.get("/", invoiceController.getAll);
router.get("/:id", invoiceController.getDetails);
router.put("/:id", invoiceController.update);
router.delete("/:id", invoiceController.delete);

export default router;
