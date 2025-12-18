import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-left">
          <div style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
            <div style={{width:40,height:40,borderRadius:8,background:'linear-gradient(135deg,var(--primary),var(--accent))'}} aria-hidden="true" />
            <div className="footer-copy">© {new Date().getFullYear()} FreelanceHub — Built for simplicity</div>
          </div>
        </div>

        <div className="footer-right">
          <nav className="footer-links" aria-label="Footer">
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
