<template>
  <div class="page">
    <AppNavbar />

    <section class="track-hero">
      <div class="hero-inner">
        <span class="page-label">Order Status</span>
        <h1 class="page-title">Track <span class="accent">Order</span></h1>
      </div>
    </section>

    <section class="track-section">
      <div class="track-inner">

        <!-- Loading -->
        <div v-if="loading" class="empty-state">
          <div class="spinner"></div>
          <p>Fetching your order…</p>
        </div>

        <!-- Not found -->
        <div v-else-if="notFound" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Order Not Found</h3>
          <p>We couldn't find an order with that reference number.</p>
          <router-link to="/orders" class="cta-btn">My Orders</router-link>
        </div>

        <!-- Order found -->
        <div v-else-if="order" class="track-content">

          <!-- Order ref + status badges -->
          <div class="track-header">
            <div>
              <div class="track-label">Order Reference</div>
              <div class="track-order-num">{{ order.order_number }}</div>
              <div class="track-date">Placed on {{ formatDate(order.created_at) }}</div>
            </div>
            <div class="track-badges">
              <span class="badge" :class="statusClass(order.order_status)">{{ order.order_status }}</span>
              <span class="badge" :class="paymentClass(order.payment_status)">{{ order.payment_status }}</span>
            </div>
          </div>

          <!-- Progress stepper -->
          <div class="stepper-card" v-if="order.order_status !== 'cancelled' && order.order_status !== 'refunded'">
            <div class="stepper">
              <div
                v-for="(step, i) in steps"
                :key="step.key"
                :class="['step-item', { done: isStepDone(order.order_status, step.key), active: order.order_status === step.key }]"
              >
                <div class="step-circle">
                  <svg v-if="isStepDone(order.order_status, step.key) && order.order_status !== step.key" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l5 5L20 7"/></svg>
                  <span v-else>{{ i + 1 }}</span>
                </div>
                <div class="step-label">{{ step.label }}</div>
                <div class="step-desc">{{ step.desc }}</div>
                <div v-if="i < steps.length - 1" class="step-connector" :class="{ filled: isStepDone(order.order_status, steps[i+1].key) || order.order_status === steps[i+1].key }"></div>
              </div>
            </div>
          </div>

          <!-- Cancelled banner -->
          <div v-else class="cancelled-banner">
            <span>⚠</span>
            This order has been {{ order.order_status }}. Please contact support if you have questions.
          </div>

          <!-- Tracking number -->
          <div v-if="order.tracking_number" class="tracking-num-box">
            <div class="tn-label">Courier Tracking Number</div>
            <div class="tn-value">{{ order.tracking_number }}</div>
          </div>

          <!-- Two column: items + shipping -->
          <div class="track-grid">

            <!-- Items -->
            <div class="track-card">
              <div class="tc-title">Items Ordered</div>
              <div class="order-items">
                <div class="oi-row" v-for="item in order.items" :key="item.product_name">
                  <span class="oi-name">{{ item.product_name }}</span>
                  <span class="oi-qty">× {{ item.quantity }}</span>
                  <span class="oi-price">R {{ Number(item.subtotal || item.unit_price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
              <div class="order-total-row">
                <span>Total</span>
                <span class="total-amt">R {{ Number(order.total_amount).toFixed(2) }}</span>
              </div>
            </div>

            <!-- Shipping + payment -->
            <div class="track-card">
              <div class="tc-title">Delivery Details</div>
              <div class="detail-group" v-if="order.shipping_address">
                <div class="dg-label">Shipping Address</div>
                <div class="dg-val">{{ order.shipping_address.street }}</div>
                <div class="dg-val">{{ order.shipping_address.city }}, {{ order.shipping_address.postal_code }}</div>
                <div class="dg-val">{{ order.shipping_address.country }}</div>
              </div>
              <div class="detail-group">
                <div class="dg-label">Payment Method</div>
                <div class="dg-val" style="text-transform:uppercase;letter-spacing:0.06em;">{{ order.payment_method }}</div>
              </div>
              <div class="detail-group">
                <div class="dg-label">Payment Status</div>
                <div class="dg-val"><span class="badge" :class="paymentClass(order.payment_status)">{{ order.payment_status }}</span></div>
              </div>
            </div>

          </div>

          <!-- Actions -->
          <div class="track-actions">
            <router-link to="/orders" class="ghost-btn">← All Orders</router-link>
            <router-link to="/brands" class="cta-btn">Continue Shopping</router-link>
          </div>

        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import AppNavbar from '../components/Appnavbar.vue'
import AppFooter from '../components/Appfooter.vue'

const API_BASE = 'http://localhost:5000/api'
const route  = useRoute()
const router = useRouter()

const order    = ref(null)
const loading  = ref(true)
const notFound = ref(false)

const steps = [
  { key: 'pending',    label: 'Order Placed',  desc: 'We\'ve received your order' },
  { key: 'processing', label: 'Processing',    desc: 'Being prepared for dispatch' },
  { key: 'shipped',    label: 'Shipped',        desc: 'On its way to you' },
  { key: 'delivered',  label: 'Delivered',      desc: 'Enjoy your products ✿' },
]

const stepOrder = ['pending', 'processing', 'shipped', 'delivered']

function isStepDone(currentStatus, stepKey) {
  if (currentStatus === 'cancelled' || currentStatus === 'refunded') return false
  return stepOrder.indexOf(currentStatus) >= stepOrder.indexOf(stepKey)
}

function statusClass(s) {
  return { pending: 'badge-pending', processing: 'badge-processing', shipped: 'badge-shipped', delivered: 'badge-delivered', cancelled: 'badge-cancelled', refunded: 'badge-cancelled' }[s] || 'badge-pending'
}
function paymentClass(s) {
  return { pending: 'badge-pending', paid: 'badge-delivered', failed: 'badge-cancelled', refunded: 'badge-cancelled' }[s] || 'badge-pending'
}
function formatDate(dt) {
  return new Date(dt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  // Auth guard
  const stored = localStorage.getItem('user')
  if (!stored) {
    localStorage.setItem('redirect_after_login', route.fullPath)
    router.push('/login')
    return
  }

  try {
    const res = await axios.get(`${API_BASE}/orders/track/${route.params.orderNumber}`)
    order.value = res.data
  } catch (err) {
    if (err.response?.status === 404) notFound.value = true
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.page { background: #fdf8f3; min-height: 100vh; color: #2d1f14; }

.track-hero { padding: 120px 5% 50px; background: linear-gradient(160deg, #f5ede4 0%, #fdf8f3 60%); border-bottom: 1px solid rgba(196,120,74,0.12); }
.hero-inner { max-width: 1200px; margin: 0 auto; }
.page-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: #c4784a; display: block; margin-bottom: 12px; }
.page-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(52px, 7vw, 80px); line-height: 0.92; color: #2d1f14; }
.accent { color: #c4784a; }

.track-section { padding: 60px 5% 100px; }
.track-inner { max-width: 900px; margin: 0 auto; }

.empty-state { text-align: center; padding: 80px 20px; }
.empty-icon { font-size: 52px; margin-bottom: 20px; }
.empty-state h3 { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 0.08em; color: #2d1f14; margin-bottom: 12px; }
.empty-state p { font-family: 'DM Mono', monospace; font-size: 12px; color: rgba(45,31,20,0.5); margin-bottom: 28px; }
.spinner { width: 36px; height: 36px; border: 3px solid rgba(196,120,74,0.2); border-top-color: #c4784a; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 20px; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Track header */
.track-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
.track-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #c4784a; margin-bottom: 6px; }
.track-order-num { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 0.08em; color: #2d1f14; }
.track-date { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(45,31,20,0.4); margin-top: 4px; }
.track-badges { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-top: 8px; }

/* Badges */
.badge { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; border: 1px solid; }
.badge-pending    { color: #b07d2a; background: rgba(176,125,42,0.08); border-color: rgba(176,125,42,0.25); }
.badge-processing { color: #5a72aa; background: rgba(90,114,170,0.08); border-color: rgba(90,114,170,0.25); }
.badge-shipped    { color: #c4784a; background: rgba(196,120,74,0.08); border-color: rgba(196,120,74,0.25); }
.badge-delivered  { color: #5aaa40; background: rgba(90,170,64,0.08); border-color: rgba(90,170,64,0.25); }
.badge-cancelled  { color: #c84a4a; background: rgba(200,74,74,0.08); border-color: rgba(200,74,74,0.25); }

/* Stepper */
.stepper-card { background: #fff; border: 1px solid rgba(196,120,74,0.15); border-radius: 8px; padding: 36px 28px 28px; margin-bottom: 24px; }
.stepper { display: flex; align-items: flex-start; gap: 0; }
.step-item { display: flex; flex-direction: column; align-items: center; position: relative; flex: 1; min-width: 70px; }
.step-circle { width: 36px; height: 36px; border-radius: 50%; border: 2px solid rgba(45,31,20,0.15); background: #fff; display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(45,31,20,0.3); transition: all 0.3s; z-index: 1; position: relative; }
.step-circle svg { width: 16px; height: 16px; }
.step-item.done .step-circle { background: #c4784a; border-color: #c4784a; color: #fff; }
.step-item.active .step-circle { border-color: #c4784a; color: #c4784a; box-shadow: 0 0 0 5px rgba(196,120,74,0.12); }
.step-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(45,31,20,0.35); margin-top: 10px; text-align: center; }
.step-desc { font-family: 'DM Mono', monospace; font-size: 8px; color: rgba(45,31,20,0.25); margin-top: 4px; text-align: center; line-height: 1.4; max-width: 80px; }
.step-item.done .step-label, .step-item.active .step-label { color: #c4784a; }
.step-item.active .step-desc { color: rgba(45,31,20,0.45); }
.step-connector { position: absolute; top: 17px; left: 50%; width: 100%; height: 2px; background: rgba(45,31,20,0.1); z-index: 0; transition: background 0.3s; }
.step-connector.filled { background: #c4784a; }

/* Cancelled banner */
.cancelled-banner { background: rgba(200,74,74,0.06); border: 1px solid rgba(200,74,74,0.2); border-radius: 6px; padding: 16px 20px; font-family: 'DM Mono', monospace; font-size: 12px; color: #c84a4a; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; line-height: 1.6; }

/* Tracking number box */
.tracking-num-box { background: rgba(196,120,74,0.06); border: 1px solid rgba(196,120,74,0.2); border-radius: 6px; padding: 16px 20px; margin-bottom: 24px; }
.tn-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #c4784a; margin-bottom: 6px; }
.tn-value { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.08em; color: #2d1f14; }

/* Grid */
.track-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
.track-card { background: #fff; border: 1px solid rgba(196,120,74,0.12); border-radius: 8px; padding: 24px; }
.tc-title { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 0.08em; color: #2d1f14; margin-bottom: 16px; }

.order-items { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.oi-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid rgba(45,31,20,0.05); }
.oi-name { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(45,31,20,0.6); flex: 1; }
.oi-qty { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(45,31,20,0.35); }
.oi-price { font-family: 'DM Mono', monospace; font-size: 11px; color: #2d1f14; }
.order-total-row { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(45,31,20,0.5); }
.total-amt { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 0.06em; color: #c4784a; }

.detail-group { margin-bottom: 16px; }
.dg-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: #c4784a; margin-bottom: 6px; }
.dg-val { font-family: 'DM Mono', monospace; font-size: 12px; color: rgba(45,31,20,0.6); line-height: 1.7; }

/* Actions */
.track-actions { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.cta-btn { font-family: 'Bebas Neue', sans-serif; font-size: 15px; letter-spacing: 0.18em; background: #c4784a; color: #fff; text-decoration: none; padding: 13px 32px; border-radius: 4px; display: inline-block; transition: background 0.2s; }
.cta-btn:hover { background: #a05535; }
.ghost-btn { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(45,31,20,0.5); text-decoration: none; padding: 13px 20px; border: 1px solid rgba(45,31,20,0.2); border-radius: 4px; transition: all 0.2s; }
.ghost-btn:hover { color: #2d1f14; border-color: rgba(196,120,74,0.4); }

@media (max-width: 700px) { .track-grid { grid-template-columns: 1fr; } .stepper { overflow-x: auto; padding-bottom: 8px; } .step-desc { display: none; } }
</style>