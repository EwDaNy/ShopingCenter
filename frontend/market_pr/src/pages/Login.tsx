import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");

      alert("Login success");
    } catch (err: any) {
        console.log("LOGIN ERROR:", err.response?.data || err.message);
        alert(err.response?.data?.message || "Login failed");
     }
  };


  return (
    <div className="p-4 flex flex-col gap-2">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>

      <p className="text-sm">
        Don't have an account?{" "}
        <Link className="underline" to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}