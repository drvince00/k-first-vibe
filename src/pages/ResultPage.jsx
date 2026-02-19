import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer'

const T = {
  congrats:   { en: 'Congratulations!', ko: '축하합니다!' },
  complete:   { en: 'Quiz Complete!',   ko: '퀴즈 완료!' },
  correct:    { en: 'correct',          ko: '정답' },
  excellent:  { en: 'Excellent work!',  ko: '훌륭해요!' },
  keepTrying: { en: "Keep trying, you'll get there!", ko: '계속 도전하면 반드시 올라요!' },
  retry:      { en: 'Retry',            ko: '다시 풀기' },
  home:       { en: 'Home',             ko: '홈으로' },
  saved:      { en: 'Result saved!',    ko: '기록이 저장됐어요!' },
}

export default function ResultPage() {
  const { lang, quiz, score, handleRetry, navigate, selectedCategories } = useApp()
  const { user } = useAuth()
  const savedRef = useRef(false)

  const percentage = quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0
  const passed = percentage >= 70
  const congratsImg = passed
    ? `/congratulations/congrats${Math.floor(Math.random() * 11) + 1}.jpg`
    : null

  useEffect(() => {
    if (!user || quiz.length === 0 || savedRef.current) return
    savedRef.current = true

    supabase.from('quiz_results').insert({
      user_id: user.id,
      score,
      total: quiz.length,
      percentage,
      categories: selectedCategories,
    }).then(({ error }) => {
      if (error) console.error('Failed to save quiz result:', error)
    })
  }, [user, quiz.length, score, percentage, selectedCategories])

  if (quiz.length === 0) {
    navigate('/')
    return null
  }

  const t = (key) => T[key][lang] ?? T[key]['en']

  return (
    <div className="app">
      <div className="center-screen">
        <h2 className="result-title">{passed ? t('congrats') : t('complete')}</h2>
        {congratsImg && (
          <img src={congratsImg} alt="Congratulations" className="congrats-image" />
        )}
        <div className={`score-circle ${passed ? 'pass' : ''}`}>
          <span className="score-percent">{percentage}%</span>
        </div>
        <p className="score-detail">
          {score} / {quiz.length} {t('correct')}
        </p>
        {passed && <p className="score-message pass">{t('excellent')}</p>}
        {!passed && <p className="score-message">{t('keepTrying')}</p>}
        {user && (
          <p className="result-saved-msg">{t('saved')}</p>
        )}
        <div className="result-actions">
          <button className="result-btn primary" onClick={handleRetry}>
            {t('retry')}
          </button>
          <Link to="/" className="result-btn secondary">
            {t('home')}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
