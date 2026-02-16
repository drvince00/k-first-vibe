import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { HERO_IMAGES } from '../utils/constants'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function HomePage() {
  const {
    lang, slideIndex, slideTransition, prevSlide, nextSlide
  } = useApp()

  const sliderImages = [...HERO_IMAGES, HERO_IMAGES[0]]

  return (
    <div className="home-page home-gradient">
      <Navbar />

      {/* Hero: Cat left + Slider right */}
      <header className="home-hero-split">
        <div className="home-hero-left">
          <img
            src="/images/catatsuwon.jpg"
            alt="K-Culture Cat mascot"
            className="home-hero-cat"
          />
          <h1 className="home-hero-title">
            {lang === 'en' ? (
              <>Explore <span className="gold-text">Korean Culture</span> with Fun</>
            ) : (
              <>재미있게 <span className="gold-text">한국 문화</span>를 탐험하세요</>
            )}
          </h1>
          <p className="home-hero-sub">
            {lang === 'en'
              ? 'Quizzes, AI styling, and more — all in one place'
              : '퀴즈, AI 스타일링 등 — 모두 한곳에서'}
          </p>
        </div>
        <div className="home-hero-right">
          <div className="home-hero-slider">
            <button className="slider-arrow slider-prev" onClick={prevSlide} aria-label="Previous image">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div
              className="slider-track"
              style={{
                transform: `translateX(-${slideIndex * 100}%)`,
                transition: slideTransition ? 'transform 0.7s ease-in-out' : 'none'
              }}
            >
              {sliderImages.map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={`Korean culture ${(i % HERO_IMAGES.length) + 1}`}
                  className="slider-img"
                />
              ))}
            </div>
            <button className="slider-arrow slider-next" onClick={nextSlide} aria-label="Next image">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Feature Cards Section */}
      <section className="home-features-section">
        <div className="home-features-grid">
          <Link to="/quiz" className="home-feature-card">
            <div className="home-feature-icon">
              <img src="/images/char-quiz.png" alt="Korean Culture Quiz" />
            </div>
            <h3>{lang === 'en' ? 'Korean Culture Quiz' : '한국 문화 퀴즈'}</h3>
            <p>{lang === 'en' ? 'TOPIK, food, and traditions' : 'TOPIK, 음식, 전통'}</p>
          </Link>
          <Link to="/style" className="home-feature-card">
            <div className="home-feature-icon">
              <img src="/images/char-style.png" alt="AI Stylist" />
            </div>
            <h3>{lang === 'en' ? 'K-Fashion AI' : 'K-패션 AI'}</h3>
            <p>{lang === 'en' ? 'AI-powered Korean fashion & hairstyle analysis' : 'AI 기반 한국 패션 & 헤어스타일 분석'}</p>
          </Link>
          <Link to="/learn" className="home-feature-card">
            <div className="home-feature-icon">
              <img src="/images/char-learn.png" alt="Learn Korean" />
            </div>
            <h3>{lang === 'en' ? 'Learn Korean' : '한국어 배우기'}</h3>
            <p>{lang === 'en' ? 'Curated YouTube lessons from top teachers' : '인기 유튜버 엄선 강의 모음'}</p>
          </Link>
          <Link to="/board" className="home-feature-card">
            <div className="home-feature-icon">
              <img src="/images/selka.jpg" alt="Community Board" />
            </div>
            <h3>{lang === 'en' ? 'Community Board' : '자유게시판'}</h3>
            <p>{lang === 'en' ? 'Share tips, questions & K-culture stories' : '꿀팁, 질문, K-컬처 이야기를 나눠보세요'}</p>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
