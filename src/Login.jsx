import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://facial-payment-app-backend.onrender.com/login",
        {
          phone,
          password,
        }
      );

      if (res.data.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("phone", phone);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("profile_pic", res.data.profile_pic || "");
        navigate("/home");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      setError("Login error. Please check phone and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center px-4">
      <div className="bg-slate-800 w-full max-w-md p-6 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Welcome Back</h2>
          <p className="text-sm text-slate-400">Login to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Phone Number</label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-slate-400 mt-4">
          New here?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
