import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithFacebook, signUpWithEmail, signInWithPassword } = useAuth()
  const { lang } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from || '/'

  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true })
    }
  }, [user, loading, navigate, from])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !password) {
      setError(lang === 'ko' ? '이메일과 비밀번호를 입력하세요.' : 'Please enter email and password.')
      return
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setError(lang === 'ko' ? '비밀번호는 6자 이상이어야 합니다.' : 'Password must be at least 6 characters.')
        return
      }
      if (password !== confirmPassword) {
        setError(lang === 'ko' ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.')
        return
      }
    }

    setSubmitting(true)
    try {
      if (mode === 'signup') {
        // 인증 메일 클릭 후 /auth/callback에서 올바르게 리다이렉트되도록 저장
        if (from && from !== '/') localStorage.setItem('authRedirect', from)
        const { error: err } = await signUpWithEmail(email, password)
        if (err) throw err
        setSuccess(lang === 'ko' ? '인증 이메일을 보냈습니다. 이메일을 확인하세요.' : 'Verification email sent. Please check your inbox.')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      } else {
        const { error: err } = await signInWithPassword(email, password)
        if (err) throw err
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="home-page">
        <Navbar />
        <div className="login-page">
          <div className="loader" />
        </div>
        <Footer />
      </div>
    )
  }

  const t = {
    en: {
      title: 'Welcome Back',
      subtitle: 'Sign in to save your results and unlock more features',
      google: 'Continue with Google',
      facebook: 'Continue with Facebook',
      or: 'OR',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      confirmLabel: 'Confirm Password',
      loginBtn: 'Sign In',
      signupBtn: 'Create Account',
      switchToSignup: "Don't have an account? Sign up",
      switchToLogin: 'Already have an account? Sign in',
      forgotPassword: 'Forgot password?',
    },
    ko: {
      title: '로그인',
      subtitle: '결과를 저장하고 더 많은 기능을 이용하세요',
      google: 'Google로 계속하기',
      facebook: 'Facebook으로 계속하기',
      or: '또는',
      emailLabel: '이메일',
      passwordLabel: '비밀번호',
      confirmLabel: '비밀번호 확인',
      loginBtn: '로그인',
      signupBtn: '회원가입',
      switchToSignup: '계정이 없으신가요? 회원가입',
      switchToLogin: '이미 계정이 있으신가요? 로그인',
      forgotPassword: '비밀번호 찾기',
    },
  }
  const tx = t[lang] || t.en

  return (
    <div className="home-page">
      <Navbar />
      <main className="login-page">
        <div className="login-card">
          <h1 className="login-title">{tx.title}</h1>
          <p className="login-subtitle">{tx.subtitle}</p>

          <div className="login-buttons">
            <button className="social-btn social-google" onClick={() => { localStorage.setItem('authRedirect', from); signInWithGoogle() }}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{tx.google}</span>
            </button>

            <button className="social-btn social-facebook" onClick={() => { localStorage.setItem('authRedirect', from); signInWithFacebook() }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>{tx.facebook}</span>
            </button>
          </div>

          <div className="login-divider">
            <span>{tx.or}</span>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-message login-error">{error}</div>}
            {success && <div className="login-message login-success">{success}</div>}

            <input
              type="email"
              className="login-input"
              placeholder={tx.emailLabel}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              type="password"
              className="login-input"
              placeholder={tx.passwordLabel}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
            {mode === 'signup' && (
              <input
                type="password"
                className="login-input"
                placeholder={tx.confirmLabel}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            )}

            <button type="submit" className="login-submit-btn" disabled={submitting}>
              {submitting ? <span className="loader-small" /> : (mode === 'signup' ? tx.signupBtn : tx.loginBtn)}
            </button>

            {mode === 'login' && (
              <Link to="/reset-password" className="login-forgot-link">
                {tx.forgotPassword}
              </Link>
            )}
          </form>

          <button
            className="login-mode-toggle"
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}
          >
            {mode === 'login' ? tx.switchToSignup : tx.switchToLogin}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
