import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import styles from './AuthPage.module.css'


export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.username, form.password)
      // Redirect admin to admin panel, regular users to dashboard
      navigate(user.is_staff ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.header}>
          <Link to="/" className={styles.brand}>🌿 AgriTech</Link>
          <h1>Welcome back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        {error && <div className={styles.errorBanner} role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input label="Username" name="username" value={form.username} onChange={handleChange} required placeholder="Enter your username" />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Enter your password" />
          <Button type="submit" loading={loading} size="lg" className={styles.submitBtn}>Sign In</Button>
        </form>

        <p className={styles.footer}>
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>
      </div>
    </div>
  )
}
