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
          <div class="partner-card" v-for="brand in brands" :key="brand.name" :class="{ featured: brand.featured }">
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
              <div class="scanner-placeholder">
                <svg viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="40" y="20" width="100" height="160" rx="12" fill="rgba(196,120,74,0.06)" stroke="rgba(196,120,74,0.3)" stroke-width="1.5"/>
                  <rect x="55" y="40" width="70" height="90" rx="6" fill="rgba(196,120,74,0.06)" stroke="rgba(196,120,74,0.2)" stroke-width="1"/>
                  <ellipse cx="90" cy="85" rx="22" ry="28" fill="none" stroke="#c4784a" stroke-width="1" opacity="0.6"/>
                  <path d="M78 78 L84 84 L90 78" fill="none" stroke="#c4784a" stroke-width="1" opacity="0.7"/>
                  <path d="M90 78 L96 84 L102 78" fill="none" stroke="#c4784a" stroke-width="1" opacity="0.7"/>
                  <path d="M82 98 Q90 104 98 98" fill="none" stroke="#c4784a" stroke-width="1.2" opacity="0.8"/>
                  <path d="M58 43 L58 50 L65 50" stroke="#c4784a" stroke-width="1.5" opacity="0.8"/>
                  <path d="M122 43 L122 50 L115 50" stroke="#c4784a" stroke-width="1.5" opacity="0.8"/>
                  <path d="M58 127 L58 120 L65 120" stroke="#c4784a" stroke-width="1.5" opacity="0.8"/>
                  <path d="M122 127 L122 120 L115 120" stroke="#c4784a" stroke-width="1.5" opacity="0.8"/>
                  <rect x="70" y="148" width="40" height="5" rx="2.5" fill="rgba(196,120,74,0.3)"/>
                  <circle cx="90" cy="168" r="8" fill="none" stroke="rgba(196,120,74,0.4)" stroke-width="1.5"/>
                  <circle cx="90" cy="168" r="3.5" fill="rgba(196,120,74,0.4)"/>
                  <line x1="58" y1="85" x2="122" y2="85" stroke="#c4784a" stroke-width="0.5" opacity="0.2"/>
                  <line x1="58" y1="85" x2="122" y2="85" stroke="#c4784a" stroke-width="1" opacity="0.5">
                    <animate attributeName="y1" values="45;125;45" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="y2" values="45;125;45" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0;0.6;0" dur="3s" repeatCount="indefinite"/>
                  </line>
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
              <button class="scanner-cta">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FACE.IT OWN PRODUCTS ── -->
    <section class="section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-label">Face.IT Range</span>
          <h2>Our own products.<br/><span class="accent">Formulated from your data.</span></h2>
          <p>Beyond our partner brands, Face.IT offers our own clinically-informed product line — every formula shaped by real scan data from thousands of skin profiles.</p>
        </div>
        <div class="products-grid">
          <div class="product-card" v-for="product in ownProducts" :key="product.name">
            <div class="product-visual">
              <div class="product-glow"></div>
              <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="35" y="30" width="50" height="100" rx="10" fill="rgba(196,120,74,0.07)" stroke="rgba(196,120,74,0.25)" stroke-width="1.2"/>
                <rect x="45" y="18" width="30" height="18" rx="6" fill="rgba(196,120,74,0.1)" stroke="rgba(196,120,74,0.2)" stroke-width="1"/>
                <rect x="43" y="55" width="34" height="5" rx="2.5" fill="rgba(196,120,74,0.35)"/>
                <rect x="46" y="66" width="28" height="3" rx="1.5" fill="rgba(196,120,74,0.2)"/>
                <rect x="48" y="74" width="24" height="3" rx="1.5" fill="rgba(196,120,74,0.15)"/>
                <circle cx="60" cy="100" r="12" fill="none" stroke="rgba(196,120,74,0.3)" stroke-width="1"/>
                <text x="60" y="104" text-anchor="middle" font-size="8" fill="rgba(196,120,74,0.7)" font-family="monospace" font-weight="bold">FI</text>
              </svg>
            </div>
            <div class="product-body">
              <div class="product-type-badge">{{ product.type }}</div>
              <h4>{{ product.name }}</h4>
              <p>{{ product.desc }}</p>
              <div class="product-tags">
                <span class="skin-tag" v-for="t in product.skins" :key="t">{{ t }}</span>
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

    <AppFooter />
  </div>
</template>

<script setup>
import AppNavbar from '../components/Appnavbar.vue'
import AppFooter from '../components/Appfooter.vue'

