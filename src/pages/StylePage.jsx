import { useState, useRef } from 'react'
import { PolarEmbedCheckout } from '@polar-sh/checkout/embed'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const API_URL = '/api/analyze'
const CHECKOUT_URL = '/api/checkout'

const BODY_TYPES = [
  { value: 'muscular', en: 'Muscular', ko: '근육형' },
  { value: 'slim', en: 'Slim', ko: '마른 체형' },
  { value: 'average', en: 'Average', ko: '보통' },
  { value: 'chubby', en: 'Plus-size', ko: '통통한 체형' },
]

const COUNTRIES = [
  { code: 'KR', en: 'South Korea', ko: '대한민국' },
  { code: 'US', en: 'United States', ko: '미국' },
  { code: 'JP', en: 'Japan', ko: '일본' },
  { code: 'CN', en: 'China', ko: '중국' },
  { code: 'TW', en: 'Taiwan', ko: '대만' },
  { code: 'HK', en: 'Hong Kong', ko: '홍콩' },
  { code: 'GB', en: 'United Kingdom', ko: '영국' },
  { code: 'FR', en: 'France', ko: '프랑스' },
  { code: 'DE', en: 'Germany', ko: '독일' },
  { code: 'IT', en: 'Italy', ko: '이탈리아' },
  { code: 'ES', en: 'Spain', ko: '스페인' },
  { code: 'NL', en: 'Netherlands', ko: '네덜란드' },
  { code: 'SE', en: 'Sweden', ko: '스웨덴' },
  { code: 'CH', en: 'Switzerland', ko: '스위스' },
  { code: 'PT', en: 'Portugal', ko: '포르투갈' },
  { code: 'GR', en: 'Greece', ko: '그리스' },
  { code: 'TR', en: 'Turkey', ko: '터키' },
  { code: 'RU', en: 'Russia', ko: '러시아' },
  { code: 'AU', en: 'Australia', ko: '호주' },
  { code: 'NZ', en: 'New Zealand', ko: '뉴질랜드' },
  { code: 'CA', en: 'Canada', ko: '캐나다' },
  { code: 'TH', en: 'Thailand', ko: '태국' },
  { code: 'VN', en: 'Vietnam', ko: '베트남' },
  { code: 'PH', en: 'Philippines', ko: '필리핀' },
  { code: 'SG', en: 'Singapore', ko: '싱가포르' },
  { code: 'MY', en: 'Malaysia', ko: '말레이시아' },
  { code: 'ID', en: 'Indonesia', ko: '인도네시아' },
  { code: 'MM', en: 'Myanmar', ko: '미얀마' },
  { code: 'KH', en: 'Cambodia', ko: '캄보디아' },
  { code: 'IN', en: 'India', ko: '인도' },
  { code: 'PK', en: 'Pakistan', ko: '파키스탄' },
  { code: 'BD', en: 'Bangladesh', ko: '방글라데시' },
  { code: 'NP', en: 'Nepal', ko: '네팔' },
  { code: 'LK', en: 'Sri Lanka', ko: '스리랑카' },
  { code: 'BR', en: 'Brazil', ko: '브라질' },
  { code: 'MX', en: 'Mexico', ko: '멕시코' },
  { code: 'AR', en: 'Argentina', ko: '아르헨티나' },
  { code: 'CO', en: 'Colombia', ko: '콜롬비아' },
  { code: 'PE', en: 'Peru', ko: '페루' },
  { code: 'CL', en: 'Chile', ko: '칠레' },
  { code: 'AE', en: 'UAE', ko: 'UAE' },
  { code: 'SA', en: 'Saudi Arabia', ko: '사우디아라비아' },
  { code: 'EG', en: 'Egypt', ko: '이집트' },
  { code: 'NG', en: 'Nigeria', ko: '나이지리아' },
  { code: 'ZA', en: 'South Africa', ko: '남아프리카' },
  { code: 'KE', en: 'Kenya', ko: '케냐' },
  { code: 'MN', en: 'Mongolia', ko: '몽골' },
  { code: 'UZ', en: 'Uzbekistan', ko: '우즈베키스탄' },
]

