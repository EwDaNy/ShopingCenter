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


export async function getProductById(req, res) {
  try {
    const { id } = req.params;

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
        const { name, price, category, image } = req.body;

        const product = new Product({
            name,
            price,
            category,
            image,
        });

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
        const {name, price, category,  image} = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) return res.status(404).json({message: "Product not found"});

        res.status(200).json(updatedProduct);

    }catch(error){
        console.error("Error is in the updateProduct controller", error);
        res.status(500).json({message: "internal server issues"});

    }
}
