import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import styles from './Contact.module.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (!form.message.trim()) e.message = 'Message is required.'
    return e
  }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitted(true)
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.header}>
            <p className={styles.eyebrow}>Contact Us</p>
            <h1>Get in Touch</h1>
            <p>Have questions or feedback? We'd love to hear from you.</p>
          </div>

          <div className={styles.grid}>
            <Card className={styles.formCard}>
              {submitted ? (
                <div className={styles.success}>
                  <div className={styles.successIcon}>✅</div>
                  <h3>Message Sent!</h3>
                  <p>Thanks for reaching out. We'll get back to you soon.</p>
                  <button className={styles.resetBtn} onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }) }}>Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <Input label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} required placeholder="John Doe" />
                  <Input label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required placeholder="john@example.com" />
                  <div className={styles.field}>
                    <label className={styles.label}>Message <span className={styles.req}>*</span></label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      rows={5}
                      className={`${styles.textarea} ${errors.message ? styles.hasError : ''}`}
                    />
                    {errors.message && <p className={styles.errMsg}>{errors.message}</p>}
                  </div>
                  <Button type="submit" size="lg" className={styles.submitBtn}>Send Message</Button>
                </form>
              )}
            </Card>

            <div className={styles.info}>
              <h3>Why AgriTech?</h3>
              <div className={styles.infoItems}>
                <div className={styles.infoItem}><span>🌱</span><div><strong>Free to Use</strong><p>No subscription required. Get crop recommendations instantly.</p></div></div>
                <div className={styles.infoItem}><span>🤖</span><div><strong>AI-Powered</strong><p>Random Forest model trained on thousands of data points.</p></div></div>
                <div className={styles.infoItem}><span>🔒</span><div><strong>Secure</strong><p>Your data is private and protected with JWT authentication.</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
