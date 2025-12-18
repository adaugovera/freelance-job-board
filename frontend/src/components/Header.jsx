import { Link } from "react-router-dom";
import { useState } from 'react'

// Top navigation with theme toggle and responsive mobile menu hooks
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="site-header" role="banner">
      <div className="container">
        <div className="brand">
          <div className="logo" aria-hidden="true">
            {/* professional minimal emblem (SVG) - inner icon increased */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="1" y="1" width="22" height="22" rx="5" fill="white" opacity="0.06"/>
              <path d="M6 12h6l-2 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="17" cy="7" r="3" fill="white" />
            </svg>
          </div>
          <Link to="/" className="wordmark" style={{textDecoration:'none',color:'inherit'}}>
            Freelance<span style={{color:'var(--primary)',marginLeft:6,fontWeight:800}}>Hub</span>
          </Link>
        </div>

        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/" className="nav-link">Jobs</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/login" className="nav-link nav-cta">Login</Link>
        </nav>

        <div style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
          <button data-theme-toggle className="theme-toggle" aria-pressed="false" title="Toggle theme">🌓</button>
          <button
            data-mobile-toggle
            className="hamburger"
            aria-expanded={String(mobileOpen)}
            aria-label="Toggle mobile menu"
            onClick={()=> setMobileOpen(v => !v)}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </div>

      <nav
        data-mobile-menu
        className={`mobile-menu ${mobileOpen ? 'open' : 'closed'}`}
        aria-hidden={!mobileOpen}
      >
        <Link to="/">Jobs</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}
