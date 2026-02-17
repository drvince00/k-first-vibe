import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage'
import './App.css'

const AboutPage = lazy(() => import('./pages/AboutPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const QuizPage = lazy(() => import('./pages/QuizPage'))
const ResultPage = lazy(() => import('./pages/ResultPage'))
const LearnPage = lazy(() => import('./pages/LearnPage'))
const StylePage = lazy(() => import('./pages/StylePage'))
const RefundPage = lazy(() => import('./pages/RefundPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const MyPage = lazy(() => import('./pages/MyPage'))
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'))
const BoardPage = lazy(() => import('./pages/BoardPage'))
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'))
const PostWritePage = lazy(() => import('./pages/PostWritePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function LoadingFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="loading-spinner" />
    </div>
  )
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/style" element={<StylePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/board/write" element={<PostWritePage />} />
        <Route path="/board/write/:id" element={<PostWritePage />} />
        <Route path="/board/:id" element={<PostDetailPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </AuthProvider>
  )
}

export default App
