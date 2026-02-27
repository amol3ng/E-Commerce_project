<template>
  <div class="page">
    <AppNavbar />

    <!-- ── HERO ── -->
    <section class="brands-hero">
      <div class="hero-bg">
        <div class="bg-petal bp-1"></div>
        <div class="bg-petal bp-2"></div>
        <div class="bg-lines"></div>
      </div>
      <div class="brands-hero-inner">
        <span class="page-label">Partners & Products</span>
        <h1 class="page-title">Brands that<br/><span class="accent">trust the scan.</span></h1>
        <p class="page-sub">Face.IT partners with world-leading skincare brands to bring you the most trusted products — matched to your skin by AI.</p>
      </div>
    </section>

    <!-- ── PARTNER BRANDS ── -->
    <section class="section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-label">Our Partners</span>
          <h2>Three brands. One mission.</h2>
          <p>We've partnered with industry leaders so your personalised routine is always backed by the best.</p>
        </div>
        <div class="partner-grid">
          <div
            class="partner-card"
            v-for="brand in brands"
            :key="brand.name"
            :class="{ featured: brand.featured }"
          >
            <div class="partner-logo-wrap">
              <div class="partner-logo-placeholder" :class="brand.colorClass">
                <span class="brand-initials">{{ brand.initials }}</span>
                <span class="brand-label-sm">{{ brand.name }}</span>
              </div>
              <div class="partner-badge" :class="{ 'featured-badge': brand.featured }">
                {{ brand.featured ? 'Featured' : 'Partner' }}
              </div>
            </div>
            <div class="partner-body">
              <h3>{{ brand.name }}</h3>
              <p class="partner-tagline">{{ brand.tagline }}</p>
              <p class="partner-desc">{{ brand.desc }}</p>
              <div class="partner-tags">
                <span class="ptag" v-for="t in brand.tags" :key="t">{{ t }}</span>
              </div>
              <a :href="brand.url" target="_blank" rel="noopener noreferrer" class="brand-visit-btn">
                Visit {{ brand.name }}
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── SCANNERS ── -->
    <section id="scanners" class="section alt">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-label">Our Hardware</span>
          <h2>Three scanners. Every skin need.</h2>
          <p>Face.IT offers three precision skin scanning devices — each built for a different use case, all powered by the same AI core.</p>
        </div>
        <div class="scanner-grid">
          <div class="scanner-card" v-for="scanner in scanners" :key="scanner.name">
            <div class="scanner-visual">
              <div class="scanner-glow" :class="scanner.glowClass"></div>
              <img
                v-if="scanner.image"
                :src="scanner.image"
                :alt="scanner.name"
                class="scanner-img"
              />
              <div v-else class="scanner-placeholder">
                <svg viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="40" y="20" width="100" height="160" rx="12" fill="rgba(196,120,74,0.06)" stroke="rgba(196,120,74,0.3)" stroke-width="1.5"/>
                  <ellipse cx="90" cy="85" rx="22" ry="28" fill="none" stroke="#c4784a" stroke-width="1" opacity="0.6"/>
                </svg>
              </div>
              <div class="scanner-tier-badge" :class="scanner.tierClass">{{ scanner.tier }}</div>
            </div>
            <div class="scanner-body">
              <div class="scanner-name-row">
                <h3>{{ scanner.name }}</h3>
                <span class="scanner-price">{{ scanner.price }}</span>
              </div>
              <p class="scanner-desc">{{ scanner.desc }}</p>
              <div class="scanner-specs">
                <div class="spec" v-for="s in scanner.specs" :key="s">
                  <span class="spec-dot"></span>{{ s }}
                </div>
              </div>
              <button
                class="scanner-cta add-cart-btn"
                @click="addToCart(scanner)"
                :disabled="scanner.adding || !scanner.product_id"
              >
                <span v-if="scanner.adding" class="btn-spinner"></span>
                <span v-else-if="scanner.added">✓ Added to Cart</span>
                <span v-else>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PARTNER PRODUCTS ── -->
    <section class="section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-label">Partner Products</span>
          <h2>Curated products.<br/><span class="accent">Matched to your scan.</span></h2>
          <p>Products from our partner brands, recommended by Face.IT's AI based on your unique skin profile.</p>
        </div>

        <!-- Brand filter tabs -->
        <div class="brand-tabs">
          <button
            v-for="tab in brandTabs"
            :key="tab"
            class="brand-tab"
            :class="{ active: activeTab === tab }"
            @click="activeTab = tab"
          >{{ tab }}</button>
        </div>

        <div class="products-grid">
          <div
            class="product-card"
            v-for="product in filteredPartnerProducts"
            :key="product.sku"
          >
            <div class="product-visual">
              <div class="product-glow"></div>
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
                class="product-img"
              />
            </div>
            <div class="product-body">
              <div class="product-brand-badge">{{ product.brand }}</div>
              <div class="product-type-badge">{{ product.type }}</div>
              <h4>{{ product.name }}</h4>
              <p>{{ product.desc }}</p>
              <div class="product-tags">
                <span class="skin-tag" v-for="t in product.skins" :key="t">{{ t }}</span>
              </div>
              <div class="product-footer">
                <span class="product-price">R {{ product.price }}</span>
                <button
                  class="product-add-btn"
                  @click="addToCart(product)"
                  :disabled="product.adding || !product.product_id"
                >
                  <span v-if="product.adding" class="btn-spinner-sm"></span>
                  <span v-else-if="product.added">✓ Added</span>
                  <span v-else>+ Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    

    <!-- ── CTA ── -->
    <section class="cta-strip">
      <div class="cta-strip-inner">
        <h2>Find what your<br/><span class="accent-light">skin actually needs.</span></h2>
        <p>Scan your skin and let Face.IT recommend exactly the right products from our brands and our own range.</p>
        <router-link to="/login" class="cta-btn">Start Your Scan</router-link>
      </div>
    </section>

    <!-- Toast notification -->
    <transition name="fade">
      <div v-if="toast.show" :class="['toast', toast.type]">{{ toast.message }}</div>
    </transition>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AppNavbar from '../components/Appnavbar.vue'
