import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = async () => {
    try {
      if (!email || !password) {
        alert("Please fill all fields");
        return;
      }

      await API.post("/auth/register", { email, password });

      alert("Registration successful");
      navigate("/login");
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="p-4 flex flex-col gap-3 max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-bold">Register</h1>

      <input
        className="border p-2 rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-black text-white p-2 rounded"
        onClick={handleRegister}
      >
        Register
      </button>

      <p className="text-sm">
        Already have an account?{" "}
        <Link className="underline" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}