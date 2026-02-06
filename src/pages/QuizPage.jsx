import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { playSound } from '../utils/sound'
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
    <div className="app" ref={topRef}>
      <div className="quiz-mascot">
        <img src="/images/catatsuwon.jpg" alt="Cat mascot" className="quiz-mascot-img" />
        <div className="quiz-mascot-bubble">
          {lang === 'en' ? 'You got this! 💪' : '화이팅! 💪'}
        </div>
      </div>
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
      <Footer />
    </div>
  )
}
