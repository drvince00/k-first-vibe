import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { playSound } from '../utils/sound'
import { CATEGORY_IMAGES, CATEGORY_DESC } from '../utils/constants'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function QuizPage() {
  const {
    lang, quiz, currentIndex, answered, selected, setSelected, setAnswered,
    score, setScore, soundOn, setSoundOn, imgError, setImgError,
    setCurrentIndex, navigate, topRef,
    categories, selectedCategories, toggleCategory,
    questionCount, setQuestionCount, startQuiz, ready, quizLoading, resetQuizSetup
  } = useApp()

  // Reset quiz setup every time user navigates to this page
  useEffect(() => {
    resetQuizSetup()
  }, [resetQuizSetup])

  const quizHeaderRef = useRef(null)

  const q = quiz[currentIndex]
  const quizActive = !!q

  const showImage = quizActive && q.type === 'PIC' && q.image && !imgError

  const handleSelect = (index) => {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    const isCorrect = index === q.answer
    if (isCorrect) {
      setScore((prev) => prev + 1)
      if (soundOn) playSound('correct')
    } else {
      if (soundOn) playSound('wrong')
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 < quiz.length) {
      setCurrentIndex((prev) => prev + 1)
      setSelected(null)
      setAnswered(false)
      setImgError(false)
      quizHeaderRef.current?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/result')
    }
  }

  const getOptionClass = (index) => {
    if (!answered) return 'option-btn'
    if (index === q.answer) return 'option-btn correct'
    if (index === selected) return 'option-btn wrong'
    return 'option-btn disabled'
  }

  return (
    <div className="home-page" ref={topRef}>
      <Navbar />

      {/* Hero Banner */}
      <header className="learn-hero">
        <div className="learn-hero-content">
          <img
            src="/images/char-quiz.webp"
            alt="Quiz cat mascot"
            className="learn-hero-img"
            loading="lazy"
          />
          <div className="learn-hero-text">
            <span className="hero-label">K-QUIZ</span>
            <h1 className="hero-title">
              {lang === 'en' ? (
                <>Challenge Your<br />Korean Knowledge!</>
              ) : (
                <>한국 문화 지식에<br />도전해보세요!</>
              )}
            </h1>
            <p className="hero-desc">
              {lang === 'en'
                ? 'From TOPIK vocabulary to traditional cuisine and cultural heritage — prove how much you know about Korea!'
                : 'TOPIK 어휘부터 전통 음식, 문화유산까지 — 한국에 대해 얼마나 알고 있는지 증명하세요!'}
            </p>
            <div className="learn-speech-bubble">
              {lang === 'en' ? 'You got this! 💪' : '화이팅! 💪'}
            </div>
          </div>
        </div>
      </header>

      {/* Quiz Setup (no active quiz) */}
      {!quizActive && (
        <section className="quiz-section-wrapper">
          <div className="quiz-setup">
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              {lang === 'en' ? 'Set Up Your Quiz' : '퀴즈 설정'}
            </h2>
            <p className="section-desc" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              {lang === 'en'
                ? 'Choose categories and the number of questions to begin your journey.'
                : '카테고리와 문제 수를 선택하고 여행을 시작하세요.'}
            </p>

            <div className="category-mini-cards" style={{ maxWidth: '400px', margin: '0 auto 1rem' }}>
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

            <div className="count-options" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
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
            <div style={{ textAlign: 'center' }}>
              <button
                className="btn-primary"
                onClick={startQuiz}
                disabled={selectedCategories.length === 0 || !ready || quizLoading}
              >
                {quizLoading
                  ? 'Loading...'
                  : lang === 'en'
                    ? 'START QUIZ'
                    : '퀴즈 시작'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Active Quiz */}
      {quizActive && (
        <section className="quiz-section-wrapper">
          <div className="quiz-container" ref={quizHeaderRef}>
            <div className="quiz-screen">
              <div className="quiz-header">
                <span className="quiz-progress">
                  {currentIndex + 1} / {quiz.length}
                  {q.id != null && <span style={{ fontSize: '0.75em', color: '#888', marginLeft: '0.4em' }}>(No.{q.id})</span>}
                </span>
                <div className="quiz-header-right">
                  <button className="sound-toggle" onClick={() => setSoundOn((v) => !v)}>
                    {soundOn ? '🔊' : '🔇'}
                  </button>
                  <Link to="/" className="quit-btn">
                    Quit
                  </Link>
                </div>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentIndex + 1) / quiz.length) * 100}%` }}
                />
              </div>

              <div className="quiz-body">
                <h2 className="question-text">{q.question}</h2>

                {q.context && (
                  <p className="question-context">{q.context}</p>
                )}

                {showImage && (
                  <div className="question-image-wrapper">
                    <img
                      src={q.image}
                      alt={`Quiz question about ${q.category}`}
                      className="question-image"
                      loading="lazy"
                      onError={() => setImgError(true)}
                    />
                  </div>
                )}
              </div>

              <div className="options">
                {q.options.map((option, index) => (
                  <button
                    key={index}
                    className={getOptionClass(index)}
                    onClick={() => handleSelect(index)}
                  >
                    <span className="option-number">{index + 1}</span>
                    <span className="option-text">{option}</span>
                  </button>
                ))}
              </div>

              {answered && (
                <button className="next-btn" onClick={handleNext}>
                  {currentIndex + 1 < quiz.length ? 'Next' : 'See Results'}
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
