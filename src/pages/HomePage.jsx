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
      <Navbar variant="glass" />

      {/* Hero Slider */}
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

      {/* Hero Text */}
      <div className="home-hero-text">
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

      {/* Feature Cards */}
      <div className="feature-grid">
        <Link to="/quiz" className="feature-card">
          <img src="/temp/Gemini_Generated_Image_cuioa3cuioa3cuio.png" alt="Korean Culture Quiz" />
          <h3>{lang === 'en' ? 'K-Quiz' : 'K-퀴즈'}</h3>
          <p>{lang === 'en' ? 'Test your Korean knowledge' : '한국 문화 지식 테스트'}</p>
        </Link>
        <Link to="/style" className="feature-card">
          <img src="/temp/Gemini_Generated_Image_h7of0jh7of0jh7of.png" alt="AI Stylist" />
          <h3>{lang === 'en' ? 'AI Stylist' : 'AI 스타일리스트'}</h3>
          <p>{lang === 'en' ? 'K-Fashion AI analysis' : 'K-패션 AI 분석'}</p>
        </Link>
        <Link to="/learn" className="feature-card feature-full">
          <img src="/temp/Gemini_Generated_Image_vkgvslvkgvslvkgv.png" alt="Learn Korean" />
          <div className="card-text">
            <h3>{lang === 'en' ? 'Learn Korean' : '한국어 배우기'}</h3>
            <p>{lang === 'en' ? 'YouTube lessons from top teachers' : '인기 유튜버 강의 모음'}</p>
          </div>
        </Link>
      </div>

      {/* Desktop: Feature Cards Section */}
      <div className="desktop-features">
        <Link to="/quiz" className="desktop-feature-card">
          <img src="/temp/Gemini_Generated_Image_cuioa3cuioa3cuio.png" alt="Korean Culture Quiz" />
          <h3>{lang === 'en' ? 'Korean Culture Quiz' : '한국 문화 퀴즈'}</h3>
          <p>{lang === 'en' ? '522+ questions about TOPIK, Korean food, and traditions — test your K-culture knowledge' : 'TOPIK, 한국 음식, 전통에 대한 522개 이상의 문제 — K-문화 지식 테스트'}</p>
        </Link>
        <Link to="/style" className="desktop-feature-card">
          <img src="/temp/Gemini_Generated_Image_h7of0jh7of0jh7of.png" alt="AI Stylist" />
          <h3>{lang === 'en' ? 'K-Fashion AI Analysis' : 'K-패션 AI 분석'}</h3>
          <p>{lang === 'en' ? 'Upload your photo and get personalized Korean fashion & hairstyle recommendations' : '사진을 업로드하고 맞춤 한국 패션 & 헤어스타일 추천을 받으세요'}</p>
        </Link>
        <Link to="/learn" className="desktop-feature-card">
          <img src="/temp/Gemini_Generated_Image_vkgvslvkgvslvkgv.png" alt="Learn Korean" />
          <h3>{lang === 'en' ? 'Learn Korean Language' : '한국어 배우기'}</h3>
          <p>{lang === 'en' ? 'Curated YouTube videos and resources to help you master Korean language and culture' : '한국어와 문화를 마스터할 수 있는 엄선된 유튜브 영상과 자료'}</p>
        </Link>
      </div>

      <Footer />
    </div>
  )
}
