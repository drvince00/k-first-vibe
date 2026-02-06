import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Footer from '../components/Footer'

export default function ResultPage() {
  const { lang, quiz, score, handleRetry, navigate } = useApp()

  const percentage = quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0
  const passed = percentage >= 70
  const congratsImg = passed
    ? `/congratulations/congrats${Math.floor(Math.random() * 11) + 1}.jpg`
    : null

  if (quiz.length === 0) {
    navigate('/')
    return null
  }

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
          <Link to="/" className="result-btn secondary">
            Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
