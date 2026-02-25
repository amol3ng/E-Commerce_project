<template>
  <div class="auth-wrapper">
    <div class="bg-petal bg-petal-1"></div>
    <div class="bg-petal bg-petal-2"></div>
    <div class="bg-petal bg-petal-3"></div>

    <router-link to="/" class="back-link">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 8H3M7 4L3 8l4 4"/></svg>
      Back
    </router-link>

    <div class="auth-container">
      <router-link to="/" class="brand">
        <span class="brand-petal">✿</span>
        <span class="brand-name">FACE<span class="brand-accent">.IT</span></span>
      </router-link>

      <p class="auth-tagline">{{ mode === 'login' ? 'Welcome back, lovely.' : 'Start your skin journey.' }}</p>

      <div class="tab-bar">
        <button :class="['tab', { active: mode === 'login' }]" @click="switchMode('login')">Sign In</button>
        <button :class="['tab', { active: mode === 'register' }]" @click="switchMode('register')">Register</button>
        <div class="tab-indicator" :style="{ transform: mode === 'login' ? 'translateX(0)' : 'translateX(100%)' }"></div>
      </div>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <transition name="slide" mode="out-in">
          <div :key="mode" class="fields">
            <div v-if="mode === 'register'" class="field-group">
              <label>Full Name</label>
              <div class="input-wrap">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                <input v-model="form.full_name" type="text" placeholder="Jane Doe" required />
              </div>
            </div>

            <div class="field-group">
              <label>Email</label>
              <div class="input-wrap">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
                <input v-model="form.email" type="email" placeholder="you@example.com" required />
              </div>
            </div>

            <div v-if="mode === 'register'" class="field-group">
              <label>Phone <span class="optional">(optional)</span></label>
              <div class="input-wrap phone-wrap">
                <div class="phone-prefix">
                  <span class="za-flag">🇿🇦</span>
                  <span class="za-code">+27</span>
                </div>
                <input v-model="form.phone" type="tel" placeholder="81 234 5678" maxlength="12" @input="formatZAPhone" class="phone-input" />
              </div>
              <span class="field-hint">e.g. 081 234 5678</span>
            </div>

            <div class="field-group">
              <label>Password</label>
              <div class="input-wrap">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="••••••••" required />
                <button type="button" class="eye-btn" @click="showPass = !showPass">
                  <svg v-if="!showPass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>
          </div>
        </transition>

        <transition name="fade">
          <div v-if="message" :class="['msg', msgType]">{{ message }}</div>
        </transition>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="!loading">{{ mode === 'login' ? 'Sign In' : 'Create Account' }}</span>
          <span v-else class="spinner"></span>
        </button>
      </form>

      <p class="footer-note">
        {{ mode === 'login' ? "Don't have an account?" : 'Already have an account?' }}
        <button type="button" class="link-btn" @click="switchMode(mode === 'login' ? 'register' : 'login')">
          {{ mode === 'login' ? 'Register' : 'Sign in' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE = 'http://localhost:5000/api'
const router = useRouter()

const mode = ref('login')
const loading = ref(false)
const showPass = ref(false)
const message = ref('')
const msgType = ref('error')

const form = reactive({ full_name: '', email: '', phone: '', password: '' })

function formatZAPhone(e) {
  let digits = e.target.value.replace(/\D/g, '')
  if (digits.startsWith('0')) digits = digits.slice(1)
  digits = digits.slice(0, 9)
  let formatted = digits
  if (digits.length > 2) formatted = digits.slice(0, 2) + ' ' + digits.slice(2)
  if (digits.length > 5) formatted = digits.slice(0, 2) + ' ' + digits.slice(2, 5) + ' ' + digits.slice(5)
  form.phone = formatted
}

function switchMode(m) {
  mode.value = m; message.value = ''
  form.full_name = ''; form.email = ''; form.phone = ''; form.password = ''
  showPass.value = false
}

async function handleSubmit() {
  loading.value = true; message.value = ''
  try {
    if (mode.value === 'login') {
      const res = await axios.post(`${API_BASE}/users/login`, {
        email: form.email, password: form.password,
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      // Notify navbar in the same tab
      window.dispatchEvent(new Event('user-updated'))
      // Redirect home
      router.push('/')
    } else {
      await axios.post(`${API_BASE}/users`, {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        phone: form.phone ? '+27' + form.phone.replace(/\s/g, '') : undefined,
      })
      msgType.value = 'success'
      message.value = 'Account created! Signing you in…'
      setTimeout(() => switchMode('login'), 1500)
    }
  } catch (err) {
    msgType.value = 'error'
    message.value = err.response?.data?.message || 'Something went wrong.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,400;1,300&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }

.auth-wrapper {
  min-height: 100vh;
  background: #fdf8f3;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  font-family: 'DM Mono', monospace;
  padding: 40px 20px;
}

/* Decorative petals */
.bg-petal {
  position: absolute; border-radius: 50%; pointer-events: none; opacity: 0.35;
}
.bg-petal-1 {
  width: 500px; height: 500px; top: -150px; right: -100px;
  background: radial-gradient(circle, #f0d5c0 0%, transparent 70%);
}
.bg-petal-2 {
  width: 350px; height: 350px; bottom: -80px; left: -80px;
  background: radial-gradient(circle, #e8c8b0 0%, transparent 70%);
}
.bg-petal-3 {
  width: 200px; height: 200px; top: 40%; left: 10%;
  background: radial-gradient(circle, #f5dfd0 0%, transparent 70%);
}

.back-link {
  position: fixed; top: 28px; left: 28px;
  display: flex; align-items: center; gap: 6px;
  font-family: 'DM Mono', monospace; font-size: 10px;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(45,31,20,0.4); text-decoration: none; z-index: 10; transition: color 0.2s;
}
.back-link:hover { color: #2d1f14; }
.back-link svg { width: 14px; height: 14px; }

.auth-container {
  position: relative; z-index: 1; width: 100%; max-width: 420px;
  background: rgba(255,252,248,0.96);
  border: 1px solid rgba(196,120,74,0.18);
  border-radius: 8px; padding: 44px 40px 36px;
  box-shadow: 0 8px 60px rgba(160,85,53,0.1), 0 2px 8px rgba(160,85,53,0.06);
  animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes cardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }

.brand { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; text-decoration: none; }
.brand-petal { font-size: 18px; line-height: 1; animation: petalSpin 5s ease-in-out infinite; display: inline-block; }
@keyframes petalSpin { 0%,100%{transform:rotate(0)} 50%{transform:rotate(15deg)} }
.brand-name { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 0.15em; color: #2d1f14; }
.brand-accent { color: #c4784a; }

.auth-tagline { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: rgba(45,31,20,0.45); margin-bottom: 32px; font-style: italic; }

/* Tabs */
.tab-bar {
  display: grid; grid-template-columns: 1fr 1fr; position: relative;
  background: rgba(45,31,20,0.04); border: 1px solid rgba(196,120,74,0.15);
  border-radius: 4px; margin-bottom: 32px; overflow: hidden;
}
.tab {
  background: none; border: none; color: rgba(45,31,20,0.45);
  font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  padding: 12px; cursor: pointer; position: relative; z-index: 1; transition: color 0.3s;
}
.tab.active { color: #2d1f14; }
.tab-indicator {
  position: absolute; width: 50%; height: 100%; top: 0; left: 0;
  background: rgba(196,120,74,0.12); border-bottom: 2px solid #c4784a;
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); z-index: 0;
}

/* Fields */
.fields { display: flex; flex-direction: column; gap: 20px; }
.field-group { display: flex; flex-direction: column; gap: 8px; }
.field-group label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(45,31,20,0.4); }
.optional { color: rgba(45,31,20,0.2); font-size: 8px; }

.input-wrap { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 14px; width: 15px; height: 15px; color: rgba(45,31,20,0.25); pointer-events: none; }
.input-wrap input {
  width: 100%; background: rgba(45,31,20,0.03); border: 1px solid rgba(45,31,20,0.12);
  border-radius: 4px; color: #2d1f14; font-family: 'DM Mono', monospace; font-size: 13px;
  padding: 12px 42px; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
.input-wrap input::placeholder { color: rgba(45,31,20,0.2); }
.input-wrap input:focus { border-color: rgba(196,120,74,0.5); box-shadow: 0 0 0 3px rgba(196,120,74,0.1); }

.eye-btn {
  position: absolute; right: 12px; background: none; border: none;
  cursor: pointer; color: rgba(45,31,20,0.25); display: flex; padding: 0; transition: color 0.2s;
}
.eye-btn:hover { color: rgba(45,31,20,0.6); }
.eye-btn svg { width: 15px; height: 15px; }

/* Phone */
.phone-wrap {
  display: flex; align-items: center; background: rgba(45,31,20,0.03);
  border: 1px solid rgba(45,31,20,0.12); border-radius: 4px; overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.phone-wrap:focus-within { border-color: rgba(196,120,74,0.5); box-shadow: 0 0 0 3px rgba(196,120,74,0.1); }
.phone-prefix {
  display: flex; align-items: center; gap: 6px; padding: 12px 12px 12px 14px;
  border-right: 1px solid rgba(45,31,20,0.1); background: rgba(45,31,20,0.02); flex-shrink: 0;
}
.za-flag { font-size: 14px; }
.za-code { font-size: 13px; color: rgba(45,31,20,0.5); letter-spacing: 0.04em; }
.phone-input { flex: 1; background: transparent !important; border: none !important; box-shadow: none !important; padding: 12px 14px !important; color: #2d1f14; }
.phone-input:focus { outline: none; }
.field-hint { font-size: 9px; color: rgba(45,31,20,0.2); letter-spacing: 0.06em; }

/* Message */
.msg { margin-top: 16px; padding: 10px 14px; border-radius: 4px; font-size: 11px; letter-spacing: 0.04em; border-left: 2px solid; }
.msg.error { background: rgba(200,50,50,0.06); border-color: #c83232; color: #c83232; }
.msg.success { background: rgba(100,170,80,0.08); border-color: #5aaa40; color: #5aaa40; }

/* Submit */
.submit-btn {
  margin-top: 24px; width: 100%; background: #c4784a; border: none; border-radius: 4px;
  color: #fff; font-family: 'Bebas Neue', sans-serif; font-size: 16px;
  letter-spacing: 0.2em; padding: 14px; cursor: pointer; overflow: hidden;
  transition: background 0.2s, box-shadow 0.2s;
}
.submit-btn:hover { background: #a05535; box-shadow: 0 0 24px rgba(196,120,74,0.35); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.spinner {
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle;
}
@keyframes spin { to{transform:rotate(360deg)} }

.footer-note { margin-top: 24px; text-align: center; font-size: 11px; color: rgba(45,31,20,0.3); letter-spacing: 0.04em; }
.link-btn { background: none; border: none; color: #c4784a; font-family: 'DM Mono', monospace; font-size: 11px; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }

.slide-enter-active, .slide-leave-active { transition: all 0.22s ease; }
.slide-enter-from { opacity: 0; transform: translateY(8px); }
.slide-leave-to { opacity: 0; transform: translateY(-8px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 480px) {
  .auth-wrapper { align-items: flex-start; padding: 0; }
  .auth-container { max-width: 100%; min-height: 100dvh; border-radius: 0; border-left: none; border-right: none; border-top: none; padding: 52px 24px 36px; box-shadow: none; }
}
</style>