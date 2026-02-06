import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { playSound } from '../utils/sound'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function QuizPage() {
  const {
    lang, quiz, currentIndex, answered, selected, setSelected, setAnswered,
    score, setScore, soundOn, setSoundOn, imgError, setImgError,
    setCurrentIndex, navigate, topRef
  } = useApp()

  const q = quiz[currentIndex]

  if (!q) {
    navigate('/')
    return null
  }

  const showImage = q.type === 'PIC' && q.image && !imgError

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
      topRef.current?.scrollIntoView({ behavior: 'smooth' })
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
            src="/images/catatsuwon.jpg"
            alt="Cat mascot at Suwon"
            className="learn-hero-img"
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

      {/* Quiz Content */}
      <section className="quiz-section-wrapper">
        <div className="quiz-container">
          <div className="quiz-screen">
            <div className="quiz-header">
              <span className="quiz-progress">
                {currentIndex + 1} / {quiz.length}
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

      <Footer />
    </div>
  )
}
