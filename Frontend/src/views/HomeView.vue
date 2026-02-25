<template>
  <div class="page">
    <AppNavbar />

    <!-- ── HERO ── -->
    <section class="hero">
      <div class="hero-bg">
        <div class="bg-petal bp-1"></div>
        <div class="bg-petal bp-2"></div>
        <div class="bg-petal bp-3"></div>
        <div class="bg-lines"></div>
      </div>

      <div class="hero-inner">
        <!-- LEFT: Content -->
        <div class="hero-content">
          <div class="badge">
            <span class="badge-dot"></span>
            AI-Powered Skincare Technology
          </div>
          <h1 class="hero-title">
            Decode<br />
            <span class="title-accent">Your Skin.</span>
          </h1>
          <p class="hero-sub">
            Intelligent skin analysis that pinpoints your unique needs —
            backed by AI and precision-personalised to you.
          </p>
          <div class="hero-ctas">
            <router-link to="/login" class="cta-primary">Start Analysis</router-link>
            <router-link to="/about" class="cta-ghost">
              Learn More
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </router-link>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-num">98%</span>
              <span class="stat-label">Accuracy Rate</span>
            </div>
            <div class="stat-div"></div>
            <div class="stat">
              <span class="stat-num">50k+</span>
              <span class="stat-label">Skin Profiles</span>
            </div>
            <div class="stat-div"></div>
            <div class="stat">
              <span class="stat-num">24/7</span>
              <span class="stat-label">AI Support</span>
            </div>
          </div>
        </div>

        <!-- RIGHT: Scanner visual — properly centred -->
        <div class="hero-visual">
          <div class="face-frame">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="ring ring-3"></div>
            <div class="face-card">
              <svg viewBox="0 0 220 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Corner brackets -->
                <path d="M20 55 L20 35 L40 35" stroke="#c4784a" stroke-width="2" opacity="0.9"/>
                <path d="M200 55 L200 35 L180 35" stroke="#c4784a" stroke-width="2" opacity="0.9"/>
                <path d="M20 225 L20 245 L40 245" stroke="#c4784a" stroke-width="2" opacity="0.9"/>
                <path d="M200 225 L200 245 L180 245" stroke="#c4784a" stroke-width="2" opacity="0.9"/>
                <!-- Grid lines -->
                <line x1="20" y1="140" x2="200" y2="140" stroke="#c4784a" stroke-width="0.4" opacity="0.15"/>
                <line x1="110" y1="20" x2="110" y2="260" stroke="#c4784a" stroke-width="0.4" opacity="0.15"/>
                <!-- Face oval -->
                <ellipse cx="110" cy="130" rx="72" ry="92" fill="none" stroke="#c4784a" stroke-width="1" opacity="0.3"/>
                <!-- Eyes -->
                <ellipse cx="83" cy="108" rx="13" ry="9" fill="none" stroke="#c4784a" stroke-width="1.5" opacity="0.75"/>
                <ellipse cx="137" cy="108" rx="13" ry="9" fill="none" stroke="#c4784a" stroke-width="1.5" opacity="0.75"/>
                <circle cx="83" cy="108" r="5" fill="rgba(196,120,74,0.25)" opacity="0.8"/>
                <circle cx="137" cy="108" r="5" fill="rgba(196,120,74,0.25)" opacity="0.8"/>
                <!-- Animated pupils -->
                <circle cx="83" cy="108" r="2" fill="#c4784a" opacity="0.9">
                  <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="137" cy="108" r="2" fill="#c4784a" opacity="0.9">
                  <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite"/>
                </circle>
                <!-- Nose -->
                <path d="M110 118 L102 145 Q110 150 118 145 Z" fill="none" stroke="#c4784a" stroke-width="1.2" opacity="0.4"/>
                <!-- Smile -->
                <path d="M90 163 Q110 177 130 163" fill="none" stroke="#c4784a" stroke-width="1.5" opacity="0.6"/>
                <!-- Side dots -->
                <circle cx="55" cy="90" r="2.5" fill="#c4784a" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.8s" repeatCount="indefinite"/>
                </circle>
                <circle cx="165" cy="90" r="2.5" fill="#c4784a" opacity="0.6">
                  <animate attributeName="opacity" values="0.1;0.6;0.1" dur="1.8s" repeatCount="indefinite"/>
                </circle>
                <circle cx="110" cy="50" r="2" fill="#c4784a" opacity="0.5">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="1.3s" repeatCount="indefinite"/>
                </circle>
                <!-- Connector lines -->
                <line x1="55" y1="90" x2="83" y2="108" stroke="#c4784a" stroke-width="0.5" opacity="0.15"/>
                <line x1="165" y1="90" x2="137" y2="108" stroke="#c4784a" stroke-width="0.5" opacity="0.15"/>
              </svg>
              <div class="scan-beam"></div>
            </div>

            <!-- Floating data tags -->
            <div class="ftag ftag-1">
              <span class="ftag-dot"></span>
              <div><div class="ftag-label">Hydration</div><div class="ftag-value">74%</div></div>
            </div>
            <div class="ftag ftag-2">
              <span class="ftag-dot green"></span>
              <div><div class="ftag-label">UV Damage</div><div class="ftag-value">Low</div></div>
            </div>
            <div class="ftag ftag-3">
              <span class="ftag-dot rose"></span>
              <div><div class="ftag-label">Skin Tone</div><div class="ftag-value">Balanced</div></div>
            </div>
          </div>
        </div>
      </div>

      <div class="scroll-hint">
        <div class="scroll-wheel"></div>
        <span>Scroll</span>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import AppNavbar from '../components/Appnavbar.vue'
