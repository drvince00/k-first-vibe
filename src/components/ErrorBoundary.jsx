import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f6fb',
        padding: '2rem',
        fontFamily: "'Outfit', sans-serif",
        textAlign: 'center',
      }}>
        <img
          src="/images/catwithjjajangmyun.jpg"
          alt="K-Culture Cat"
          style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: '1.25rem', opacity: 0.8 }}
        />
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#3b2667', marginBottom: '0.5rem' }}>
          Oops! Something went wrong.
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1.75rem', maxWidth: 320 }}>
          An unexpected error occurred. Please try again or return to the home page.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '0.6rem 1.4rem',
              borderRadius: 99,
              border: '1.5px solid #a78bfa',
              background: 'transparent',
              color: '#6c63ff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              padding: '0.6rem 1.4rem',
              borderRadius: 99,
              background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              color: '#fff',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.9rem',
            }}
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }
}
