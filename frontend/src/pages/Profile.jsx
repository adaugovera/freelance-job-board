import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "", bio: "", skills: "", role: "" });
  const [originalUser, setOriginalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  // Fetch user info from backend (only for authenticated users)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // No token — redirect to login
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        // API interceptor already attaches Authorization header.
        const res = await API.get("/auth/me");
        const data = res.data || {};
        const fetched = {
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
          skills: data.skills || "",
          role: data.role || "",
        };
        setUser(fetched);
        setOriginalUser(fetched);
      } catch (err) {
        // If token invalid or expired, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        console.error(err);
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Determine avatar style from gender stored at registration (client-side)
  const gender = typeof window !== 'undefined' ? localStorage.getItem('gender') || 'other' : 'other';
  const avatarStyles = {
    male: { bg: '#e0f2fe', face: '#bfdbfe', stroke: '#60a5fa' },
    female: { bg: '#fff0f6', face: '#fecaca', stroke: '#fb7185' },
    other: { bg: '#eef2ff', face: '#c7d2fe', stroke: '#a78bfa' },
  };
  const av = avatarStyles[gender] || avatarStyles.other;

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      // API will attach Authorization header via interceptor
      await API.put("/auth/me", {
        name: user.name,
        bio: user.bio,
        skills: user.skills,
      });
      setMessage("Profile updated successfully!");
      // Exit edit mode and update original user snapshot
      setOriginalUser({ ...user });
      setEditMode(false);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Revert changes
    if (originalUser) setUser(originalUser);
    setError("");
    setMessage("");
    setEditMode(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('gender');
    navigate('/login');
  };

  return (
    <div className="profile-page narrow">
      <div className="form-card profile-card">
        <h1>Profile</h1>

        {loading ? (
          <p className="muted">Loading profile...</p>
        ) : (
          <>
            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}

            {!editMode ? (
              <div className="profile-view">
                <div className="profile-avatar">
                  {/* Simple placeholder avatar SVG */}
                  <svg viewBox="0 0 80 80" className="avatar-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="80" height="80" rx="12" fill={av.bg} />
                    <circle cx="40" cy="28" r="14" fill={av.face} />
                    <path d="M20 62c4-10 24-10 40 0" stroke={av.stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{user.name || "Unnamed"}</h2>
                  <div className="profile-meta">
                    <span className="muted">{user.role}</span>
                    <span className="muted">{user.email}</span>
                  </div>
                  <p className="profile-bio">{user.bio || <span className="muted">No bio yet</span>}</p>
                  <p className="profile-skills">{user.skills ? `Skills: ${user.skills}` : <span className="muted">No skills listed</span>}</p>

                  <div className="form-actions">
                    <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit Profile</button>
                    <button className="btn" onClick={handleLogout} style={{ marginLeft: 8 }}>Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <label className="label">Name</label>
                  <input
                    className="input"
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <label className="label">Email</label>
                  <input className="input" type="email" value={user.email} disabled />
                </div>

                <div className="form-row">
                  <label className="label">Bio</label>
                  <textarea
                    className="input"
                    value={user.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <label className="label">Skills</label>
                  <input
                    className="input"
                    type="text"
                    value={user.skills}
                    onChange={(e) => setUser({ ...user, skills: e.target.value })}
                  />
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button type="button" className="btn" onClick={handleCancel} style={{ marginLeft: 8 }}>Cancel</button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
