import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span>🌿</span>
          <span className={styles.name}>AgriTech</span>
          <p>AI-powered crop recommendations for smarter farming.</p>
        </div>
        <div className={styles.links}>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
        </div>
        <p className={styles.copy}>© {new Date().getFullYear()} AgriTech. All rights reserved.</p>
      </div>
    </footer>
  )
}
