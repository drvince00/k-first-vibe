import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function RefundPage() {
  const { lang } = useApp()

  return (
    <div className="home-page">
      <Navbar />

      <main className="page-content">
        <h1 className="page-title">
          {lang === 'en' ? 'Refund Policy' : '환불 정책'}
        </h1>
        <p className="page-updated">
          {lang === 'en' ? 'Last updated: February 2026' : '최종 수정일: 2026년 2월'}
        </p>

        {lang === 'en' ? (
          <article>
            <section className="page-section">
              <h2>Overview</h2>
              <p>
                K-Culture Cat offers both free and paid digital services. This Refund Policy applies to
                paid features, including the AI-powered Korean Style Analysis. All payments are processed
                through <a href="https://polar.sh" target="_blank" rel="noopener noreferrer" className="inline-link">Polar</a>,
                our third-party payment processor.
              </p>
            </section>

            <section className="page-section">
              <h2>Digital Content — Immediate Delivery</h2>
              <p>
                The Korean Style Analysis is a digital service that is delivered immediately upon payment.
                Once your AI-generated style analysis results are provided, the service is considered fully delivered.
              </p>
              <p>
                Because our paid services deliver digital content instantly, we generally do not offer refunds
                after the analysis results have been generated and displayed.
              </p>
            </section>

            <section className="page-section">
              <h2>Eligible Refund Cases</h2>
              <p>We will consider a refund in the following situations:</p>
              <ul>
                <li><strong>Service failure:</strong> Payment was processed but the analysis was not delivered due to a technical error on our end</li>
                <li><strong>Duplicate charge:</strong> You were charged more than once for the same analysis</li>
                <li><strong>Unauthorized transaction:</strong> A charge was made without your authorization</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>Non-Refundable Cases</h2>
              <p>Refunds will generally not be granted in the following situations:</p>
              <ul>
                <li>Dissatisfaction with the AI-generated style recommendations (results are for entertainment and reference purposes)</li>
                <li>Uploading an incorrect or low-quality photo that affects results</li>
                <li>Change of mind after the analysis has been successfully delivered</li>
                <li>Failure to download or save your results before leaving the page</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>How to Request a Refund</h2>
              <p>To request a refund, please contact us through our{' '}
                <Link to="/about#contact-section" className="inline-link">contact form</Link>{' '}
                with the following information:
              </p>
              <ul>
                <li>The email address used for the purchase</li>
                <li>Date of the purchase</li>
                <li>A description of the issue</li>
              </ul>
              <p>
                We aim to respond to all refund requests within 3 business days.
              </p>
            </section>

            <section className="page-section">
              <h2>Refund Processing</h2>
              <p>
                If your refund request is approved:
              </p>
              <ul>
                <li>The refund will be processed through Polar, our payment processor</li>
                <li>The refund will be issued to the original payment method</li>
                <li>Processing time may vary depending on your bank or payment provider (typically 5-10 business days)</li>
                <li>You will receive a confirmation email from Polar when the refund is processed</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>Polar's Role</h2>
              <p>
                As our payment processor, <a href="https://polar.sh" target="_blank" rel="noopener noreferrer" className="inline-link">Polar</a> handles
                all payment and refund transactions. Polar's refund processing is subject to their own terms and policies.
                In some cases, you may also contact Polar directly regarding payment disputes.
              </p>
            </section>

            <section className="page-section">
              <h2>Changes to This Policy</h2>
              <p>
                We reserve the right to modify this Refund Policy at any time. Changes will be effective
                immediately upon posting to this page. Your continued use of our paid services after
                changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="page-section">
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Refund Policy, please contact us through our{' '}
                <Link to="/about#contact-section" className="inline-link">contact form</Link>.
              </p>
            </section>
          </article>
        ) : (
          <article>
            <section className="page-section">
              <h2>개요</h2>
              <p>
                K-Culture Cat은 무료 및 유료 디지털 서비스를 제공합니다. 본 환불 정책은
                AI 한국 스타일 분석을 포함한 유료 기능에 적용됩니다. 모든 결제는 제3자 결제
                처리업체인 <a href="https://polar.sh" target="_blank" rel="noopener noreferrer" className="inline-link">Polar</a>를
                통해 처리됩니다.
              </p>
            </section>

            <section className="page-section">
              <h2>디지털 콘텐츠 — 즉시 제공</h2>
              <p>
                한국 스타일 분석은 결제 즉시 제공되는 디지털 서비스입니다.
                AI가 생성한 스타일 분석 결과가 제공되면 서비스가 완전히 이행된 것으로 간주됩니다.
              </p>
              <p>
                유료 서비스는 디지털 콘텐츠를 즉시 제공하므로, 분석 결과가 생성되어 표시된 후에는
                일반적으로 환불을 제공하지 않습니다.
              </p>
            </section>

            <section className="page-section">
              <h2>환불 가능한 경우</h2>
              <p>다음과 같은 상황에서 환불을 검토합니다:</p>
              <ul>
                <li><strong>서비스 장애:</strong> 결제가 처리되었으나 당사의 기술적 오류로 인해 분석이 제공되지 않은 경우</li>
                <li><strong>중복 결제:</strong> 동일한 분석에 대해 두 번 이상 결제된 경우</li>
                <li><strong>무단 거래:</strong> 본인의 승인 없이 결제가 이루어진 경우</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>환불 불가한 경우</h2>
              <p>다음과 같은 상황에서는 일반적으로 환불이 제공되지 않습니다:</p>
              <ul>
                <li>AI 생성 스타일 추천에 대한 불만족 (결과는 오락 및 참고 목적)</li>
                <li>잘못된 사진이나 저품질 사진 업로드로 인한 결과 영향</li>
                <li>분석이 성공적으로 제공된 후 단순 변심</li>
                <li>페이지를 떠나기 전에 결과를 다운로드하거나 저장하지 않은 경우</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>환불 요청 방법</h2>
              <p>
                환불을 요청하려면{' '}
                <Link to="/about#contact-section" className="inline-link">문의 양식</Link>을
                통해 다음 정보와 함께 연락해 주세요:
              </p>
              <ul>
                <li>구매 시 사용한 이메일 주소</li>
                <li>구매 날짜</li>
                <li>문제에 대한 설명</li>
              </ul>
              <p>
                모든 환불 요청에 대해 영업일 기준 3일 이내에 답변하는 것을 목표로 합니다.
              </p>
            </section>

            <section className="page-section">
              <h2>환불 처리</h2>
              <p>환불 요청이 승인된 경우:</p>
              <ul>
                <li>환불은 결제 처리업체인 Polar를 통해 처리됩니다</li>
                <li>환불은 원래 결제 수단으로 이루어집니다</li>
                <li>처리 시간은 은행 또는 결제 제공업체에 따라 다를 수 있습니다 (일반적으로 영업일 기준 5-10일)</li>
                <li>환불이 처리되면 Polar로부터 확인 이메일을 받으실 수 있습니다</li>
              </ul>
            </section>

            <section className="page-section">
              <h2>Polar의 역할</h2>
              <p>
                결제 처리업체인 <a href="https://polar.sh" target="_blank" rel="noopener noreferrer" className="inline-link">Polar</a>는
                모든 결제 및 환불 거래를 처리합니다. Polar의 환불 처리는 자체 약관 및 정책에 따릅니다.
                경우에 따라 결제 분쟁에 대해 Polar에 직접 문의하실 수도 있습니다.
              </p>
            </section>

            <section className="page-section">
              <h2>정책 변경</h2>
              <p>
                본 환불 정책을 언제든지 수정할 수 있는 권리를 보유합니다. 변경 사항은
                이 페이지에 게시된 즉시 효력이 발생합니다. 변경 후 유료 서비스를
                계속 이용하면 업데이트된 정책에 동의한 것으로 간주됩니다.
              </p>
            </section>

            <section className="page-section">
              <h2>문의</h2>
              <p>
                본 환불 정책에 대한 질문이 있으시면{' '}
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
