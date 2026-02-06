import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function TermsPage() {
  const { lang } = useApp()

  return (
    <div className="home-page">
      <Navbar />

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

      <Footer />
    </div>
  )
}
