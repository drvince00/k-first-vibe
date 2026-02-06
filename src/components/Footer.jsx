import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Footer() {
  const { lang } = useApp()

  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/about" className="footer-link">About</Link>
        <span className="footer-divider">|</span>
        <Link to="/about#contact-section" className="footer-link" onClick={(e) => {
          e.preventDefault()
          window.location.href = '/about#contact-section'
        }}>
          Contact
        </Link>
        <span className="footer-divider">|</span>
        <Link to="/privacy" className="footer-link">
          {lang === 'en' ? 'Privacy Policy' : '개인정보처리방침'}
        </Link>
        <span className="footer-divider">|</span>
        <Link to="/terms" className="footer-link">
          {lang === 'en' ? 'Terms of Service' : '이용약관'}
        </Link>
      </div>
      <p className="footer-copy">&copy; 2026 K-Culture Cat</p>
    </footer>
  )
}
