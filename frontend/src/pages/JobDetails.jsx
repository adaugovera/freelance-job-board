import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJob();

    // Decode JWT to get role
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
    }
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await API.post(`/jobs/${id}/apply`, { cover_letter: coverLetter });
      setMessage("Application submitted successfully!");
      setCoverLetter("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply");
    }
  };

  if (!job) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading job...</p>;

  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.description}</p>
      <p><strong>Budget:</strong> ${job.budget}</p>

      {userRole === "freelancer" && (
        <div className="form-card" style={{ marginTop: "1.5rem" }}>
          <h2>Apply for this Job</h2>
          {message && <p style={{ color: "green" }}>{message}</p>}
          <form onSubmit={handleApply}>
            <div className="form-row">
              <textarea
                className="input"
                placeholder="Write your cover letter..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <button className="btn btn-primary" type="submit">Apply</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
