import express from "express";
import { 
  createProduct, 
  deleteProduct, 
  getAllProducts, 
  updateProduct,
  getProductById
} from "../controllers/marketController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;

