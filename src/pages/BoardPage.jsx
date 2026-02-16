import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PAGE_SIZE = 10

export default function BoardPage() {
  const { user, loading, profile } = useAuth()
  const { lang } = useApp()
  const navigate = useNavigate()
  const isAdmin = profile?.is_admin === true

  const [posts, setPosts] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [fetching, setFetching] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: '/board' }, replace: true })
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (!user) return
    fetchPosts()
  }, [user, page, search])

  const fetchPosts = async () => {
    setFetching(true)
    const offset = page * PAGE_SIZE

    let query = supabase
      .from('posts')
      .select('id, title, content, image_urls, quiz_id, created_at, author_id, deleted_at, profiles(nickname, avatar_url)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1)

    if (search.trim()) {
      const term = search.trim().replace(/%/g, '\\%')
      query = query.or(`title.ilike.%${term}%,content.ilike.%${term}%`)
    }

    const { data, count, error } = await query

    if (error) {
      console.error('Board fetch error:', error)
      setFetching(false)
      return
    }

    // Fetch comment counts separately
    if (data && data.length > 0) {
      const postIds = data.map((p) => p.id)
      const { data: commentData } = await supabase
        .from('comments')
        .select('post_id')
        .in('post_id', postIds)

      const countMap = {}
      if (commentData) {
        commentData.forEach((c) => {
          countMap[c.post_id] = (countMap[c.post_id] || 0) + 1
        })
      }
      setPosts(data.map((p) => ({ ...p, _commentCount: countMap[p.id] || 0 })))
    } else {
      setPosts([])
    }
    setTotalCount(count || 0)
    setFetching(false)
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    setSearch(searchInput)
  }

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === posts.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(posts.map(p => p.id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selected.size === 0) return
    const msg = lang === 'ko'
      ? `${selected.size}개 게시글을 삭제하시겠습니까?`
      : `Delete ${selected.size} post(s)?`
    if (!confirm(msg)) return
    setDeleting(true)
    const ids = [...selected]
    // Delete comments first, then posts
    await supabase.from('comments').delete().in('post_id', ids)
    const { error } = await supabase.from('posts').delete().in('id', ids)
    if (error) {
      console.error('Delete error:', error)
    }
    setSelected(new Set())
    setDeleting(false)
    fetchPosts()
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = now - d
    if (diff < 60000) return lang === 'ko' ? '방금 전' : 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}${lang === 'ko' ? '분 전' : 'm ago'}`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}${lang === 'ko' ? '시간 전' : 'h ago'}`
    return d.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="home-page">
      <Navbar />
      <main className="board-wrapper">
        <div className="board-container">
          <div className="board-header">
            <h1 className="board-title">{lang === 'ko' ? '자유게시판' : 'Community Board'}</h1>
            <Link to="/board/write" className="board-write-btn">
              {lang === 'ko' ? '글쓰기' : 'Write'}
            </Link>
          </div>

          <form className="board-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="board-search-input"
              placeholder={lang === 'ko' ? '제목/내용 검색...' : 'Search...'}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="board-search-btn">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </form>

          {isAdmin && posts.length > 0 && !fetching && (
            <div className="board-admin-bar">
              <label className="board-select-all">
                <input
                  type="checkbox"
                  checked={posts.length > 0 && selected.size === posts.length}
                  onChange={toggleSelectAll}
                />
                <span>{lang === 'ko' ? '전체 선택' : 'Select All'}</span>
              </label>
              {selected.size > 0 && (
                <button
                  className="board-delete-btn"
                  onClick={handleBulkDelete}
                  disabled={deleting}
                >
                  {deleting
                    ? (lang === 'ko' ? '삭제 중...' : 'Deleting...')
                    : (lang === 'ko' ? `${selected.size}개 삭제` : `Delete ${selected.size}`)}
                </button>
              )}
            </div>
          )}

          {fetching ? (
            <div className="board-loading">
              <div className="loader" />
            </div>
          ) : posts.length === 0 ? (
            <div className="board-empty">
              {search
                ? (lang === 'ko' ? '검색 결과가 없습니다.' : 'No results found.')
                : (lang === 'ko' ? '아직 게시글이 없습니다.' : 'No posts yet.')}
            </div>
          ) : (
            <div className="board-list">
              {posts.map((post) => {
                const commentCount = post._commentCount || 0
                const hasImages = post.image_urls && post.image_urls.length > 0
                const softDeleted = !!post.deleted_at
                return (
                  <div key={post.id} className="board-item-row">
                    {isAdmin && (
                      <input
                        type="checkbox"
                        className="board-item-checkbox"
                        checked={selected.has(post.id)}
                        onChange={() => toggleSelect(post.id)}
                      />
                    )}
                    <Link to={`/board/${post.id}`} className={`board-item${softDeleted ? ' board-item-deleted' : ''}`} style={{ flex: 1 }}>
                      <div className="board-item-main">
                        <div className="board-item-title-row">
                          <span className="board-item-title">{post.title}</span>
                          {hasImages && <span className="board-item-img-icon" title="Image">📷</span>}
                          {commentCount > 0 && <span className="board-item-comment-count">[{commentCount}]</span>}
                        </div>
                        {post.quiz_id != null && (
                          <span className="board-quiz-badge">Quiz #{post.quiz_id}</span>
                        )}
                      </div>
                      <div className="board-item-meta">
                        <span className="board-item-author">{post.profiles?.nickname || 'Anonymous'}</span>
                        <span className="board-item-date">{formatDate(post.created_at)}</span>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="board-pagination">
              <button
                className="board-page-btn"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                &laquo;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`board-page-btn ${page === i ? 'active' : ''}`}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="board-page-btn"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                &raquo;
              </button>
            </div>
          )}
        </div>

        <Link to="/board/write" className="board-fab" aria-label="Write post">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </Link>
      </main>
      <Footer />
    </div>
  )
}
