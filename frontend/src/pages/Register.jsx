import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import ErrorNotice from "../components/ErrorNotice";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "freelancer", gender: "other" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      // Send only fields the backend expects (name, email, password, role)
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };
      const res = await API.post("/auth/register", payload);
      // Save token and gender locally. Gender is used client-side to style avatar.
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("gender", form.gender || "other");
      setSuccess("Registration successful — redirecting to profile...");
      // Short delay to show success message, then go to profile
      setTimeout(() => navigate("/profile"), 800);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      // Prefer server-provided structured message, otherwise generic
      const msgWithHint = (err.response?.data?.message) ? err.response.data.message : 'Registration failed. Please try again.';
      const hint = err.response?.status === 409 ? ' — it looks like you already have an account.' : '';
      setError(msgWithHint + hint);
    }
  };

  return (
    <div className="narrow">
      <div className="form-card" style={{ marginTop: 40 }}>
        <h2 style={{ textAlign: "center" }}>Register</h2>
  <ErrorNotice message={error} type="error" onClose={() => setError('')} />
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input className="input" type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <input className="input" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <input className="input" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <select className="input" name="role" value={form.role} onChange={handleChange}>
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
          </div>
          <div className="form-row">
            <label className="label">Gender</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="radio" name="gender" value="female" checked={form.gender === 'female'} onChange={handleChange} />
                Female
              </label>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="radio" name="gender" value="male" checked={form.gender === 'male'} onChange={handleChange} />
                Male
              </label>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="radio" name="gender" value="other" checked={form.gender === 'other'} onChange={handleChange} />
                Other
              </label>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <button className="btn btn-primary" type="submit">Register</button>
          </div>
          {success && <p className="success" style={{ marginTop: 8 }}>{success}</p>}
          {/* Small inline hint for existing users */}
          {error?.toLowerCase().includes('already') && (
            <p style={{ marginTop: 8 }} className="muted">Already registered? <Link to="/login">Sign in</Link></p>
          )}
        </form>
      </div>
    </div>
  );
}
