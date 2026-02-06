import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { CATEGORY_IMAGES, CATEGORY_DESC, HERO_IMAGES } from '../utils/constants'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function HomePage() {
  const {
    lang, categories, selectedCategories, toggleCategory,
    questionCount, setQuestionCount, startQuiz, ready,
    slideIndex, prevSlide, nextSlide
  } = useApp()

  return (
    <div className="home-page">
      <Navbar showQuizLink />

      <header className="hero">
        <div className="hero-content">
          <span className="hero-label">KOREAN CULTURE</span>
          <h1 className="hero-title">
            {lang === 'en' ? (
              <>Welcome to<br />K-Culture Cat</>
            ) : (
              <>K-Culture Cat에<br />오신 것을 환영합니다</>
            )}
          </h1>
          <p className="hero-desc">
            {lang === 'en'
              ? 'Your gateway to Korean culture — from language and food to fashion, traditions, and everyday life in Korea.'
              : '한국어, 음식, 패션, 전통 그리고 일상까지 — 한국 문화를 향한 당신의 관문입니다.'}
          </p>
        </div>
        <div className="hero-slider">
          <button className="slider-arrow slider-prev" onClick={prevSlide} aria-label="Previous image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="slider-track" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
            {HERO_IMAGES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Korean culture ${i + 1}`}
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
      </header>

      <section className="featured" id="quiz-section">
        <div className="featured-image">
          <img src="/quiz/rim-sunny-1196278665-23833464.jpg" alt="Korean BBQ galbi" loading="lazy" />
        </div>
        <div className="featured-content">
          <span className="section-tag">K-QUIZ</span>
          <h2 className="section-title">
            {lang === 'en' ? (
              <>Test Your Korean<br />Culture Knowledge</>
            ) : (
              <>한국 문화 지식을<br />테스트해보세요</>
            )}
          </h2>
          <p className="section-desc">
            {lang === 'en'
              ? 'Choose categories and the number of questions to begin your journey.'
              : '카테고리와 문제 수를 선택하고 여행을 시작하세요.'}
          </p>

          <div className="category-mini-cards">
            {categories.map((cat) => (
              <div
                key={cat}
                className={`category-mini-card ${selectedCategories.includes(cat) ? 'selected' : ''}`}
                onClick={() => toggleCategory(cat)}
              >
                {selectedCategories.includes(cat) && (
                  <span className="mini-card-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
                <img
                  src={CATEGORY_IMAGES[cat]}
                  alt={`${cat} - ${CATEGORY_DESC[cat]?.en}`}
                  loading="lazy"
                />
                <div className="mini-card-info">
                  <h3>{cat}</h3>
                  <p>{CATEGORY_DESC[cat]?.[lang]}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="count-options">
            {[5, 10, 20, 30].map((n) => (
              <button
                key={n}
                className={`count-chip ${questionCount === n ? 'active' : ''}`}
                onClick={() => setQuestionCount(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            className="btn-primary"
            onClick={startQuiz}
            disabled={selectedCategories.length === 0 || !ready}
          >
            {!ready
              ? 'Loading...'
              : lang === 'en'
                ? 'START QUIZ'
                : '퀴즈 시작'}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
