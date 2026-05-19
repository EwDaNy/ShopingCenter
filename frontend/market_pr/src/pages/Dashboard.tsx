import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
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

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setImage("");
    setEditingId(null);
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
        image,
      });

      resetForm();
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add product");
    }
  };

  const handleUpdateProduct = async () => {
    try {
      if (!editingId) return;

      await API.put(`/market/${editingId}`, {
        name,
        price: Number(price),
        category,
        image,
      });

      resetForm();
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update product");
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product._id);
    setName(product.name);
    setPrice(String(product.price));
    setCategory(product.category);
    setImage(product.image || "");
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await API.delete(`/market/${id}`);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Market Manager
            </h1>
            <p className="text-sm text-slate-500">
              Manage your products easily
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            <div className="flex flex-col gap-4">
              <input
                className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                type="text"
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
                className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <input
                className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />

              <button
                onClick={editingId ? handleUpdateProduct : handleAddProduct}
                className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="bg-slate-200 text-slate-800 py-3 rounded-lg font-medium hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="lg:col-span-2">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Products
              </h2>
              <p className="text-sm text-slate-500">
                Total products: {products.length}
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="bg-white border rounded-2xl p-10 text-center shadow-sm">
              <p className="text-slate-500 text-lg">No products yet</p>
              <p className="text-slate-400 text-sm mt-2">
                Add your first product using the form
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition"
                >
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-40 object-cover rounded-xl mb-4"
                    />
                  )}
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {p.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {p.category}
                      </p>
                    </div>

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      ${p.price}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="flex-1 bg-red-50 text-red-700 py-2 rounded-lg hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}