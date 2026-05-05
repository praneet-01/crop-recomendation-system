import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import cropRows from '../assets/crop-rows.jpg'
import styles from './About.module.css'

const STACK = [
  { icon: '⚛️', name: 'React 18', desc: 'Modern UI library' },
  { icon: '⚡', name: 'Vite', desc: 'Lightning-fast build tool' },
  { icon: '🐍', name: 'Django', desc: 'Python web framework' },
  { icon: '🔌', name: 'Django REST Framework', desc: 'REST API layer' },
  { icon: '🔐', name: 'JWT Auth', desc: 'Secure token authentication' },
  { icon: '🤖', name: 'scikit-learn', desc: 'Machine learning library' },
  { icon: '🌲', name: 'Random Forest', desc: 'ML prediction model' },
  { icon: '🗄️', name: 'SQLite', desc: 'Lightweight database' },
]

export default function About() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>About AgriTech</p>
            <h1>Smarter Farming Through AI</h1>
            <p className={styles.sub}>
              AgriTech uses a trained Random Forest machine learning model to analyse soil and climate parameters and recommend the most suitable crop for your land — helping farmers make data-driven decisions.
            </p>
          </div>
        </section>

        <section className={styles.mission}>
          <div className={`container ${styles.missionGrid}`}>
            <div>
              <h2>Our Mission</h2>
              <p>We believe every farmer deserves access to cutting-edge agricultural intelligence. By combining soil science with machine learning, AgriTech bridges the gap between data and actionable farming decisions.</p>
              <p>Our model is trained on thousands of crop-soil-climate data points, achieving over 95% accuracy across 22 different crop types.</p>
            </div>
            <div className={styles.missionImageWrap}>
              <img src={cropRows} alt="Crop rows in a farm" className={styles.missionImage} />
              <div className={styles.missionStats}>
                <div className={styles.missionStat}><strong>22</strong><span>Crop Types</span></div>
                <div className={styles.missionStat}><strong>7</strong><span>Parameters</span></div>
                <div className={styles.missionStat}><strong>95%+</strong><span>Accuracy</span></div>
                <div className={styles.missionStat}><strong>Free</strong><span>To Use</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.techStack}>
          <div className="container">
            <h2>Technology Stack</h2>
            <p className={styles.stackSub}>Built with modern, production-grade technologies.</p>
            <div className={styles.stackGrid}>
              {STACK.map(t => (
                <div key={t.name} className={styles.stackCard}>
                  <span className={styles.stackIcon}>{t.icon}</span>
                  <strong>{t.name}</strong>
                  <span>{t.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
