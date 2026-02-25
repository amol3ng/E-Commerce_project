<template>
  <footer class="footer">
    <div class="footer-petal footer-petal-1"></div>
    <div class="footer-petal footer-petal-2"></div>
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="logo">
          <span class="logo-petal">✿</span>
          <span class="logo-text">FACE<span class="logo-accent">.IT</span></span>
        </div>
        <p class="footer-tagline">AI-powered skincare intelligence.<br/>Built for every skin type.</p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <span class="col-label">Navigate</span>
          <router-link to="/">Home</router-link>
          <router-link to="/about">About</router-link>
          <router-link to="/product">Product</router-link>
          <router-link to="/brands">Brands</router-link>
          <router-link to="/brands#scanners">Cultivate Your Own</router-link>
        </div>
        <div class="footer-col">
          <span class="col-label">Account</span>
          <router-link to="/login">Sign In</router-link>
          <router-link to="/login">Register</router-link>
          <router-link to="/cart">Your Cart</router-link>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Face.IT. All rights reserved.</span>
      <span class="footer-status">
        <span class="status-dot"></span> All systems operational
      </span>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }

.footer {
  background: #f5ede4;
  position: relative; overflow: hidden;
  border-top: 1px solid rgba(196,120,74,0.18);
}

/* Decorative petals */
.footer-petal { position: absolute; border-radius: 50%; pointer-events: none; opacity: 0.5; }
.footer-petal-1 { width: 400px; height: 400px; top: -150px; right: -100px; background: radial-gradient(circle, #edd5bc 0%, transparent 70%); }
.footer-petal-2 { width: 250px; height: 250px; bottom: 0; left: -60px; background: radial-gradient(circle, #e8c8aa 0%, transparent 70%); }

.footer-inner {
  max-width: 1200px; margin: 0 auto;
  padding: 64px 5% 40px;
  display: flex; gap: 80px; justify-content: space-between; flex-wrap: wrap;
  position: relative;
}

.footer-brand { max-width: 300px; }
.logo { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.logo-petal { font-size: 18px; line-height: 1; }
.logo-text { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.15em; color: #2d1f14; }
.logo-accent { color: #c4784a; }
.footer-tagline { font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.8; color: rgba(45,31,20,0.4); letter-spacing: 0.04em; }

.footer-links { display: flex; gap: 60px; flex-wrap: wrap; }
.footer-col { display: flex; flex-direction: column; gap: 12px; }
.col-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(45,31,20,0.3); margin-bottom: 4px; }
.footer-col a { font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 0.08em; color: rgba(45,31,20,0.5); text-decoration: none; transition: color 0.2s; }
.footer-col a:hover { color: #c4784a; }

.footer-bottom {
  max-width: 1200px; margin: 0 auto; padding: 20px 5%;
  border-top: 1px solid rgba(45,31,20,0.08);
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
  font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(45,31,20,0.3); letter-spacing: 0.06em;
  position: relative;
}
.footer-status { display: flex; align-items: center; gap: 6px; }
.status-dot { width: 6px; height: 6px; background: #5aaa40; border-radius: 50%; box-shadow: 0 0 6px #5aaa40; animation: statusPulse 2s ease-in-out infinite; }
@keyframes statusPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
</style>