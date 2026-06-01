import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  countInStock?: number;
  createdAt?: string;
}

type SortMode = "newest" | "priceLow" | "priceHigh" | "name";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100";

const isValidImageUrl = (value: string) => {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2500);
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/market");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
      showMessage("Could not load products");
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setImage("");
    setCountInStock("");
    setEditingId(null);
  };

  const productPayload = {
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    category: category.trim(),
    image: image.trim(),
    countInStock: Number(countInStock || 0),
  };

  const validateForm = () => {
    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const trimmedDescription = description.trim();
    const trimmedImage = image.trim();
    const priceValue = Number(price);
    const stockValue = Number(countInStock || 0);

    if (!trimmedName || !price || !trimmedCategory) {
      showMessage("Please fill product name, price and category");
      return false;
    }

    if (!Number.isFinite(priceValue)) {
      showMessage("Price must be a valid number");
      return false;
    }

    if (priceValue < 0) {
      showMessage("Price cannot be negative");
      return false;
    }

    if (!Number.isInteger(stockValue) || stockValue < 0) {
      showMessage("Stock must be a non-negative whole number");
      return false;
    }

    if (trimmedName.length > 80) {
      showMessage("Product name cannot exceed 80 characters");
      return false;
    }

    if (trimmedCategory.length > 40) {
      showMessage("Category cannot exceed 40 characters");
      return false;
    }

    if (trimmedDescription.length > 300) {
      showMessage("Description cannot exceed 300 characters");
      return false;
    }

    if (!isValidImageUrl(trimmedImage)) {
      showMessage("Image URL must be a valid http or https URL");
      return false;
    }

    return true;
  };

  const handleAddProduct = async () => {
    try {
      if (!validateForm()) return;

      await API.post("/market", productPayload);
      resetForm();
      await fetchProducts();
      showMessage("Product added");
    } catch (err: any) {
      showMessage(err.response?.data?.message || "Failed to add product");
    }
  };

  const handleUpdateProduct = async () => {
    try {
      if (!editingId || !validateForm()) return;

      await API.put(`/market/${editingId}`, productPayload);
      resetForm();
      await fetchProducts();
      showMessage("Product updated");
    } catch (err: any) {
      showMessage(err.response?.data?.message || "Failed to update product");
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product._id);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(String(product.price));
    setCategory(product.category);
    setImage(product.image || "");
    setCountInStock(String(product.countInStock || 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (id: string) => {
    const shouldDelete = window.confirm("Delete this product?");
    if (!shouldDelete) return;

    try {
      await API.delete(`/market/${id}`);
      await fetchProducts();
      showMessage("Product deleted");
    } catch (err: any) {
      showMessage(err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products]
  );

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.category.toLowerCase().includes(normalizedSearch);
        const matchesCategory =
          categoryFilter === "All" || product.category === categoryFilter;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortMode === "priceLow") return a.price - b.price;
        if (sortMode === "priceHigh") return b.price - a.price;
        if (sortMode === "name") return a.name.localeCompare(b.name);
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      });
  }, [categoryFilter, products, search, sortMode]);

  const totalValue = products.reduce(
    (sum, product) => sum + product.price * (product.countInStock || 0),
    0
  );
  const outOfStock = products.filter((product) => !product.countInStock).length;

  return (
    <div className="min-h-screen text-slate-900">
      {message && (
        <div className="fixed right-5 top-5 z-20 rounded-lg border border-sky-100 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-xl">
          {message}
        </div>
      )}

      <header className="border-b border-white/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
              Market Manager
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-950 md:text-4xl">
              Product workspace
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-300 transition hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-8 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <section className="rounded-lg border border-white bg-white p-5 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-bold text-sky-600">
                {editingId ? "Editing mode" : "New product"}
              </p>
              <h2 className="text-2xl font-black text-slate-950">
                {editingId ? "Update item" : "Add item"}
              </h2>
            </div>

            <div className="space-y-3">
              <input
                className={inputClass}
                type="text"
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                className={`${inputClass} min-h-24 resize-none`}
                placeholder="Short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />

                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  placeholder="Stock"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                />
              </div>

              <input
                className={inputClass}
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <input
                className={inputClass}
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />

              <button
                onClick={editingId ? handleUpdateProduct : handleAddProduct}
                className="w-full rounded-lg bg-sky-600 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700"
              >
                {editingId ? "Save changes" : "Add product"}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="w-full rounded-lg border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-white bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Products</p>
              <p className="mt-1 text-2xl font-black">{products.length}</p>
            </div>
            <div className="rounded-lg border border-white bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Categories</p>
              <p className="mt-1 text-2xl font-black">{categories.length - 1}</p>
            </div>
            <div className="rounded-lg border border-white bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Stock value</p>
              <p className="mt-1 text-xl font-black">${totalValue.toFixed(0)}</p>
            </div>
            <div className="rounded-lg border border-white bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Out</p>
              <p className="mt-1 text-2xl font-black text-rose-600">{outOfStock}</p>
            </div>
          </section>
        </aside>

        <section className="space-y-5">
          <div className="rounded-lg border border-white bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px]">
              <input
                className={inputClass}
                type="search"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className={inputClass}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                className={inputClass}
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
              >
                <option value="newest">Newest</option>
                <option value="priceLow">Price low</option>
                <option value="priceHigh">Price high</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {visibleProducts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-12 text-center">
              <h2 className="text-2xl font-black text-slate-950">
                No products found
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Add a product or change your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {visibleProducts.map((product) => {
                const stock = product.countInStock || 0;
                const inStock = stock > 0;

                return (
                  <article
                    key={product._id}
                    className="overflow-hidden rounded-lg border border-white bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <div className="h-48 bg-slate-100">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain p-3"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-100 via-white to-emerald-100 text-sm font-bold text-slate-500">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
                            {product.category}
                          </p>
                          <h3 className="mt-1 text-xl font-black text-slate-950">
                            {product.name}
                          </h3>
                        </div>

                        <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700">
                          ${product.price}
                        </span>
                      </div>

                      {product.description && (
                        <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <span
                          className={`rounded-lg px-3 py-2 text-xs font-black ${
                            inStock
                              ? "bg-sky-50 text-sky-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {inStock ? `${stock} in stock` : "Out of stock"}
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="rounded-lg bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
