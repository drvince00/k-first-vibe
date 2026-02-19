import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'
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
  share:      { en: 'Share Result',     ko: '결과 공유' },
  sharing:    { en: 'Generating...',    ko: '생성 중...' },
}

const CAT_COLORS = { TOPIK: '#6c63ff', FOOD: '#f97316', CULTURE: '#10b981' }

export default function ResultPage() {
  const { lang, quiz, score, handleRetry, navigate, selectedCategories } = useApp()
  const { user } = useAuth()
  const savedRef = useRef(false)
  const shareCardRef = useRef(null)
  const [sharing, setSharing] = useState(false)

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

  const handleShare = useCallback(async () => {
    if (!shareCardRef.current) return
    setSharing(true)
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      })
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      const file = new File([blob], 'k-culture-quiz-result.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'K-Culture Cat Quiz',
          text: `I scored ${percentage}% on the K-Culture Cat quiz! 🎉`,
          files: [file],
        })
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'k-culture-quiz-result.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Share failed:', err)
    } finally {
      setSharing(false)
    }
  }, [percentage])

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
        {user && <p className="result-saved-msg">{t('saved')}</p>}

        <div className="result-actions">
          <button className="result-btn primary" onClick={handleRetry}>
            {t('retry')}
          </button>
          <button
            className="result-btn share-btn"
            onClick={handleShare}
            disabled={sharing}
          >
            {sharing ? t('sharing') : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                {t('share')}
              </>
            )}
          </button>
          <Link to="/" className="result-btn secondary">
            {t('home')}
          </Link>
        </div>
      </div>

      {/* Hidden share card — captured by html2canvas */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
        <div ref={shareCardRef} className="share-card">
          <div className="share-card-header">
            <img src="/images/catwithjjajangmyun.jpg" alt="K-Culture Cat" className="share-card-logo" />
            <span className="share-card-brand">K-Culture Cat</span>
          </div>
          <div className={`share-card-circle ${passed ? 'pass' : ''}`}>
            <span className="share-card-pct">{percentage}%</span>
          </div>
          <p className="share-card-score">{score} / {quiz.length} correct</p>
          <p className="share-card-msg">{passed ? '🎉 Passed!' : '💪 Keep going!'}</p>
          <div className="share-card-cats">
            {selectedCategories.map(c => (
              <span key={c} className="share-card-badge" style={{ background: CAT_COLORS[c] || '#888' }}>
                {c}
              </span>
            ))}
          </div>
          <p className="share-card-url">kculturecat.cc</p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
