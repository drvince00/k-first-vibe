import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EmojiPicker from '../components/EmojiPicker'

export default function PostDetailPage() {
  const { id } = useParams()
  const { user, loading, profile } = useAuth()
  const { lang } = useApp()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [quizQuestion, setQuizQuestion] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const commentInputRef = useRef(null)

  const insertCommentEmoji = (emoji) => {
    const input = commentInputRef.current
    if (!input) { setCommentText((prev) => prev + emoji); return }
    const start = input.selectionStart
    const end = input.selectionEnd
    const newVal = commentText.slice(0, start) + emoji + commentText.slice(end)
    setCommentText(newVal)
    requestAnimationFrame(() => {
      input.selectionStart = input.selectionEnd = start + emoji.length
      input.focus()
    })
  }

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: `/board/${id}` }, replace: true })
    }
  }, [user, loading, navigate, id])

  useEffect(() => {
    if (!user) return
    fetchPost()
    fetchComments()
  }, [user, id])

  const fetchPost = async () => {
    setFetching(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(nickname, avatar_url)')
      .eq('id', id)
      .single()
    if (error || !data) {
      navigate('/board', { replace: true })
      return
    }
    setPost(data)
    setFetching(false)

    // Load quiz question if referenced
    if (data.quiz_id != null) {
      try {
        const res = await fetch('/quizData.json')
        const allQuiz = await res.json()
        const q = allQuiz.find((item) => item.id === data.quiz_id)
        if (q) setQuizQuestion(q)
      } catch { /* ignore */ }
    }
  }

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(nickname, avatar_url)')
      .eq('post_id', id)
      .order('created_at', { ascending: true })
    if (data) setComments(data)
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim() || submittingComment) return
    setSubmittingComment(true)
    const { error } = await supabase
      .from('comments')
      .insert({ post_id: Number(id), author_id: user.id, content: commentText.trim() })
    if (!error) {
      setCommentText('')
      fetchComments()
    }
    setSubmittingComment(false)
  }

  const handleDeleteComment = async (commentId) => {
    if (isAdmin) {
      await supabase.from('comments').delete().eq('id', commentId)
    } else {
      await supabase.from('comments').delete().eq('id', commentId).eq('author_id', user.id)
    }
    fetchComments()
  }

  const handleDeletePost = async () => {
    setDeleting(true)
    if (isAdmin) {
      // Admin: hard delete (comments + post)
      await supabase.from('comments').delete().eq('post_id', Number(id))
      const { error } = await supabase.from('posts').delete().eq('id', id)
      setDeleting(false)
      if (!error) navigate('/board', { replace: true })
    } else {
      // Author: soft delete (keep comments)
      const { error } = await supabase.from('posts').update({
        title: lang === 'ko' ? '삭제된 게시물입니다' : 'This post has been deleted',
        content: lang === 'ko' ? '작성자에 의해 삭제된 게시물입니다.' : 'This post has been deleted by the author.',
        image_urls: [],
        deleted_at: new Date().toISOString(),
      }).eq('id', id).eq('author_id', user.id)
      setDeleting(false)
      if (!error) navigate('/board', { replace: true })
    }
    setShowDeleteModal(false)
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const isAdmin = profile?.is_admin === true
  const isAuthor = post && user && post.author_id === user.id
  const isDeleted = !!post?.deleted_at

  if (loading || fetching) {
    return (
      <div className="home-page">
        <Navbar />
        <main className="board-wrapper">
          <div className="board-loading"><div className="loader" /></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="home-page">
      <Navbar />
      <main className="board-wrapper">
        <div className="board-container" style={{ maxWidth: 720 }}>
          {/* Back link */}
          <Link to="/board" className="board-back-link">
            &larr; {lang === 'ko' ? '목록으로' : 'Back to list'}
          </Link>

          {/* Post */}
          <article className="post-detail-card">
            <h1 className="post-detail-title">{post.title}</h1>
            <div className="post-detail-meta">
              <div className="post-detail-author">
                {post.profiles?.avatar_url ? (
                  <img src={post.profiles.avatar_url} alt="" className="post-detail-avatar" referrerPolicy="no-referrer" />
                ) : (
                  <span className="post-detail-avatar-fallback">
                    {(post.profiles?.nickname || 'A')[0].toUpperCase()}
                  </span>
                )}
                <span>{post.profiles?.nickname || 'Anonymous'}</span>
              </div>
              <span className="post-detail-date">{formatDate(post.created_at)}</span>
            </div>

            {/* Quiz reference card */}
            {quizQuestion && (
              <div className="post-quiz-card">
                <span className="board-quiz-badge">Quiz #{post.quiz_id}</span>
                <p className="post-quiz-question">{quizQuestion.question}</p>
                {quizQuestion.type === 'PIC' && quizQuestion.image && (
                  <img
                    src={quizQuestion.image}
                    alt={`Quiz #${post.quiz_id}`}
                    className="post-quiz-image"
                    loading="lazy"
                  />
                )}
                <div className="post-quiz-options">
                  {quizQuestion.options.map((opt, i) => (
                    <span key={i} className={`post-quiz-option ${i === quizQuestion.answer ? 'correct' : ''}`}>
                      {i + 1}. {opt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="post-detail-content">{post.content}</div>

            {/* Images */}
            {post.image_urls && post.image_urls.length > 0 && (
              <div className="post-detail-images">
                {post.image_urls.map((url, i) => (
                  <img key={i} src={url} alt="" className="post-detail-img" loading="lazy" />
                ))}
              </div>
            )}

            {/* Actions */}
            {!isDeleted && isAuthor && (
              <div className="post-detail-actions">
                <Link to={`/board/write/${post.id}`} className="post-edit-btn">
                  {lang === 'ko' ? '수정' : 'Edit'}
                </Link>
                <button className="post-delete-btn" onClick={() => setShowDeleteModal(true)}>
                  {lang === 'ko' ? '삭제' : 'Delete'}
                </button>
              </div>
            )}
            {isDeleted && isAdmin && (
              <div className="post-detail-actions">
                <button className="post-delete-btn" onClick={() => setShowDeleteModal(true)}>
                  {lang === 'ko' ? '완전 삭제' : 'Hard Delete'}
                </button>
              </div>
            )}
          </article>

          {/* Comments */}
          <section className="comments-section">
            <h2 className="comments-title">
              {lang === 'ko' ? '댓글' : 'Comments'} ({comments.length})
            </h2>
            {comments.length === 0 ? (
              <p className="comments-empty">
                {lang === 'ko' ? '아직 댓글이 없습니다.' : 'No comments yet.'}
              </p>
            ) : (
              <div className="comments-list">
                {comments.map((c) => (
                  <div key={c.id} className="comment-item">
                    <div className="comment-header">
                      <div className="comment-author">
                        {c.profiles?.avatar_url ? (
                          <img src={c.profiles.avatar_url} alt="" className="comment-avatar" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="comment-avatar-fallback">
                            {(c.profiles?.nickname || 'A')[0].toUpperCase()}
                          </span>
                        )}
                        <span className="comment-nickname">{c.profiles?.nickname || 'Anonymous'}</span>
                        <span className="comment-date">{formatDate(c.created_at)}</span>
                      </div>
                      {user && (c.author_id === user.id || isAdmin) && (
                        <button className="comment-delete-btn" onClick={() => handleDeleteComment(c.id)}>
                          {lang === 'ko' ? '삭제' : 'Delete'}
                        </button>
                      )}
                    </div>
                    <p className="comment-content">{c.content}</p>
                  </div>
                ))}
              </div>
            )}

            <form className="comment-form-with-emoji" onSubmit={handleAddComment}>
              <EmojiPicker onSelect={insertCommentEmoji} lang={lang} compact />
              <div className="comment-input-row">
                <input
                  ref={commentInputRef}
                  type="text"
                  className="comment-input"
                  maxLength={1000}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={lang === 'ko' ? '댓글을 입력하세요...' : 'Write a comment...'}
                />
                <button type="submit" className="comment-submit-btn" disabled={submittingComment || !commentText.trim()}>
                  {submittingComment ? <span className="loader-small" /> : (lang === 'ko' ? '등록' : 'Post')}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <p className="modal-text">
              {isAdmin
                ? (lang === 'ko'
                    ? '관리자 권한으로 완전 삭제합니다. 댓글도 모두 삭제됩니다.'
                    : 'Admin: permanently delete this post and all comments?')
                : (lang === 'ko'
                    ? '게시물을 삭제하시겠습니까? (댓글은 유지됩니다)'
                    : 'Delete this post? (Comments will be kept.)')}
            </p>
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={() => setShowDeleteModal(false)}>
                {lang === 'ko' ? '취소' : 'Cancel'}
              </button>
              <button className="modal-confirm-btn" onClick={handleDeletePost} disabled={deleting}>
                {deleting ? <span className="loader-small" /> : (lang === 'ko' ? '삭제' : 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
