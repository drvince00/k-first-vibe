import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFoundPage() {
  const { lang } = useApp()

  return (
    <div className="home-page">
      <Navbar />

      <main className="page-content" style={{ textAlign: 'center', paddingTop: '120px' }}>
        <h1 className="page-title" style={{ fontSize: '96px', color: '#c8a882', marginBottom: '16px' }}>404</h1>
        <h2 style={{ marginBottom: '16px' }}>{lang === 'en' ? 'Page Not Found' : '페이지를 찾을 수 없습니다'}</h2>
        <p className="section-desc">
          {lang === 'en'
            ? 'The page you are looking for does not exist.'
            : '찾으시는 페이지가 존재하지 않습니다.'}
        </p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '32px', textDecoration: 'none' }}>
          {lang === 'en' ? 'GO HOME' : '홈으로'}
        </Link>
      </main>

      <Footer />
    </div>
  )
}
