import Product from "../models/Product.js";


export async function getAllProducts(req, res){
    try{
        const products = await Product.find();
        res.status(200).json(products);
    }catch(error){
        console.error("Error in the getAllProducts controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export function createProduct(req, res){
    res.status(201).json({ message: "You successfully created a product to sell"})
}

export function deleteProduct(req, res){
    res.status(200).json({message: "You successfully deleted a product"})
}

export function updateProduct(req, res){
    res.status(200).json({ message: "You successfully updated a product"})
}
