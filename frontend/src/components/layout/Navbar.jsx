import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logo}>🌿</span>
          <span className={styles.brandName}>AgriTech</span>
        </Link>

        <button className={styles.hamburger} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>

        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          <NavLink to="/about" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>Contact</NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
              {user?.is_staff && (
                <NavLink to="/admin" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>Admin</NavLink>
              )}
              <div className={styles.userMenu}>
                <span className={styles.username}>👤 {user?.first_name || user?.username}</span>
                <div className={styles.dropdown}>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                  <Link to="/history" onClick={() => setMenuOpen(false)}>History</Link>
                  <button onClick={() => { logout(); setMenuOpen(false) }}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.loginBtn} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className={styles.registerBtn} onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
