import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MAX_IMAGES = 5
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

import EmojiPicker from '../components/EmojiPicker'

export default function PostWritePage() {
  const { user, loading } = useAuth()
  const { lang } = useApp()
  const navigate = useNavigate()
  const { id: editId } = useParams()
  const fileInputRef = useRef(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [quizId, setQuizId] = useState('')
  const [existingImages, setExistingImages] = useState([]) // URLs from DB
  const [newFiles, setNewFiles] = useState([]) // File objects
  const [previews, setPreviews] = useState([]) // preview URLs for new files
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const titleRef = useRef(null)
  const textareaRef = useRef(null)
  const lastFocusedRef = useRef('content') // 'title' or 'content'

  const insertEmoji = (emoji) => {
    const isTitle = lastFocusedRef.current === 'title'
    const el = isTitle ? titleRef.current : textareaRef.current
    const value = isTitle ? title : content
    const setter = isTitle ? setTitle : setContent

    if (!el) { setter((prev) => prev + emoji); return }
    const start = el.selectionStart
    const end = el.selectionEnd
    const newVal = value.slice(0, start) + emoji + value.slice(end)
    setter(newVal)
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + emoji.length
      el.focus()
    })
  }

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: '/board/write' }, replace: true })
    }
  }, [user, loading, navigate])

  // Load existing post for edit mode
  useEffect(() => {
    if (!editId || !user) return
    const loadPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', editId)
        .single()
      if (error || !data) {
        navigate('/board', { replace: true })
        return
      }
      if (data.author_id !== user.id) {
        navigate(`/board/${editId}`, { replace: true })
        return
      }
      setTitle(data.title)
      setContent(data.content)
      setQuizId(data.quiz_id != null ? String(data.quiz_id) : '')
      setExistingImages(data.image_urls || [])
    }
    loadPost()
  }, [editId, user, navigate])

  const totalImages = existingImages.length + newFiles.length

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const available = MAX_IMAGES - totalImages
    if (available <= 0) return

    const valid = []
    const urls = []
    for (const file of files.slice(0, available)) {
      if (file.size > MAX_FILE_SIZE) {
        setError(lang === 'ko' ? '이미지는 5MB 이하만 가능합니다.' : 'Image must be under 5MB.')
        continue
      }
      if (!file.type.startsWith('image/')) continue
      valid.push(file)
      urls.push(URL.createObjectURL(file))
    }
    setNewFiles((prev) => [...prev, ...valid])
    setPreviews((prev) => [...prev, ...urls])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const removeNewFile = (idx) => {
    URL.revokeObjectURL(previews[idx])
    setNewFiles((prev) => prev.filter((_, i) => i !== idx))
    setPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError(lang === 'ko' ? '제목을 입력하세요.' : 'Title is required.')
      return
    }
    if (!content.trim()) {
      setError(lang === 'ko' ? '내용을 입력하세요.' : 'Content is required.')
      return
    }

    const parsedQuizId = quizId.trim() ? parseInt(quizId, 10) : null
    if (quizId.trim() && (isNaN(parsedQuizId) || parsedQuizId < 1)) {
      setError(lang === 'ko' ? '유효한 퀴즈 번호를 입력하세요.' : 'Enter a valid quiz number.')
      return
    }

    setSubmitting(true)

    try {
      // Upload new images
      const uploadedUrls = []
      for (const file of newFiles) {
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
        const { error: upErr } = await supabase.storage
          .from('board-images')
          .upload(path, file, { cacheControl: '3600', upsert: false })
        if (upErr) throw upErr
        const { data: urlData } = supabase.storage
          .from('board-images')
          .getPublicUrl(path)
        uploadedUrls.push(urlData.publicUrl)
      }

      const allImageUrls = [...existingImages, ...uploadedUrls]

      if (editId) {
        const { error: updateErr } = await supabase
          .from('posts')
          .update({
            title: title.trim(),
            content: content.trim(),
            quiz_id: parsedQuizId,
            image_urls: allImageUrls,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editId)
          .eq('author_id', user.id)
        if (updateErr) throw updateErr
        navigate(`/board/${editId}`, { replace: true })
      } else {
        const { data: newPost, error: insertErr } = await supabase
          .from('posts')
          .insert({
            author_id: user.id,
            title: title.trim(),
            content: content.trim(),
            quiz_id: parsedQuizId,
            image_urls: allImageUrls,
          })
          .select('id')
          .single()
        if (insertErr) throw insertErr
        navigate(`/board/${newPost.id}`, { replace: true })
      }
    } catch (err) {
      console.error(err)
      setError(lang === 'ko' ? '저장에 실패했습니다.' : 'Failed to save.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className="home-page">
      <Navbar />
      <main className="board-wrapper">
        <div className="board-container" style={{ maxWidth: 640 }}>
          <h1 className="board-title">
            {editId
              ? (lang === 'ko' ? '글 수정' : 'Edit Post')
              : (lang === 'ko' ? '새 글 작성' : 'New Post')}
          </h1>

          <form className="post-form" onSubmit={handleSubmit}>
            <div className="post-form-group">
              <label>{lang === 'ko' ? '제목' : 'Title'}</label>
              <input
                ref={titleRef}
                type="text"
                className="post-form-input"
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => { lastFocusedRef.current = 'title' }}
                placeholder={lang === 'ko' ? '제목을 입력하세요' : 'Enter title'}
              />
              <span className="post-form-hint">{title.length}/200</span>
            </div>

            <div className="post-form-group">
              <div className="post-form-label-row">
                <label>{lang === 'ko' ? '내용' : 'Content'}</label>
              </div>
              <EmojiPicker onSelect={insertEmoji} lang={lang} />
              <textarea
                ref={textareaRef}
                className="post-form-textarea"
                maxLength={5000}
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => { lastFocusedRef.current = 'content' }}
                placeholder={lang === 'ko' ? '내용을 입력하세요' : 'Write your post'}
              />
              <span className="post-form-hint">{content.length}/5000</span>
            </div>

            <div className="post-form-group">
              <label>{lang === 'ko' ? '퀴즈 번호 (선택)' : 'Quiz No. (optional)'}</label>
              <input
                type="number"
                className="post-form-input"
                min="1"
                value={quizId}
                onChange={(e) => setQuizId(e.target.value)}
                placeholder="e.g. 37"
                style={{ maxWidth: 160 }}
              />
            </div>

            <div className="post-form-group">
              <label>{lang === 'ko' ? `이미지 (${totalImages}/${MAX_IMAGES})` : `Images (${totalImages}/${MAX_IMAGES})`}</label>
              <div className="post-image-grid">
                {existingImages.map((url, i) => (
                  <div key={`ex-${i}`} className="post-image-thumb">
                    <img src={url} alt="" />
                    <button type="button" className="post-image-remove" onClick={() => removeExistingImage(i)}>&times;</button>
                  </div>
                ))}
                {previews.map((url, i) => (
                  <div key={`new-${i}`} className="post-image-thumb">
                    <img src={url} alt="" />
                    <button type="button" className="post-image-remove" onClick={() => removeNewFile(i)}>&times;</button>
                  </div>
                ))}
                {totalImages < MAX_IMAGES && (
                  <label className="post-image-add">
                    <span>+</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      hidden
                    />
                  </label>
                )}
              </div>
            </div>

            {error && <p className="post-form-error">{error}</p>}

            <div className="post-form-actions">
              <button type="button" className="post-cancel-btn" onClick={() => navigate(-1)}>
                {lang === 'ko' ? '취소' : 'Cancel'}
              </button>
              <button type="submit" className="post-submit-btn" disabled={submitting}>
                {submitting
                  ? <span className="loader-small" />
                  : (editId
                    ? (lang === 'ko' ? '수정하기' : 'Update')
                    : (lang === 'ko' ? '게시하기' : 'Publish'))}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
