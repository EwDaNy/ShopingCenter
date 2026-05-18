import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/market");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product._id);
    setName(product.name);
    setPrice(String(product.price));
    setCategory(product.category);
  };

  const handleUpdateProduct = async () => {
    try {
      if (!editingId) return;

      await API.put(`/market/${editingId}`, {
        name,
        price: Number(price),
        category,
      });

      setEditingId(null);
      setName("");
      setPrice("");
      setCategory("");

      fetchProducts();
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update product");
    }
  };
  const handleAddProduct = async () => {
    try {
      if (!name || !price || !category) {
        alert("Please fill all fields");
        return;
      }

      await API.post("/market", {
        name,
        price: Number(price),
        category,
      });

      setName("");
      setPrice("");
      setCategory("");

      fetchProducts();
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
  try {
    await API.delete(`/market/${id}`);
    fetchProducts();
  } catch (err: any) {
    console.log(err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to delete product");
  }
};

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Dashboard</h1>

        <button
          className="bg-gray-800 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="border p-4 rounded mb-6 flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Add Product</h2>

        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button
          className="bg-black text-white p-2 rounded"
          onClick={editingId ? handleUpdateProduct : handleAddProduct}
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <div key={p._id} className="border p-3 rounded">
            <h3 className="font-semibold">{p.name}</h3>
            <p>Price: ${p.price}</p>
            <p>Category: {p.category}</p>

            <button
              className="bg-red-600 text-white px-3 py-1 rounded mt-2"
              onClick={() => handleDeleteProduct(p._id)}
            >
              Delete
            </button>

            <button
              className="bg-blue-600 text-white px-3 py-1 rounded mt-2 mr-2"
              onClick={() => handleEditClick(p)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}