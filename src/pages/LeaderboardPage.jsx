import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'

const CATEGORIES = ['ALL', 'TOPIK', 'FOOD', 'CULTURE']
const CAT_COLORS = { TOPIK: '#6c63ff', FOOD: '#f97316', CULTURE: '#10b981' }
const MEDAL = ['🥇', '🥈', '🥉']

function streakBadge(streak) {
  if (streak >= 30) return { icon: '🏆', label: `${streak}d` }
  if (streak >= 7)  return { icon: '🔥', label: `${streak}d` }
  if (streak >= 3)  return { icon: '🔥', label: `${streak}d` }
  return null
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('ALL')
  const [rows, setRows] = useState([])
  const [myRank, setMyRank] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchLeaderboard(tab)
  }, [tab])

  async function fetchLeaderboard(category) {
    // 1. Fetch all quiz_results
    const { data: results, error: rErr } = await supabase
      .from('quiz_results')
      .select('user_id, score, total, percentage, categories')

    if (rErr) {
      console.error('Leaderboard fetch error:', rErr)
      setLoading(false)
      return
    }

    // 2. Filter by category
    const filtered = category === 'ALL'
      ? results
      : results.filter(r => Array.isArray(r.categories) && r.categories.includes(category))

    // 3. Aggregate per user
    const map = {}
    for (const r of filtered) {
      const uid = r.user_id
      if (!map[uid]) {
        map[uid] = {
          user_id: uid,
          weighted_score: 0,
          total_correct: 0,
          total_questions: 0,
          sessions: 0,
        }
      }
      const pct = (r.percentage ?? 0) / 100
      map[uid].weighted_score += r.score * pct
      map[uid].total_correct += r.score
      map[uid].total_questions += r.total
      map[uid].sessions += 1
    }

    const ranked = Object.values(map)
      .sort((a, b) => b.weighted_score - a.weighted_score)
      .slice(0, 20)

    if (ranked.length === 0) {
      setRows([])
      setMyRank(null)
      setLoading(false)
      return
    }

    // 4. Fetch profiles for top 20 users
    const uids = ranked.map(r => r.user_id)
    const [{ data: profiles }, { data: streaks }] = await Promise.all([
      supabase.from('profiles').select('id, nickname, avatar_url').in('id', uids),
      supabase.from('user_streaks').select('user_id, current_streak, longest_streak').in('user_id', uids),
    ])

    const profileMap = {}
    for (const p of profiles ?? []) profileMap[p.id] = p

    const streakMap = {}
    for (const s of streaks ?? []) streakMap[s.user_id] = s

    const enriched = ranked.map(r => ({
      ...r,
      display_name: profileMap[r.user_id]?.nickname || 'Anonymous',
      avatar_url: profileMap[r.user_id]?.avatar_url || null,
      current_streak: streakMap[r.user_id]?.current_streak ?? 0,
      longest_streak: streakMap[r.user_id]?.longest_streak ?? 0,
    }))

    setRows(enriched)

    if (user) {
      const idx = enriched.findIndex(r => r.user_id === user.id)
      setMyRank(idx >= 0 ? idx + 1 : null)
    }

    setLoading(false)
  }

  return (
    <div className="app">
      <div className="subpage-container">
        <div className="lb-header">
          <Link to="/" className="back-btn">← Back</Link>
          <h1 className="lb-title">🏆 Leaderboard</h1>
          <p className="lb-subtitle">Ranked by weighted score (correct answers × accuracy)</p>
        </div>

        {/* Category tabs */}
        <div className="lb-tabs">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`lb-tab${tab === c ? ' active' : ''}`}
              onClick={() => setTab(c)}
              style={tab === c && c !== 'ALL' ? { borderColor: CAT_COLORS[c], color: CAT_COLORS[c], background: `${CAT_COLORS[c]}18` } : {}}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="lb-loading">
            <div className="loading-spinner" />
          </div>
        ) : rows.length === 0 ? (
          <div className="lb-empty">
            <p>No data yet. Be the first to take the quiz!</p>
            <Link to="/quiz" className="lb-cta-btn">Start Quiz</Link>
          </div>
        ) : (
          <div className="lb-list">
            {rows.map((row, i) => {
              const isMe = user && row.user_id === user.id
              const badge = streakBadge(row.current_streak)
              const accuracy = row.total_questions > 0
                ? Math.round((row.total_correct / row.total_questions) * 100)
                : 0

              return (
                <div key={row.user_id} className={`lb-row${isMe ? ' lb-row-me' : ''}`}>
                  <span className="lb-rank">
                    {i < 3 ? MEDAL[i] : <span className="lb-rank-num">{i + 1}</span>}
                  </span>

                  <div className="lb-avatar">
                    {row.avatar_url
                      ? <img src={row.avatar_url} alt="" />
                      : <span className="lb-avatar-fallback">{(row.display_name || '?')[0].toUpperCase()}</span>
                    }
                  </div>

                  <div className="lb-info">
                    <div className="lb-name">
                      {row.display_name}
                      {badge && (
                        <span className="lb-streak-badge" title={`${row.current_streak} day streak`}>
                          {badge.icon} {badge.label}
                        </span>
                      )}
                      {isMe && <span className="lb-you">You</span>}
                    </div>
                    <div className="lb-meta">
                      {row.sessions} {row.sessions === 1 ? 'session' : 'sessions'} · {accuracy}% accuracy
                    </div>
                  </div>

                  <div className="lb-score">
                    <span className="lb-score-num">{Math.round(row.weighted_score)}</span>
                    <span className="lb-score-label">pts</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {user && myRank && myRank > 20 && (
          <div className="lb-myrank-note">
            Your rank: #{myRank} — Keep quizzing to climb the board!
          </div>
        )}

        {!user && (
          <div className="lb-login-note">
            <Link to="/login">Log in</Link> to save your results and appear on the leaderboard.
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
