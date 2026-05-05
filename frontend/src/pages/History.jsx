import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getHistoryAPI } from '../api/prediction'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import styles from './History.module.css'

export default function History() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getHistoryAPI()
      .then(({ data }) => setPredictions(data))
      .catch(() => setError('Failed to load history.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={`container ${styles.main}`}>
        <div className={styles.header}>
          <div>
            <h1>Prediction History</h1>
            <p>All your past crop recommendations</p>
          </div>
          <Link to="/dashboard" className={styles.newBtn}>+ New Prediction</Link>
        </div>

        {loading && <Spinner center />}
        {error && <div className={styles.errorMsg}>{error}</div>}

        {!loading && !error && predictions.length === 0 && (
          <Card className={styles.empty}>
            <div className={styles.emptyIcon}>📋</div>
            <h3>No predictions yet</h3>
            <p>Make your first crop prediction to see it here.</p>
            <Link to="/dashboard" className={styles.emptyLink}>Go to Dashboard →</Link>
          </Card>
        )}

        {!loading && predictions.length > 0 && (
          <Card padding="none" className={styles.tableCard}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Crop</th>
                    <th>N</th><th>P</th><th>K</th>
                    <th>Temp (°C)</th><th>Humidity (%)</th>
                    <th>pH</th><th>Rainfall (mm)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map(p => (
                    <tr key={p.id}>
                      <td className={styles.cropCell}>
                        <span className={styles.cropName}>🌾 {p.predicted_crop}</span>
                      </td>
                      <td>{p.nitrogen}</td>
                      <td>{p.phosphorus}</td>
                      <td>{p.potassium}</td>
                      <td>{p.temperature}</td>
                      <td>{p.humidity}</td>
                      <td>{p.ph}</td>
                      <td>{p.rainfall}</td>
                      <td className={styles.dateCell}>
                        {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