import AppFooter from '../components/Appfooter.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Cormorant+Garamond:ital,wght@1,300&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }

.page { background: #fdf8f3; min-height: 100vh; }

/* ── HERO ── */
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 72px 5% 60px;
}

/* Background decorations */
.hero-bg { position: absolute; inset: 0; pointer-events: none; }

.bg-petal {
  position: absolute; border-radius: 50%;
}
.bp-1 {
  width: 700px; height: 700px; top: -200px; right: -150px;
  background: radial-gradient(circle, rgba(240,213,192,0.55) 0%, transparent 65%);
  filter: blur(40px);
}
.bp-2 {
  width: 450px; height: 450px; bottom: -100px; left: -80px;
  background: radial-gradient(circle, rgba(232,200,176,0.5) 0%, transparent 65%);
  filter: blur(40px);
}
.bp-3 {
  width: 300px; height: 300px; top: 30%; left: 35%;
  background: radial-gradient(circle, rgba(245,223,208,0.35) 0%, transparent 70%);
  filter: blur(30px);
}

.bg-lines {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(196,120,74,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(196,120,74,0.04) 1px, transparent 1px);
  background-size: 44px 44px;
}

/* ── INNER LAYOUT ── */
.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 60px;
  flex: 1;
  position: relative;
  z-index: 1;
}

