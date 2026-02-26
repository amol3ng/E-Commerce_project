<template>
  <nav class="nav" :class="{ scrolled }">
    <div class="nav-inner">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <span class="logo-petal">✿</span>
        <span class="logo-text">FACE<span class="logo-accent">.IT</span></span>
      </router-link>

      <!-- Desktop links -->
      <div class="nav-links">
        <router-link to="/" class="nav-link" active-class="active" exact>Home</router-link>
        <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        <router-link to="/product" class="nav-link" active-class="active">Product</router-link>
        <router-link to="/brands" class="nav-link" active-class="active">Brands</router-link>
        <router-link to="/brands#scanners" class="nav-link cultivate" active-class="active">Cultivate Your Own</router-link>
        <router-link to="/contact" class="nav-link" active-class="active">Contact Us</router-link>
      </div>

      <!-- Desktop actions -->
      <div class="nav-actions">
        <template v-if="user">
          <!-- Cart icon -->
          <router-link to="/cart" class="cart-btn" title="Your Cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </router-link>
          <span class="user-greeting">Hi, {{ firstName }}</span>
          <button class="btn-ghost" @click="logout">Sign Out</button>
        </template>
        <template v-else>
          <router-link to="/login" class="btn-ghost">Sign In</router-link>
          <router-link to="/login" class="btn-solid">Get Started</router-link>
        </template>
      </div>

      <!-- Hamburger -->
      <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>
    </div>

    <!-- Mobile menu -->
    <transition name="menu-drop">
      <div v-if="menuOpen" class="mobile-menu">
        <router-link to="/" class="mob-link" @click="menuOpen = false" exact>Home</router-link>
        <router-link to="/about" class="mob-link" @click="menuOpen = false">About</router-link>
        <router-link to="/product" class="mob-link" @click="menuOpen = false">Product</router-link>
        <router-link to="/brands" class="mob-link" @click="menuOpen = false">Brands</router-link>
        <router-link to="/brands#scanners" class="mob-link cultivate" @click="menuOpen = false">Cultivate Your Own</router-link>
        <router-link to="/contact" class="mob-link" @click="menuOpen = false">Contact Us</router-link>
        <div class="mob-divider"></div>
        <template v-if="user">
          <router-link to="/cart" class="mob-link" @click="menuOpen = false">🛍 Cart{{ cartCount > 0 ? ` (${cartCount})` : '' }}</router-link>
          <button class="mob-ghost" @click="logout">Sign Out</button>
        </template>
        <template v-else>
          <router-link to="/login" class="mob-ghost" @click="menuOpen = false">Sign In</router-link>
          <router-link to="/login" class="mob-solid" @click="menuOpen = false">Get Started</router-link>
        </template>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE = 'http://localhost:5000/api'
const router = useRouter()

const scrolled = ref(false)
const menuOpen = ref(false)
const user = ref(null)
const cartCount = ref(0)

const firstName = computed(() => user.value?.full_name?.split(' ')[0] || '')

function loadUser() {
  const stored = localStorage.getItem('user')
  if (stored) {
    user.value = JSON.parse(stored)
    fetchCartCount()
  }
}

async function fetchCartCount() {
  if (!user.value) return
  try {
    const res = await axios.get(`${API_BASE}/carts/${user.value.id}`)
    cartCount.value = res.data.reduce((sum, item) => sum + item.quantity, 0)
  } catch {
    cartCount.value = 0
  }
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  user.value = null
  cartCount.value = 0
  menuOpen.value = false
  router.push('/')
}

function onScroll() { scrolled.value = window.scrollY > 40 }
function onStorageChange() { loadUser() }

onMounted(() => {
  loadUser()
  window.addEventListener('scroll', onScroll)
  window.addEventListener('storage', onStorageChange)
  // Custom event for same-tab login updates
  window.addEventListener('user-updated', loadUser)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('storage', onStorageChange)
  window.removeEventListener('user-updated', loadUser)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }

.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  padding: 0 5%;
  transition: background 0.4s, border-color 0.4s, box-shadow 0.4s;
  border-bottom: 1px solid transparent;
}
.nav.scrolled {
  background: rgba(254, 250, 245, 0.97);
  border-color: rgba(180, 140, 110, 0.2);
  box-shadow: 0 4px 40px rgba(160, 100, 60, 0.08);
  backdrop-filter: blur(16px);
}

.nav-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; height: 72px; gap: 40px;
}

