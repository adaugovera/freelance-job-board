import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Pagination from "../components/Pagination";

// Home (JobFeed) - shows all jobs with a polished card UI and graceful empty/loading states.
export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1)
  const pageSize = 8

  useEffect(() => {
    // Fetch jobs once on mount. Keep error handling simple and non-blocking for UI.
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        // Defensive: ensure we get an array
        setJobs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        // Log for debugging; UI shows empty state instead of crashing
        console.error("Failed to fetch jobs", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Loading: show a couple of skeleton cards to indicate content structure
  if (loading) {
    return (
      <div className="job-feed" aria-busy="true">
        <div className="job-feed__header">
          <h1 className="job-feed__title">Job Feed</h1>
        </div>

        <div className="job-feed__list">
          {[1, 2, 3, 4].map((n) => (
            <div className="job-card skeleton" key={n} style={{ padding: 16 }}>
              <div className="skeleton__title" />
              <div className="skeleton__line" style={{ width: '90%' }} />
              <div className="skeleton__line" style={{ width: '70%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Normal render
  return (
    <div className="job-feed">
      <div className="job-feed__header">
        <h1 className="job-feed__title">Job Feed</h1>
        {/* light CTA to dashboard - visible to everyone but doesn't change behavior */}
        <Link to="/dashboard" className="btn-cta">Dashboard</Link>
      </div>

  {jobs.length === 0 ? (
        <div className="empty-state" role="status">
          {/* Simple inline SVG illustration — avoids adding asset files while providing a friendly visual */}
          <svg className="empty-state__svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g fill="none" fillRule="evenodd">
              <circle cx="32" cy="20" r="10" fill="#EEF2FF" />
              <rect x="10" y="36" width="44" height="14" rx="3" fill="#F8FAFF" stroke="#E6EEF9" />
              <path d="M20 40h24" stroke="#E6EEF9" strokeWidth="2" strokeLinecap="round" />
              <path d="M20 44h12" stroke="#E6EEF9" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
          <div className="empty-state__title">No jobs yet</div>
          <div className="empty-state__lead">There aren't any jobs posted right now. Check back soon or post the first job to find freelancers.</div>
          <div>
            <Link to="/dashboard" className="btn-cta">Post a Job</Link>
            <Link to="/register" className="btn-cta secondary">Join as Freelancer</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="job-feed__list">
            {jobs.slice((page-1)*pageSize, (page-1)*pageSize + pageSize).map((job) => {
            const desc = job.description ? String(job.description) : "No description provided.";
            // Truncate safely
            const short = desc.length > 140 ? desc.slice(0, 140).trim() + "…" : desc;
            return (
              <article className="job-card" key={job.id} aria-labelledby={`job-${job.id}-title`}>
                <h2 id={`job-${job.id}-title`} className="job-card__title">{job.title || "Untitled Job"}</h2>
                <p className="job-card__desc">{short}</p>
                <div className="job-card__meta">
                  <div className="job-card__budget">${job.budget ?? "—"}</div>
                  <Link className="job-card__link" to={`/jobs/${job.id}`}>View Details →</Link>
                </div>
              </article>
            );
            })}
          </div>

          {/* Pagination */}
          <Pagination total={jobs.length} page={page} pageSize={pageSize} onPageChange={(p)=>setPage(p)} />
        </>
      )}
    </div>
  );
}
