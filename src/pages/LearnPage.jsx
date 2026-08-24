import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function LearnPage() {
  const { lang } = useApp()
  const [channels, setChannels] = useState([])
  const [activeChannel, setActiveChannel] = useState(0)
  const [activeVideo, setActiveVideo] = useState(0)
  const [currentVideoId, setCurrentVideoId] = useState('')
  const playerRef = useRef(null)

  useEffect(() => {
    fetch('/learnData.json')
      .then((res) => res.json())
      .then((data) => {
        const chs = data.channels || []
        setChannels(chs)
        if (chs.length > 0 && chs[0].videos?.length > 0) {
          setCurrentVideoId(chs[0].videos[0].id)
        }
      })
  }, [])

  const channel = channels[activeChannel]
  const video = channel?.videos?.[activeVideo]

  const handleChannelChange = (idx) => {
    setActiveChannel(idx)
    setActiveVideo(0)
    const newChannel = channels[idx]
    if (newChannel?.videos?.length > 0) {
      setCurrentVideoId(newChannel.videos[0].id)
    }
  }

  const handleVideoSelect = (idx) => {
    setActiveVideo(idx)
    const selectedVideo = channel?.videos?.[idx]
    if (selectedVideo) {
      setCurrentVideoId(selectedVideo.id)
    }
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Banner */}
      <header className="learn-hero">
        <div className="learn-hero-content">
          <img
            src="/images/char-learn.webp"
            alt="Learn Korean cat mascot"
            className="learn-hero-img"
            loading="lazy"
          />
          <div className="learn-hero-text">
            <span className="hero-label">LANGUAGE TRAINING</span>
            <h1 className="hero-title">
              {lang === 'en' ? (
                <>Learn Korean with<br />the Best Teachers!</>
              ) : (
                <>최고의 선생님과<br />한국어를 배우세요!</>
              )}
            </h1>
            <p className="hero-desc">
              {lang === 'en'
                ? 'Watch curated Korean lessons from top YouTube teachers. Start your learning journey here!'
                : '유튜브 최고의 한국어 선생님들의 엄선된 강의를 시청하세요. 여기서 학습 여정을 시작하세요!'}
            </p>
            <div className="learn-speech-bubble">
              {lang === 'en' ? "Let's learn Korean together! 🍜" : '같이 한국어 공부하자! 🍜'}
            </div>
          </div>
        </div>
      </header>

      {/* Channel Tabs */}
      {channels.length > 0 && (
        <section className="learn-channels">
          <div className="learn-channels-inner">
            <div className="section-header" style={{ textAlign: 'center' }}>
              <span className="section-tag">
                {lang === 'en' ? 'YOUTUBE CHANNELS' : '유튜브 채널'}
              </span>
              <h2 className="section-title">
                {lang === 'en' ? 'Choose a Channel' : '채널을 선택하세요'}
              </h2>
            </div>

            <div className="channel-tabs">
              {channels.map((ch, idx) => (
                <button
                  key={ch.id}
                  className={`channel-tab ${activeChannel === idx ? 'active' : ''}`}
                  onClick={() => handleChannelChange(idx)}
                >
                  <div className="channel-tab-thumb">{ch.name.charAt(0)}</div>
                  <div className="channel-tab-info">
                    <span className="channel-tab-name">{ch.name}</span>
                    <span className="channel-tab-handle">{ch.handle}</span>
                    <div className="channel-tab-levels">
                      {ch.level.map((lv) => (
                        <span key={lv} className="channel-level-badge">{lv}</span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Channel Description */}
            {channel && (
              <p className="channel-description">
                {channel.description[lang] || channel.description.en}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Video Player */}
      {currentVideoId && video && (
        <section className="learn-player-section" ref={playerRef}>
          <div className="learn-player-inner">
            <div className="video-player">
              <iframe
                key={currentVideoId}
                src={`https://www.youtube.com/embed/${currentVideoId}`}
                title={lang === 'ko' ? video.titleKo : video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h3 className="video-now-playing">
              {lang === 'ko' ? video.titleKo : video.title}
            </h3>
          </div>
        </section>
      )}

      {/* Video List */}
      {channel && (
        <section className="learn-video-list-section">
          <div className="learn-video-list-inner">
            <h3 className="video-list-title">
              {lang === 'en'
                ? `${channel.name} Videos`
                : `${channel.name} 영상 목록`}
            </h3>
            <div className="video-list">
              {channel.videos.map((v, idx) => (
                <button
                  key={`${channel.id}-${v.id}`}
                  className={`video-card ${activeVideo === idx ? 'active' : ''}`}
                  onClick={() => handleVideoSelect(idx)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                    alt={lang === 'ko' ? v.titleKo : v.title}
                    className="video-card-thumb"
                    loading="lazy"
                  />
                  <div className="video-card-info">
                    <span className="video-card-number">{idx + 1}</span>
                    <span className="video-card-title">
                      {lang === 'ko' ? v.titleKo : v.title}
                    </span>
                  </div>
                  {activeVideo === idx && (
                    <span className="video-card-playing">
                      {lang === 'en' ? 'Now Playing' : '재생 중'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
