/* CropSense — Main JavaScript */

document.addEventListener('DOMContentLoaded', function () {

  // ── Auto-dismiss alerts after 4s ──────────────────────────────
  const alerts = document.querySelectorAll('.cs-alert');
  alerts.forEach(function (alert) {
    setTimeout(function () {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
      bsAlert.close();
    }, 4000);
  });

  // ── Scroll-triggered animations ───────────────────────────────
  const animObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('animate-in');
        animObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.step-card, .param-badge').forEach(function (el) {
    animObserver.observe(el);
  });

  // ── Form: prevent double submit ───────────────────────────────
  const forms = document.querySelectorAll('form');
  forms.forEach(function (form) {
    form.addEventListener('submit', function () {
      const submitBtn = form.querySelector('[type=submit]');
      if (submitBtn && !form.dataset.submitted) {
        form.dataset.submitted = 'true';
        // Allow the prediction form to show its loading state (handled inline)
        // For other forms just disable
        if (form.id !== 'predictionForm') {
          setTimeout(function () { submitBtn.disabled = true; }, 10);
        }
      }
    });
  });

  // ── Input range hints (optional visual slider for ph) ─────────
  const phInput = document.querySelector('input[name="ph"]');
  if (phInput) {
    phInput.addEventListener('input', function () {
      const val = parseFloat(this.value);
      let hint = '';
      if (!isNaN(val)) {
        if (val < 5.5) hint = 'Acidic';
        else if (val <= 7) hint = 'Neutral–Slightly Acidic';
        else if (val <= 8) hint = 'Slightly Alkaline';
        else hint = 'Alkaline';
      }
      let hintEl = this.parentElement.querySelector('.ph-hint');
      if (!hintEl) {
        hintEl = document.createElement('small');
        hintEl.className = 'ph-hint';
        hintEl.style.cssText = 'color: var(--primary); font-weight: 600;';
        this.parentElement.querySelector('.form-hint')?.insertAdjacentElement('afterend', hintEl);
      }
      hintEl.textContent = hint;
    });
  }

  // ── Navbar active link highlight ──────────────────────────────
  const currentPath = window.location.pathname;
  document.querySelectorAll('.cs-navbar .nav-link').forEach(function (link) {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

});
