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

const CATEGORY_IMAGES = {
  TOPIK: '/quiz/seoul-3804293_640.jpg',
  FOOD: '/quiz/bibimbap-1738580_640.jpg',
  CULTURE: '/quiz/samulnori-7846037_640.jpg',
}

const CATEGORY_DESC = {
  TOPIK: { en: 'Korean Language', ko: '한국어 능력' },
  FOOD: { en: 'Korean Cuisine', ko: '한국 음식' },
  CULTURE: { en: 'Traditions & Heritage', ko: '전통과 유산' },
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
  const [soundOn, setSoundOn] = useState(() => !/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactStatus, setContactStatus] = useState(null)
  const [lang, setLang] = useState('en')
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

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactStatus('sending')
    try {
      const res = await fetch('https://formspree.io/f/mgozgrjk', {
        method: 'POST',
        body: JSON.stringify({ email: contactEmail, message: contactMessage }),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        setContactStatus('success')
        setContactEmail('')
        setContactMessage('')
      } else {
        setContactStatus('error')
      }
    } catch {
      setContactStatus('error')
    }
  }

  const getOptionClass = (index) => {
    if (!answered) return 'option-btn'
    if (index === quiz[currentIndex].answer) return 'option-btn correct'
    if (index === selected) return 'option-btn wrong'
    return 'option-btn disabled'
  }

  // ===== HOME SCREEN =====
  if (screen === 'home') {
    return (
      <div className="home-page">
        <nav className="navbar">
          <div className="nav-logo">
            <span className="logo-italic">the</span> K-VIBE
          </div>
          <div className="nav-menu">
            <button
              className="nav-link"
              onClick={() => {
                const el = document.getElementById('quiz-section')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              K-Quiz
            </button>
            <button className="nav-link">Login</button>
            <button
              className="lang-toggle"
              onClick={() => setLang((l) => (l === 'en' ? 'ko' : 'en'))}
            >
              {lang === 'en' ? '한글' : 'English'}
            </button>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-content">
            <span className="hero-label">KOREAN CULTURE</span>
            <h1 className="hero-title">
              {lang === 'en' ? (
                <>Welcome to<br />K-First Vibe</>
              ) : (
                <>K-First Vibe에<br />오신 것을 환영합니다</>
              )}
            </h1>
            <p className="hero-desc">
              {lang === 'en'
                ? 'Discover Korean culture through interactive quizzes about food, language, and traditions.'
                : '음식, 언어, 전통에 대한 재미있는 퀴즈로 한국 문화를 탐험해보세요.'}
            </p>
            <div className="hero-actions">
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
          </div>
          <div className="hero-image">
            <img src="/quiz/gyeongbok-palace-2929520_640.jpg" alt="Gyeongbokgung Palace" />
          </div>
        </section>

        <section className="category-section" id="quiz-section">
          <div className="section-header">
            <span className="section-tag">
              {lang === 'en' ? 'OUR QUIZ' : '퀴즈'}
            </span>
            <h2 className="section-title">
              {lang === 'en' ? 'Quiz Categories' : '퀴즈 카테고리'}
            </h2>
            <p className="section-desc">
              {lang === 'en'
                ? 'Select the categories you want to explore'
                : '탐험하고 싶은 카테고리를 선택하세요'}
            </p>
          </div>
          <div className="category-cards">
            {categories.map((cat) => (
              <div
                key={cat}
                className={`category-card ${selectedCategories.includes(cat) ? 'selected' : ''}`}
                onClick={() => toggleCategory(cat)}
              >
                <img
                  src={CATEGORY_IMAGES[cat] || '/quiz/seoul-3804293_640.jpg'}
                  alt={cat}
                />
                <div className="card-info">
                  <h3>{cat}</h3>
                  <p>{CATEGORY_DESC[cat]?.[lang] || cat}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="featured">
          <div className="featured-image">
            <img src="/quiz/korean-barbecue-8579180_640.jpg" alt="Korean BBQ" />
          </div>
          <div className="featured-content">
            <span className="section-tag">
              {lang === 'en' ? 'GET STARTED' : '시작하기'}
            </span>
            <h2 className="section-title">
              {lang === 'en' ? (
                <>Customize Your<br />Quiz Experience</>
              ) : (
                <>나만의 퀴즈<br />경험 만들기</>
              )}
            </h2>
            <p className="section-desc">
              {lang === 'en'
                ? 'Choose the number of questions and begin your Korean culture journey.'
                : '문제 수를 선택하고 한국 문화 여행을 시작하세요.'}
            </p>
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

        <section className="contact-section-home">
          <h3 className="contact-title">
            {lang === 'en' ? 'Contact Us' : '관리자에게 문의'}
          </h3>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <label className="contact-label">
              {lang === 'en' ? 'Email' : '이메일'}
              <input
                type="email"
                className="contact-input"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </label>
            <label className="contact-label">
              {lang === 'en' ? 'Message' : '내용'}
              <textarea
                className="contact-textarea"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder={
                  lang === 'en' ? 'Write your message here' : '문의 내용을 입력하세요'
                }
                rows={4}
                required
              />
            </label>
            <button
              type="submit"
              className="btn-primary contact-submit-btn"
              disabled={contactStatus === 'sending'}
            >
              {contactStatus === 'sending'
                ? lang === 'en'
                  ? 'Sending...'
                  : '전송 중...'
                : lang === 'en'
                  ? 'SEND MESSAGE'
                  : '보내기'}
            </button>
            {contactStatus === 'success' && (
              <p className="contact-msg success">
                {lang === 'en'
                  ? 'Message sent successfully!'
                  : '문의가 전송되었습니다!'}
              </p>
            )}
            {contactStatus === 'error' && (
              <p className="contact-msg error">
                {lang === 'en'
                  ? 'Failed to send. Please try again.'
                  : '전송에 실패했습니다. 다시 시도해주세요.'}
              </p>
            )}
          </form>
        </section>

        <footer className="footer">
          <p>&copy; 2026 K-First Vibe</p>
        </footer>
      </div>
    )
  }

  // ===== RESULT SCREEN =====
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

  // ===== QUIZ SCREEN =====
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
          <div className="quiz-header-right">
            <button className="sound-toggle" onClick={() => setSoundOn((v) => !v)}>
              {soundOn ? '🔊' : '🔇'}
            </button>
            <button className="quit-btn" onClick={() => setScreen('home')}>
              Quit
            </button>
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
