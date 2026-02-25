<template>
  <div class="page">
    <AppNavbar />

    <section class="checkout-hero">
      <div class="hero-inner">
        <span class="page-label">Almost there ✿</span>
        <h1 class="page-title">Checkout</h1>
      </div>
    </section>

    <section class="checkout-section">
      <div class="checkout-inner">

        <!-- Not logged in -->
        <div v-if="!user" class="empty-state">
          <div class="empty-icon">🔒</div>
          <h3>Please sign in first</h3>
          <router-link to="/login" class="cta-btn">Sign In</router-link>
        </div>

        <!-- Empty cart -->
        <div v-else-if="!loading && items.length === 0" class="empty-state">
          <div class="empty-icon">🛍</div>
          <h3>Your cart is empty</h3>
          <router-link to="/brands" class="cta-btn">Shop Now</router-link>
        </div>

        <!-- Success screen -->
        <div v-else-if="orderPlaced" class="success-screen">
          <div class="success-icon">✿</div>
          <h2>Order Placed!</h2>
          <p>Thank you, {{ user.full_name.split(' ')[0] }}. Your skin journey continues.</p>
          <p class="order-ref">Order ref: <strong>{{ orderRef }}</strong></p>
          <router-link to="/" class="cta-btn">Back to Home</router-link>
        </div>

        <div v-else class="checkout-layout">
          <!-- LEFT: Shipping + Payment -->
          <div class="checkout-forms">
            <!-- Shipping -->
            <div class="form-card">
              <h2 class="form-card-title">
                <span class="step-num">01</span> Shipping Address
              </h2>
              <div class="fields">
                <div class="field-row">
                  <div class="field-group">
                    <label>Street Address</label>
                    <input v-model="shipping.street" type="text" placeholder="12 Main Road" required />
                  </div>
                  <div class="field-group">
                    <label>City</label>
                    <input v-model="shipping.city" type="text" placeholder="Johannesburg" required />
                  </div>
                </div>
                <div class="field-row">
                  <div class="field-group">
                    <label>Postal Code</label>
                    <input v-model="shipping.postal_code" type="text" placeholder="2000" required />
                  </div>
                  <div class="field-group">
                    <label>Country</label>
                    <select v-model="shipping.country">
                      <option value="ZA">South Africa</option>
                      <option value="ZW">Zimbabwe</option>
                      <option value="NA">Namibia</option>
                      <option value="BW">Botswana</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="form-card">
              <h2 class="form-card-title">
                <span class="step-num">02</span> Payment Method
              </h2>
              <div class="payment-methods">
                <label
                  v-for="pm in paymentMethods"
                  :key="pm.value"
                  :class="['pm-option', { active: paymentMethod === pm.value }]"
                >
                  <input type="radio" :value="pm.value" v-model="paymentMethod" />
                  <span class="pm-icon">{{ pm.icon }}</span>
                  <div class="pm-info">
                    <span class="pm-label">{{ pm.label }}</span>
                    <span class="pm-desc">{{ pm.desc }}</span>
                  </div>
                  <span class="pm-check" v-if="paymentMethod === pm.value">✓</span>
                </label>
              </div>

              <!-- Card details (simulated) -->
              <div v-if="paymentMethod === 'card'" class="card-fields">
                <div class="field-group">
                  <label>Card Number</label>
                  <input v-model="card.number" type="text" placeholder="4242 4242 4242 4242" maxlength="19" @input="formatCard" />
                </div>
                <div class="field-row">
                  <div class="field-group">
                    <label>Expiry</label>
                    <input v-model="card.expiry" type="text" placeholder="MM/YY" maxlength="5" @input="formatExpiry" />
                  </div>
                  <div class="field-group">
                    <label>CVV</label>
                    <input v-model="card.cvv" type="text" placeholder="123" maxlength="4" />
                  </div>
                </div>
                <div class="field-group">
                  <label>Name on Card</label>
                  <input v-model="card.name" type="text" placeholder="Jane Doe" />
                </div>
                <p class="sim-note">✿ This is a simulated payment — no real charges will be made.</p>
              </div>

              <div v-if="paymentMethod === 'eft'" class="eft-info">
                <p>Banking details will be emailed to you after placing the order. Please use your order number as reference.</p>
              </div>

              <div v-if="paymentMethod === 'cod'" class="eft-info">
                <p>Pay in cash when your order arrives. Available for selected areas in South Africa.</p>
              </div>
            </div>
          </div>

          <!-- RIGHT: Order Summary -->
          <div class="order-summary">
            <h2 class="summary-title">Your Order</h2>
            <div v-if="loading" class="spinner"></div>
            <div class="summary-items" v-else>
              <div class="summary-item" v-for="item in items" :key="item.id">
                <span class="si-name">{{ item.name }} <span class="si-qty">× {{ item.quantity }}</span></span>
                <span class="si-price">R {{ Number(item.subtotal).toFixed(2) }}</span>
              </div>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row">
              <span>Subtotal</span><span>R {{ cartTotal }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span><span class="free">Free</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
              <span>Total</span><span>R {{ cartTotal }}</span>
            </div>

            <transition name="fade">
              <div v-if="formError" class="form-error">{{ formError }}</div>
            </transition>

            <button class="place-order-btn" @click="placeOrder" :disabled="placing || loading || items.length === 0">
              <span v-if="!placing">Place Order</span>
              <span v-else class="btn-spinner"></span>
            </button>
            <router-link to="/cart" class="back-link">← Edit Cart</router-link>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import AppNavbar from '../components/Appnavbar.vue'
import AppFooter from '../components/Appfooter.vue'

const API_BASE = 'http://localhost:5000/api'

const user = ref(null)
const items = ref([])
const loading = ref(true)
const placing = ref(false)
const orderPlaced = ref(false)
const orderRef = ref('')
const formError = ref('')

const shipping = reactive({ street: '', city: '', postal_code: '', country: 'ZA' })
const paymentMethod = ref('card')
const card = reactive({ number: '', expiry: '', cvv: '', name: '' })

const paymentMethods = [
  { value: 'card', icon: '💳', label: 'Card', desc: 'Visa, Mastercard, Amex (simulated)' },
  { value: 'eft', icon: '🏦', label: 'EFT / Bank Transfer', desc: 'Direct bank transfer' },
  { value: 'cod', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when it arrives' },
]

const cartTotal = computed(() =>
  items.value.reduce((sum, i) => sum + Number(i.subtotal), 0).toFixed(2)
)

function formatCard(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 16)
  card.number = v.replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 4)
  card.expiry = v.length > 2 ? v.slice(0,2) + '/' + v.slice(2) : v
}

