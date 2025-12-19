import { Link } from "react-router-dom";
import { useState, useEffect } from 'react'

// Top navigation with theme toggle and responsive mobile menu hooks
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close on Escape, close when resizing above mobile breakpoint, and lock body scroll when open
  useEffect(()=>{
    const onKey = (e)=>{ if (e.key === 'Escape') setMobileOpen(false) }
    const onResize = ()=>{ if (window.innerWidth > 900) setMobileOpen(false) }
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    // lock body scroll while mobile menu is open
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return ()=>{
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const closeMenu = ()=> setMobileOpen(false)

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
            aria-controls="mobile-menu"
            aria-label="Toggle mobile menu"
            onClick={()=> setMobileOpen(v => !v)}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </div>

      {/* backdrop */}
      <div className={`mobile-backdrop ${mobileOpen ? 'open' : ''}`} onClick={closeMenu} aria-hidden={!mobileOpen} />

      <nav
        id="mobile-menu"
        data-mobile-menu
        className={`mobile-menu ${mobileOpen ? 'open' : 'closed'}`}
        aria-hidden={!mobileOpen}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <Link to="/" onClick={closeMenu}>Jobs</Link>
        <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
        <Link to="/profile" onClick={closeMenu}>Profile</Link>
        <Link to="/login" onClick={closeMenu}>Login</Link>
      </nav>
    </header>
  );
}
