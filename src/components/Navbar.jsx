import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { lang, setLang } = useApp()

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">K-Culture Cat</Link>
      <div className="nav-menu">
        <Link to="/quiz" className="nav-link">K-Quiz</Link>
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