async function fetchCart() {
  if (!user.value) { loading.value = false; return }
  try {
    const res = await axios.get(`${API_BASE}/carts/${user.value.id}`)
    items.value = res.data
  } catch { /* ignore */ } finally { loading.value = false }
}

async function placeOrder() {
  if (!shipping.street || !shipping.city || !shipping.postal_code) {
    formError.value = 'Please fill in all shipping fields.'
    setTimeout(() => formError.value = '', 4000); return
  }
  placing.value = true; formError.value = ''
  try {
    const payload = {
      user_id: user.value.id,
      items: items.value.map(i => ({ product_id: i.product_id, quantity: i.quantity, unit_price: i.price, product_name: i.name })),
      shipping_address: { ...shipping },
      payment_method: paymentMethod.value,
      total_amount: cartTotal.value,
    }
    const res = await axios.post(`${API_BASE}/orders`, payload)
    orderRef.value = res.data.order_number || 'ORD-' + Date.now()
    orderPlaced.value = true
    // Clear cart items in state
    items.value = []
    window.dispatchEvent(new Event('user-updated'))
  } catch (err) {
    formError.value = err.response?.data?.message || 'Could not place order. Please try again.'
    setTimeout(() => formError.value = '', 5000)
  } finally { placing.value = false }
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
.checkout-hero {
  padding: 120px 5% 50px;
  background: linear-gradient(160deg, #f5ede4 0%, #fdf8f3 60%);
  border-bottom: 1px solid rgba(196,120,74,0.12);
}
.hero-inner { max-width: 1200px; margin: 0 auto; }
.page-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: #c4784a; display: block; margin-bottom: 12px; }
.page-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(52px, 7vw, 80px); line-height: 0.92; color: #2d1f14; }

/* Section */
.checkout-section { padding: 60px 5% 100px; }
.checkout-inner { max-width: 1200px; margin: 0 auto; }

/* Layout */
.checkout-layout { display: grid; grid-template-columns: 1fr 380px; gap: 40px; align-items: start; }
.checkout-forms { display: flex; flex-direction: column; gap: 24px; }

/* Form cards */
.form-card {
  background: #fff; border: 1px solid rgba(196,120,74,0.12);
  border-radius: 8px; padding: 28px;
}
.form-card-title {
  font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.08em;
  color: #2d1f14; margin-bottom: 24px; display: flex; align-items: center; gap: 14px;
}
.step-num {
  background: rgba(196,120,74,0.1); color: #c4784a;
  font-size: 14px; padding: 4px 10px; border-radius: 20px;
  border: 1px solid rgba(196,120,74,0.2);
}

.fields { display: flex; flex-direction: column; gap: 16px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field-group { display: flex; flex-direction: column; gap: 7px; }
.field-group label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(45,31,20,0.4); }
.field-group input,
.field-group select {
  background: rgba(45,31,20,0.03); border: 1px solid rgba(45,31,20,0.12);
  border-radius: 4px; padding: 11px 14px; font-family: 'DM Mono', monospace;
  font-size: 13px; color: #2d1f14; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none;
}
.field-group input:focus,
.field-group select:focus { border-color: rgba(196,120,74,0.5); box-shadow: 0 0 0 3px rgba(196,120,74,0.1); }

/* Payment methods */
.payment-methods { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.pm-option {
  display: flex; align-items: center; gap: 14px; padding: 14px 16px;
  border: 1px solid rgba(45,31,20,0.1); border-radius: 6px; cursor: pointer;
  transition: all 0.2s; position: relative;
}
.pm-option.active { border-color: #c4784a; background: rgba(196,120,74,0.05); }
.pm-option input[type="radio"] { display: none; }
.pm-icon { font-size: 20px; flex-shrink: 0; }
.pm-info { display: flex; flex-direction: column; gap: 2px; }
.pm-label { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.08em; color: #2d1f14; }
.pm-desc { font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(45,31,20,0.4); letter-spacing: 0.04em; }
.pm-check { margin-left: auto; color: #c4784a; font-size: 14px; }

.card-fields { display: flex; flex-direction: column; gap: 14px; border-top: 1px solid rgba(196,120,74,0.1); padding-top: 20px; }
.sim-note { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(45,31,20,0.35); letter-spacing: 0.04em; margin-top: 4px; }
.eft-info { border-top: 1px solid rgba(196,120,74,0.1); padding-top: 18px; }
.eft-info p { font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.8; color: rgba(45,31,20,0.5); }

/* Order summary */
.order-summary {
  background: #fff; border: 1px solid rgba(196,120,74,0.15);
  border-radius: 8px; padding: 28px; position: sticky; top: 90px;
}
.summary-title { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 0.08em; color: #2d1f14; margin-bottom: 20px; }
.summary-items { display: flex; flex-direction: column; gap: 10px; margin-bottom: 4px; }
.summary-item { display: flex; justify-content: space-between; }
.si-name { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(45,31,20,0.6); }
.si-qty { color: rgba(45,31,20,0.35); }
.si-price { font-family: 'DM Mono', monospace; font-size: 11px; color: #2d1f14; }
.summary-row { display: flex; justify-content: space-between; font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(45,31,20,0.55); padding: 6px 0; }
.summary-row.total { font-size: 15px; color: #2d1f14; font-weight: 500; }
.free { color: #5aaa40; }
.summary-divider { height: 1px; background: rgba(196,120,74,0.12); margin: 10px 0; }

.form-error { background: rgba(200,74,74,0.06); border: 1px solid rgba(200,74,74,0.25); border-radius: 4px; padding: 10px 14px; font-family: 'DM Mono', monospace; font-size: 11px; color: #c84a4a; margin: 14px 0 0; }

.place-order-btn {
  display: block; width: 100%; margin-top: 20px; padding: 16px;
  background: #c4784a; color: #fff; border: none; border-radius: 4px;
  font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 0.18em;
  cursor: pointer; transition: background 0.2s; text-align: center;
}
.place-order-btn:hover:not(:disabled) { background: #a05535; }
.place-order-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.btn-spinner {
  display: inline-block; width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle;
}
@keyframes spin { to{transform:rotate(360deg)} }
.spinner { width: 30px; height: 30px; border: 3px solid rgba(196,120,74,0.2); border-top-color: #c4784a; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 20px auto; }

.back-link { display: block; text-align: center; margin-top: 14px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: rgba(45,31,20,0.4); text-decoration: none; transition: color 0.2s; }
.back-link:hover { color: #c4784a; }

/* Empty / Success */
.empty-state, .success-screen { text-align: center; padding: 80px 20px; }
.empty-icon, .success-icon { font-size: 52px; margin-bottom: 20px; }
.empty-state h3, .success-screen h2 { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 0.08em; color: #2d1f14; margin-bottom: 12px; }
.empty-state p, .success-screen p { font-family: 'DM Mono', monospace; font-size: 12px; color: rgba(45,31,20,0.5); margin-bottom: 10px; }
.order-ref { font-family: 'DM Mono', monospace; font-size: 11px; color: #c4784a; margin-bottom: 28px !important; }
.order-ref strong { letter-spacing: 0.06em; }
.cta-btn { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; background: #c4784a; color: #fff; text-decoration: none; padding: 13px 32px; border-radius: 4px; display: inline-block; margin-top: 10px; transition: background 0.2s; }
.cta-btn:hover { background: #a05535; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 900px) { .checkout-layout { grid-template-columns: 1fr; } .order-summary { position: static; } }
@media (max-width: 560px) { .field-row { grid-template-columns: 1fr; } }
</style>