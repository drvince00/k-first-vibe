import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const HISTORY_LIMIT = 20

const tx = {
  en: {
    title: 'My Page',
    profileSection: 'Profile',
    nicknameLabel: 'Nickname',
    emailLabel: 'Email',
    saveBtn: 'Save',
    passwordSection: 'Change Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    changeBtn: 'Change Password',
    deleteSection: 'Delete Account',
    deleteWarning: 'This action cannot be undone. All your data will be permanently deleted.',
    deleteBtn: 'Delete Account',
    deleteConfirm: 'Are you sure you want to delete your account?',
    cancel: 'Cancel',
    confirm: 'Delete',
    historySection: 'Quiz History',
    historyEmpty: 'No quiz records yet. Take a quiz!',
    totalPlayed: 'Total',
    avgScore: 'Average',
    bestScore: 'Best',
    times: 'times',
    clearHistory: 'Clear History',
    clearConfirm: 'Delete all quiz records?',
    clearDone: 'History cleared.',
    noHistory: 'No records yet.',
  },
  ko: {
    title: '마이페이지',
    profileSection: '프로필',
    nicknameLabel: '닉네임',
    emailLabel: '이메일',
    saveBtn: '저장',
    passwordSection: '비밀번호 변경',
    newPassword: '새 비밀번호',
    confirmPassword: '비밀번호 확인',
    changeBtn: '비밀번호 변경',
    deleteSection: '계정 삭제',
    deleteWarning: '이 작업은 되돌릴 수 없습니다. 모든 데이터가 영구 삭제됩니다.',
    deleteBtn: '계정 삭제',
    deleteConfirm: '정말 계정을 삭제하시겠습니까?',
    cancel: '취소',
    confirm: '삭제',
    historySection: '퀴즈 기록',
    historyEmpty: '아직 퀴즈 기록이 없어요. 퀴즈를 풀어보세요!',
    totalPlayed: '총 횟수',
    avgScore: '평균 점수',
    bestScore: '최고 점수',
    times: '회',
    clearHistory: '기록 초기화',
    clearConfirm: '퀴즈 기록을 모두 삭제할까요?',
    clearDone: '기록이 초기화됐어요.',
    noHistory: '기록이 없어요.',
  },
}

