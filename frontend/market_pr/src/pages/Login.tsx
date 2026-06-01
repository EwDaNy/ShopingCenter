import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");

      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail || !password) {
        setError("Please enter email and password");
        return;
      }

      if (!emailRegex.test(normalizedEmail)) {
        setError("Enter a valid email address");
        return;
      }

      const res = await API.post("/auth/login", {
        email: normalizedEmail,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_480px]">
      <section className="flex items-center px-6 py-12 md:px-12">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-600">
            Market Manager
          </p>
          <h1 className="mt-4 text-5xl font-black leading-tight text-slate-950 md:text-7xl">
            Clean control for your product catalog.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Manage prices, stock, categories and product details from a focused
            workspace built for daily use.
          </p>
        </div>
      </section>

      <section className="flex items-center border-l border-white/80 bg-white/80 px-6 py-10 backdrop-blur md:px-10">
        <div className="w-full rounded-lg border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/70">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-950">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to open your dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <input
              className={inputClass}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className={inputClass}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </p>
            )}

            <button
              onClick={handleLogin}
              className="w-full rounded-lg bg-slate-950 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800"
            >
              Login
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link className="font-bold text-sky-700 hover:text-sky-800" to="/register">
              Register
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