/* Logo */
.logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
.logo-petal {
  font-size: 16px; line-height: 1;
  animation: petalSpin 6s ease-in-out infinite;
  display: inline-block;
}
@keyframes petalSpin { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(20deg)} }
.logo-text {
  font-family: 'Bebas Neue', sans-serif; font-size: 24px;
  letter-spacing: 0.15em; color: #2d1f14;
}
.logo-accent { color: #c4784a; }

/* Nav links */
.nav-links { display: flex; gap: 4px; }
.nav-link {
  font-family: 'DM Mono', monospace; font-size: 10px;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: rgba(45,31,20,0.5); text-decoration: none;
  padding: 8px 14px; border-radius: 2px; transition: color 0.2s, background 0.2s;
  position: relative;
}
.nav-link:hover { color: #2d1f14; }
.nav-link.active {
  color: #2d1f14; background: rgba(196, 120, 74, 0.1);
}
.nav-link.active::after {
  content: ''; position: absolute; bottom: -1px; left: 14px; right: 14px;
  height: 2px; background: #c4784a; border-radius: 1px;
}
.nav-link.cultivate {
  color: #c4784a;
  border: 1px solid rgba(196, 120, 74, 0.25);
  border-radius: 20px;
  padding: 7px 16px;
}
.nav-link.cultivate:hover { background: rgba(196,120,74,0.08); color: #a05535; }
.nav-link.cultivate::after { display: none; }

/* Actions */
.nav-actions { display: flex; gap: 10px; align-items: center; margin-left: auto; }

.cart-btn {
  position: relative; display: flex; align-items: center; justify-content: center;
  width: 38px; height: 38px; border-radius: 50%;
  background: rgba(196,120,74,0.08); border: 1px solid rgba(196,120,74,0.2);
  color: #c4784a; text-decoration: none; transition: all 0.2s;
}
.cart-btn:hover { background: rgba(196,120,74,0.15); }
.cart-btn svg { width: 17px; height: 17px; }
.cart-badge {
  position: absolute; top: -4px; right: -4px;
  background: #c4784a; color: #fff; font-size: 8px;
  width: 16px; height: 16px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'DM Mono', monospace; font-weight: 500;
}

.user-greeting {
  font-family: 'DM Mono', monospace; font-size: 10px;
  letter-spacing: 0.08em; color: rgba(45,31,20,0.5);
}

.btn-ghost {
  font-family: 'DM Mono', monospace; font-size: 10px;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(45,31,20,0.6); text-decoration: none;
  padding: 8px 16px; border: 1px solid rgba(45,31,20,0.2);
  border-radius: 2px; transition: all 0.2s; background: none; cursor: pointer;
}
.btn-ghost:hover { color: #2d1f14; border-color: rgba(196,120,74,0.5); }

.btn-solid {
  font-family: 'DM Mono', monospace; font-size: 10px;
  letter-spacing: 0.12em; text-transform: uppercase;
  background: #c4784a; color: #fff; text-decoration: none;
  padding: 9px 20px; border-radius: 2px; transition: background 0.2s, box-shadow 0.2s;
}
.btn-solid:hover { background: #a05535; box-shadow: 0 0 20px rgba(196,120,74,0.35); }

/* Hamburger */
.hamburger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; margin-left: auto; padding: 4px;
}
.hamburger span {
  display: block; width: 22px; height: 2px;
  background: #2d1f14; border-radius: 2px; transition: all 0.3s;
}
.hamburger span.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger span.open:nth-child(2) { opacity: 0; }
.hamburger span.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile menu */
.mobile-menu {
  background: rgba(254,250,245,0.98); border-top: 1px solid rgba(196,120,74,0.15);
  display: flex; flex-direction: column; padding: 24px 5%; gap: 4px;
  backdrop-filter: blur(16px);
}
.mob-link {
  font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.14em;
  text-transform: uppercase; color: rgba(45,31,20,0.55); text-decoration: none;
  padding: 12px 0; border-bottom: 1px solid rgba(45,31,20,0.06); transition: color 0.2s;
}
.mob-link:hover, .mob-link.router-link-active { color: #2d1f14; }
.mob-link.cultivate { color: #c4784a; }
.mob-divider { height: 1px; background: rgba(196,120,74,0.2); margin: 12px 0; }
.mob-ghost, .mob-solid {
  font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.12em;
  text-transform: uppercase; text-decoration: none; padding: 13px 20px;
  border-radius: 2px; margin-top: 4px; text-align: center;
  background: none; border: none; cursor: pointer;
}
.mob-ghost { color: rgba(45,31,20,0.6); border: 1px solid rgba(45,31,20,0.2); }
.mob-solid { background: #c4784a; color: #fff; }

.menu-drop-enter-active, .menu-drop-leave-active { transition: all 0.25s ease; }
.menu-drop-enter-from, .menu-drop-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 768px) {
  .nav-links, .nav-actions { display: none; }
  .hamburger { display: flex; }
}
</style>