import AppFooter from '../components/Appfooter.vue'

// ── Import product images ────────────────────────────────────────────────────
// Scanner images
import imgScannerLite   from '../assets/The Face I.T 1.png'
import imgScannerPro    from '../assets/The Face I.T Pro 1.jpg'
import imgScannerClinic from '../assets/face scanner.jpg'

// Neutrogena
import imgBrightBoostSerum      from '../assets/BoostIlluminatingserum.jpg'
import imgBrightBoostResurface  from '../assets/Bright Boost resurfacing.jpg'
import imgRetinolBoostDay       from '../assets/renitol boost day cream.jpg'
import imgIntenseRepair         from '../assets/repair body lotion.jpg'
import imgSpotControlling       from '../assets/Spot controling wash.jpg'

// The Ordinary
import imgDeliveryEssence from '../assets/Delivery Essence.jpg'
import imgGlycolicAcid    from '../assets/Glycolic Acid.jpg'
import imgLacticAcid      from '../assets/Lactic Acid.jpg'
import imgNiacinamide     from '../assets/Niacinmaide.jpg'
import imgRetinol         from '../assets/retinol.jpg'

// Nivea
import imgDermaDry       from '../assets/Nivea derma dry control.jpg'
import imgCellularFiller from '../assets/The Cellular Filler Set Nivea.jpg'
import imgLuminous630    from '../assets/The Nivea Cellular Luminous 630 Antispot Serum.jpg'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const router = useRouter()

// ── Toast ────────────────────────────────────────────────────────────────────
const toast = reactive({ show: false, message: '', type: 'success' })
function showToast(message, type = 'success') {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => { toast.show = false }, 3000)
}

// ── Add to Cart ──────────────────────────────────────────────────────────────
async function addToCart(item) {
  const stored = localStorage.getItem('user')
  if (!stored) {
    localStorage.setItem('redirect_after_login', '/brands#scanners')
    router.push('/login')
    return
  }
  if (!item.product_id) {
    showToast('This product is not yet available.', 'error')
    return
  }
  const user = JSON.parse(stored)
  const token = localStorage.getItem('token')
  item.adding = true
  try {
    await axios.post(`${API_BASE}/carts/${user.id}/items`, {
      product_id: item.product_id,
      quantity: 1,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })
    item.added = true
    showToast(`${item.name} added to cart!`)
    window.dispatchEvent(new Event('user-updated'))
    setTimeout(() => { item.added = false }, 3000)
  } catch (err) {
    showToast(err.response?.data?.message || 'Could not add to cart.', 'error')
  } finally {
    item.adding = false
  }
}