const brands = [
  {
    name: 'The Ordinary',
    initials: 'TO',
    colorClass: 'ordinary',
    featured: false,
    tagline: 'Clinical formulations with integrity.',
    desc: 'Known for its no-nonsense, science-first approach to skincare. Face.IT integrates their targeted actives — retinols, acids, peptides — directly into your AI-generated routine.',
    tags: ['Serums', 'Actives', 'Retinoids', 'Peeling Solutions'],
  },
  {
    name: 'Nivea',
    initials: 'N',
    colorClass: 'nivea',
    featured: true,
    tagline: 'Trusted skincare for over 100 years.',
    desc: 'One of the world\'s most recognised skincare brands. Through our partnership, Face.IT users get access to Nivea\'s full hydration and protection range, recommended precisely to your moisture profile.',
    tags: ['Moisturisers', 'SPF', 'Body Care', 'Men\'s Range'],
  },
  {
    name: 'Neutrogena',
    initials: 'NG',
    colorClass: 'neutrogena',
    featured: false,
    tagline: 'Dermatologist recommended skincare.',
    desc: 'Clinically proven formulas trusted by dermatologists worldwide. Neutrogena\'s acne, hydration, and sun care lines are matched by our scanner to users who need them most.',
    tags: ['Acne Care', 'Hydration', 'Sun Care', 'Cleansers'],
  },
]

const scanners = [
  {
    name: 'Face.IT Lite',
    tier: 'Starter',
    tierClass: 'tier-lite',
    glowClass: 'glow-lite',
    price: 'R 1,499',
    desc: 'The perfect entry point. Compact home-use scanner with full hydration, oil balance, and skin type analysis.',
    specs: ['Hydration mapping', 'Oil zone detection', 'Skin type classification', 'App sync via Bluetooth'],
  },
  {
    name: 'Face.IT Pro',
    tier: 'Most Popular',
    tierClass: 'tier-pro',
    glowClass: 'glow-pro',
    price: 'R 3,299',
    desc: 'Our flagship device. UV damage detection, aging analysis, and full personalised routine builder — all in one scan.',
    specs: ['All Lite features', 'UV & aging detection', 'Tone & texture analysis', 'Routine builder AI', 'Cloud skin history'],
  },
  {
    name: 'Face.IT Clinic',
    tier: 'Professional',
    tierClass: 'tier-clinic',
    glowClass: 'glow-clinic',
    price: 'Contact Us',
    desc: 'Built for dermatologists and beauty professionals. Multi-client profiles, clinical-grade reporting, and practice dashboard.',
    specs: ['All Pro features', 'Multi-client profiles', 'Clinical PDF reports', 'Practice dashboard', 'Priority API access'],
  },
]

