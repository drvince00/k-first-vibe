import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const SITE_URL = 'https://kculturecat.cc'

const SHARE_TEXT = {
  en: 'Test your Korean culture knowledge! Fun quizzes about K-Food, TOPIK & more 🇰🇷',
  ko: '한국 문화 퀴즈에 도전하세요! K-Food, TOPIK 등 재미있는 퀴즈 🇰🇷'
}

function ShareButtons({ lang }) {
  const text = SHARE_TEXT[lang] || SHARE_TEXT.en
  const encodedUrl = encodeURIComponent(SITE_URL)
  const encodedText = encodeURIComponent(text)

  const share = (url) => {
    window.open(url, '_blank', 'width=600,height=500,noopener,noreferrer')
  }

  return (
    <div className="share-buttons">
      {/* X (Twitter) */}
      <button
        className="share-btn share-x"
        onClick={() => share(`https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`)}
        aria-label="Share on X"
        title="X"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </button>
      {/* Facebook */}
      <button
        className="share-btn share-fb"
        onClick={() => share(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}
        aria-label="Share on Facebook"
        title="Facebook"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </button>
      {/* KakaoTalk */}
      <button
        className="share-btn share-kakao"
        onClick={() => {
          const kakaoUrl = `https://story.kakao.com/share?url=${encodedUrl}`
          share(kakaoUrl)
        }}
        aria-label="Share on KakaoTalk"
        title="KakaoTalk"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.858 1.898 5.37 4.752 6.788l-1.22 4.492a.5.5 0 0 0 .764.534l5.252-3.494c.15.006.3.012.452.012 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
        </svg>
      </button>
      {/* LINE */}
      <button
        className="share-btn share-line"
        onClick={() => share(`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`)}
        aria-label="Share on LINE"
        title="LINE"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.39.084.923.258 1.058.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967C23.309 14.253 24 12.39 24 10.304zm-17.04 2.241a.45.45 0 0 1-.449.449H4.056a.449.449 0 0 1-.449-.449V8.637a.45.45 0 0 1 .898 0v3.459h1.955a.45.45 0 0 1 0 .898v-.449zm2.035-.449a.45.45 0 0 1-.898 0V8.637a.45.45 0 0 1 .898 0v3.459zm5.163 0a.45.45 0 0 1-.449.449.44.44 0 0 1-.357-.179l-2.516-3.396v3.126a.45.45 0 0 1-.898 0V8.637a.45.45 0 0 1 .449-.449.44.44 0 0 1 .357.179l2.516 3.396V8.637a.45.45 0 0 1 .898 0v3.459zm3.897-2.561a.45.45 0 0 1 0 .898h-1.955v.714h1.955a.45.45 0 0 1 0 .898h-2.404a.449.449 0 0 1-.449-.449V8.637a.45.45 0 0 1 .449-.449h2.404a.45.45 0 0 1 0 .898h-1.955v.714h1.955v-.265z"/>
        </svg>
      </button>
    </div>
  )
}

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
        {showQuizLink && <ShareButtons lang={lang} />}
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
