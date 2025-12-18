import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import ErrorNotice from "../components/ErrorNotice";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      // After successful login, go to profile (access point)
      navigate("/profile");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
    }
  };

  return (
    <div className="narrow">
      <div className="form-card" style={{ marginTop: 40 }}>
        <h2 style={{ textAlign: "center" }}>Login</h2>
  <ErrorNotice message={error} type="error" onClose={() => setError('')} />
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input className="input" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <input className="input" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          </div>
          <div style={{ textAlign: "right" }}>
            <button className="btn btn-primary" type="submit">Login</button>
          </div>
          <p style={{ marginTop: 8 }} className="muted">Don't have an account? <Link to="/register">Register</Link></p>
        </form>
      </div>
    </div>
  );
}
