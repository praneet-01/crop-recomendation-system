import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getProfileAPI, updateProfileAPI, changePasswordAPI } from '../api/profile'
import Navbar from '../components/layout/Navbar'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Toast from '../components/ui/Toast'
import Spinner from '../components/ui/Spinner'
import styles from './Profile.module.css'

export default function Profile() {
  const { updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [profileForm, setProfileForm] = useState({})
  const [profileErrors, setProfileErrors] = useState({})
  const [profileLoading, setProfileLoading] = useState(false)

  const [pwForm, setPwForm] = useState({ old_password: '', new_password1: '', new_password2: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [pwLoading, setPwLoading] = useState(false)

  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfileAPI().then(({ data }) => {
      setProfile(data)
      setProfileForm({ first_name: data.first_name, last_name: data.last_name, phone: data.phone || '', location: data.location || '' })
    }).finally(() => setLoading(false))
  }, [])

  const handleProfileChange = (e) => {
    setProfileForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setProfileErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      const { data } = await updateProfileAPI(profileForm)
      setProfile(data)
      updateUser({ first_name: data.first_name, last_name: data.last_name })
      setToast({ message: 'Profile updated successfully.', type: 'success' })
    } catch (err) {
      setProfileErrors(err.response?.data || {})
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePwChange = (e) => {
    setPwForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setPwErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  const handlePwSubmit = async (e) => {
    e.preventDefault()
    if (pwForm.new_password1 !== pwForm.new_password2) {
      setPwErrors({ new_password2: 'Passwords do not match.' })
      return
    }
    setPwLoading(true)
    try {
      await changePasswordAPI(pwForm)
      setPwForm({ old_password: '', new_password1: '', new_password2: '' })
      setToast({ message: 'Password changed successfully.', type: 'success' })
    } catch (err) {
      setPwErrors(err.response?.data || {})
    } finally {
      setPwLoading(false)
    }
  }

  if (loading) return <div className={styles.page}><Navbar /><Spinner center /></div>

  return (
    <div className={styles.page}>
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className={`container ${styles.main}`}>
        <div className={styles.header}>
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </div>

        <div className={styles.grid}>
          {/* Profile info */}
          <Card>
            <h2 className={styles.sectionTitle}>👤 Personal Information</h2>
            <div className={styles.readOnly}>
              <div className={styles.field}><span>Username</span><strong>{profile?.username}</strong></div>
              <div className={styles.field}><span>Email</span><strong>{profile?.email}</strong></div>
            </div>
            <form onSubmit={handleProfileSubmit} className={styles.form}>
              <div className={styles.row}>
                <Input label="First Name" name="first_name" value={profileForm.first_name || ''} onChange={handleProfileChange} error={profileErrors.first_name} />
                <Input label="Last Name" name="last_name" value={profileForm.last_name || ''} onChange={handleProfileChange} error={profileErrors.last_name} />
              </div>
              <Input label="Phone" name="phone" value={profileForm.phone || ''} onChange={handleProfileChange} error={profileErrors.phone} placeholder="+91-9876543210" />
              <Input label="Location" name="location" value={profileForm.location || ''} onChange={handleProfileChange} error={profileErrors.location} placeholder="Punjab, India" />
              <Button type="submit" loading={profileLoading}>Save Changes</Button>
            </form>
          </Card>

          {/* Change password */}
          <Card>
            <h2 className={styles.sectionTitle}>🔒 Change Password</h2>
            <form onSubmit={handlePwSubmit} className={styles.form}>
              <Input label="Current Password" name="old_password" type="password" value={pwForm.old_password} onChange={handlePwChange} error={pwErrors.old_password} required />
              <Input label="New Password" name="new_password1" type="password" value={pwForm.new_password1} onChange={handlePwChange} error={pwErrors.new_password1} required hint="Minimum 8 characters" />
              <Input label="Confirm New Password" name="new_password2" type="password" value={pwForm.new_password2} onChange={handlePwChange} error={pwErrors.new_password2} required />
              <Button type="submit" loading={pwLoading} variant="secondary">Update Password</Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
