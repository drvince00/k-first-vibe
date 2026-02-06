import { useApp } from '../context/AppContext'

export default function ContactForm() {
  const {
    lang, contactEmail, setContactEmail,
    contactMessage, setContactMessage,
    contactStatus, handleContactSubmit
  } = useApp()

  return (
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
}
