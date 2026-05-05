import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAdminPredictionsAPI } from '../../api/admin'
import Navbar from '../../components/layout/Navbar'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'
import styles from './AdminPredictions.module.css'

export default function AdminPredictions() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminPredictionsAPI().then(({ data }) => setPredictions(data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={`container ${styles.main}`}>
        <div className={styles.header}>
          <div>
            <h1>All Predictions</h1>
            <p>{predictions.length} total predictions across all users</p>
          </div>
          <Link to="/admin" className={styles.backBtn}>← Back to Dashboard</Link>
        </div>

        {loading ? <Spinner center /> : (
          <Card padding="none">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>User</th><th>Crop</th><th>N</th><th>P</th><th>K</th>
                    <th>Temp</th><th>Humidity</th><th>pH</th><th>Rainfall</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map(p => (
                    <tr key={p.id}>
                      <td className={styles.userCell}>@{p.username}</td>
                      <td className={styles.cropCell}>🌾 {p.predicted_crop}</td>
                      <td>{p.nitrogen}</td><td>{p.phosphorus}</td><td>{p.potassium}</td>
                      <td>{p.temperature}</td><td>{p.humidity}</td><td>{p.ph}</td><td>{p.rainfall}</td>
                      <td className={styles.dateCell}>{new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
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
