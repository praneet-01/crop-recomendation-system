import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { predictAPI, getHistoryAPI } from '../api/prediction'
import Navbar from '../components/layout/Navbar'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import Toast from '../components/ui/Toast'
import styles from './Dashboard.module.css'

const FIELDS = [
  { name: 'nitrogen',    label: 'Nitrogen (N)',    placeholder: 'e.g. 90',   hint: 'mg/kg' },
  { name: 'phosphorus',  label: 'Phosphorus (P)',  placeholder: 'e.g. 42',   hint: 'mg/kg' },
  { name: 'potassium',   label: 'Potassium (K)',   placeholder: 'e.g. 43',   hint: 'mg/kg' },
  { name: 'temperature', label: 'Temperature',     placeholder: 'e.g. 20.8', hint: '°C' },
  { name: 'humidity',    label: 'Humidity',        placeholder: 'e.g. 82',   hint: '% (0–100)' },
  { name: 'ph',          label: 'pH Value',        placeholder: 'e.g. 6.5',  hint: '0–14' },
  { name: 'rainfall',    label: 'Rainfall',        placeholder: 'e.g. 202',  hint: 'mm/year' },
]

const EMPTY_FORM = { nitrogen: '', phosphorus: '', potassium: '', temperature: '', humidity: '', ph: '', rainfall: '' }

export default function Dashboard() {
  const { user } = useAuth()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    getHistoryAPI().then(({ data }) => {
      setRecent(data.slice(0, 3))
      setTotalCount(data.length)
    }).catch(() => {})
  }, [])

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setResult(null)
    setLoading(true)
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, parseFloat(v)]))
      const { data } = await predictAPI(payload)
      setResult(data)
      setRecent(prev => [{ predicted_crop: data.crop, created_at: new Date().toISOString(), ...payload }, ...prev].slice(0, 3))
      setTotalCount(c => c + 1)
      setToast({ message: `Recommended crop: ${data.crop_display || data.crop}`, type: 'success' })
    } catch (err) {
      const data = err.response?.data
      if (err.response?.status === 400 && typeof data === 'object') {
        setErrors(data)
      } else {
        setToast({ message: data?.detail || 'Prediction failed. Please try again.', type: 'error' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className={`container ${styles.main}`}>
        <div className={styles.pageHeader}>
          <div>
            <h1>Crop Prediction</h1>
            <p>Enter your soil and climate data to get an AI-powered recommendation.</p>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.statBadge}>
              <strong>{totalCount}</strong>
              <span>Total Predictions</span>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Form */}
          <Card className={styles.formCard}>
            <h2 className={styles.cardTitle}>🧪 Soil & Climate Parameters</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGrid}>
                {FIELDS.map(f => (
                  <Input
                    key={f.name}
                    label={f.label}
                    name={f.name}
                    type="number"
                    step="any"
                    value={form[f.name]}
                    onChange={handleChange}
                    error={errors[f.name]}
                    placeholder={f.placeholder}
                    hint={f.hint}
                    required
                  />
                ))}
              </div>
              <Button type="submit" loading={loading} size="lg" className={styles.submitBtn}>
                {loading ? 'Analysing...' : '🔍 Get Recommendation'}
              </Button>
            </form>
          </Card>

          {/* Result + Recent */}
          <div className={styles.rightCol}>
            {/* Result card */}
            {result ? (
              <Card className={styles.resultCard}>
                <p className={styles.resultLabel}>Recommended Crop</p>
                <div className={styles.resultEmoji}>{result.emoji}</div>
                <h2 className={styles.resultCrop}>{result.crop_display || result.crop}</h2>
                <p className={styles.resultDesc}>{result.description}</p>
                <div className={styles.resultBadge}>✓ AI Recommendation</div>
              </Card>
            ) : (
              <Card className={styles.emptyResult}>
                <div className={styles.emptyIcon}>🌱</div>
                <p>Your crop recommendation will appear here after you submit the form.</p>
              </Card>
            )}

            {/* Recent predictions */}
            <Card>
              <div className={styles.recentHeader}>
                <h3>Recent Predictions</h3>
                <Link to="/history">View all →</Link>
              </div>
              {recent.length === 0 ? (
                <p className={styles.emptyText}>No predictions yet.</p>
              ) : (
                <div className={styles.recentList}>
                  {recent.map((p, i) => (
                    <div key={i} className={styles.recentItem}>
                      <span className={styles.recentCrop}>🌾 {p.predicted_crop}</span>
                      <span className={styles.recentDate}>
                        {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
