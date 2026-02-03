import { useState } from 'react'
import './App.css'

const SAMPLE_QUIZ = [
  {
    id: 1,
    question: '이 음식의 이름은 무엇일까요?',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Dolsot-bibimbap.jpg/500px-Dolsot-bibimbap.jpg',
    options: ['김치찌개', '비빔밥', '불고기', '떡볶이'],
    answer: 1,
  },
  {
    id: 2,
    question: '이 한국 전통 의상의 이름은?',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Korean.clothing-Hanbok-01.jpg/400px-Korean.clothing-Hanbok-01.jpg',
    options: ['기모노', '한복', '치파오', '아오자이'],
    answer: 1,
  },
  {
    id: 3,
    question: '이 건축물은 어디에 있을까요?',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Gyeongbokgung-GessanjeongBackView.jpg/500px-Gyeongbokgung-GeunjeongmunFront.jpg',
    options: ['창덕궁', '덕수궁', '경복궁', '경희궁'],
    answer: 2,
  },
  {
    id: 4,
    question: '"감사합니다"의 의미는?',
    image: null,
    options: ['Hello', 'Thank you', 'Goodbye', 'Sorry'],
    answer: 1,
  },
  {
    id: 5,
    question: '한국의 수도는 어디일까요?',
    image: null,
    options: ['부산', '인천', '대구', '서울'],
    answer: 3,
  },
]

function App() {
  const [screen, setScreen] = useState('home')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)

  const startQuiz = () => {
    setScreen('quiz')
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setAnswered(false)
  }

  const handleSelect = (index) => {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    if (index === SAMPLE_QUIZ[currentIndex].answer) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 < SAMPLE_QUIZ.length) {
      setCurrentIndex((prev) => prev + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setScreen('result')
    }
  }

  const getOptionClass = (index) => {
    if (!answered) return 'option-btn'
    if (index === SAMPLE_QUIZ[currentIndex].answer) return 'option-btn correct'
    if (index === selected) return 'option-btn wrong'
    return 'option-btn disabled'
  }

  if (screen === 'home') {
    return (
      <div className="app">
        <div className="home-screen">
          <h1 className="title">K-Quiz</h1>
          <p className="subtitle">한국 문화 퀴즈</p>
          <div className="home-info">
            <span>{SAMPLE_QUIZ.length}문제</span>
          </div>
          <button className="start-btn" onClick={startQuiz}>
            시작하기
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'result') {
    const percentage = Math.round((score / SAMPLE_QUIZ.length) * 100)
    return (
      <div className="app">
        <div className="result-screen">
          <h2 className="result-title">퀴즈 완료!</h2>
          <div className="score-circle">
            <span className="score-percent">{percentage}%</span>
          </div>
          <p className="score-detail">
            {SAMPLE_QUIZ.length}문제 중 {score}문제 정답
          </p>
          {percentage >= 70 && <p className="score-message">🎉 훌륭합니다!</p>}
          {percentage < 70 && <p className="score-message">다음에 다시 도전해보세요!</p>}
          <div className="result-actions">
            <button className="start-btn" onClick={startQuiz}>
              다시하기
            </button>
            <button className="home-btn" onClick={() => setScreen('home')}>
              홈으로
            </button>
          </div>
        </div>
      </div>
    )
  }

  const quiz = SAMPLE_QUIZ[currentIndex]

  return (
    <div className="app">
      <div className="quiz-screen">
        <div className="quiz-header">
          <span className="quiz-progress">
            {currentIndex + 1} / {SAMPLE_QUIZ.length}
          </span>
          <button className="quit-btn" onClick={() => setScreen('home')}>
            그만하기
          </button>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / SAMPLE_QUIZ.length) * 100}%` }}
          />
        </div>

        <h2 className="question-text">{quiz.question}</h2>

        {quiz.image && (
          <div className="question-image-wrapper">
            <img src={quiz.image} alt="quiz" className="question-image" />
          </div>
        )}

        <div className="options">
          {quiz.options.map((option, index) => (
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
            {currentIndex + 1 < SAMPLE_QUIZ.length ? '다음 문제' : '결과 보기'}
          </button>
        )}
      </div>
    </div>
  )
}

export default App
