import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PrivacyPage() {
  const { lang } = useApp()

  return (
    <div className="home-page">
      <Navbar />

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

      <Footer />
    </div>
  )
}