// ── Partner brands ───────────────────────────────────────────────────────────
const brands = ref([
  {
    name: 'The Ordinary',
    initials: 'TO',
    colorClass: 'ordinary',
    featured: false,
    tagline: 'Clinical formulations with integrity.',
    desc: 'Known for its no-nonsense, science-first approach to skincare. Face.IT integrates their targeted actives — retinols, acids, peptides — directly into your AI-generated routine.',
    tags: ['Serums', 'Actives', 'Retinoids', 'Exfoliants'],
    url: 'https://theordinary.com',
  },
  {
    name: 'Nivea',
    initials: 'N',
    colorClass: 'nivea',
    featured: true,
    tagline: 'Trusted skincare for over 100 years.',
    desc: "One of the world's most recognised skincare brands. Through our partnership, Face.IT users get access to Nivea's full hydration and protection range, recommended precisely to your moisture profile.",
    tags: ['Moisturisers', 'Anti-Spot', 'Body Care', 'Cellular Range'],
    url: 'https://www.nivea.co.za',
  },
  {
    name: 'Neutrogena',
    initials: 'NG',
    colorClass: 'neutrogena',
    featured: false,
    tagline: 'Dermatologist recommended skincare.',
    desc: "Clinically proven formulas trusted by dermatologists worldwide. Neutrogena's brightening, retinol, and acne lines are matched by our scanner to users who need them most.",
    tags: ['Bright Boost', 'Retinol', 'Body Care', 'Cleansers'],
    url: 'https://www.neutrogena.com',
  },
])

// ── Scanners ─────────────────────────────────────────────────────────────────
const scanners = ref([
  {
    name: 'Face.IT Lite',
    tier: 'Starter',
    tierClass: 'tier-lite',
    glowClass: 'glow-lite',
    price: 'R 1,499',
    image: imgScannerLite,
    desc: 'The perfect entry point. Compact home-use scanner with full hydration, oil balance, and skin type analysis.',
    specs: ['Hydration mapping', 'Oil zone detection', 'Skin type classification', 'App sync via Bluetooth'],
    product_id: 1,
    adding: false,
    added: false,
  },
  {
    name: 'Face.IT Pro',
    tier: 'Most Popular',
    tierClass: 'tier-pro',
    glowClass: 'glow-pro',
    price: 'R 3,299',
    image: imgScannerPro,
    desc: 'Our flagship device. UV damage detection, aging analysis, and full personalised routine builder — all in one scan.',
    specs: ['All Lite features', 'UV & aging detection', 'Tone & texture analysis', 'Routine builder AI', 'Cloud skin history'],
    product_id: 2,
    adding: false,
    added: false,
  },
  {
    name: 'Face.IT Clinic',
    tier: 'Professional',
    tierClass: 'tier-clinic',
    glowClass: 'glow-clinic',
    price: 'Contact Us',
    image: imgScannerClinic,
    desc: 'Built for dermatologists and beauty professionals. Multi-client profiles, clinical-grade reporting, and practice dashboard.',
    specs: ['All Pro features', 'Multi-client profiles', 'Clinical PDF reports', 'Practice dashboard', 'Priority API access'],
    product_id: 3,
    adding: false,
    added: false,
  },
])

// ── Brand filter tabs ────────────────────────────────────────────────────────
const brandTabs = ['All', 'The Ordinary', 'Nivea', 'Neutrogena']
const activeTab = ref('All')

