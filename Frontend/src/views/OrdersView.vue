<template>
  <div class="page">
    <AppNavbar />

    <section class="orders-hero">
      <div class="hero-inner">
        <span class="page-label">Your Account</span>
        <h1 class="page-title">Order <span class="accent">History</span></h1>
      </div>
    </section>

    <section class="orders-section">
      <div class="orders-inner">

        <!-- Loading -->
        <div v-if="loading" class="empty-state">
          <div class="spinner"></div>
          <p>Loading your orders…</p>
        </div>

        <!-- No orders -->
        <div v-else-if="orders.length === 0" class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Once you place an order it will appear here.</p>
          <router-link to="/brands" class="cta-btn">Start Shopping</router-link>
        </div>

        <!-- Orders list -->
        <div v-else class="orders-list">
          <div class="order-card" v-for="order in orders" :key="order.id">

            <!-- Order header -->
            <div class="order-header">
              <div class="order-meta">
                <span class="order-num">{{ order.order_number }}</span>
                <span class="order-date">{{ formatDate(order.created_at) }}</span>
              </div>
              <div class="order-badges">
                <span class="badge" :class="statusClass(order.order_status)">{{ order.order_status }}</span>
                <span class="badge" :class="paymentClass(order.payment_status)">{{ order.payment_status }}</span>
              </div>
            </div>

            <!-- Status stepper -->
            <div class="stepper">
              <div
                v-for="(step, i) in steps"
                :key="step.key"
                :class="['step-item', { done: isStepDone(order.order_status, step.key), active: order.order_status === step.key, cancelled: order.order_status === 'cancelled' }]"
              >
                <div class="step-circle">
                  <svg v-if="isStepDone(order.order_status, step.key) && order.order_status !== step.key" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l5 5L20 7"/></svg>
                  <span v-else>{{ i + 1 }}</span>
                </div>
                <div class="step-label">{{ step.label }}</div>
                <div v-if="i < steps.length - 1" class="step-connector" :class="{ filled: isStepDone(order.order_status, steps[i+1].key) || order.order_status === steps[i+1].key }"></div>
              </div>
            </div>

            <!-- Items -->
            <div class="order-items">
              <div class="oi-row" v-for="item in order.items" :key="item.product_name">
                <span class="oi-name">{{ item.product_name }}</span>
                <span class="oi-qty">× {{ item.quantity }}</span>
                <span class="oi-price">R {{ Number(item.subtotal || item.unit_price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="order-footer">
              <div class="order-total">
                <span>Total</span>
                <span class="total-amt">R {{ Number(order.total_amount).toFixed(2) }}</span>
              </div>
              <router-link :to="`/track/${order.order_number}`" class="track-btn">
                Track Order →
              </router-link>
            </div>

          </div>
        </div>

      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AppNavbar from '../components/Appnavbar.vue'
import AppFooter from '../components/Appfooter.vue'

const API_BASE = 'http://localhost:5000/api'
const router = useRouter()

const orders  = ref([])
const loading = ref(true)

const steps = [
  { key: 'pending',    label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped',    label: 'Shipped' },
  { key: 'delivered',  label: 'Delivered' },
]

const stepOrder = ['pending', 'processing', 'shipped', 'delivered']

function isStepDone(currentStatus, stepKey) {
  if (currentStatus === 'cancelled' || currentStatus === 'refunded') return false
  return stepOrder.indexOf(currentStatus) >= stepOrder.indexOf(stepKey)
}

function statusClass(s) {
  return {
    pending:    'badge-pending',
    processing: 'badge-processing',
    shipped:    'badge-shipped',
    delivered:  'badge-delivered',
    cancelled:  'badge-cancelled',
    refunded:   'badge-cancelled',
  }[s] || 'badge-pending'
}

function paymentClass(s) {
  return {
    pending:   'badge-pending',
    paid:      'badge-delivered',
    failed:    'badge-cancelled',
    refunded:  'badge-cancelled',
  }[s] || 'badge-pending'
}

function formatDate(dt) {
  return new Date(dt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(async () => {
  const stored = localStorage.getItem('user')
  if (!stored) { router.push('/login'); return }
  const user = JSON.parse(stored)
  try {
    const res = await axios.get(`${API_BASE}/orders/user/${user.id}`)
    orders.value = res.data
  } catch { /* ignore */ }
  finally { loading.value = false }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.page { background: #fdf8f3; min-height: 100vh; color: #2d1f14; }

.orders-hero { padding: 120px 5% 50px; background: linear-gradient(160deg, #f5ede4 0%, #fdf8f3 60%); border-bottom: 1px solid rgba(196,120,74,0.12); }
.hero-inner { max-width: 1200px; margin: 0 auto; }
.page-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: #c4784a; display: block; margin-bottom: 12px; }
.page-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(52px, 7vw, 80px); line-height: 0.92; color: #2d1f14; }
.accent { color: #c4784a; }

.orders-section { padding: 60px 5% 100px; }
.orders-inner { max-width: 900px; margin: 0 auto; }

.empty-state { text-align: center; padding: 80px 20px; }
.empty-icon { font-size: 52px; margin-bottom: 20px; }
.empty-state h3 { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 0.08em; color: #2d1f14; margin-bottom: 12px; }
.empty-state p { font-family: 'DM Mono', monospace; font-size: 12px; color: rgba(45,31,20,0.5); margin-bottom: 28px; }
.spinner { width: 36px; height: 36px; border: 3px solid rgba(196,120,74,0.2); border-top-color: #c4784a; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 20px; }
@keyframes spin { to { transform: rotate(360deg); } }
.cta-btn { font-family: 'Bebas Neue', sans-serif; font-size: 15px; letter-spacing: 0.18em; background: #c4784a; color: #fff; text-decoration: none; padding: 13px 32px; border-radius: 4px; display: inline-block; transition: background 0.2s; }
.cta-btn:hover { background: #a05535; }

.orders-list { display: flex; flex-direction: column; gap: 24px; }

/* Order card */
.order-card { background: #fff; border: 1px solid rgba(196,120,74,0.15); border-radius: 8px; overflow: hidden; }

.order-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid rgba(196,120,74,0.1); flex-wrap: wrap; gap: 12px; }
.order-num { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 0.08em; color: #2d1f14; margin-right: 12px; }
.order-date { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(45,31,20,0.4); letter-spacing: 0.06em; }
.order-badges { display: flex; gap: 8px; flex-wrap: wrap; }

/* Badges */
.badge { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; border: 1px solid; }
.badge-pending    { color: #b07d2a; background: rgba(176,125,42,0.08); border-color: rgba(176,125,42,0.25); }
.badge-processing { color: #5a72aa; background: rgba(90,114,170,0.08); border-color: rgba(90,114,170,0.25); }
.badge-shipped    { color: #c4784a; background: rgba(196,120,74,0.08); border-color: rgba(196,120,74,0.25); }
.badge-delivered  { color: #5aaa40; background: rgba(90,170,64,0.08); border-color: rgba(90,170,64,0.25); }
.badge-cancelled  { color: #c84a4a; background: rgba(200,74,74,0.08); border-color: rgba(200,74,74,0.25); }

/* Stepper */
.stepper { display: flex; align-items: flex-start; padding: 28px 24px 20px; gap: 0; overflow-x: auto; }
.step-item { display: flex; flex-direction: column; align-items: center; position: relative; flex: 1; min-width: 60px; }
.step-circle {
  width: 32px; height: 32px; border-radius: 50%;
  border: 2px solid rgba(45,31,20,0.15);
  background: #fff; display: flex; align-items: center; justify-content: center;
  font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(45,31,20,0.3);
  transition: all 0.3s; z-index: 1; position: relative;
}
.step-circle svg { width: 14px; height: 14px; }
.step-item.done .step-circle { background: #c4784a; border-color: #c4784a; color: #fff; }
.step-item.active .step-circle { border-color: #c4784a; color: #c4784a; box-shadow: 0 0 0 4px rgba(196,120,74,0.15); }
.step-item.cancelled .step-circle { border-color: #c84a4a; color: #c84a4a; }
.step-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(45,31,20,0.35); margin-top: 8px; text-align: center; }
.step-item.done .step-label, .step-item.active .step-label { color: #c4784a; }

.step-connector { position: absolute; top: 15px; left: 50%; width: 100%; height: 2px; background: rgba(45,31,20,0.1); z-index: 0; transition: background 0.3s; }
.step-connector.filled { background: #c4784a; }

/* Order items */
.order-items { padding: 0 24px 20px; display: flex; flex-direction: column; gap: 8px; }
.oi-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(45,31,20,0.05); }
.oi-name { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(45,31,20,0.6); flex: 1; }
.oi-qty { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(45,31,20,0.35); }
.oi-price { font-family: 'DM Mono', monospace; font-size: 11px; color: #2d1f14; }

/* Order footer */
.order-footer { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: rgba(196,120,74,0.04); border-top: 1px solid rgba(196,120,74,0.1); }
.order-total { display: flex; gap: 16px; align-items: center; font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(45,31,20,0.5); }
.total-amt { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 0.06em; color: #c4784a; }
.track-btn { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #c4784a; text-decoration: none; border: 1px solid rgba(196,120,74,0.3); padding: 8px 16px; border-radius: 3px; transition: all 0.2s; }
.track-btn:hover { background: rgba(196,120,74,0.08); }

@media (max-width: 600px) { .stepper { padding: 20px 12px; } .order-header, .order-footer { flex-direction: column; align-items: flex-start; gap: 12px; } }
</style>