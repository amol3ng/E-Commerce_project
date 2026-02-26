<template>
  <div class="page">
    <AppNavbar />

    <!-- ── HERO ── -->
    <section class="contact-hero">
      <div class="hero-bg">
        <div class="bg-petal bp-1"></div>
        <div class="bg-petal bp-2"></div>
        <div class="bg-lines"></div>
      </div>
      <div class="hero-inner">
        <span class="page-label">Get In Touch</span>
        <h1 class="page-title">We'd love to<br /><span class="accent">hear from you.</span></h1>
        <p class="page-sub">Whether you have a question about your scan results, our products, or anything else — our team is here to help.</p>
      </div>
    </section>

    <!-- ── MAIN CONTENT ── -->
    <section class="contact-section">
      <div class="contact-inner">

        <!-- LEFT: Info Panel -->
        <div class="info-panel">

          <!-- Address -->
          <div class="info-block">
            <div class="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <div>
              <span class="info-label">Visit Us</span>
              <p class="info-value">317 Imam Haron Road<br />Lansdowne, Cape Town</p>
            </div>
          </div>

          <!-- Phone -->
          <div class="info-block">
            <div class="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <div>
              <span class="info-label">Call Us</span>
              <p class="info-value">021 709 2375</p>
            </div>
          </div>

          <!-- Email -->
          <div class="info-block">
            <div class="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <span class="info-label">Email Us</span>
              <p class="info-value">faceit@gmail.com</p>
            </div>
          </div>

          <!-- Social -->
          <div class="info-block">
            <div class="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <div>
              <span class="info-label">Follow Us</span>
              <div class="social-links">
                <a href="https://instagram.com/faceit" target="_blank" class="social-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                  @faceit
                </a>
                <a href="https://facebook.com/faceit" target="_blank" class="social-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                  Face I.T
                </a>
              </div>
            </div>
          </div>

          <!-- Operating Hours -->
          <div class="hours-card">
            <div class="hours-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span class="info-label">Operating Hours</span>
            </div>
            <div class="hours-grid">
              <div class="hours-row">
                <span class="hours-day">Monday – Friday</span>
                <span class="hours-time">08:00 – 17:00</span>
              </div>
              <div class="hours-divider"></div>
              <div class="hours-row">
                <span class="hours-day">Saturday</span>
                <span class="hours-time">09:00 – 13:00</span>
              </div>
              <div class="hours-divider"></div>
              <div class="hours-row closed">
                <span class="hours-day">Sunday & Public Holidays</span>
                <span class="hours-time closed-tag">Closed</span>
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT: Contact Form -->
        <div class="form-panel">
          <div class="form-header">
            <span class="section-label">Send a Message</span>
            <h2>We'll get back to you<br /><span class="accent">within 24 hours.</span></h2>
          </div>

          <form class="contact-form" @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group">
                <label for="fullName">Full Name</label>
                <input
                  id="fullName"
                  v-model="form.fullName"
                  type="text"
                  placeholder="Jane Smith"
                  required
                />
              </div>
              <div class="form-group">
                <label for="contactNumber">Contact Number</label>
                <input
                  id="contactNumber"
                  v-model="form.contactNumber"
                  type="tel"
                  placeholder="082 000 0000"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="jane@example.com"
                required
              />
            </div>

            <div class="form-group">
              <label for="message">Your Message</label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                placeholder="Tell us how we can help you..."
                required
              ></textarea>
            </div>

            <button type="submit" class="submit-btn" :class="{ submitted: isSubmitted }">
              <span v-if="!isSubmitted">Send Message</span>
              <span v-else class="sent-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Message Sent!
              </span>
            </button>
          </form>
        </div>

      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppNavbar from '../components/Appnavbar.vue'
import AppFooter from '../components/Appfooter.vue'

const isSubmitted = ref(false)

const form = ref({
  fullName: '',
  contactNumber: '',
  email: '',
  message: '',
})

