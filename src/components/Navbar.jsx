import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { lang, setLang } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  const handleQuizClick = (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      const el = document.getElementById('quiz-section')
      el?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById('quiz-section')
        el?.scrollIntoView({ behavior: 'smooth' })
      }, 400)
    }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">K-Culture Cat</Link>
      <div className="nav-menu">
        <a href="/#quiz-section" className="nav-link" onClick={handleQuizClick}>
          K-Quiz
        </a>
        <Link to="/learn" className="nav-link">Learn</Link>
        <Link to="/about" className="nav-link">About</Link>
        <button
          className="lang-toggle"
          onClick={() => setLang((l) => (l === 'en' ? 'ko' : 'en'))}
        >
          {lang === 'en' ? '한글' : 'English'}
        </button>
      </div>
    </nav>
  )
}
