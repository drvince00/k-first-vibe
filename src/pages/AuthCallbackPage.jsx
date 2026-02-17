import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const fullUrl = window.location.href
    if (fullUrl.includes('error=')) {
      navigate('/login', { replace: true })
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        const redirectTo = sessionStorage.getItem('authRedirect') || '/'
        sessionStorage.removeItem('authRedirect')
        navigate(redirectTo, { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#FAF7F3' }}>
      <div className="loader" />
    </div>
  )
}
