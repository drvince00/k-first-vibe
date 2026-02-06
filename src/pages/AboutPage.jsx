import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ContactForm from '../components/ContactForm'

export default function AboutPage() {
  const { lang } = useApp()

  return (
    <div className="home-page">
      <Navbar />

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

      <ContactForm />
      <Footer />
    </div>
  )
}