const STYLE_LABELS = {
  casual: { en: 'Casual', ko: '캐주얼', emoji: '👕' },
  rainy: { en: 'Rainy Day', ko: '비 오는 날', emoji: '🌧️' },
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve({ data: base64, mimeType: file.type })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function StylePage() {
  const { lang } = useApp()
  const t = (en, ko) => lang === 'en' ? en : ko

  const [form, setForm] = useState({
    photo: null,
    height: '',
    weight: '',
    gender: 'male',
    country: 'KR',
    bodyType: 'average',
  })
  const [photoPreview, setPhotoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const formRef = useRef(null)

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError(t('Photo must be under 5MB', '사진은 5MB 이하여야 합니다'))
      return
    }
    setForm(prev => ({ ...prev, photo: file }))
    setPhotoPreview(URL.createObjectURL(file))
    setError(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const runAnalysis = async (checkoutId) => {
    setLoading(true)
    setResult(null)

    try {
      const converted = await fileToBase64(form.photo)
      const photoData = converted.data
      const photoMimeType = converted.mimeType

      const selectedCountry = COUNTRIES.find(c => c.code === form.country)
      const countryName = selectedCountry?.en || form.country

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photo: photoData,
          photoMimeType,
          height: Number(form.height),
          weight: Number(form.weight),
          gender: form.gender,
          country: countryName,
          bodyType: form.bodyType,
          checkoutId,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const refundMsg = err.refunded
          ? t(' (payment has been refunded)', ' (결제가 환불되었습니다)')
          : ''
        throw new Error((err.error || `Server error: ${res.status}`) + refundMsg)
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.photo) {
      setError(t('Please upload your photo', '사진을 업로드해주세요'))
      return
    }
    if (!formRef.current?.reportValidity()) return
    setError(null)
    setCheckoutLoading(true)

    try {
      const res = await fetch(CHECKOUT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Checkout error: ${res.status}`)
      }

      const { url, checkoutId } = await res.json()
      setCheckoutLoading(false)

      PolarEmbedCheckout.create(url, {
        theme: 'dark',
        onSuccess: () => {
          runAnalysis(checkoutId)
        },
      })
    } catch (err) {
      setError(err.message)
      setCheckoutLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="home-page">
      <Navbar />

      <main className="page-content">
        <h1 className="page-title">
          {t('AI Style Consultant', 'AI 스타일 컨설턴트')}
        </h1>
        <p className="style-subtitle">
          {t(
            'Get personalized outfit & hairstyle recommendations based on your body type and local weather',
            '체형과 현지 날씨를 기반으로 맞춤 스타일과 헤어스타일을 추천받으세요'
          )}
        </p>

        {!result ? (
          <form className="style-form" ref={formRef} onSubmit={handleSubmit}>
            {/* Photo Upload */}
            <div className="style-form-group style-photo-group">
              <label>{t('Your Photo', '사진')} *</label>
              <div className="style-photo-upload">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="style-photo-preview" />
                ) : (
                  <div className="style-photo-placeholder">
                    <span>📷</span>
                    <span>{t('Upload photo', '사진 업로드')}</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="style-file-input"
                />
              </div>
            </div>

            {/* Body Info */}
            <div className="style-form-row">
              <div className="style-form-group">
                <label>{t('Height (cm)', '키 (cm)')}</label>
                <input
                  type="number"
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  placeholder={t('e.g. 170', '예: 170')}
                  min="100"
                  max="250"
                  required
                />
              </div>
              <div className="style-form-group">
                <label>{t('Weight (kg)', '몸무게 (kg)')}</label>
                <input
                  type="number"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder={t('e.g. 65', '예: 65')}
                  min="30"
                  max="200"
                  required
                />
              </div>
            </div>

            <div className="style-form-row">
              <div className="style-form-group">
                <label>{t('Gender', '성별')}</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="male">{t('Male', '남성')}</option>
                  <option value="female">{t('Female', '여성')}</option>
                </select>
              </div>
              <div className="style-form-group">
                <label>{t('Body Type', '체형')}</label>
                <select name="bodyType" value={form.bodyType} onChange={handleChange}>
                  {BODY_TYPES.map(bt => (
                    <option key={bt.value} value={bt.value}>
                      {lang === 'en' ? bt.en : bt.ko}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Country */}
            <div className="style-form-group">
              <label>{t('Country', '국가')}</label>
              <select name="country" value={form.country} onChange={handleChange}>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {lang === 'en' ? c.en : c.ko}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="style-error">{error}</p>}

            <button
              type="submit"
              className="style-submit-btn"
              disabled={loading || checkoutLoading}
            >
              {loading ? (
                <>
                  <span className="style-spinner" />
                  {t('Analyzing your style...', 'AI가 스타일을 분석 중...')}
                </>
              ) : checkoutLoading ? (
                <>
                  <span className="style-spinner" />
                  {t('Opening checkout...', '결제 페이지 여는 중...')}
                </>
              ) : (
                t('Analyze My Style', '스타일 분석하기')
              )}
            </button>
          </form>
        ) : (
          <div className="style-results">
            {/* Location & Climate Card */}
            {result.location && (
              <div className="style-weather-card">
                <span className="style-location-icon">📍</span>
                <div>
                  <strong>{result.location.country}</strong>
                  {result.location.climate && (
                    <span>{result.location.climate}</span>
                  )}
                </div>
              </div>
            )}

            {/* Outfit Style Cards */}
            <h2 className="style-section-title">Outfit Recommendations</h2>
            <div className="style-cards">
              {['casual', 'rainy'].map((style) => {
                const info = result.report?.[style]
                const image = result.images?.[style]
                const label = STYLE_LABELS[style]
                return (
                  <div key={style} className="style-card">
                    <div className="style-card-header">
                      <span className="style-card-emoji">{label.emoji}</span>
                      <span className="style-card-label">{label.en}</span>
                    </div>
                    {image && (
                      <img
                        src={`data:${image.mimeType};base64,${image.data}`}
                        alt={info?.title || style}
                        className="style-card-image"
                      />
                    )}
                    <h3 className="style-card-title">{info?.title}</h3>
                    <p className="style-card-desc">{info?.description}</p>
                    {info?.tip && (
                      <p className="style-card-tip">
                        💡 <strong>Tip:</strong> {info.tip}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Korean Hairstyle Grid */}
            {result.hairstyle && (
              <div className="style-hairstyle-section">
                <h2 className="style-section-title">Trending Korean Hairstyles</h2>
                <p className="style-hairstyle-subtitle">
                  9 popular Korean hairstyles applied to your photo
                </p>
                <div className="style-hairstyle-grid-wrapper">
                  <img
                    src={`data:${result.hairstyle.mimeType};base64,${result.hairstyle.data}`}
                    alt="Korean hairstyle recommendations in 3x3 grid"
                    className="style-hairstyle-grid"
                  />
                </div>
              </div>
            )}

            <button className="style-submit-btn" onClick={handleReset}>
              {t('Try Again', '다시 분석하기')}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
