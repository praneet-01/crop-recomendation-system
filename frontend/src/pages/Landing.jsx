import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import farmField from '../assets/farm-field.jpg'
import harvest from '../assets/harvest.jpg'
import styles from './Landing.module.css'

const FEATURES = [
  { icon: '🌿', name: 'Nitrogen (N)', desc: 'Soil nitrogen content in mg/kg' },
  { icon: '🔴', name: 'Phosphorus (P)', desc: 'Phosphorus level for root development' },
  { icon: '🟡', name: 'Potassium (K)', desc: 'Potassium for plant strength' },
  { icon: '🌡️', name: 'Temperature', desc: 'Average temperature in °C' },
  { icon: '💧', name: 'Humidity', desc: 'Relative humidity percentage' },
  { icon: '🧪', name: 'pH Value', desc: 'Soil acidity/alkalinity (0–14)' },
  { icon: '🌧️', name: 'Rainfall', desc: 'Annual rainfall in mm' },
]

const STEPS = [
  { num: '01', title: 'Enter Soil Data', desc: 'Input your soil and climate parameters into the prediction form.' },
  { num: '02', title: 'AI Analysis', desc: 'Our Random Forest model analyses 22 crop types against your data.' },
  { num: '03', title: 'Get Recommendation', desc: 'Receive the best crop recommendation with detailed growing tips.' },
]

export default function Landing() {
  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero} style={{ backgroundImage: `url(${farmField})` }}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>🌱 Empowering Farmers with AI</p>
            <h1 className={styles.heroTitle}>
              AI-Powered<br />
              <span className={styles.highlight}>Agriculture</span><br />
              at Your Fingertips
            </h1>
            <p className={styles.heroSub}>
              Enter your soil and climate data to instantly discover the most suitable crop for your land — powered by machine learning.
            </p>
            <div className={styles.heroCta}>
              <Link to="/register" className={styles.ctaPrimary}>Get Started Free</Link>
              <Link to="/about" className={styles.ctaSecondary}>Learn More →</Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}><strong>22+</strong><span>Crop Types</span></div>
              <div className={styles.stat}><strong>7</strong><span>Parameters</span></div>
              <div className={styles.stat}><strong>95%+</strong><span>Accuracy</span></div>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardHeader}>🌾 Prediction Result</div>
              <div className={styles.heroCardCrop}>Rice</div>
              <div className={styles.heroCardDesc}>Staple food crop ideal for high humidity and warm climates.</div>
              <div className={styles.heroCardBadge}>✓ High Confidence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Parameters</p>
            <h2>What We Analyse</h2>
            <p className={styles.sectionSub}>Seven key soil and climate parameters power our AI recommendation engine.</p>
          </div>
          <div className={styles.featureGrid}>
            {FEATURES.map(f => (
              <div key={f.name} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <h3>{f.name}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howItWorks}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Process</p>
            <h2>How It Works</h2>
            <p className={styles.sectionSub}>Three simple steps to your personalised crop recommendation.</p>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map(s => (
              <div key={s.num} className={styles.step}>
                <div className={styles.stepNum}>{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner} style={{ backgroundImage: `url(${harvest})` }}>
        <div className={styles.ctaBannerOverlay} />
        <div className={`container ${styles.ctaBannerContent}`}>
          <h2>Ready to grow smarter?</h2>
          <p>Join thousands of farmers using AgriTech to make data-driven planting decisions.</p>
          <Link to="/register" className={styles.ctaPrimary}>Create Free Account</Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
