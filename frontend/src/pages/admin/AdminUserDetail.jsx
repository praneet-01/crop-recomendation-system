import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAdminUserDetailAPI } from '../../api/admin'
import Navbar from '../../components/layout/Navbar'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'
import styles from './AdminUserDetail.module.css'

export default function AdminUserDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminUserDetailAPI(id).then(({ data }) => setData(data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className={styles.page}><Navbar /><Spinner center /></div>
  if (!data) return <div className={styles.page}><Navbar /><p className={styles.notFound}>User not found.</p></div>

  const { user, predictions } = data

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={`container ${styles.main}`}>
        <div className={styles.header}>
          <Link to="/admin" className={styles.back}>← Back to Dashboard</Link>
          <h1>@{user.username}</h1>
          <p>{user.email}</p>
        </div>

        <div className={styles.grid}>
          <Card>
            <h2 className={styles.sectionTitle}>User Profile</h2>
            <div className={styles.profileFields}>
              <div className={styles.field}><span>Username</span><strong>{user.username}</strong></div>
              <div className={styles.field}><span>Email</span><strong>{user.email}</strong></div>
              <div className={styles.field}><span>First Name</span><strong>{user.first_name || '—'}</strong></div>
              <div className={styles.field}><span>Last Name</span><strong>{user.last_name || '—'}</strong></div>
              <div className={styles.field}><span>Phone</span><strong>{user.phone || '—'}</strong></div>
              <div className={styles.field}><span>Location</span><strong>{user.location || '—'}</strong></div>
              <div className={styles.field}><span>Total Predictions</span><strong className={styles.count}>{predictions.length}</strong></div>
            </div>
          </Card>

          <Card padding="none">
            <div className={styles.tableHeader}>
              <h2 className={styles.sectionTitle}>Prediction History</h2>
            </div>
            <div className={styles.tableWrap}>
              {predictions.length === 0 ? (
                <p className={styles.empty}>No predictions yet.</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr><th>Crop</th><th>N</th><th>P</th><th>K</th><th>Temp</th><th>pH</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {predictions.map(p => (
                      <tr key={p.id}>
                        <td className={styles.cropCell}>🌾 {p.predicted_crop}</td>
                        <td>{p.nitrogen}</td><td>{p.phosphorus}</td><td>{p.potassium}</td>
                        <td>{p.temperature}</td><td>{p.ph}</td>
                        <td>{new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
