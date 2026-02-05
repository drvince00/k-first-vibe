import { useState, useEffect, useRef, useCallback } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import './App.css'

function playSound(type) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (type === 'correct') {
    const notes = [523.25, 659.25, 783.99]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3)
      osc.connect(gain).connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.1)
      osc.stop(ctx.currentTime + i * 0.1 + 0.3)
    })
  } else {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  }
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const CATEGORY_DESC = {
  TOPIK: { en: 'Korean Language', ko: '한국어 능력' },
  FOOD: { en: 'Korean Cuisine', ko: '한국 음식' },
  CULTURE: { en: 'Traditions & Heritage', ko: '전통과 유산' },
}

function Footer({ lang }) {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/about" className="footer-link">About</Link>
        <span className="footer-divider">|</span>
        <Link to="/about#contact-section" className="footer-link" onClick={(e) => {
          e.preventDefault()
          window.location.href = '/about#contact-section'
        }}>
          Contact
        </Link>
        <span className="footer-divider">|</span>
        <Link to="/privacy" className="footer-link">
          {lang === 'en' ? 'Privacy Policy' : '개인정보처리방침'}
        </Link>
        <span className="footer-divider">|</span>
        <Link to="/terms" className="footer-link">
          {lang === 'en' ? 'Terms of Service' : '이용약관'}
        </Link>
      </div>
      <p className="footer-copy">&copy; 2026 K-Culture Cat</p>
    </footer>
  )
}

