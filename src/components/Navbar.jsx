import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar({ showQuizLink = false }) {
  const { lang, setLang } = useApp()

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">K-Culture Cat</Link>
      <div className="nav-menu">
        {showQuizLink && (
          <button
            className="nav-link"
            onClick={() => {
              const el = document.getElementById('quiz-section')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            K-Quiz
          </button>
        )}
        {!showQuizLink && <Link to="/" className="nav-link">Home</Link>}
        {showQuizLink && <Link to="/about" className="nav-link">About</Link>}
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