function formatDate(dateStr, lang) {
  const d = new Date(dateStr)
  if (lang === 'ko') {
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function CategoryBadge({ cat }) {
  const colors = { TOPIK: '#6c63ff', FOOD: '#f97316', CULTURE: '#10b981' }
  return (
    <span style={{
      background: colors[cat] || '#888',
      color: '#fff',
      fontSize: '0.7rem',
      fontWeight: 700,
      padding: '2px 7px',
      borderRadius: 99,
      marginRight: 4,
    }}>{cat}</span>
  )
}

export default function MyPage() {
  const { user, profile, loading, updatePassword, updateProfile, deleteAccount } = useAuth()
  const { lang } = useApp()
  const navigate = useNavigate()
  const t = tx[lang] || tx.en

  const [nickname, setNickname] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Quiz history
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [streak, setStreak] = useState(null)

  const isEmailUser = user?.app_metadata?.provider === 'email'

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: '/mypage' }, replace: true })
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || user?.user_metadata?.full_name || '')
    }
  }, [profile, user])

  const fetchHistory = useCallback(async () => {
    if (!user) return
    setHistoryLoading(true)
    const [{ data, error }, { data: streakData }] = await Promise.all([
      supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(HISTORY_LIMIT),
      supabase
        .from('user_streaks')
        .select('current_streak, longest_streak')
        .eq('user_id', user.id)
        .single(),
    ])
    if (!error) setHistory(data || [])
    if (streakData) setStreak(streakData)
    setHistoryLoading(false)
  }, [user])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleProfileSave = async () => {
    setProfileMsg({ type: '', text: '' })
    if (!nickname.trim()) {
      setProfileMsg({ type: 'error', text: lang === 'ko' ? '닉네임을 입력하세요.' : 'Please enter a nickname.' })
      return
    }
    setSaving(true)
    try {
      await updateProfile({ nickname: nickname.trim() })
      setProfileMsg({ type: 'success', text: lang === 'ko' ? '저장되었습니다.' : 'Saved successfully.' })
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordMsg({ type: '', text: '' })
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: lang === 'ko' ? '비밀번호는 6자 이상이어야 합니다.' : 'Password must be at least 6 characters.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: lang === 'ko' ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.' })
      return
    }
    try {
      const { error } = await updatePassword(newPassword)
      if (error) throw error
      setPasswordMsg({ type: 'success', text: lang === 'ko' ? '비밀번호가 변경되었습니다.' : 'Password updated.' })
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message })
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteAccount()
      navigate('/', { replace: true })
    } catch (err) {
      setDeleting(false)
      alert(err.message)
    }
  }

  const handleClearHistory = async () => {
    setClearing(true)
    const { error } = await supabase
      .from('quiz_results')
      .delete()
      .eq('user_id', user.id)
    if (!error) {
      setHistory([])
    }
    setClearing(false)
    setShowClearModal(false)
  }

  if (loading || !user) {
    return (
      <div className="home-page">
        <Navbar />
        <div className="login-page"><div className="loader" /></div>
        <Footer />
      </div>
    )
  }

  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url
  const displayName = nickname || profile?.nickname || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  // Stats
  const totalPlayed = history.length
  const avgScore = totalPlayed > 0
    ? Math.round(history.reduce((sum, r) => sum + r.percentage, 0) / totalPlayed)
    : 0
  const bestScore = totalPlayed > 0
    ? Math.max(...history.map(r => r.percentage))
    : 0

  return (
    <div className="home-page">
      <Navbar />
      <main className="mypage">
        <h1 className="mypage-title">{t.title}</h1>

        {/* Streak & Leaderboard */}
        {streak && (
          <section className="mypage-section mypage-streak-section">
            <div className="mypage-streak-row">
              <div className="mypage-streak-card">
                <span className="mypage-streak-icon">{streak.current_streak >= 7 ? '🏆' : '🔥'}</span>
                <span className="mypage-streak-num">{streak.current_streak}</span>
                <span className="mypage-streak-label">{lang === 'ko' ? '연속 출석' : 'Day Streak'}</span>
              </div>
              <div className="mypage-streak-card">
                <span className="mypage-streak-icon">⭐</span>
                <span className="mypage-streak-num">{streak.longest_streak}</span>
                <span className="mypage-streak-label">{lang === 'ko' ? '최장 연속' : 'Best Streak'}</span>
              </div>
              <Link to="/leaderboard" className="mypage-lb-btn">
                🏆 {lang === 'ko' ? '리더보드' : 'Leaderboard'}
              </Link>
            </div>
          </section>
        )}

        {/* Quiz History Section */}
        <section className="mypage-section">
          <h2 className="mypage-section-title">{t.historySection}</h2>

          {historyLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}><div className="loader" /></div>
          ) : totalPlayed === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '1.5rem 0' }}>{t.historyEmpty}</p>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="history-stats">
                <div className="history-stat-card">
                  <span className="history-stat-icon">📊</span>
                  <span className="history-stat-value">{totalPlayed}{lang === 'ko' ? t.times : ''}</span>
                  <span className="history-stat-label">{t.totalPlayed}{lang === 'en' ? ' ' + t.times : ''}</span>
                </div>
                <div className="history-stat-card">
                  <span className="history-stat-icon">⭐</span>
                  <span className="history-stat-value">{avgScore}%</span>
                  <span className="history-stat-label">{t.avgScore}</span>
                </div>
                <div className="history-stat-card">
                  <span className="history-stat-icon">🏆</span>
                  <span className="history-stat-value">{bestScore}%</span>
                  <span className="history-stat-label">{t.bestScore}</span>
                </div>
              </div>

              {/* History List */}
              <ul className="history-list">
                {history.map((r) => (
                  <li key={r.id} className="history-item">
                    <div className="history-item-top">
                      <span className="history-date">{formatDate(r.created_at, lang)}</span>
                      <span className="history-score-text">{r.score} / {r.total}</span>
                    </div>
                    <div className="history-item-mid">
                      <div className="history-categories">
                        {(r.categories || []).map(c => <CategoryBadge key={c} cat={c} />)}
                      </div>
                      <span className="history-pct">{r.percentage}%</span>
                    </div>
                    <div className="history-bar-track">
                      <div
                        className={`history-bar-fill ${r.percentage >= 70 ? 'pass' : ''}`}
                        style={{ width: `${r.percentage}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              {/* Clear History */}
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button className="history-clear-btn" onClick={() => setShowClearModal(true)}>
                  {t.clearHistory}
                </button>
              </div>
            </>
          )}
        </section>

        {/* Profile Section */}
        <section className="mypage-section">
          <h2 className="mypage-section-title">{t.profileSection}</h2>
          <div className="mypage-profile-header">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="mypage-avatar" referrerPolicy="no-referrer" />
            ) : (
              <span className="mypage-avatar-fallback">{displayName[0].toUpperCase()}</span>
            )}
            <div className="mypage-profile-info">
              <div className="mypage-field">
                <label className="mypage-label">{t.nicknameLabel}</label>
                <input
                  type="text"
                  className="login-input"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
              <div className="mypage-field">
                <label className="mypage-label">{t.emailLabel}</label>
                <input type="email" className="login-input" value={user.email || ''} disabled />
              </div>
              {profileMsg.text && (
                <div className={`login-message ${profileMsg.type === 'error' ? 'login-error' : 'login-success'}`}>
                  {profileMsg.text}
                </div>
              )}
              <button className="login-submit-btn" onClick={handleProfileSave} disabled={saving}>
                {saving ? <span className="loader-small" /> : t.saveBtn}
              </button>
            </div>
          </div>
        </section>

        {/* Password Section */}
        {isEmailUser && (
          <section className="mypage-section">
            <h2 className="mypage-section-title">{t.passwordSection}</h2>
            <form className="login-form" onSubmit={handlePasswordChange}>
              {passwordMsg.text && (
                <div className={`login-message ${passwordMsg.type === 'error' ? 'login-error' : 'login-success'}`}>
                  {passwordMsg.text}
                </div>
              )}
              <input
                type="password"
                className="login-input"
                placeholder={t.newPassword}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <input
                type="password"
                className="login-input"
                placeholder={t.confirmPassword}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button type="submit" className="login-submit-btn">{t.changeBtn}</button>
            </form>
          </section>
        )}

        {/* Delete Account Section */}
        <section className="mypage-section mypage-danger">
          <h2 className="mypage-section-title">{t.deleteSection}</h2>
          <p className="mypage-warning">{t.deleteWarning}</p>
          <button className="mypage-delete-btn" onClick={() => setShowDeleteModal(true)}>
            {t.deleteBtn}
          </button>
        </section>

        {/* Clear History Modal */}
        {showClearModal && (
          <div className="modal-overlay" onClick={() => setShowClearModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <p className="modal-text">{t.clearConfirm}</p>
              <div className="modal-actions">
                <button className="modal-cancel-btn" onClick={() => setShowClearModal(false)}>
                  {t.cancel}
                </button>
                <button className="modal-confirm-btn" onClick={handleClearHistory} disabled={clearing}>
                  {clearing ? <span className="loader-small" /> : t.confirm}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <p className="modal-text">{t.deleteConfirm}</p>
              <div className="modal-actions">
                <button className="modal-cancel-btn" onClick={() => setShowDeleteModal(false)}>
                  {t.cancel}
                </button>
                <button className="modal-confirm-btn" onClick={handleDelete} disabled={deleting}>
                  {deleting ? <span className="loader-small" /> : t.confirm}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