// ── Partner brand products ───────────────────────────────────────────────────
const partnerProducts = ref([
  // ── The Ordinary ──────────────────────────────────────────────
  {
    brand: 'The Ordinary', sku: 'TO-ESSENCE-001', name: 'Multi-Active Delivery Essence',
    type: 'Essence', price: '189',
    desc: 'A hydrating essence that primes the skin and improves absorption of subsequent skincare steps.',
    skins: ['All skin types'], image: imgDeliveryEssence, product_id: 9, adding: false, added: false,
  },
  {
    brand: 'The Ordinary', sku: 'TO-GLYCO-001', name: 'Glycolic Acid 7% Exfoliating Toner',
    type: 'Toner', price: '149',
    desc: 'Exfoliating toner that smooths texture and brightens skin tone with AHA acid at pH 3.6.',
    skins: ['Normal', 'Oily', 'Combination'], image: imgGlycolicAcid, product_id: 10, adding: false, added: false,
  },
  {
    brand: 'The Ordinary', sku: 'TO-LACTIC-001', name: 'Lactic Acid 10% + HA',
    type: 'Peeling Solution', price: '175',
    desc: 'High-strength lactic acid for superficial peeling, improved clarity and visible anti-aging effects.',
    skins: ['Dry', 'Dull', 'Mature'], image: imgLacticAcid, product_id: 11, adding: false, added: false,
  },
  {
    brand: 'The Ordinary', sku: 'TO-NIAC-001', name: 'Niacinamide 5% Body Emulsion',
    type: 'Body Treatment', price: '219',
    desc: 'Multi-functional face and body emulsion targeting brighter, more even skin tone with 5% niacinamide.',
    skins: ['All skin types', 'Hyperpigmentation'], image: imgNiacinamide, product_id: 12, adding: false, added: false,
  },
  {
    brand: 'The Ordinary', sku: 'TO-RETI-001', name: 'Retinol 1% in Squalane',
    type: 'Retinoid', price: '289',
    desc: 'High-strength retinol in a water-free squalane base. Targets signs of aging and skin texture.',
    skins: ['Mature', 'Normal', 'Combination'], image: imgRetinol, product_id: 13, adding: false, added: false,
  },
  // ── Nivea ────────────────────────────────────────────────────
  {
    brand: 'Nivea', sku: 'NV-DERMA-001', name: 'Derma Dry Control Anti-Perspirant',
    type: 'Body Care', price: '129',
    desc: '96-hour extreme sweat defence with DermaDry technology that protects and cares for the skin.',
    skins: ['All skin types'], image: imgDermaDry, product_id: 14, adding: false, added: false,
  },
  {
    brand: 'Nivea', sku: 'NV-CELL-001', name: 'Cellular Filler Gift Set',
    type: 'Gift Set', price: '549',
    desc: 'Intensive anti-age set with 20% Hydra Elixir. Includes day cream and serum for visible line correction.',
    skins: ['Mature', 'Dry', 'Normal'], image: imgCellularFiller, product_id: 15, adding: false, added: false,
  },
  {
    brand: 'Nivea', sku: 'NV-LUM-001', name: 'Cellular Luminous 630 Anti-Spot Serum',
    type: 'Serum', price: '349',
    desc: 'Intensive serum with patented Luminous630® technology that visibly reduces dark spots and hyperpigmentation.',
    skins: ['Hyperpigmentation', 'All skin types'], image: imgLuminous630, product_id: 16, adding: false, added: false,
  },
  // ── Neutrogena ───────────────────────────────────────────────
  {
    brand: 'Neutrogena', sku: 'NG-BBSER-001', name: 'Bright Boost Illuminating Serum',
    type: 'Serum', price: '299',
    desc: 'Activates skin\'s natural renewal process with highly concentrated neoglucosamine for brighter, even-toned skin.',
    skins: ['All skin types'], image: imgBrightBoostSerum, product_id: 17, adding: false, added: false,
  },
  {
    brand: 'Neutrogena', sku: 'NG-BBPOL-001', name: 'Bright Boost Resurfacing Polish',
    type: 'Exfoliator', price: '229',
    desc: 'AHA + natural exfoliators work together to resurface and reveal smoother, more radiant skin.',
    skins: ['All skin types'], image: imgBrightBoostResurface, product_id: 18, adding: false, added: false,
  },
  {
    brand: 'Neutrogena', sku: 'NG-RETDAY-001', name: 'Retinol Boost Day Cream SPF 15',
    type: 'Day Cream', price: '319',
    desc: 'Anti-age day cream with retinol and SPF 15. Helps fight wrinkles, dryness, and age spots for visibly younger skin.',
    skins: ['Mature', 'Normal', 'Dry'], image: imgRetinolBoostDay, product_id: 19, adding: false, added: false,
  },
  {
    brand: 'Neutrogena', sku: 'NG-REPAIR-001', name: 'Intense Repair Cica Body Lotion',
    type: 'Body Lotion', price: '189',
    desc: 'Norwegian Formula upgraded with 10% glycerin + Centella Asiatica for instant relief on very dry, rough skin.',
    skins: ['Very Dry', 'Rough'], image: imgIntenseRepair, product_id: 20, adding: false, added: false,
  },
  {
    brand: 'Neutrogena', sku: 'NG-SPOT-001', name: 'Spot Controlling+ Face Wash',
    type: 'Cleanser', price: '149',
    desc: 'Salicylic Acid + 2% PHA formula. Fragrance-free, gentle cleanser that improves the look of spot marks in 1 week.',
    skins: ['Oily', 'Acne-Prone', 'Combination'], image: imgSpotControlling, product_id: 21, adding: false, added: false,
  },
])

