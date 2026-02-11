import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'
import LearnPage from './pages/LearnPage'
import StylePage from './pages/StylePage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/learn" element={<LearnPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/style" element={<StylePage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}

export default App
