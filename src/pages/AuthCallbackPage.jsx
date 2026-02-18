import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const fullUrl = window.location.href
    if (fullUrl.includes('error=')) {
      navigate('/login', { replace: true })
      return
    }

    const redirectTo = sessionStorage.getItem('authRedirect') || '/'
    sessionStorage.removeItem('authRedirect')

    const doRedirect = () => navigate(redirectTo, { replace: true })

    // Check if session already exists (race condition: AuthContext may have processed it first)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        doRedirect()
        return
      }

      // Session not ready yet — wait for the auth state change
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN') {
          subscription.unsubscribe()
          doRedirect()
        }
      })

      // Safety timeout: if nothing happens in 5 seconds, redirect anyway
      setTimeout(() => {
        subscription.unsubscribe()
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) doRedirect()
          else navigate('/login', { replace: true })
        })
      }, 5000)
    })
  }, [navigate])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#FAF7F3' }}>
      <div className="loader" />
    </div>
  )
}
