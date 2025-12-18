import { useState, useEffect } from "react";
import API from "../api/axios";
import { useToast } from "../components/Toast";

export default function Dashboard() {
  const [userRole, setUserRole] = useState("");
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", budget: "" });
  const [message, setMessage] = useState("");
  const toast = useToast()

  useEffect(() => {
    // Decode token to get role
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await API.post("/jobs/create", form);
      setJobs([...jobs, res.data]);
      setForm({ title: "", description: "", budget: "" });
      setMessage("Job created successfully!");
      try{ toast('Job created successfully', 'success', 3500) }catch(e){}
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create job"
      setMessage(msg);
      try{ toast(msg, 'error', 5000) }catch(e){}
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Dashboard ({userRole})</h1>

      {userRole === "client" && (
        <div className="form-card" style={{ margin: "1.25rem 0" }}>
          <h2>Create a New Job</h2>
          {message && <p style={{ color: "green" }}>{message}</p>}
          <form onSubmit={handleCreateJob}>
            <div className="form-row">
              <input className="input" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <textarea className="input" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <input className="input" name="budget" type="number" placeholder="Budget" value={form.budget} onChange={handleChange} required />
            </div>
            <div style={{ textAlign: "right" }}>
              <button className="btn btn-primary" type="submit">Create Job</button>
            </div>
          </form>
        </div>
      )}

      {userRole === "freelancer" && (
        <div className="form-card" style={{ margin: "1.25rem 0" }}>
          <h2>Your Applications</h2>
          <p className="muted">Coming soon: list of jobs you applied for...</p>
        </div>
      )}

    </div>
  );
}
