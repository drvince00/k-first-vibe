import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { shuffle } from '../utils/sound'
import { HERO_IMAGES, SEO_DATA } from '../utils/constants'
import { supabase } from '../lib/supabase'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [quiz, setQuiz] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [categories] = useState(['TOPIK', 'FOOD', 'CULTURE'])
  const [selectedCategories, setSelectedCategories] = useState(['TOPIK', 'FOOD', 'CULTURE'])
  const [questionCount, setQuestionCount] = useState(10)
  const [imgError, setImgError] = useState(false)
  const [ready] = useState(true)
  const [quizLoading, setQuizLoading] = useState(false)
  const [soundOn, setSoundOn] = useState(() => !/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactStatus, setContactStatus] = useState(null)
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('k-vibe-lang')
    if (saved) return saved
    // Auto-detect language from browser/system settings
    const browserLang = navigator.language || navigator.userLanguage || ''
    return browserLang.startsWith('ko') ? 'ko' : 'en'
  })
  const [slideIndex, setSlideIndex] = useState(0)
  const [slideTransition, setSlideTransition] = useState(true)
  const slideTimerRef = useRef(null)
  const topRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    localStorage.setItem('k-vibe-lang', lang)
    document.documentElement.lang = lang === 'ko' ? 'ko' : 'en'
  }, [lang])

  useEffect(() => {
    const page = SEO_DATA[location.pathname] || SEO_DATA['/']
    const l = lang === 'ko' ? 'ko' : 'en'
    document.title = page[l].title
    document.querySelector('meta[name="description"]')?.setAttribute('content', page[l].desc)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', 'https://kculturecat.cc' + (location.pathname === '/' ? '/' : location.pathname))
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', page[l].title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', page[l].desc)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', 'https://kculturecat.cc' + (location.pathname === '/' ? '/' : location.pathname))
  }, [location.pathname, lang])

  // No longer fetching entire JSON — quizzes are loaded from Supabase on demand

  useEffect(() => {
    if (location.hash === '#contact-section') {
      setTimeout(() => {
        const el = document.getElementById('contact-section')
        el?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])

  const buildQuiz = useCallback(async () => {
    setQuizLoading(true)
    try {
      // Distribute questions evenly across selected categories
      const perCat = Math.ceil(questionCount / selectedCategories.length)
      const promises = selectedCategories.map(async (cat) => {
        const { data, error } = await supabase.rpc('get_random_quizzes', {
          cat_name: cat,
          lim: perCat
        })
        if (error) throw error
        return data
      })
      const results = await Promise.all(promises)
      const all = shuffle(results.flat()).slice(0, questionCount)
      setQuiz(all)
      return all
    } catch (err) {
      console.error('Failed to load quizzes:', err)
      return []
    } finally {
      setQuizLoading(false)
    }
  }, [selectedCategories, questionCount])

  // Reset to first slide when reaching the clone (seamless loop)
  useEffect(() => {
    if (slideIndex === HERO_IMAGES.length) {
      setTimeout(() => {
        setSlideTransition(false)
        setSlideIndex(0)
      }, 700) // Wait for transition to complete
      setTimeout(() => {
        setSlideTransition(true)
      }, 750)
    }
  }, [slideIndex])

  useEffect(() => {
    if (location.pathname !== '/') return
    slideTimerRef.current = setInterval(() => {
      setSlideIndex((prev) => prev + 1)
    }, 3000)
    return () => clearInterval(slideTimerRef.current)
  }, [location.pathname])

  const goToSlide = (index) => {
    setSlideIndex(index)
    clearInterval(slideTimerRef.current)
    slideTimerRef.current = setInterval(() => {
      setSlideIndex((prev) => prev + 1)
    }, 3000)
  }

  const prevSlide = () => {
    if (slideIndex === 0) {
      setSlideTransition(false)
      setSlideIndex(HERO_IMAGES.length)
      setTimeout(() => {
        setSlideTransition(true)
        goToSlide(HERO_IMAGES.length - 1)
      }, 50)
    } else {
      goToSlide(slideIndex - 1)
    }
  }
  const nextSlide = () => goToSlide(slideIndex + 1)

  const scrollToTop = useCallback(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const resetQuizSetup = useCallback(() => {
    setSelectedCategories(['FOOD', 'CULTURE'])
    setQuestionCount(10)
    setQuiz([])
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setAnswered(false)
    setImgError(false)
  }, [])

  const startQuiz = async () => {
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setAnswered(false)
    setImgError(false)
    const built = await buildQuiz()
    if (built.length === 0) return
    navigate('/quiz')
  }

  const handleRetry = async () => {
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setAnswered(false)
    setImgError(false)
    const built = await buildQuiz()
    if (built.length === 0) return
    navigate('/quiz')
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactStatus('sending')
    try {
      const res = await fetch('https://formspree.io/f/mgozgrjk', {
        method: 'POST',
        body: JSON.stringify({ email: contactEmail, message: contactMessage }),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        setContactStatus('success')
        setContactEmail('')
        setContactMessage('')
      } else {
        setContactStatus('error')
      }
    } catch {
      setContactStatus('error')
    }
  }

  const value = {
    // Language
    lang, setLang,
    // Quiz data
    quiz, setQuiz, currentIndex, setCurrentIndex, score, setScore,
    selected, setSelected, answered, setAnswered,
    categories, selectedCategories, toggleCategory,
    questionCount, setQuestionCount,
    imgError, setImgError, ready, quizLoading, soundOn, setSoundOn,
    // Quiz actions
    buildQuiz, startQuiz, handleRetry, resetQuizSetup,
    // Contact
    contactEmail, setContactEmail, contactMessage, setContactMessage,
    contactStatus, handleContactSubmit,
    // Slider
    slideIndex, slideTransition, prevSlide, nextSlide,
    // Refs
    topRef,
    // Navigation
    navigate,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