const filteredPartnerProducts = computed(() => {
  if (activeTab.value === 'All') return partnerProducts.value
  return partnerProducts.value.filter(p => p.brand === activeTab.value)
})


</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Playfair+Display:wght@400;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.page { background: #fdf8f3; min-height: 100vh; color: #2d1f14; }

/* HERO */
.brands-hero { min-height: 55vh; display: flex; align-items: center; position: relative; overflow: hidden; padding: 140px 5% 80px; }
.hero-bg { position: absolute; inset: 0; pointer-events: none; }
.bg-petal { position: absolute; border-radius: 50%; }
.bp-1 { width: 700px; height: 700px; top: -200px; right: -150px; background: radial-gradient(circle, rgba(240,213,192,0.55) 0%, transparent 65%); filter: blur(50px); }
.bp-2 { width: 400px; height: 400px; bottom: -100px; left: -80px; background: radial-gradient(circle, rgba(232,200,176,0.4) 0%, transparent 65%); filter: blur(40px); }
.bg-lines { position: absolute; inset: 0; background-image: linear-gradient(rgba(196,120,74,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(196,120,74,0.04) 1px, transparent 1px); background-size: 44px 44px; }
.brands-hero-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
.page-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: #c4784a; display: block; margin-bottom: 20px; }
.page-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(60px, 8vw, 100px); line-height: 0.92; letter-spacing: 0.02em; color: #2d1f14; margin-bottom: 24px; }
.accent { color: #c4784a; }
.page-sub { font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.9; color: rgba(45,31,20,0.5); max-width: 560px; }

/* SECTIONS */
.section { padding: 100px 5%; }
.section.alt { background: rgba(196,120,74,0.04); border-top: 1px solid rgba(196,120,74,0.12); border-bottom: 1px solid rgba(196,120,74,0.12); }
.section-inner { max-width: 1200px; margin: 0 auto; }
.section-header { margin-bottom: 64px; max-width: 600px; }
.section-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #c4784a; display: block; margin-bottom: 14px; }
.section-header h2 { font-family: 'Playfair Display', serif; font-size: clamp(30px, 4vw, 48px); line-height: 1.2; color: #2d1f14; margin-bottom: 16px; }
.section-header p { font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.9; color: rgba(45,31,20,0.5); }

/* PARTNER CARDS */
.partner-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.partner-card { background: rgba(255,255,255,0.7); border: 1px solid rgba(45,31,20,0.08); border-radius: 6px; overflow: hidden; transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s; }
.partner-card:hover { border-color: rgba(196,120,74,0.4); transform: translateY(-4px); box-shadow: 0 8px 30px rgba(160,85,53,0.1); }
.partner-card.featured { border-color: rgba(196,120,74,0.3); background: rgba(196,120,74,0.04); }
.partner-logo-wrap { position: relative; height: 140px; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(45,31,20,0.06); background: rgba(255,255,255,0.5); }
.partner-logo-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.brand-initials { font-family: 'Bebas Neue', sans-serif; font-size: 52px; letter-spacing: 0.08em; line-height: 1; }
.brand-label-sm { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(45,31,20,0.3); }
.ordinary .brand-initials { color: #2d1f14; }
.nivea .brand-initials { color: #c4784a; }
.neutrogena .brand-initials { color: #a05535; }
.partner-badge { position: absolute; top: 14px; right: 14px; font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase; padding: 4px 10px; border-radius: 2px; background: rgba(45,31,20,0.05); color: rgba(45,31,20,0.35); border: 1px solid rgba(45,31,20,0.1); }
.featured-badge { background: rgba(196,120,74,0.12); color: #c4784a; border-color: rgba(196,120,74,0.35); }
.partner-body { padding: 28px 28px 32px; }
.partner-body h3 { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 0.08em; color: #2d1f14; margin-bottom: 6px; }
.partner-tagline { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: #c4784a; text-transform: uppercase; margin-bottom: 14px; }
.partner-desc { font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.8; color: rgba(45,31,20,0.5); margin-bottom: 20px; }
.partner-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
.ptag { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 10px; border-radius: 2px; background: rgba(196,120,74,0.07); border: 1px solid rgba(196,120,74,0.18); color: rgba(45,31,20,0.5); }
.brand-visit-btn { display: inline-flex; align-items: center; gap: 8px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #c4784a; text-decoration: none; border: 1px solid rgba(196,120,74,0.3); border-radius: 3px; padding: 9px 16px; transition: all 0.2s; }
.brand-visit-btn:hover { background: rgba(196,120,74,0.08); border-color: #c4784a; }
.brand-visit-btn svg { width: 14px; height: 14px; }

/* SCANNER CARDS */
.scanner-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.scanner-card { border: 1px solid rgba(45,31,20,0.08); border-radius: 6px; background: rgba(255,255,255,0.7); overflow: hidden; transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s; }
.scanner-card:hover { border-color: rgba(196,120,74,0.4); transform: translateY(-4px); box-shadow: 0 8px 30px rgba(160,85,53,0.1); }
.scanner-visual { position: relative; height: 240px; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(45,31,20,0.06); overflow: hidden; background: rgba(196,120,74,0.03); }
.scanner-glow { position: absolute; border-radius: 50%; filter: blur(40px); pointer-events: none; width: 200px; height: 200px; }
.glow-lite { background: radial-gradient(circle, rgba(196,120,74,0.18) 0%, transparent 70%); }
.glow-pro  { background: radial-gradient(circle, rgba(160,85,53,0.25) 0%, transparent 70%); }
.glow-clinic { background: radial-gradient(circle, rgba(212,114,106,0.18) 0%, transparent 70%); }
.scanner-img { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: cover; }
.scanner-placeholder { position: relative; z-index: 1; }
.scanner-placeholder svg { width: 150px; height: 180px; }
.scanner-tier-badge { position: absolute; top: 14px; left: 14px; font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase; padding: 5px 10px; border-radius: 2px; z-index: 2; }
.tier-lite { background: rgba(196,120,74,0.1); color: #c4784a; border: 1px solid rgba(196,120,74,0.25); }
.tier-pro  { background: rgba(160,85,53,0.14); color: #a05535; border: 1px solid rgba(160,85,53,0.3); }
.tier-clinic { background: rgba(212,114,106,0.1); color: #d4726a; border: 1px solid rgba(212,114,106,0.3); }
.scanner-body { padding: 28px; }
.scanner-name-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
.scanner-name-row h3 { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 0.08em; color: #2d1f14; }
.scanner-price { font-family: 'DM Mono', monospace; font-size: 13px; letter-spacing: 0.06em; color: #c4784a; }
.scanner-desc { font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.8; color: rgba(45,31,20,0.5); margin-bottom: 20px; }
.scanner-specs { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
.spec { display: flex; align-items: center; gap: 10px; font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(45,31,20,0.55); letter-spacing: 0.04em; }
.spec-dot { width: 5px; height: 5px; background: #c4784a; border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 5px rgba(196,120,74,0.5); }
.scanner-cta { width: 100%; background: transparent; border: 1px solid rgba(196,120,74,0.3); color: rgba(45,31,20,0.55); font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; padding: 12px; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
.add-cart-btn:hover:not(:disabled) { background: rgba(196,120,74,0.1); border-color: #c4784a; color: #2d1f14; }
.add-cart-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* BRAND FILTER TABS */
.brand-tabs { display: flex; gap: 8px; margin-bottom: 40px; flex-wrap: wrap; }
.brand-tab { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; padding: 8px 18px; border-radius: 3px; border: 1px solid rgba(45,31,20,0.12); background: transparent; color: rgba(45,31,20,0.45); cursor: pointer; transition: all 0.2s; }
.brand-tab:hover { border-color: rgba(196,120,74,0.4); color: #c4784a; }
.brand-tab.active { background: #c4784a; border-color: #c4784a; color: #fff; }

/* PRODUCT CARDS */
.products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.product-card { background: rgba(255,255,255,0.7); border: 1px solid rgba(45,31,20,0.08); border-radius: 6px; overflow: hidden; transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column; }
.product-card:hover { border-color: rgba(196,120,74,0.35); transform: translateY(-3px); box-shadow: 0 6px 20px rgba(160,85,53,0.1); }
.product-visual { position: relative; height: 180px; display: flex; align-items: center; justify-content: center; background: #fff; border-bottom: 1px solid rgba(45,31,20,0.06); overflow: hidden; }
.fi-visual { background: rgba(196,120,74,0.04); }
.product-glow { position: absolute; inset: 0; background: radial-gradient(circle at 50% 60%, rgba(196,120,74,0.08) 0%, transparent 70%); }
.product-img { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: contain; padding: 12px; }
.product-visual svg { position: relative; z-index: 1; width: 100px; height: 130px; }
.product-body { padding: 16px 18px 20px; display: flex; flex-direction: column; flex: 1; }
.product-brand-badge { font-family: 'DM Mono', monospace; font-size: 7px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(45,31,20,0.35); margin-bottom: 4px; }
.product-type-badge { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.16em; text-transform: uppercase; color: #c4784a; margin-bottom: 8px; display: inline-block; padding: 3px 8px; background: rgba(196,120,74,0.08); border: 1px solid rgba(196,120,74,0.2); border-radius: 2px; }
.product-body h4 { font-family: 'Bebas Neue', sans-serif; font-size: 17px; letter-spacing: 0.08em; color: #2d1f14; margin-bottom: 8px; line-height: 1.15; }
.product-body p { font-family: 'DM Mono', monospace; font-size: 10px; line-height: 1.75; color: rgba(45,31,20,0.45); margin-bottom: 12px; flex: 1; }
.product-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 14px; }
.skin-tag { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 8px; border-radius: 2px; background: rgba(45,31,20,0.04); border: 1px solid rgba(45,31,20,0.08); color: rgba(45,31,20,0.4); }
.product-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: auto; }
.product-price { font-family: 'DM Mono', monospace; font-size: 13px; color: #c4784a; letter-spacing: 0.04em; white-space: nowrap; }
.product-add-btn { padding: 9px 14px; border: 1px solid rgba(196,120,74,0.3); background: transparent; border-radius: 3px; cursor: pointer; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(45,31,20,0.55); transition: all 0.2s; display: flex; align-items: center; gap: 4px; white-space: nowrap; }
.product-add-btn:hover:not(:disabled) { background: rgba(196,120,74,0.08); border-color: #c4784a; color: #2d1f14; }
.product-add-btn:disabled { opacity: 0.45; cursor: not-allowed; }

/* Spinners */
.btn-spinner { display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(196,120,74,0.3); border-top-color: #c4784a; border-radius: 50%; animation: spin 0.7s linear infinite; }
.btn-spinner-sm { display: inline-block; width: 10px; height: 10px; border: 2px solid rgba(196,120,74,0.3); border-top-color: #c4784a; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* CTA */
.cta-strip { padding: 100px 5%; background: #c4784a; text-align: center; }
.cta-strip-inner { max-width: 620px; margin: 0 auto; }
.cta-strip h2 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(48px, 6vw, 76px); letter-spacing: 0.04em; line-height: 0.95; color: #fff; margin-bottom: 20px; }
.accent-light { color: rgba(255,255,255,0.75); }
.cta-strip p { font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.9; color: rgba(255,255,255,0.7); margin-bottom: 36px; }
.cta-btn { font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 0.2em; background: #fff; color: #c4784a; text-decoration: none; padding: 16px 44px; border-radius: 4px; display: inline-block; transition: background 0.2s, transform 0.2s; }
.cta-btn:hover { background: #fdf8f3; transform: translateY(-2px); }

/* Toast */
.toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.06em; padding: 12px 24px; border-radius: 4px; box-shadow: 0 4px 24px rgba(0,0,0,0.15); z-index: 999; white-space: nowrap; }
.toast.success { background: #2d1f14; color: #fff; }
.toast.error   { background: #c84a4a; color: #fff; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 1100px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 900px) { .partner-grid, .scanner-grid { grid-template-columns: 1fr; } .products-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .products-grid { grid-template-columns: 1fr; } }
</style>
