import Product from "../models/Product.js";
import mongoose from "mongoose";

function validateProductInput(body) {
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const category = String(body.category || "").trim();
    const image = String(body.image || "").trim();
    const price = Number(body.price);
    const countInStock = Number(body.countInStock || 0);

    if (!name || !category || body.price === undefined || body.price === null || body.price === "") {
        return { error: "Name, price and category are required" };
    }

    if (!Number.isFinite(price)) {
        return { error: "Price must be a valid number" };
    }

    if (price < 0) {
        return { error: "Price cannot be negative" };
    }

    if (!Number.isInteger(countInStock) || countInStock < 0) {
        return { error: "Stock must be a non-negative whole number" };
    }

    if (name.length > 80) {
        return { error: "Product name cannot exceed 80 characters" };
    }

    if (category.length > 40) {
        return { error: "Category cannot exceed 40 characters" };
    }

    if (description.length > 300) {
        return { error: "Description cannot exceed 300 characters" };
    }

    if (image) {
        try {
            const url = new URL(image);

            if (!["http:", "https:"].includes(url.protocol)) {
                return { error: "Image URL must start with http or https" };
            }
        } catch {
            return { error: "Image URL must be a valid URL" };
        }
    }

    return {
        value: {
            name,
            description,
            price,
            category,
            image,
            countInStock,
        },
    };
}

function isValidProductId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

export async function getAllProducts(req, res){
    try{
        const products = await Product.find();
        res.status(200).json(products);
    }catch(error){
        console.error("Error in the getAllProducts controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}


export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidProductId(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function createProduct(req, res){
    try{
        const validation = validateProductInput(req.body);

        if (validation.error) {
            return res.status(400).json({ message: validation.error });
        }

        const product = new Product(validation.value);

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    }catch(error){
        console.error("Error in the createProduct controller", error);
        res.status(500).json({message: "internal server error"});
    }
}


export async function deleteProduct(req, res){
    try{
        const { id } = req.params;

        if (!isValidProductId(id)) {
            return res.status(400).json({message: "Invalid product id"});
        }

        const deletedProduct =  await Product.findByIdAndDelete(id);

        if(!deletedProduct) return res.status(404).json({message: "Product not found"});

        res.status(200).json({message:"Product deleted successfully"});

    }catch(error){
        console.error("Error is in the deleteProduct controller", error);
        res.status(500).json({message: "internal server issues"});
    }
}


export async function updateProduct(req, res){
    try{
        const { id } = req.params;

        if (!isValidProductId(id)) {
            return res.status(400).json({message: "Invalid product id"});
        }

        const validation = validateProductInput(req.body);

        if (validation.error) {
            return res.status(400).json({ message: validation.error });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, validation.value, { new: true });

        if (!updatedProduct) return res.status(404).json({message: "Product not found"});

        res.status(200).json(updatedProduct);

    }catch(error){
        console.error("Error is in the updateProduct controller", error);
        res.status(500).json({message: "internal server issues"});

    }
}