/* ── LEFT: Content ── */
.hero-content {
  animation: riseIn 0.9s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes riseIn { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }

.badge {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: 0.18em; text-transform: uppercase; color: #c4784a;
  background: rgba(196,120,74,0.08); border: 1px solid rgba(196,120,74,0.25);
  border-radius: 20px; padding: 7px 16px; margin-bottom: 32px;
}
.badge-dot {
  width: 6px; height: 6px; background: #c4784a; border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite; flex-shrink: 0;
  box-shadow: 0 0 6px rgba(196,120,74,0.6);
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

.hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(70px, 8vw, 110px);
  line-height: 0.9; letter-spacing: 0.02em; color: #2d1f14; margin-bottom: 28px;
}
.title-accent { color: #c4784a; }

.hero-sub {
  font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.9;
  color: rgba(45,31,20,0.5); max-width: 420px; margin-bottom: 40px;
}

.hero-ctas { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; margin-bottom: 56px; }

.cta-primary {
  font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 0.2em;
  background: #c4784a; color: #fff; text-decoration: none; padding: 15px 40px;
  border-radius: 4px; display: inline-block; position: relative; overflow: hidden;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
}
.cta-primary::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  transform: translateX(-100%); transition: transform 0.5s;
}
.cta-primary:hover::before { transform: translateX(100%); }
.cta-primary:hover { background: #a05535; box-shadow: 0 0 30px rgba(196,120,74,0.4); transform: translateY(-1px); }

.cta-ghost {
  font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.12em;
  text-transform: uppercase; color: rgba(45,31,20,0.5); text-decoration: none;
  display: flex; align-items: center; gap: 8px; transition: color 0.2s;
}
.cta-ghost:hover { color: #c4784a; }
.cta-ghost svg { width: 16px; height: 16px; }

.hero-stats { display: flex; gap: 32px; align-items: center; flex-wrap: wrap; }
.stat { display: flex; flex-direction: column; gap: 3px; }
.stat-num {
  font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 0.05em; color: #2d1f14; line-height: 1;
}
.stat-label {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.14em;
  text-transform: uppercase; color: rgba(45,31,20,0.35);
}
.stat-div { width: 1px; height: 40px; background: rgba(45,31,20,0.12); }

/* ── RIGHT: Scanner visual — centred in its column ── */
.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;          /* horizontal centre in the column */
  animation: riseIn 0.9s 0.15s cubic-bezier(0.16,1,0.3,1) both;
}

.face-frame {
  position: relative;
  width: 400px;
  height: 460px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Decorative rings */
.ring {
  position: absolute; border-radius: 50%;
  border: 1px solid rgba(196,120,74,0.12);
}
.ring-1 { width: 380px; height: 380px; animation: ringBreath 4s ease-in-out infinite; }
.ring-2 { width: 300px; height: 300px; animation: ringBreath 4s 0.6s ease-in-out infinite; }
.ring-3 { width: 240px; height: 240px; animation: ringBreath 4s 1.2s ease-in-out infinite; }
@keyframes ringBreath { 0%,100%{opacity:0.25;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.02)} }

/* Scanner card */
.face-card {
  width: 260px; height: 320px;
  background: rgba(255,250,245,0.95);
  border: 1px solid rgba(196,120,74,0.22);
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(196,120,74,0.06),
    0 20px 60px rgba(160,85,53,0.15),
    0 4px 16px rgba(160,85,53,0.08),
    inset 0 1px 0 rgba(255,255,255,0.8);
}
.face-card svg { width: 220px; height: 280px; position: relative; z-index: 1; }

/* Scan beam */
.scan-beam {
  position: absolute; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(196,120,74,0.6), transparent);
  animation: beamScan 4s ease-in-out infinite;
}
@keyframes beamScan {
  0%,100% { top: 15%; opacity: 0; }
  15%      { opacity: 1; }
  85%      { opacity: 1; }
  50%      { top: 85%; }
}

/* Floating data tags */
.ftag {
  position: absolute;
  background: rgba(255,252,248,0.96);
  border: 1px solid rgba(196,120,74,0.2);
  border-radius: 4px; padding: 10px 14px;
  display: flex; align-items: center; gap: 10px;
  box-shadow: 0 6px 20px rgba(160,85,53,0.12);
  backdrop-filter: blur(8px);
  animation: floatY 3s ease-in-out infinite;
  white-space: nowrap;
}
.ftag-label {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.1em;
  text-transform: uppercase; color: rgba(45,31,20,0.4); margin-bottom: 2px;
}
.ftag-value {
  font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 0.08em; color: #2d1f14;
}
.ftag-dot {
  width: 8px; height: 8px; background: #c4784a; border-radius: 50%;
  box-shadow: 0 0 8px rgba(196,120,74,0.6); flex-shrink: 0;
}
.ftag-dot.green  { background: #5aaa40; box-shadow: 0 0 8px rgba(90,170,64,0.5); }
.ftag-dot.rose   { background: #d4726a; box-shadow: 0 0 8px rgba(212,114,106,0.5); }

/* Tag positioning — offset outside the card */
.ftag-1 { top: 70px;  left: -10px;  animation-delay: 0s; }
.ftag-2 { top: 200px; right: -10px; animation-delay: 0.8s; }
.ftag-3 { bottom: 80px; left: -10px; animation-delay: 1.6s; }

@keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

/* ── SCROLL HINT ── */
.scroll-hint {
  position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.14em;
  text-transform: uppercase; color: rgba(45,31,20,0.25);
  z-index: 1;
}
.scroll-wheel {
  width: 20px; height: 32px;
  border: 1px solid rgba(45,31,20,0.18); border-radius: 10px; position: relative;
}
.scroll-wheel::after {
  content: ''; position: absolute; top: 5px; left: 50%; transform: translateX(-50%);
  width: 3px; height: 6px; background: rgba(196,120,74,0.5); border-radius: 2px;
  animation: scrollDot 1.8s ease-in-out infinite;
}
@keyframes scrollDot { 0%{top:5px;opacity:1} 100%{top:18px;opacity:0} }

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .hero-inner {
    grid-template-columns: 1fr;
    text-align: center;
    padding-top: 40px;
    gap: 50px;
  }
  .hero-content { display: flex; flex-direction: column; align-items: center; }
  .hero-sub { max-width: 100%; }
  .hero-ctas { justify-content: center; }
  .hero-stats { justify-content: center; }
  .face-frame { width: 320px; height: 360px; }
  .ring-1 { width: 300px; height: 300px; }
  .ring-2 { width: 240px; height: 240px; }
  .ring-3 { width: 190px; height: 190px; }
  .face-card { width: 220px; height: 270px; }
  .ftag-1, .ftag-3 { left: -5px; }
  .ftag-2 { right: -5px; }
}

@media (max-width: 640px) {
  .hero { padding-top: 90px; }
  .hero-title { font-size: 64px; }
  .stat-div { display: none; }
}
</style>