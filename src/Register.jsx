import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    cid: "",
    dob: "",
    phone: "",
    password: "",
  });
  const [started, setStarted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("cid", formData.cid);
    data.append("dob", formData.dob);
    data.append("phone", formData.phone);
    data.append("password", formData.password);

    await axios.post("http://localhost:5000/register", data);
    setStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center px-4">
      <div className="bg-slate-800 w-full max-w-md p-6 rounded-xl shadow-lg">
        {!started ? (
          <>
            <h2 className="text-2xl font-semibold text-center mb-4">
              Register
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">CID Number</label>
                <input
                  type="text"
                  name="cid"
                  value={formData.cid}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
              >
                Start Camera
              </button>
            </form>

            <p className="text-sm text-center text-slate-400 mt-4">
              Already registered?{" "}
              <a href="/login" className="text-blue-400 hover:underline">
                Login
              </a>
            </p>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Face Registration</h2>
            <img
              src="http://localhost:5000/video_feed"
              alt="Video Feed"
              className="rounded-lg mx-auto mb-4"
            />
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