function App() {
  const [allQuiz, setAllQuiz] = useState([])
  const [quiz, setQuiz] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [categories, setCategories] = useState(['TOPIK', 'FOOD', 'CULTURE'])
  const [selectedCategories, setSelectedCategories] = useState(['TOPIK', 'FOOD', 'CULTURE'])
  const [questionCount, setQuestionCount] = useState(10)
  const [imgError, setImgError] = useState(false)
  const [ready, setReady] = useState(false)
  const [soundOn, setSoundOn] = useState(() => !/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactStatus, setContactStatus] = useState(null)
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('k-vibe-lang')
    return saved || 'en'
  })
  const topRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    localStorage.setItem('k-vibe-lang', lang)
    document.documentElement.lang = lang === 'ko' ? 'ko' : 'en'
  }, [lang])

  useEffect(() => {
    fetch('/quizData.json')
      .then((res) => res.json())
      .then((data) => {
        setAllQuiz(data)
        const cats = [...new Set(data.map((q) => q.category))]
        setCategories(cats)
        setSelectedCategories(cats)
        setReady(true)
      })
  }, [])

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

  const buildQuiz = useCallback(() => {
    let filtered = allQuiz.filter((q) => selectedCategories.includes(q.category))
    filtered = shuffle(filtered).slice(0, questionCount)
    setQuiz(filtered)
    return filtered
  }, [allQuiz, selectedCategories, questionCount])

  const scrollToTop = useCallback(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const startQuiz = () => {
    const built = buildQuiz()
    if (built.length === 0) return
    navigate('/quiz')
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setAnswered(false)
    setImgError(false)
  }

  const handleSelect = (index) => {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    const isCorrect = index === quiz[currentIndex].answer
    if (isCorrect) {
      setScore((prev) => prev + 1)
      if (soundOn) playSound('correct')
    } else {
      if (soundOn) playSound('wrong')
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 < quiz.length) {
      setCurrentIndex((prev) => prev + 1)
      setSelected(null)
      setAnswered(false)
      setImgError(false)
      scrollToTop()
    } else {
      navigate('/result')
    }
  }

  const handleRetry = () => {
    const built = buildQuiz()
    if (built.length === 0) return
    navigate('/quiz')
    setCurrentIndex(0)
    setScore(0)
    setSelected(null)
    setAnswered(false)
    setImgError(false)
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

  const getOptionClass = (index) => {
    if (!answered) return 'option-btn'
    if (index === quiz[currentIndex].answer) return 'option-btn correct'
    if (index === selected) return 'option-btn wrong'
    return 'option-btn disabled'
  }

  const langToggle = (
    <button
      className="lang-toggle"
      onClick={() => setLang((l) => (l === 'en' ? 'ko' : 'en'))}
    >
      {lang === 'en' ? '한글' : 'English'}
    </button>
  )

  // Shared contact form JSX
  const contactForm = (
    <section className="contact-section-home" id="contact-section">
      <h3 className="contact-title">
        {lang === 'en' ? 'Contact Us' : '관리자에게 문의'}
      </h3>
      <form className="contact-form" onSubmit={handleContactSubmit}>
        <label className="contact-label">
          {lang === 'en' ? 'Email' : '이메일'}
          <input
            type="email"
            className="contact-input"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </label>
        <label className="contact-label">
          {lang === 'en' ? 'Message' : '내용'}
          <textarea
            className="contact-textarea"
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            placeholder={lang === 'en' ? 'Write your message here' : '문의 내용을 입력하세요'}
            rows={4}
            required
          />
        </label>
        <button
          type="submit"
          className="btn-primary contact-submit-btn"
          disabled={contactStatus === 'sending'}
        >
          {contactStatus === 'sending'
            ? lang === 'en' ? 'Sending...' : '전송 중...'
            : lang === 'en' ? 'SEND MESSAGE' : '보내기'}
        </button>
        {contactStatus === 'success' && (
          <p className="contact-msg success">
            {lang === 'en' ? 'Message sent successfully!' : '문의가 전송되었습니다!'}
          </p>
        )}
        {contactStatus === 'error' && (
          <p className="contact-msg error">
            {lang === 'en' ? 'Failed to send. Please try again.' : '전송에 실패했습니다. 다시 시도해주세요.'}
          </p>
        )}
      </form>
    </section>
  )

  // ===== ABOUT PAGE (now includes Contact Us) =====
  const AboutPage = () => (
    <div className="home-page">
      <nav className="navbar">
        <Link to="/" className="nav-logo">K-Culture Cat</Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          {langToggle}
        </div>
      </nav>

      <main className="page-content">
        <h1 className="page-title">
          {lang === 'en' ? 'About K-Culture Cat' : 'K-Culture Cat 소개'}
        </h1>

        {lang === 'en' ? (
          <article>
            <section className="page-section">
              <h2>Our Mission</h2>
              <p>
                K-Culture Cat is dedicated to helping people around the world discover and appreciate
                Korean culture through fun, interactive content. We believe that learning about another
                culture should be engaging, accessible, and enjoyable.
              </p>
            </section>

            <section className="page-section">
              <h2>What We Offer</h2>
              <p>
                Our platform features interactive quizzes, cultural guides, and curated content across
                multiple categories:
              </p>
              <ul>
                <li><strong>TOPIK (Korean Language)</strong> — Test your Korean language skills with vocabulary, grammar, and reading comprehension questions inspired by the official TOPIK exam.</li>
                <li><strong>Korean Cuisine (Food)</strong> — Explore the rich world of Korean food, from classic dishes like bibimbap and kimchi to regional specialties and cooking techniques.</li>
                <li><strong>Traditions & Heritage (Culture)</strong> — Discover Korean history, customs, festivals, and cultural practices that have shaped the nation.</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>How It Works</h2>
              <p>
                Choose your favorite categories, select the number of questions (5, 10, 20, or 30),
                and start your quiz. Each session draws from our randomized question pool, so every
                quiz experience is unique. Score 70% or higher to pass and earn a congratulations!
              </p>
            </section>

            <section className="page-section">
              <h2>Who We Are</h2>
              <p>
                K-Culture Cat is an independent educational platform created by Korean culture enthusiasts.
                All content is originally written and carefully reviewed for accuracy. Our goal is to
                be the most engaging way to learn about Korea online.
              </p>
            </section>
          </article>
        ) : (
          <article>
            <section className="page-section">
              <h2>미션</h2>
              <p>
                K-Culture Cat은 재미있고 인터랙티브한 콘텐츠를 통해 전 세계 사람들이 한국 문화를
                발견하고 감상할 수 있도록 돕는 데 전념하고 있습니다. 다른 문화에 대해 배우는 것은
                흥미롭고, 접근하기 쉽고, 즐거워야 한다고 믿습니다.
              </p>
            </section>

            <section className="page-section">
              <h2>제공 내용</h2>
              <p>
                본 플랫폼은 인터랙티브 퀴즈, 문화 가이드 등 다양한 카테고리의 콘텐츠를 제공합니다:
              </p>
              <ul>
                <li><strong>TOPIK (한국어 능력)</strong> — 공식 TOPIK 시험을 참고한 어휘, 문법, 독해 문제로 한국어 실력을 테스트하세요.</li>
                <li><strong>한국 음식 (Food)</strong> — 비빔밥, 김치부터 지역 특산물과 요리 기법까지 한국 음식의 풍부한 세계를 탐험하세요.</li>
                <li><strong>전통과 유산 (Culture)</strong> — 한국의 역사, 관습, 축제, 문화적 관행을 발견하세요.</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>이용 방법</h2>
              <p>
                원하는 카테고리를 선택하고, 문제 수(5, 10, 20, 30)를 선택한 후 퀴즈를 시작하세요.
                각 세션은 무작위 문제 풀에서 출제되므로 매번 새로운 퀴즈 경험을 할 수 있습니다.
                70% 이상 득점하면 합격입니다!
              </p>
            </section>

            <section className="page-section">
              <h2>소개</h2>
              <p>
                K-Culture Cat은 한국 문화 애호가들이 만든 독립적인 교육 플랫폼입니다.
                모든 콘텐츠는 독창적으로 작성되었으며 정확성을 위해 신중하게 검토됩니다.
                온라인에서 한국에 대해 배울 수 있는 가장 매력적인 방법이 되는 것이 목표입니다.
              </p>
            </section>
          </article>
        )}
      </main>

      {contactForm}

      <Footer lang={lang} />
    </div>
  )

  // ===== PRIVACY POLICY PAGE =====
  const PrivacyPage = () => (
    <div className="home-page">
      <nav className="navbar">
        <Link to="/" className="nav-logo">K-Culture Cat</Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          {langToggle}
        </div>
      </nav>

      <main className="page-content">
        <h1 className="page-title">
          {lang === 'en' ? 'Privacy Policy' : '개인정보처리방침'}
        </h1>
        <p className="page-updated">
          {lang === 'en' ? 'Last updated: February 2026' : '최종 수정일: 2026년 2월'}
        </p>

        {lang === 'en' ? (
          <article>
            <section className="page-section">
              <h2>Information We Collect</h2>
              <p>
                K-Culture Cat collects minimal personal information. When you use our contact form,
                we collect your email address and the message you send. We do not require account
                registration to use our service.
              </p>
            </section>

            <section className="page-section">
              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Respond to your inquiries and feedback submitted through our contact form</li>
                <li>Improve and maintain our platform</li>
                <li>Analyze usage patterns to enhance user experience</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>Cookies and Tracking Technologies</h2>
              <p>
                Our site may use cookies and similar tracking technologies for analytics and advertising purposes.
                Third-party services, including Google AdSense and Google Analytics, may place cookies on your
                browser to serve ads based on your prior visits to our site or other websites.
              </p>
              <p>
                Google's use of advertising cookies enables it and its partners to serve ads based on your
                visit to our site and/or other sites on the Internet. You may opt out of personalized advertising
                by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
              </p>
            </section>

            <section className="page-section">
              <h2>Third-Party Advertising</h2>
              <p>
                We use Google AdSense to display advertisements on our site. Google AdSense may use cookies
                and web beacons to collect information (not including your name, address, email address, or
                telephone number) about your visits to this and other websites in order to provide advertisements
                about goods and services of interest to you.
              </p>
            </section>

            <section className="page-section">
              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal
                information. However, no method of transmission over the Internet is 100% secure, and
                we cannot guarantee absolute security.
              </p>
            </section>

            <section className="page-section">
              <h2>Children's Privacy</h2>
              <p>
                Our service is designed for general audiences and does not knowingly collect personal
                information from children under 13. If we learn that we have collected personal information
                from a child under 13, we will take steps to delete such information.
              </p>
            </section>

            <section className="page-section">
              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="page-section">
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us through our{' '}
                <Link to="/about#contact-section" className="inline-link">contact form</Link>.
              </p>
            </section>
          </article>
        ) : (
          <article>
            <section className="page-section">
              <h2>수집하는 정보</h2>
              <p>
                K-Culture Cat은 최소한의 개인정보만 수집합니다. 문의 양식을 사용할 때
                이메일 주소와 보내신 메시지를 수집합니다. 서비스를 이용하기 위해
                회원가입이 필요하지 않습니다.
              </p>
            </section>

            <section className="page-section">
              <h2>정보 사용 목적</h2>
              <p>수집된 정보는 다음과 같이 사용됩니다:</p>
              <ul>
                <li>문의 양식을 통해 제출된 문의 및 피드백에 대한 응답</li>
                <li>플랫폼 개선 및 유지</li>
                <li>사용자 경험 향상을 위한 사용 패턴 분석</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>쿠키 및 추적 기술</h2>
              <p>
                본 사이트는 분석 및 광고 목적으로 쿠키 및 유사한 추적 기술을 사용할 수 있습니다.
                Google AdSense 및 Google Analytics를 포함한 제3자 서비스가 브라우저에 쿠키를 배치하여
                이전 방문을 기반으로 광고를 제공할 수 있습니다.
              </p>
              <p>
                Google의 광고 쿠키 사용을 통해 Google 및 파트너는 본 사이트 및/또는 인터넷의 다른 사이트
                방문을 기반으로 광고를 제공할 수 있습니다.{' '}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google 광고 설정</a>에서
                맞춤 광고를 거부할 수 있습니다.
              </p>
            </section>

            <section className="page-section">
              <h2>제3자 광고</h2>
              <p>
                본 사이트는 Google AdSense를 사용하여 광고를 게재합니다. Google AdSense는 쿠키와
                웹 비콘을 사용하여 귀하의 관심사에 맞는 상품 및 서비스에 관한 광고를 제공하기 위해
                본 사이트 및 다른 웹사이트 방문에 관한 정보를 수집할 수 있습니다.
              </p>
            </section>

            <section className="page-section">
              <h2>데이터 보안</h2>
              <p>
                개인정보를 보호하기 위해 적절한 기술적, 조직적 조치를 시행합니다.
                그러나 인터넷을 통한 전송 방법은 100% 안전하지 않으며 절대적인 보안을 보장할 수 없습니다.
              </p>
            </section>

            <section className="page-section">
              <h2>아동 개인정보</h2>
              <p>
                본 서비스는 일반 사용자를 대상으로 하며 13세 미만 아동의 개인정보를 의도적으로
                수집하지 않습니다. 13세 미만 아동의 개인정보를 수집한 것을 알게 된 경우
                해당 정보를 삭제하기 위한 조치를 취할 것입니다.
              </p>
            </section>

            <section className="page-section">
              <h2>정책 변경</h2>
              <p>
                본 개인정보처리방침은 수시로 업데이트될 수 있습니다. 변경사항이 있을 경우
                이 페이지에 새 방침을 게시하고 "최종 수정일"을 업데이트합니다.
              </p>
            </section>

            <section className="page-section">
              <h2>문의</h2>
              <p>
                본 개인정보처리방침에 대한 질문이 있으시면{' '}
                <Link to="/about#contact-section" className="inline-link">문의 양식</Link>을 통해 연락해 주세요.
              </p>
            </section>
          </article>
        )}
      </main>

      <Footer lang={lang} />
    </div>
  )

  // ===== TERMS OF SERVICE PAGE =====
  const TermsPage = () => (
    <div className="home-page">
      <nav className="navbar">
        <Link to="/" className="nav-logo">K-Culture Cat</Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          {langToggle}
        </div>
      </nav>

      <main className="page-content">
        <h1 className="page-title">
          {lang === 'en' ? 'Terms of Service' : '이용약관'}
        </h1>
        <p className="page-updated">
          {lang === 'en' ? 'Last updated: February 2026' : '최종 수정일: 2026년 2월'}
        </p>

        {lang === 'en' ? (
          <article>
            <section className="page-section">
              <h2>Acceptance of Terms</h2>
              <p>
                By accessing and using K-Culture Cat, you accept and agree to be bound by these Terms of
                Service. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="page-section">
              <h2>Description of Service</h2>
              <p>
                K-Culture Cat provides an interactive platform focused on Korean culture, including
                Korean language (TOPIK), cuisine, and traditions. The service is provided free of charge
                and supported by advertising.
              </p>
            </section>

            <section className="page-section">
              <h2>User Conduct</h2>
              <p>When using our service, you agree to:</p>
              <ul>
                <li>Use the service for lawful purposes only</li>
                <li>Not attempt to disrupt or interfere with the service's functionality</li>
                <li>Not reproduce, distribute, or create derivative works from our content without permission</li>
                <li>Provide accurate information when using the contact form</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>Intellectual Property</h2>
              <p>
                All content, including questions, answers, images, and design elements, is the
                intellectual property of K-Culture Cat. Unauthorized reproduction, distribution, or
                modification is prohibited.
              </p>
            </section>

            <section className="page-section">
              <h2>Disclaimer of Warranties</h2>
              <p>
                K-Culture Cat is provided "as is" without any warranties, express or implied. We do not
                guarantee that the service will be uninterrupted, error-free, or that content is
                free from inaccuracies. The results are for educational and entertainment purposes
                only and do not constitute official certification.
              </p>
            </section>

            <section className="page-section">
              <h2>Limitation of Liability</h2>
              <p>
                K-Culture Cat shall not be liable for any indirect, incidental, special, or consequential
                damages arising from your use of or inability to use the service.
              </p>
            </section>

            <section className="page-section">
              <h2>Advertising</h2>
              <p>
                Our service displays third-party advertisements through Google AdSense. We are not
                responsible for the content of these advertisements. Your interaction with advertisers
                is solely between you and the advertiser.
              </p>
            </section>

            <section className="page-section">
              <h2>Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. Continued use of
                the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="page-section">
              <h2>Contact</h2>
              <p>
                For questions about these Terms of Service, please use our{' '}
                <Link to="/about#contact-section" className="inline-link">contact form</Link>.
              </p>
            </section>
          </article>
        ) : (
          <article>
            <section className="page-section">
              <h2>약관 동의</h2>
              <p>
                K-Culture Cat에 접속하고 사용함으로써 본 이용약관에 동의하는 것으로 간주합니다.
                본 약관에 동의하지 않으시면 서비스를 이용하지 마시기 바랍니다.
              </p>
            </section>

            <section className="page-section">
              <h2>서비스 설명</h2>
              <p>
                K-Culture Cat은 한국어(TOPIK), 음식, 전통 등 한국 문화에 초점을 맞춘 인터랙티브
                플랫폼을 제공합니다. 서비스는 무료로 제공되며 광고로 운영됩니다.
              </p>
            </section>

            <section className="page-section">
              <h2>이용자 행동 규범</h2>
              <p>서비스 이용 시 다음에 동의합니다:</p>
              <ul>
                <li>합법적인 목적으로만 서비스를 사용</li>
                <li>서비스 기능을 방해하거나 간섭하지 않음</li>
                <li>허가 없이 콘텐츠를 복제, 배포 또는 2차 저작물을 만들지 않음</li>
                <li>문의 양식 사용 시 정확한 정보 제공</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>지적재산권</h2>
              <p>
                문제, 답변, 이미지 및 디자인 요소를 포함한 모든 콘텐츠는 K-Culture Cat의
                지적재산입니다. 무단 복제, 배포 또는 수정은 금지되어 있습니다.
              </p>
            </section>

            <section className="page-section">
              <h2>보증의 부인</h2>
              <p>
                K-Culture Cat은 명시적이든 묵시적이든 어떠한 보증 없이 "있는 그대로" 제공됩니다.
                서비스가 중단 없이, 오류 없이 제공되거나 콘텐츠에 부정확성이 없음을 보장하지
                않습니다. 결과는 교육 및 오락 목적이며 공식 인증을 구성하지 않습니다.
              </p>
            </section>

            <section className="page-section">
              <h2>책임의 제한</h2>
              <p>
                K-Culture Cat은 서비스 사용 또는 사용 불능으로 인한 간접적, 부수적, 특별 또는
                결과적 손해에 대해 책임지지 않습니다.
              </p>
            </section>

            <section className="page-section">
              <h2>광고</h2>
              <p>
                본 서비스는 Google AdSense를 통해 제3자 광고를 게재합니다. 해당 광고의 내용에
                대해 책임지지 않습니다. 광고주와의 상호작용은 전적으로 귀하와 광고주 간의 문제입니다.
              </p>
            </section>

            <section className="page-section">
              <h2>약관 변경</h2>
              <p>
                본 이용약관을 언제든지 수정할 수 있는 권리를 보유합니다. 변경 후 서비스를
                계속 사용하면 새 약관에 동의한 것으로 간주됩니다.
              </p>
            </section>

            <section className="page-section">
              <h2>문의</h2>
              <p>
                본 이용약관에 대한 질문이 있으시면{' '}
                <Link to="/about#contact-section" className="inline-link">문의 양식</Link>을 통해 연락해 주세요.
              </p>
            </section>
          </article>
        )}
      </main>

      <Footer lang={lang} />
    </div>
  )

  // ===== NOT FOUND PAGE =====
  const NotFoundPage = () => (
    <div className="home-page">
      <nav className="navbar">
        <Link to="/" className="nav-logo">K-Culture Cat</Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          {langToggle}
        </div>
      </nav>

      <main className="page-content" style={{ textAlign: 'center', paddingTop: '120px' }}>
        <h1 className="page-title" style={{ fontSize: '96px', color: '#c8a882', marginBottom: '16px' }}>404</h1>
        <h2 style={{ marginBottom: '16px' }}>{lang === 'en' ? 'Page Not Found' : '페이지를 찾을 수 없습니다'}</h2>
        <p className="section-desc">
          {lang === 'en'
            ? 'The page you are looking for does not exist.'
            : '찾으시는 페이지가 존재하지 않습니다.'}
        </p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '32px', textDecoration: 'none' }}>
          {lang === 'en' ? 'GO HOME' : '홈으로'}
        </Link>
      </main>

      <Footer lang={lang} />
    </div>
  )

  // ===== HOME SCREEN =====
  const HomePage = () => (
    <div className="home-page">
      <nav className="navbar">
        <Link to="/" className="nav-logo">K-Culture Cat</Link>
        <div className="nav-menu">
          <button
            className="nav-link"
            onClick={() => {
              const el = document.getElementById('quiz-section')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            K-Quiz
          </button>
          <Link to="/about" className="nav-link">About</Link>
          {langToggle}
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <span className="hero-label">KOREAN CULTURE</span>
          <h1 className="hero-title">
            {lang === 'en' ? (
              <>Welcome to<br />K-Culture Cat</>
            ) : (
              <>K-Culture Cat에<br />오신 것을 환영합니다</>
            )}
          </h1>
          <p className="hero-desc">
            {lang === 'en'
              ? 'Your gateway to Korean culture — from language and food to fashion, traditions, and everyday life in Korea.'
              : '한국어, 음식, 패션, 전통 그리고 일상까지 — 한국 문화를 향한 당신의 관문입니다.'}
          </p>
          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => {
                const el = document.getElementById('quiz-section')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {lang === 'en' ? 'EXPLORE NOW' : '탐험하기'}
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src="/quiz/gyeongbok-palace-2929520_640.jpg" alt="Gyeongbokgung Palace in Seoul, Korea" loading="lazy" />
        </div>
      </header>

      <section className="featured" id="quiz-section">
        <div className="featured-image">
          <img src="/quiz/rim-sunny-1196278665-23833464.jpg" alt="Korean BBQ galbi" loading="lazy" />
        </div>
        <div className="featured-content">
          <span className="section-tag">K-QUIZ</span>
          <h2 className="section-title">
            {lang === 'en' ? (
              <>Test Your Korean<br />Culture Knowledge</>
            ) : (
              <>한국 문화 지식을<br />테스트해보세요</>
            )}
          </h2>
          <p className="section-desc">
            {lang === 'en'
              ? 'Choose categories and the number of questions to begin your journey.'
              : '카테고리와 문제 수를 선택하고 여행을 시작하세요.'}
          </p>

          <div className="category-checkboxes">
            {categories.map((cat) => (
              <label
                key={cat}
                className={`category-check ${selectedCategories.includes(cat) ? 'checked' : ''}`}
                onClick={() => toggleCategory(cat)}
              >
                <span className="check-circle">
                  {selectedCategories.includes(cat) && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span className="check-label">{cat}</span>
                <span className="check-desc">{CATEGORY_DESC[cat]?.[lang]}</span>
              </label>
            ))}
          </div>

          <div className="count-options">
            {[5, 10, 20, 30].map((n) => (
              <button
                key={n}
                className={`count-chip ${questionCount === n ? 'active' : ''}`}
                onClick={() => setQuestionCount(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            className="btn-primary"
            onClick={startQuiz}
            disabled={selectedCategories.length === 0 || !ready}
          >
            {!ready
              ? 'Loading...'
              : lang === 'en'
                ? 'START QUIZ'
                : '퀴즈 시작'}
          </button>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  )

  // ===== RESULT SCREEN =====
  const ResultPage = () => {
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
        <Footer lang={lang} />
      </div>
    )
  }

  // ===== QUIZ SCREEN (no category label, bigger question font) =====
  const QuizPage = () => {
    const q = quiz[currentIndex]

    if (!q) {
      navigate('/')
      return null
    }

    const showImage = q.type === 'PIC' && q.image && !imgError

    return (
      <div className="app" ref={topRef}>
        <div className="quiz-screen">
          <div className="quiz-header">
            <span className="quiz-progress">
              {currentIndex + 1} / {quiz.length}
            </span>
            <div className="quiz-header-right">
              <button className="sound-toggle" onClick={() => setSoundOn((v) => !v)}>
                {soundOn ? '🔊' : '🔇'}
              </button>
              <Link to="/" className="quit-btn">
                Quit
              </Link>
            </div>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentIndex + 1) / quiz.length) * 100}%` }}
            />
          </div>

          <div className="quiz-body">
            <h2 className="question-text">{q.question}</h2>

            {showImage && (
              <div className="question-image-wrapper">
                <img
                  src={q.image}
                  alt={`Quiz question about ${q.category}`}
                  className="question-image"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
              </div>
            )}
          </div>

          <div className="options">
            {q.options.map((option, index) => (
              <button
                key={index}
                className={getOptionClass(index)}
                onClick={() => handleSelect(index)}
              >
                <span className="option-number">{index + 1}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>

          {answered && (
            <button className="next-btn" onClick={handleNext}>
              {currentIndex + 1 < quiz.length ? 'Next' : 'See Results'}
            </button>
          )}
        </div>
        <Footer lang={lang} />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
