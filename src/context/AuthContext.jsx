import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (authUser) => {
    if (!authUser) { setProfile(null); return }
    const { data } = await supabase
      .from('profiles')
      .select('nickname, avatar_url')
      .eq('id', authUser.id)
      .single()

    if (data) {
      // Auto-fill nickname from social login if null
      if (!data.nickname) {
        const socialName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User'
        await supabase.from('profiles').update({ nickname: socialName }).eq('id', authUser.id)
        data.nickname = socialName
      }
      setProfile(data)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      fetchProfile(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      fetchProfile(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })

  const signInWithFacebook = () =>
    supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })

  const signInWithEmail = (email) =>
    supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

  const signUpWithEmail = (email, password) =>
    supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

  const signInWithPassword = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const resetPassword = (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

  const updatePassword = (newPassword) =>
    supabase.auth.updateUser({ password: newPassword })

  const updateProfile = async (data) => {
    // Update auth user_metadata
    const { error } = await supabase.auth.updateUser({ data })
    if (error) throw error
    // Update profiles table
    const updates = {}
    if (data.nickname !== undefined) updates.nickname = data.nickname
    if (Object.keys(updates).length > 0) {
      updates.updated_at = new Date().toISOString()
      await supabase.from('profiles').update(updates).eq('id', user.id)
    }
    const { data: { user: updated } } = await supabase.auth.getUser()
    setUser(updated)
    await fetchProfile(updated)
  }

  const deleteAccount = async () => {
    if (!user?.id) throw new Error('Not logged in')
    const { error } = await supabase.rpc('delete_own_account')
    if (error) throw error
    await signOut()
  }

  const signOut = () => supabase.auth.signOut()

  const value = {
    user,
    session,
    profile,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    signInWithPassword,
    resetPassword,
    updatePassword,
    updateProfile,
    deleteAccount,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
