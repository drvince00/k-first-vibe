import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

function playSound(type) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (type === 'correct') {
    const notes = [523.25, 659.25, 783.99]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3)
      osc.connect(gain).connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.1)
      osc.stop(ctx.currentTime + i * 0.1 + 0.3)
    })
  } else {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  }
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function App() {
  const [allQuiz, setAllQuiz] = useState([])
  const [quiz, setQuiz] = useState([])
  const [screen, setScreen] = useState('home')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [categories, setCategories] = useState(['TOPIK', 'FOOD', 'CULTURE'])
  const [selectedCategories, setSelectedCategories] = useState(['TOPIK', 'FOOD', 'CULTURE'])
  const [questionCount, setQuestionCount] = useState(10)
  const [imgError, setImgError] = useState(false)
  const [ready, setReady] = useState(false)
  const topRef = useRef(null)

  useEffect(() => {
    fetch('/quizData.json')
      .then((res) => res.json())
      .then((data) => {
        setAllQuiz(data)
        const cats = [...new Set(data.map((q) => q.category))]
        setCategories(cats)
        setSelectedCategories(cats)
        setReady(true)
      })
  }, [])

  const buildQuiz = useCallback(() => {
    let filtered = allQuiz.filter((q) => selectedCategories.includes(q.category))
    filtered = shuffle(filtered).slice(0, questionCount)
    setQuiz(filtered)
    return filtered
  }, [allQuiz, selectedCategories, questionCount])

  const scrollToTop = useCallback(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const startQuiz = () => {
    const built = buildQuiz()
    if (built.length === 0) return
    setScreen('quiz')
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setAnswered(false)
    setImgError(false)
  }

  const handleSelect = (index) => {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    const isCorrect = index === quiz[currentIndex].answer
    if (isCorrect) {
      setScore((prev) => prev + 1)
      playSound('correct')
    } else {
      playSound('wrong')
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 < quiz.length) {
      setCurrentIndex((prev) => prev + 1)
      setSelected(null)
      setAnswered(false)
      setImgError(false)
      scrollToTop()
    } else {
      setScreen('result')
    }
  }

  const handleRetry = () => {
    const built = buildQuiz()
    if (built.length === 0) return
    setScreen('quiz')
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setAnswered(false)
    setImgError(false)
  }

  const getOptionClass = (index) => {
    if (!answered) return 'option-btn'
    if (index === quiz[currentIndex].answer) return 'option-btn correct'
    if (index === selected) return 'option-btn wrong'
    return 'option-btn disabled'
  }

  if (screen === 'home') {
    return (
      <div className="app">
        <div className="center-screen">
          <h1 className="title">K-Quiz</h1>
          <p className="subtitle">Korean Culture Quiz</p>

          <div className="home-section">
            <p className="section-label">Category</p>
            <div className="chip-list">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`chip ${selectedCategories.includes(cat) ? 'active' : ''}`}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="home-section">
            <p className="section-label">Questions</p>
            <div className="chip-list">
              {[5, 10, 20, 30].map((n) => (
                <button
                  key={n}
                  className={`chip ${questionCount === n ? 'active' : ''}`}
                  onClick={() => setQuestionCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            className="start-btn"
            onClick={startQuiz}
            disabled={selectedCategories.length === 0 || !ready}
          >
            {!ready ? 'Loading...' : 'Start'}
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'result') {
    const percentage = Math.round((score / quiz.length) * 100)
    const passed = percentage >= 70
    const congratsImg = passed
      ? `/congratulations/congrats${Math.floor(Math.random() * 11) + 1}.jpg`
      : null
    return (
      <div className="app">
        <div className="center-screen">
          <h2 className="result-title">{passed ? 'Congratulations!' : 'Quiz Complete!'}</h2>
          {congratsImg && (
            <img src={congratsImg} alt="Congratulations" className="congrats-image" />
          )}
          <div className={`score-circle ${passed ? 'pass' : ''}`}>
            <span className="score-percent">{percentage}%</span>
          </div>
          <p className="score-detail">
            {score} / {quiz.length} correct
          </p>
          {passed && <p className="score-message pass">Excellent work!</p>}
          {!passed && <p className="score-message">Keep trying, you'll get there!</p>}
          <div className="result-actions">
            <button className="result-btn primary" onClick={handleRetry}>
              Retry
            </button>
            <button className="result-btn secondary" onClick={() => setScreen('home')}>
              Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const q = quiz[currentIndex]
  const showImage = q.type === 'PIC' && q.image && !imgError

  return (
    <div className="app" ref={topRef}>
      <div className="quiz-screen">
        <div className="quiz-header">
          <span className="quiz-progress">
            {currentIndex + 1} / {quiz.length}
          </span>
          <span className="quiz-category">{q.category}</span>
          <button className="quit-btn" onClick={() => setScreen('home')}>
            Quit
          </button>
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
                alt="quiz"
                className="question-image"
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
  )
}

export default App
