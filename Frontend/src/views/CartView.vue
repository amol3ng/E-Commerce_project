<template>
  <div class="page">
    <AppNavbar />

    <section class="cart-hero">
      <div class="hero-inner">
        <span class="page-label">Your Bag</span>
        <h1 class="page-title">Shopping <span class="accent">Cart</span></h1>
      </div>
    </section>

    <section class="cart-section">
      <div class="cart-inner">

        <!-- Loading -->
        <div v-if="loading" class="empty-state">
          <div class="spinner"></div>
          <p>Loading your cart…</p>
        </div>

        <!-- Not logged in -->
        <div v-else-if="!user" class="empty-state">
          <div class="empty-icon">🔒</div>
          <h3>You're not signed in</h3>
          <p>Please sign in to view your cart.</p>
          <router-link to="/login" class="cta-btn">Sign In</router-link>
        </div>

        <!-- Empty cart -->
        <div v-else-if="items.length === 0" class="empty-state">
          <div class="empty-icon">🛍</div>
          <h3>Your bag is empty</h3>
          <p>Discover products that your skin will love.</p>
          <router-link to="/brands" class="cta-btn">Shop Now</router-link>
        </div>

        <!-- Cart items -->
        <div v-else class="cart-layout">
          <div class="cart-items">
            <div class="cart-item" v-for="item in items" :key="item.id">
              <div class="item-image">
                <img v-if="item.image_url" :src="item.image_url" :alt="item.name" />
                <div v-else class="item-img-placeholder">
                  <span>✿</span>
                </div>
              </div>
              <div class="item-info">
                <p class="item-sku">{{ item.sku }}</p>
                <h3 class="item-name">{{ item.name }}</h3>
                <p class="item-price">R {{ Number(item.price).toFixed(2) }}</p>
              </div>
              <div class="item-controls">
                <div class="qty-row">
                  <button class="qty-btn" @click="changeQty(item, item.quantity - 1)" :disabled="item.quantity <= 1">−</button>
                  <span class="qty-val">{{ item.quantity }}</span>
                  <button class="qty-btn" @click="changeQty(item, item.quantity + 1)">+</button>
                </div>
                <p class="item-subtotal">R {{ Number(item.subtotal).toFixed(2) }}</p>
                <button class="remove-btn" @click="removeItem(item)" title="Remove">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="cart-summary">
            <h2 class="summary-title">Order Summary</h2>
            <div class="summary-row" v-for="item in items" :key="item.id + '-s'">
              <span>{{ item.name }} × {{ item.quantity }}</span>
              <span>R {{ Number(item.subtotal).toFixed(2) }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
              <span>Total</span>
              <span>R {{ cartTotal }}</span>
            </div>
            <router-link to="/checkout" class="checkout-btn">Proceed to Checkout</router-link>
            <router-link to="/brands" class="continue-link">← Continue Shopping</router-link>
          </div>
        </div>

        <!-- Error -->
        <transition name="fade">
          <div v-if="error" class="error-toast">{{ error }}</div>
        </transition>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import AppNavbar from '../components/Appnavbar.vue'
import AppFooter from '../components/Appfooter.vue'

const API_BASE = 'http://localhost:5000/api'

const user = ref(null)
const items = ref([])
const loading = ref(true)
const error = ref('')

const cartTotal = computed(() =>
  items.value.reduce((sum, i) => sum + Number(i.subtotal), 0).toFixed(2)
)

async function fetchCart() {
  if (!user.value) { loading.value = false; return }
  try {
    const res = await axios.get(`${API_BASE}/carts/${user.value.id}`)
    items.value = res.data
  } catch (err) {
    error.value = 'Could not load cart. Please try again.'
    setTimeout(() => error.value = '', 4000)
  } finally {
    loading.value = false
  }
}

async function changeQty(item, newQty) {
  if (newQty < 1) return
  try {
    await axios.patch(`${API_BASE}/carts/${user.value.id}/item/${item.id}`, { quantity: newQty })
    item.quantity = newQty
    item.subtotal = (item.price * newQty).toFixed(2)
    window.dispatchEvent(new Event('user-updated')) // refresh navbar badge
  } catch {
    error.value = 'Could not update quantity.'
    setTimeout(() => error.value = '', 3000)
  }
}

async function removeItem(item) {
  try {
    await axios.delete(`${API_BASE}/carts/${user.value.id}/item/${item.id}`)
    items.value = items.value.filter(i => i.id !== item.id)
    window.dispatchEvent(new Event('user-updated'))
  } catch {
    error.value = 'Could not remove item.'
    setTimeout(() => error.value = '', 3000)
  }
}

onMounted(() => {
  const stored = localStorage.getItem('user')
  if (stored) user.value = JSON.parse(stored)
  fetchCart()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Cormorant+Garamond:ital,wght@1,300&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.page { background: #fdf8f3; min-height: 100vh; color: #2d1f14; }

/* Hero */
.cart-hero {
  padding: 120px 5% 50px; background: linear-gradient(160deg, #f5ede4 0%, #fdf8f3 60%);
  border-bottom: 1px solid rgba(196,120,74,0.12);
}
.hero-inner { max-width: 1200px; margin: 0 auto; }
.page-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: #c4784a; display: block; margin-bottom: 12px; }
.page-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(52px, 7vw, 80px); line-height: 0.92; color: #2d1f14; }
.accent { color: #c4784a; }

/* Section */
.cart-section { padding: 60px 5% 100px; }
.cart-inner { max-width: 1200px; margin: 0 auto; position: relative; }

/* Empty / loading */
.empty-state { text-align: center; padding: 80px 20px; }
.empty-icon { font-size: 52px; margin-bottom: 20px; }
.empty-state h3 { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 0.08em; color: #2d1f14; margin-bottom: 12px; }
.empty-state p { font-family: 'DM Mono', monospace; font-size: 12px; color: rgba(45,31,20,0.5); margin-bottom: 28px; }
.spinner { width: 36px; height: 36px; border: 3px solid rgba(196,120,74,0.2); border-top-color: #c4784a; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 20px; }
@keyframes spin { to{transform:rotate(360deg)} }

.cta-btn {
  font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
  background: #c4784a; color: #fff; text-decoration: none; padding: 13px 32px;
  border-radius: 4px; display: inline-block; transition: background 0.2s;
}
.cta-btn:hover { background: #a05535; }

/* Layout */
.cart-layout { display: grid; grid-template-columns: 1fr 360px; gap: 40px; align-items: start; }

/* Cart items */
.cart-items { display: flex; flex-direction: column; gap: 16px; }
.cart-item {
  display: grid; grid-template-columns: 90px 1fr auto;
  gap: 20px; align-items: center; padding: 20px;
  background: #fff; border: 1px solid rgba(196,120,74,0.12);
  border-radius: 8px; transition: box-shadow 0.2s;
}
.cart-item:hover { box-shadow: 0 4px 20px rgba(160,85,53,0.08); }

.item-image { width: 90px; height: 90px; border-radius: 6px; overflow: hidden; flex-shrink: 0; }
.item-image img { width: 100%; height: 100%; object-fit: cover; }
.item-img-placeholder { width: 100%; height: 100%; background: rgba(196,120,74,0.08); display: flex; align-items: center; justify-content: center; font-size: 28px; }

.item-sku { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: #c4784a; margin-bottom: 6px; }
.item-name { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 0.06em; color: #2d1f14; margin-bottom: 8px; }
.item-price { font-family: 'DM Mono', monospace; font-size: 12px; color: rgba(45,31,20,0.5); }

.item-controls { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
.qty-row { display: flex; align-items: center; gap: 10px; }
.qty-btn {
  width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(196,120,74,0.25);
  background: none; color: #c4784a; cursor: pointer; font-size: 16px;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
}
.qty-btn:hover:not(:disabled) { background: rgba(196,120,74,0.1); }
.qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.qty-val { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 0.06em; color: #2d1f14; min-width: 24px; text-align: center; }
.item-subtotal { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 0.06em; color: #c4784a; }
.remove-btn { background: none; border: none; cursor: pointer; color: rgba(45,31,20,0.3); transition: color 0.2s; padding: 4px; }
.remove-btn:hover { color: #c84a4a; }
.remove-btn svg { width: 18px; height: 18px; }

/* Summary */
.cart-summary {
  background: #fff; border: 1px solid rgba(196,120,74,0.15);
  border-radius: 8px; padding: 28px; position: sticky; top: 90px;
}
.summary-title { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 0.08em; color: #2d1f14; margin-bottom: 20px; }
.summary-row {
  display: flex; justify-content: space-between; align-items: center;
  font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(45,31,20,0.55);
  padding: 6px 0;
}
.summary-row.total { font-size: 14px; color: #2d1f14; font-weight: 500; }
.summary-divider { height: 1px; background: rgba(196,120,74,0.12); margin: 14px 0; }

.checkout-btn {
  display: block; width: 100%; margin-top: 24px; padding: 15px;
  background: #c4784a; color: #fff; text-align: center;
  font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 0.2em;
  text-decoration: none; border-radius: 4px; transition: background 0.2s;
}
.checkout-btn:hover { background: #a05535; }

.continue-link {
  display: block; text-align: center; margin-top: 14px;
  font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em;
  color: rgba(45,31,20,0.4); text-decoration: none; transition: color 0.2s;
}
.continue-link:hover { color: #c4784a; }

/* Error toast */
.error-toast {
  position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
  background: #c84a4a; color: #fff; font-family: 'DM Mono', monospace; font-size: 11px;
  letter-spacing: 0.06em; padding: 12px 24px; border-radius: 4px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15); z-index: 999;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .cart-item { grid-template-columns: 70px 1fr; } .item-controls { grid-column: 1/-1; flex-direction: row; justify-content: space-between; } }
</style>