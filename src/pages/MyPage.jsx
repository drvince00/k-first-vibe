import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function MyPage() {
  const { user, loading, updatePassword, updateProfile, deleteAccount } = useAuth()
  const { lang } = useApp()
  const navigate = useNavigate()

  const [nickname, setNickname] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)

  const isEmailUser = user?.app_metadata?.provider === 'email'

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: '/mypage' }, replace: true })
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (user) {
      setNickname(user.user_metadata?.nickname || user.user_metadata?.full_name || '')
    }
  }, [user])

  const handleProfileSave = async () => {
    setProfileMsg({ type: '', text: '' })
    if (!nickname.trim()) {
      setProfileMsg({ type: 'error', text: lang === 'ko' ? '닉네임을 입력하세요.' : 'Please enter a nickname.' })
      return
    }
    setSaving(true)
    try {
      await updateProfile({ nickname: nickname.trim() })
      setProfileMsg({ type: 'success', text: lang === 'ko' ? '저장되었습니다.' : 'Saved successfully.' })
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordMsg({ type: '', text: '' })
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: lang === 'ko' ? '비밀번호는 6자 이상이어야 합니다.' : 'Password must be at least 6 characters.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: lang === 'ko' ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.' })
      return
    }
    try {
      const { error } = await updatePassword(newPassword)
      if (error) throw error
      setPasswordMsg({ type: 'success', text: lang === 'ko' ? '비밀번호가 변경되었습니다.' : 'Password updated.' })
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message })
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteAccount()
      navigate('/', { replace: true })
    } catch (err) {
      setDeleting(false)
      alert(err.message)
    }
  }

  if (loading || !user) {
    return (
      <div className="home-page">
        <Navbar />
        <div className="login-page"><div className="loader" /></div>
        <Footer />
      </div>
    )
  }

  const t = {
    en: {
      title: 'My Page',
      profileSection: 'Profile',
      nicknameLabel: 'Nickname',
      emailLabel: 'Email',
      saveBtn: 'Save',
      passwordSection: 'Change Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      changeBtn: 'Change Password',
      deleteSection: 'Delete Account',
      deleteWarning: 'This action cannot be undone. All your data will be permanently deleted.',
      deleteBtn: 'Delete Account',
      deleteConfirm: 'Are you sure you want to delete your account?',
      cancel: 'Cancel',
      confirm: 'Delete',
    },
    ko: {
      title: '마이페이지',
      profileSection: '프로필',
      nicknameLabel: '닉네임',
      emailLabel: '이메일',
      saveBtn: '저장',
      passwordSection: '비밀번호 변경',
      newPassword: '새 비밀번호',
      confirmPassword: '비밀번호 확인',
      changeBtn: '비밀번호 변경',
      deleteSection: '계정 삭제',
      deleteWarning: '이 작업은 되돌릴 수 없습니다. 모든 데이터가 영구 삭제됩니다.',
      deleteBtn: '계정 삭제',
      deleteConfirm: '정말 계정을 삭제하시겠습니까?',
      cancel: '취소',
      confirm: '삭제',
    },
  }
  const tx = t[lang] || t.en

  const avatarUrl = user.user_metadata?.avatar_url
  const displayName = nickname || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  return (
    <div className="home-page">
      <Navbar />
      <main className="mypage">
        <h1 className="mypage-title">{tx.title}</h1>

        {/* Profile Section */}
        <section className="mypage-section">
          <h2 className="mypage-section-title">{tx.profileSection}</h2>
          <div className="mypage-profile-header">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="mypage-avatar" referrerPolicy="no-referrer" />
            ) : (
              <span className="mypage-avatar-fallback">{displayName[0].toUpperCase()}</span>
            )}
            <div className="mypage-profile-info">
              <div className="mypage-field">
                <label className="mypage-label">{tx.nicknameLabel}</label>
                <input
                  type="text"
                  className="login-input"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
              <div className="mypage-field">
                <label className="mypage-label">{tx.emailLabel}</label>
                <input type="email" className="login-input" value={user.email || ''} disabled />
              </div>
              {profileMsg.text && (
                <div className={`login-message ${profileMsg.type === 'error' ? 'login-error' : 'login-success'}`}>
                  {profileMsg.text}
                </div>
              )}
              <button className="login-submit-btn" onClick={handleProfileSave} disabled={saving}>
                {saving ? <span className="loader-small" /> : tx.saveBtn}
              </button>
            </div>
          </div>
        </section>

        {/* Password Section - email users only */}
        {isEmailUser && (
          <section className="mypage-section">
            <h2 className="mypage-section-title">{tx.passwordSection}</h2>
            <form className="login-form" onSubmit={handlePasswordChange}>
              {passwordMsg.text && (
                <div className={`login-message ${passwordMsg.type === 'error' ? 'login-error' : 'login-success'}`}>
                  {passwordMsg.text}
                </div>
              )}
              <input
                type="password"
                className="login-input"
                placeholder={tx.newPassword}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <input
                type="password"
                className="login-input"
                placeholder={tx.confirmPassword}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button type="submit" className="login-submit-btn">{tx.changeBtn}</button>
            </form>
          </section>
        )}

        {/* Delete Account Section */}
        <section className="mypage-section mypage-danger">
          <h2 className="mypage-section-title">{tx.deleteSection}</h2>
          <p className="mypage-warning">{tx.deleteWarning}</p>
          <button className="mypage-delete-btn" onClick={() => setShowDeleteModal(true)}>
            {tx.deleteBtn}
          </button>
        </section>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <p className="modal-text">{tx.deleteConfirm}</p>
              <div className="modal-actions">
                <button className="modal-cancel-btn" onClick={() => setShowDeleteModal(false)}>
                  {tx.cancel}
                </button>
                <button className="modal-confirm-btn" onClick={handleDelete} disabled={deleting}>
                  {deleting ? <span className="loader-small" /> : tx.confirm}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