function handleSubmit() {
  // Hook up to your backend / email service here
  console.log('Form submitted:', form.value)
  isSubmitted.value = true
  setTimeout(() => {
    isSubmitted.value = false
    form.value = { fullName: '', contactNumber: '', email: '', message: '' }
  }, 3500)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Playfair+Display:wght@400;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.page { background: #fdf8f3; min-height: 100vh; color: #2d1f14; }

/* ── HERO ── */
.contact-hero {
  min-height: 48vh; display: flex; align-items: center;
  position: relative; overflow: hidden; padding: 140px 5% 70px;
}
.hero-bg { position: absolute; inset: 0; pointer-events: none; }
.bg-petal { position: absolute; border-radius: 50%; }
.bp-1 {
  width: 700px; height: 700px; top: -200px; right: -150px;
  background: radial-gradient(circle, rgba(240,213,192,0.55) 0%, transparent 65%);
  filter: blur(50px);
}
.bp-2 {
  width: 400px; height: 400px; bottom: -100px; left: -80px;
  background: radial-gradient(circle, rgba(232,200,176,0.4) 0%, transparent 65%);
  filter: blur(40px);
}
.bg-lines {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(196,120,74,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(196,120,74,0.04) 1px, transparent 1px);
  background-size: 44px 44px;
}
.hero-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
.page-label {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.22em;
  text-transform: uppercase; color: #c4784a; display: block; margin-bottom: 20px;
}
.page-title {
  font-family: 'Bebas Neue', sans-serif; font-size: clamp(56px, 8vw, 96px);
  line-height: 0.92; letter-spacing: 0.02em; color: #2d1f14; margin-bottom: 24px;
}
.accent { color: #c4784a; }
.page-sub {
  font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.9;
  color: rgba(45,31,20,0.5); max-width: 520px;
}

/* ── CONTACT SECTION ── */
.contact-section { padding: 80px 5% 120px; }
.contact-inner {
  max-width: 1200px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1.4fr; gap: 60px; align-items: start;
}

/* ── INFO PANEL ── */
.info-panel { display: flex; flex-direction: column; gap: 0; }

.info-block {
  display: flex; align-items: flex-start; gap: 18px;
  padding: 24px 0;
  border-bottom: 1px solid rgba(45,31,20,0.07);
}
.info-block:first-child { padding-top: 0; }

.info-icon {
  width: 40px; height: 40px; flex-shrink: 0;
  background: rgba(196,120,74,0.08); border: 1px solid rgba(196,120,74,0.2);
  border-radius: 6px; display: flex; align-items: center; justify-content: center;
  color: #c4784a;
}
.info-icon svg { width: 18px; height: 18px; }

.info-label {
  font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.2em;
  text-transform: uppercase; color: #c4784a; display: block; margin-bottom: 6px;
}
.info-value {
  font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.7;
  color: rgba(45,31,20,0.7);
}

.social-links { display: flex; flex-direction: column; gap: 8px; margin-top: 2px; }
.social-link {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'DM Mono', monospace; font-size: 12px;
  color: rgba(45,31,20,0.65); text-decoration: none;
  transition: color 0.2s;
}
.social-link svg { width: 14px; height: 14px; color: #c4784a; }
.social-link:hover { color: #c4784a; }

/* Hours Card */
.hours-card {
  margin-top: 28px;
  background: rgba(196,120,74,0.04);
  border: 1px solid rgba(196,120,74,0.15);
  border-radius: 8px; padding: 24px;
}
.hours-header {
  display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
  color: #c4784a;
}
.hours-header svg { width: 16px; height: 16px; }
.hours-grid { display: flex; flex-direction: column; gap: 0; }
.hours-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 0;
}
.hours-divider { height: 1px; background: rgba(45,31,20,0.06); }
.hours-day {
  font-family: 'DM Mono', monospace; font-size: 11px;
  color: rgba(45,31,20,0.6); letter-spacing: 0.04em;
}
.hours-time {
  font-family: 'DM Mono', monospace; font-size: 11px;
  color: #2d1f14; font-weight: 500;
}
.hours-row.closed .hours-day { color: rgba(45,31,20,0.4); }
.closed-tag {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.12em;
  text-transform: uppercase; color: rgba(45,31,20,0.35);
  padding: 3px 10px; border-radius: 2px;
  background: rgba(45,31,20,0.05); border: 1px solid rgba(45,31,20,0.08);
}

/* ── FORM PANEL ── */
.form-panel {
  background: rgba(255,255,255,0.75);
  border: 1px solid rgba(45,31,20,0.08);
  border-radius: 10px; padding: 48px;
}
.form-header { margin-bottom: 40px; }
.section-label {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em;
  text-transform: uppercase; color: #c4784a; display: block; margin-bottom: 14px;
}
.form-header h2 {
  font-family: 'Playfair Display', serif; font-size: clamp(26px, 3vw, 36px);
  line-height: 1.25; color: #2d1f14;
}

.contact-form { display: flex; flex-direction: column; gap: 22px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.form-group { display: flex; flex-direction: column; gap: 8px; }

.form-group label {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.18em;
  text-transform: uppercase; color: rgba(45,31,20,0.5);
}

.form-group input,
.form-group textarea {
  font-family: 'DM Mono', monospace; font-size: 12px;
  color: #2d1f14; background: rgba(253,248,243,0.8);
  border: 1px solid rgba(45,31,20,0.12); border-radius: 5px;
  padding: 13px 16px; outline: none;
  transition: border-color 0.25s, box-shadow 0.25s;
  resize: none;
}
.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(45,31,20,0.25);
}
.form-group input:focus,
.form-group textarea:focus {
  border-color: rgba(196,120,74,0.5);
  box-shadow: 0 0 0 3px rgba(196,120,74,0.08);
}

.submit-btn {
  margin-top: 6px;
  width: 100%; padding: 15px;
  font-family: 'Bebas Neue', sans-serif; font-size: 17px; letter-spacing: 0.18em;
  background: #c4784a; color: #fff; border: none; border-radius: 5px;
  cursor: pointer; transition: background 0.2s, transform 0.2s;
}
.submit-btn:hover { background: #a05535; transform: translateY(-1px); }
.submit-btn.submitted { background: #5a8a5a; cursor: default; transform: none; }

.sent-label {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
}
.sent-label svg { width: 18px; height: 18px; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .contact-inner { grid-template-columns: 1fr; }
  .form-panel { padding: 32px 24px; }
  .form-row { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .form-panel { padding: 24px 16px; }
}
</style>