import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'
import LearnPage from './pages/LearnPage'
import StylePage from './pages/StylePage'
import RefundPage from './pages/RefundPage'
import LoginPage from './pages/LoginPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import MyPage from './pages/MyPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import BoardPage from './pages/BoardPage'
import PostDetailPage from './pages/PostDetailPage'
import PostWritePage from './pages/PostWritePage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function AppRoutes() {
  return (
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
