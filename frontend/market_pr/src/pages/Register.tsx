import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      setMessage("");

      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail || !password) {
        setMessage("Please fill all fields");
        return;
      }

      if (!emailRegex.test(normalizedEmail)) {
        setMessage("Enter a valid email address");
        return;
      }

      if (password.length < 6) {
        setMessage("Password must be at least 6 characters");
        return;
      }

      await API.post("/auth/register", {
        email: normalizedEmail,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[480px_1fr]">
      <section className="flex items-center border-r border-white/80 bg-white/80 px-6 py-10 backdrop-blur md:px-10">
        <div className="w-full rounded-lg border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/70">
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-600">
              Start
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">
              Create account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Your product dashboard is one step away.
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

            {message && (
              <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {message}
              </p>
            )}

            <button
              className="w-full rounded-lg bg-sky-600 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="font-bold text-sky-700 hover:text-sky-800" to="/login">
              Login
            </Link>
          </p>
        </div>
      </section>

      <section className="flex items-center px-6 py-12 md:px-12">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-600">
            Market Manager
          </p>
          <h2 className="mt-4 text-5xl font-black leading-tight text-slate-950 md:text-7xl">
            Build a catalog that is easy to scan and simple to update.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Add products, track stock, organize categories and keep your store
            data clean from one modern interface.
          </p>
        </div>
      </section>
    </main>
  );
}