const ownProducts = [
  { name: 'FI Daily Moisturiser', type: 'Moisturiser', desc: 'Lightweight, non-comedogenic daily hydration formulated for all skin types identified by Face.IT scans.', skins: ['All skin types'] },
  { name: 'FI Peptide Serum', type: 'Serum', desc: 'High-potency peptide complex targeting fine lines and loss of firmness. Matched to mature or stressed skin profiles.', skins: ['Mature', 'Dry', 'Combination'] },
  { name: 'FI SPF 50 Shield', type: 'Sunscreen / SPF', desc: 'Broad-spectrum mineral SPF 50. Invisible finish, no white cast. Ideal for all UV-exposed profiles.', skins: ['All skin types'] },
  { name: 'FI Gentle Cleanser', type: 'Cleanser', desc: 'pH-balanced gel cleanser that removes impurities without stripping the skin barrier.', skins: ['Sensitive', 'Oily', 'Normal'] },
  { name: 'FI Balancing Toner', type: 'Toner', desc: 'Alcohol-free toner with niacinamide and witch hazel. Tightens pores and preps skin for serums.', skins: ['Oily', 'Combination'] },
  { name: 'FI Brightening Eye Cream', type: 'Eye Cream', desc: 'Caffeine and vitamin K complex targeting dark circles and puffiness detected in periorbital scan zones.', skins: ['All skin types'] },
  { name: 'FI Hydra-Repair Mask', type: 'Face Mask', desc: 'Weekly intensive sheet mask delivering 72-hour hydration. Recommended for dehydrated skin profiles.', skins: ['Dry', 'Dehydrated'] },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Playfair+Display:wght@400;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.page { background: #fdf8f3; min-height: 100vh; color: #2d1f14; }

/* HERO */
.brands-hero {
  min-height: 55vh; display: flex; align-items: center;
  position: relative; overflow: hidden; padding: 140px 5% 80px;
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
.brands-hero-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
.page-label {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.22em;
  text-transform: uppercase; color: #c4784a; display: block; margin-bottom: 20px;
}
.page-title {
  font-family: 'Bebas Neue', sans-serif; font-size: clamp(60px, 8vw, 100px);
  line-height: 0.92; letter-spacing: 0.02em; color: #2d1f14; margin-bottom: 24px;
}
.accent { color: #c4784a; }
.page-sub {
  font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.9;
  color: rgba(45,31,20,0.5); max-width: 560px;
}

/* SECTIONS */
.section { padding: 100px 5%; }
.section.alt {
  background: rgba(196,120,74,0.04);
  border-top: 1px solid rgba(196,120,74,0.12);
  border-bottom: 1px solid rgba(196,120,74,0.12);
}
.section-inner { max-width: 1200px; margin: 0 auto; }
.section-header { margin-bottom: 64px; max-width: 600px; }
.section-label {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em;
  text-transform: uppercase; color: #c4784a; display: block; margin-bottom: 14px;
}
.section-header h2 {
  font-family: 'Playfair Display', serif; font-size: clamp(30px, 4vw, 48px);
  line-height: 1.2; color: #2d1f14; margin-bottom: 16px;
}
.section-header p {
  font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.9;
  color: rgba(45,31,20,0.5);
}

/* PARTNER CARDS */
.partner-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.partner-card {
  background: rgba(255,255,255,0.7); border: 1px solid rgba(45,31,20,0.08);
  border-radius: 6px; overflow: hidden; transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
}
.partner-card:hover { border-color: rgba(196,120,74,0.4); transform: translateY(-4px); box-shadow: 0 8px 30px rgba(160,85,53,0.1); }
.partner-card.featured { border-color: rgba(196,120,74,0.3); background: rgba(196,120,74,0.04); }

.partner-logo-wrap {
  position: relative; height: 140px; display: flex; align-items: center; justify-content: center;
  border-bottom: 1px solid rgba(45,31,20,0.06); background: rgba(255,255,255,0.5);
}
.partner-logo-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.brand-initials {
  font-family: 'Bebas Neue', sans-serif; font-size: 52px; letter-spacing: 0.08em; line-height: 1;
}
.brand-label-sm {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.16em;
  text-transform: uppercase; color: rgba(45,31,20,0.3);
}
.ordinary .brand-initials { color: #2d1f14; }
.nivea .brand-initials { color: #c4784a; }
.neutrogena .brand-initials { color: #a05535; }

.partner-badge {
  position: absolute; top: 14px; right: 14px;
  font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.14em;
  text-transform: uppercase; padding: 4px 10px; border-radius: 2px;
  background: rgba(45,31,20,0.05); color: rgba(45,31,20,0.35);
  border: 1px solid rgba(45,31,20,0.1);
}
.featured-badge { background: rgba(196,120,74,0.12); color: #c4784a; border-color: rgba(196,120,74,0.35); }

.partner-body { padding: 28px 28px 32px; }
.partner-body h3 {
  font-family: 'Bebas Neue', sans-serif; font-size: 26px;
  letter-spacing: 0.08em; color: #2d1f14; margin-bottom: 6px;
}
.partner-tagline {
  font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em;
  color: #c4784a; text-transform: uppercase; margin-bottom: 14px;
}
.partner-desc {
  font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.8;
  color: rgba(45,31,20,0.5); margin-bottom: 20px;
}
.partner-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.ptag {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.1em;
  text-transform: uppercase; padding: 4px 10px; border-radius: 2px;
  background: rgba(196,120,74,0.07); border: 1px solid rgba(196,120,74,0.18);
  color: rgba(45,31,20,0.5);
}

/* SCANNER CARDS */
.scanner-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.scanner-card {
  border: 1px solid rgba(45,31,20,0.08); border-radius: 6px;
  background: rgba(255,255,255,0.7); overflow: hidden;
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
}
.scanner-card:hover { border-color: rgba(196,120,74,0.4); transform: translateY(-4px); box-shadow: 0 8px 30px rgba(160,85,53,0.1); }

.scanner-visual {
  position: relative; height: 200px;
  display: flex; align-items: center; justify-content: center;
  border-bottom: 1px solid rgba(45,31,20,0.06); overflow: hidden;
  background: rgba(196,120,74,0.03);
}
.scanner-glow {
  position: absolute; border-radius: 50%; filter: blur(40px);
  pointer-events: none; width: 200px; height: 200px;
}
.glow-lite { background: radial-gradient(circle, rgba(196,120,74,0.18) 0%, transparent 70%); }
.glow-pro  { background: radial-gradient(circle, rgba(160,85,53,0.25) 0%, transparent 70%); }
.glow-clinic { background: radial-gradient(circle, rgba(212,114,106,0.18) 0%, transparent 70%); }

.scanner-placeholder { position: relative; z-index: 1; }
.scanner-placeholder svg { width: 150px; height: 180px; }

.scanner-tier-badge {
  position: absolute; top: 14px; left: 14px;
  font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.14em;
  text-transform: uppercase; padding: 5px 10px; border-radius: 2px;
}
.tier-lite { background: rgba(196,120,74,0.1); color: #c4784a; border: 1px solid rgba(196,120,74,0.25); }
.tier-pro  { background: rgba(160,85,53,0.14); color: #a05535; border: 1px solid rgba(160,85,53,0.3); }
.tier-clinic { background: rgba(212,114,106,0.1); color: #d4726a; border: 1px solid rgba(212,114,106,0.3); }

.scanner-body { padding: 28px; }
.scanner-name-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px; flex-wrap: wrap; gap: 8px;
}
.scanner-name-row h3 {
  font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 0.08em; color: #2d1f14;
}
.scanner-price {
  font-family: 'DM Mono', monospace; font-size: 13px; letter-spacing: 0.06em; color: #c4784a;
}
.scanner-desc {
  font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.8;
  color: rgba(45,31,20,0.5); margin-bottom: 20px;
}
.scanner-specs { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
.spec {
  display: flex; align-items: center; gap: 10px;
  font-family: 'DM Mono', monospace; font-size: 11px;
  color: rgba(45,31,20,0.55); letter-spacing: 0.04em;
}
.spec-dot {
  width: 5px; height: 5px; background: #c4784a; border-radius: 50%;
  flex-shrink: 0; box-shadow: 0 0 5px rgba(196,120,74,0.5);
}
.scanner-cta {
  width: 100%; background: transparent; border: 1px solid rgba(196,120,74,0.3);
  color: rgba(45,31,20,0.55); font-family: 'DM Mono', monospace;
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  padding: 12px; border-radius: 4px; cursor: pointer; transition: all 0.2s;
}
.scanner-cta:hover { background: rgba(196,120,74,0.1); border-color: #c4784a; color: #2d1f14; }

/* OWN PRODUCTS */
.products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.product-card {
  background: rgba(255,255,255,0.7); border: 1px solid rgba(45,31,20,0.08);
  border-radius: 6px; overflow: hidden; transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
}
.product-card:hover { border-color: rgba(196,120,74,0.35); transform: translateY(-3px); box-shadow: 0 6px 20px rgba(160,85,53,0.1); }

.product-visual {
  position: relative; height: 140px; display: flex; align-items: center; justify-content: center;
  background: rgba(196,120,74,0.04); border-bottom: 1px solid rgba(45,31,20,0.06); overflow: hidden;
}
.product-glow {
  position: absolute; inset: 0;
  background: radial-gradient(circle at 50% 60%, rgba(196,120,74,0.1) 0%, transparent 70%);
}
.product-visual svg { position: relative; z-index: 1; width: 100px; height: 130px; }

.product-body { padding: 18px 18px 22px; }
.product-type-badge {
  font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.16em;
  text-transform: uppercase; color: #c4784a; margin-bottom: 8px; display: inline-block;
  padding: 3px 8px; background: rgba(196,120,74,0.08); border: 1px solid rgba(196,120,74,0.2); border-radius: 2px;
}
.product-body h4 {
  font-family: 'Bebas Neue', sans-serif; font-size: 18px;
  letter-spacing: 0.08em; color: #2d1f14; margin-bottom: 8px; line-height: 1.1;
}
.product-body p {
  font-family: 'DM Mono', monospace; font-size: 10px; line-height: 1.75;
  color: rgba(45,31,20,0.45); margin-bottom: 12px;
}
.product-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.skin-tag {
  font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.1em;
  text-transform: uppercase; padding: 3px 8px; border-radius: 2px;
  background: rgba(45,31,20,0.04); border: 1px solid rgba(45,31,20,0.08);
  color: rgba(45,31,20,0.4);
}

/* CTA */
.cta-strip { padding: 100px 5%; background: #c4784a; text-align: center; }
.cta-strip-inner { max-width: 620px; margin: 0 auto; }
.cta-strip h2 {
  font-family: 'Bebas Neue', sans-serif; font-size: clamp(48px, 6vw, 76px);
  letter-spacing: 0.04em; line-height: 0.95; color: #fff; margin-bottom: 20px;
}
.accent-light { color: rgba(255,255,255,0.75); }
.cta-strip p {
  font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.9;
  color: rgba(255,255,255,0.7); margin-bottom: 36px;
}
.cta-btn {
  font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 0.2em;
  background: #fff; color: #c4784a; text-decoration: none; padding: 16px 44px;
  border-radius: 4px; display: inline-block; transition: background 0.2s, transform 0.2s;
}
.cta-btn:hover { background: #fdf8f3; transform: translateY(-2px); }

@media (max-width: 1100px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 900px) {
  .partner-grid, .scanner-grid { grid-template-columns: 1fr; }
  .products-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) { .products-grid { grid-template-columns: 1fr; } }
</style>