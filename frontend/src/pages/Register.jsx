import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import styles from './AuthPage.module.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '', password: '', confirm_password: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    if (form.password !== form.confirm_password) {
      setErrors({ confirm_password: 'Passwords do not match.' })
      return
    }
    setLoading(true)
    try {
      const user = await register(form)
      navigate(user.is_staff ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      const data = err.response?.data || {}
      if (typeof data === 'object') setErrors(data)
      else setErrors({ non_field: 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.card} ${styles.wide}`}>
        <Link to="/" className={styles.backLink}>← Back to Home</Link>
        <div className={styles.header}>
          <Link to="/" className={styles.brand}>🌿 AgriTech</Link>
          <h1>Create your account</h1>
          <p>Start getting AI-powered crop recommendations</p>
        </div>

        {errors.non_field && <div className={styles.errorBanner}>{errors.non_field}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <Input label="First Name" name="first_name" value={form.first_name} onChange={handleChange} error={errors.first_name} required placeholder="John" />
            <Input label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} error={errors.last_name} required placeholder="Doe" />
          </div>
          <Input label="Username" name="username" value={form.username} onChange={handleChange} error={errors.username} required placeholder="farmer_john" />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required placeholder="john@example.com" />
          <div className={styles.row}>
            <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} required placeholder="Min. 8 characters" />
            <Input label="Confirm Password" name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} error={errors.confirm_password} required placeholder="Repeat password" />
          </div>
          <Button type="submit" loading={loading} size="lg" className={styles.submitBtn}>Create Account</Button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
