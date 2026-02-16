import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ variant } = {}) {
  const { lang, setLang } = useApp()
  const { user, profile, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url
  const displayName = profile?.nickname || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <nav className={`navbar ${variant === 'glass' ? 'navbar-glass' : ''}`}>
      <Link to="/" className="nav-logo">K-Culture Cat</Link>
      <div className="nav-menu">
        <Link to="/quiz" className="nav-link">K-Quiz</Link>
        <Link to="/learn" className="nav-link">Learn</Link>
        <Link to="/board" className="nav-link">Board</Link>
        <Link to="/about" className="nav-link">About</Link>
        <button
          className="lang-toggle"
          onClick={() => setLang((l) => (l === 'en' ? 'ko' : 'en'))}
        >
          {lang === 'en' ? '한글' : 'English'}
        </button>

        {!loading && (
          user ? (
            <div className="user-menu" ref={menuRef}>
              <button className="user-menu-trigger" onClick={() => setMenuOpen(!menuOpen)}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="user-avatar" referrerPolicy="no-referrer" />
                ) : (
                  <span className="user-avatar-fallback">{displayName[0].toUpperCase()}</span>
                )}
              </button>
              {menuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-name">{displayName}</div>
                  <button
                    className="user-dropdown-item"
                    onClick={() => { navigate('/mypage'); setMenuOpen(false) }}
                  >
                    My Page
                  </button>
                  <button
                    className="user-dropdown-item"
                    onClick={() => { signOut(); setMenuOpen(false) }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-login-btn">
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  )
}
