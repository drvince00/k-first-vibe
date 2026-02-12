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
              <p>K-Culture Cat collects the following types of information:</p>
              <ul>
                <li><strong>Contact form:</strong> Your email address and message when you use our contact form</li>
                <li><strong>Payment information:</strong> When you purchase paid features (e.g., Korean Style Analysis), payment is processed by <a href="https://polar.sh" target="_blank" rel="noopener noreferrer" className="inline-link">Polar</a>. We do not directly collect or store your credit card numbers or financial account information. Polar may collect your name, email address, billing address, and payment details as necessary to process transactions</li>
                <li><strong>Uploaded photos:</strong> Photos you upload for the Style Analysis feature are processed temporarily for AI analysis and are not stored permanently</li>
                <li><strong>Usage data:</strong> General analytics data about how you use our platform</li>
              </ul>
              <p>We do not require account registration to use our free features.</p>
            </section>

            <section className="page-section">
              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Respond to your inquiries and feedback submitted through our contact form</li>
                <li>Process and deliver paid services (Korean Style Analysis)</li>
                <li>Send transaction confirmations and receipts (via Polar)</li>
                <li>Improve and maintain our platform</li>
                <li>Analyze usage patterns to enhance user experience</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>Payment Data & Third-Party Payment Processor</h2>
              <p>
                All payment transactions are processed through{' '}
                <a href="https://polar.sh" target="_blank" rel="noopener noreferrer" className="inline-link">Polar</a>.
                When you make a purchase:
              </p>
              <ul>
                <li>Your payment information (credit card, billing details) is collected and processed directly by Polar</li>
                <li>We receive only the information necessary to fulfill your order (e.g., order confirmation, email for delivery)</li>
                <li>We do not have access to your full credit card number or financial account details</li>
                <li>Polar's handling of your payment data is governed by their{' '}
                  <a href="https://polar.sh/legal/privacy" target="_blank" rel="noopener noreferrer" className="inline-link">Privacy Policy</a>
                </li>
                <li>Polar uses industry-standard encryption and security measures to protect your payment information</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>Uploaded Photos</h2>
              <p>
                When you use the Korean Style Analysis feature:
              </p>
              <ul>
                <li>Your uploaded photo is sent to our AI service for analysis</li>
                <li>Photos are processed in real-time and are not permanently stored on our servers</li>
                <li>We do not use your photos for any purpose other than generating your style analysis results</li>
                <li>We do not share your photos with third parties except as necessary for AI processing</li>
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
                by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="inline-link">Google Ads Settings</a>.
              </p>
            </section>

            <section className="page-section">
              <h2>Third-Party Advertising</h2>
              <p>
                We use Google AdSense to display advertisements on our free features. Google AdSense may use cookies
                and web beacons to collect information (not including your name, address, email address, or
                telephone number) about your visits to this and other websites in order to provide advertisements
                about goods and services of interest to you.
              </p>
            </section>

            <section className="page-section">
              <h2>Data Sharing</h2>
              <p>We do not sell your personal information. We may share your information with:</p>
              <ul>
                <li><strong>Polar:</strong> Payment processing for paid features</li>
                <li><strong>AI service providers:</strong> Photo analysis for the Style Analysis feature (photos only, processed temporarily)</li>
                <li><strong>Google:</strong> Analytics and advertising services</li>
                <li><strong>Formspree:</strong> Contact form submissions</li>
                <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>Data Retention</h2>
              <ul>
                <li><strong>Contact form data:</strong> Retained as long as needed to respond to your inquiry</li>
                <li><strong>Payment records:</strong> Retained by Polar in accordance with legal and financial reporting requirements</li>
                <li><strong>Uploaded photos:</strong> Processed temporarily and not permanently stored</li>
                <li><strong>Analytics data:</strong> Retained in accordance with Google Analytics retention settings</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Request access to the personal data we hold about you</li>
                <li>Request correction or deletion of your personal data</li>
                <li>Opt out of personalized advertising</li>
                <li>Request a refund for paid services in accordance with our{' '}
                  <Link to="/refund" className="inline-link">Refund Policy</Link>
                </li>
              </ul>
              <p>
                To exercise these rights, please contact us through our{' '}
                <Link to="/about#contact-section" className="inline-link">contact form</Link>.
              </p>
            </section>

            <section className="page-section">
              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal
                information. Payment data is secured by Polar using industry-standard encryption.
                However, no method of transmission over the Internet is 100% secure, and
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
              <p>K-Culture Cat은 다음과 같은 유형의 정보를 수집합니다:</p>
              <ul>
                <li><strong>문의 양식:</strong> 문의 양식 사용 시 이메일 주소와 메시지</li>
                <li><strong>결제 정보:</strong> 유료 기능(예: 한국 스타일 분석) 구매 시 결제는{' '}
                  <a href="https://polar.sh" target="_blank" rel="noopener noreferrer" className="inline-link">Polar</a>를 통해 처리됩니다.
                  당사는 신용카드 번호나 금융 계좌 정보를 직접 수집하거나 저장하지 않습니다.
                  Polar는 거래 처리에 필요한 이름, 이메일 주소, 청구 주소 및 결제 정보를 수집할 수 있습니다</li>
                <li><strong>업로드된 사진:</strong> 스타일 분석 기능을 위해 업로드된 사진은 AI 분석을 위해 임시로 처리되며 영구적으로 저장되지 않습니다</li>
                <li><strong>사용 데이터:</strong> 플랫폼 사용에 관한 일반적인 분석 데이터</li>
              </ul>
              <p>무료 기능을 이용하기 위해 회원가입이 필요하지 않습니다.</p>
            </section>

            <section className="page-section">
              <h2>정보 사용 목적</h2>
              <p>수집된 정보는 다음과 같이 사용됩니다:</p>
              <ul>
                <li>문의 양식을 통해 제출된 문의 및 피드백에 대한 응답</li>
                <li>유료 서비스(한국 스타일 분석) 처리 및 제공</li>
                <li>거래 확인 및 영수증 발송 (Polar 통해)</li>
                <li>플랫폼 개선 및 유지</li>
                <li>사용자 경험 향상을 위한 사용 패턴 분석</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>결제 데이터 및 제3자 결제 처리업체</h2>
              <p>
                모든 결제 거래는{' '}
                <a href="https://polar.sh" target="_blank" rel="noopener noreferrer" className="inline-link">Polar</a>를
                통해 처리됩니다. 구매 시:
              </p>
              <ul>
                <li>결제 정보(신용카드, 청구 세부사항)는 Polar에서 직접 수집하고 처리합니다</li>
                <li>당사는 주문 이행에 필요한 정보(예: 주문 확인, 배송용 이메일)만 수신합니다</li>
                <li>전체 신용카드 번호나 금융 계좌 세부정보에 접근할 수 없습니다</li>
                <li>Polar의 결제 데이터 처리는{' '}
                  <a href="https://polar.sh/legal/privacy" target="_blank" rel="noopener noreferrer" className="inline-link">Polar 개인정보처리방침</a>에
                  따릅니다</li>
                <li>Polar는 업계 표준 암호화 및 보안 조치를 사용하여 결제 정보를 보호합니다</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>업로드된 사진</h2>
              <p>한국 스타일 분석 기능 사용 시:</p>
              <ul>
                <li>업로드된 사진은 AI 서비스로 전송되어 분석됩니다</li>
                <li>사진은 실시간으로 처리되며 서버에 영구적으로 저장되지 않습니다</li>
                <li>스타일 분석 결과 생성 외에 다른 목적으로 사진을 사용하지 않습니다</li>
                <li>AI 처리에 필요한 경우를 제외하고 제3자와 사진을 공유하지 않습니다</li>
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
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="inline-link">Google 광고 설정</a>에서
                맞춤 광고를 거부할 수 있습니다.
              </p>
            </section>

            <section className="page-section">
              <h2>제3자 광고</h2>
              <p>
                무료 기능에는 Google AdSense를 사용하여 광고를 게재합니다. Google AdSense는 쿠키와
                웹 비콘을 사용하여 귀하의 관심사에 맞는 상품 및 서비스에 관한 광고를 제공하기 위해
                본 사이트 및 다른 웹사이트 방문에 관한 정보를 수집할 수 있습니다.
              </p>
            </section>

            <section className="page-section">
              <h2>정보 공유</h2>
              <p>당사는 개인정보를 판매하지 않습니다. 다음과 정보를 공유할 수 있습니다:</p>
              <ul>
                <li><strong>Polar:</strong> 유료 기능 결제 처리</li>
                <li><strong>AI 서비스 제공업체:</strong> 스타일 분석 기능을 위한 사진 분석 (사진만, 임시 처리)</li>
                <li><strong>Google:</strong> 분석 및 광고 서비스</li>
                <li><strong>Formspree:</strong> 문의 양식 제출</li>
                <li><strong>법적 요구:</strong> 법률에 의해 요구되거나 권리를 보호하기 위해 필요한 경우</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>데이터 보관</h2>
              <ul>
                <li><strong>문의 양식 데이터:</strong> 문의에 대한 응답에 필요한 기간 동안 보관</li>
                <li><strong>결제 기록:</strong> 법적 및 재무 보고 요구사항에 따라 Polar에서 보관</li>
                <li><strong>업로드된 사진:</strong> 임시로 처리되며 영구 저장되지 않음</li>
                <li><strong>분석 데이터:</strong> Google Analytics 보관 설정에 따라 보관</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>이용자 권리</h2>
              <p>귀하는 다음의 권리를 가집니다:</p>
              <ul>
                <li>당사가 보유한 개인 데이터에 대한 접근 요청</li>
                <li>개인 데이터의 수정 또는 삭제 요청</li>
                <li>맞춤 광고 거부</li>
                <li><Link to="/refund" className="inline-link">환불 정책</Link>에 따른 유료 서비스 환불 요청</li>
              </ul>
              <p>
                이러한 권리를 행사하려면{' '}
                <Link to="/about#contact-section" className="inline-link">문의 양식</Link>을 통해 연락해 주세요.
              </p>
            </section>

            <section className="page-section">
              <h2>데이터 보안</h2>
              <p>
                개인정보를 보호하기 위해 적절한 기술적, 조직적 조치를 시행합니다.
                결제 데이터는 Polar에서 업계 표준 암호화를 사용하여 보호됩니다.
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
