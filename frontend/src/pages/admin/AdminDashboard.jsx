import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAdminStatsAPI, getAdminUsersAPI, getAdminPredictionsAPI } from '../../api/admin'
import Navbar from '../../components/layout/Navbar'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getAdminStatsAPI(), getAdminUsersAPI(), getAdminPredictionsAPI()])
      .then(([s, u, p]) => {
        setStats(s.data)
        setUsers(u.data)
        setPredictions(p.data.slice(0, 10))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className={styles.page}><Navbar /><Spinner center /></div>

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={`container ${styles.main}`}>
        <div className={styles.header}>
          <h1>Admin Dashboard</h1>
          <p>Platform overview and user management</p>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <Card className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statValue}>{stats?.total_users ?? 0}</div>
            <div className={styles.statLabel}>Total Users</div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statIcon}>🔍</div>
            <div className={styles.statValue}>{stats?.total_predictions ?? 0}</div>
            <div className={styles.statLabel}>Total Predictions</div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statValue}>{stats?.predictions_last_7_days ?? 0}</div>
            <div className={styles.statLabel}>Last 7 Days</div>
          </Card>
          <Card className={styles.statCard}>
            <div className={styles.statIcon}>🌾</div>
            <div className={styles.statValue}>{stats?.top_crops?.[0]?.crop ?? '—'}</div>
            <div className={styles.statLabel}>Top Crop</div>
          </Card>
        </div>

        <div className={styles.grid}>
          {/* Top crops */}
          <Card>
            <h2 className={styles.sectionTitle}>Top Predicted Crops</h2>
            <div className={styles.cropList}>
              {stats?.top_crops?.map((c, i) => (
                <div key={c.crop} className={styles.cropRow}>
                  <span className={styles.cropRank}>#{i + 1}</span>
                  <span className={styles.cropName}>🌾 {c.crop}</span>
                  <div className={styles.cropBar}>
                    <div
                      className={styles.cropBarFill}
                      style={{ width: `${Math.min(100, (c.count / (stats.top_crops[0]?.count || 1)) * 100)}%` }}
                    />
                  </div>
                  <span className={styles.cropCount}>{c.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent predictions */}
          <Card>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Predictions</h2>
              <Link to="/admin/predictions" className={styles.viewAll}>View all →</Link>
            </div>
            <div className={styles.miniTable}>
              {predictions.map(p => (
                <div key={p.id} className={styles.miniRow}>
                  <span className={styles.miniUser}>@{p.username}</span>
                  <span className={styles.miniCrop}>🌾 {p.predicted_crop}</span>
                  <span className={styles.miniDate}>{new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Users table */}
        <Card padding="none" className={styles.usersCard}>
          <div className={styles.usersHeader}>
            <h2 className={styles.sectionTitle}>All Users</h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Username</th><th>Email</th><th>Name</th><th>Joined</th><th>Predictions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className={styles.clickRow} onClick={() => navigate(`/admin/users/${u.id}`)}>
                    <td>@{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.first_name} {u.last_name}</td>
                    <td>{new Date(u.date_joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td><span className={styles.badge}>{u.prediction_count}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  )
}
