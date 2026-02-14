import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ResetPasswordPage() {
  const { resetPassword, updatePassword, session } = useAuth()
  const { lang } = useApp()

  // Check if user arrived via recovery link (Supabase sets session with type=recovery)
  const [isRecovery, setIsRecovery] = useState(false)
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Supabase appends #access_token=...&type=recovery to the URL
    const hash = window.location.hash
    if (hash.includes('type=recovery') || session?.user) {
      setIsRecovery(true)
    }
  }, [session])

  const handleSendReset = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!email) {
      setError(lang === 'ko' ? '이메일을 입력하세요.' : 'Please enter your email.')
      return
    }
    setSubmitting(true)
    try {
      const { error: err } = await resetPassword(email)
      if (err) throw err
      setSuccess(lang === 'ko' ? '재설정 링크를 이메일로 보냈습니다.' : 'Password reset link sent to your email.')
      setEmail('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (newPassword.length < 6) {
      setError(lang === 'ko' ? '비밀번호는 6자 이상이어야 합니다.' : 'Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError(lang === 'ko' ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      const { error: err } = await updatePassword(newPassword)
      if (err) throw err
      setSuccess(lang === 'ko' ? '비밀번호가 변경되었습니다.' : 'Password updated successfully.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const t = {
    en: {
      title: 'Reset Password',
      subtitle: 'Enter your email to receive a reset link',
      emailPlaceholder: 'Email',
      sendBtn: 'Send Reset Link',
      newTitle: 'Set New Password',
      newSubtitle: 'Enter your new password below',
      newPasswordPlaceholder: 'New Password',
      confirmPlaceholder: 'Confirm Password',
      updateBtn: 'Update Password',
      backToLogin: 'Back to Login',
    },
    ko: {
      title: '비밀번호 재설정',
      subtitle: '이메일을 입력하면 재설정 링크를 보내드립니다',
      emailPlaceholder: '이메일',
      sendBtn: '재설정 링크 보내기',
      newTitle: '새 비밀번호 설정',
      newSubtitle: '새 비밀번호를 입력하세요',
      newPasswordPlaceholder: '새 비밀번호',
      confirmPlaceholder: '비밀번호 확인',
      updateBtn: '비밀번호 변경',
      backToLogin: '로그인으로 돌아가기',
    },
  }
  const tx = t[lang] || t.en

  return (
    <div className="home-page">
      <Navbar />
      <main className="login-page">
        <div className="login-card">
          {isRecovery ? (
            <>
              <h1 className="login-title">{tx.newTitle}</h1>
              <p className="login-subtitle">{tx.newSubtitle}</p>
              <form className="login-form" onSubmit={handleUpdatePassword}>
                {error && <div className="login-message login-error">{error}</div>}
                {success && <div className="login-message login-success">{success}</div>}
                <input
                  type="password"
                  className="login-input"
                  placeholder={tx.newPasswordPlaceholder}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <input
                  type="password"
                  className="login-input"
                  placeholder={tx.confirmPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button type="submit" className="login-submit-btn" disabled={submitting}>
                  {submitting ? <span className="loader-small" /> : tx.updateBtn}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="login-title">{tx.title}</h1>
              <p className="login-subtitle">{tx.subtitle}</p>
              <form className="login-form" onSubmit={handleSendReset}>
                {error && <div className="login-message login-error">{error}</div>}
                {success && <div className="login-message login-success">{success}</div>}
                <input
                  type="email"
                  className="login-input"
                  placeholder={tx.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <button type="submit" className="login-submit-btn" disabled={submitting}>
                  {submitting ? <span className="loader-small" /> : tx.sendBtn}
                </button>
              </form>
            </>
          )}
          <Link to="/login" className="login-mode-toggle" style={{ display: 'inline-block', marginTop: '1rem' }}>
            {tx.backToLogin}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
