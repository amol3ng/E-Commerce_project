import { createRouter, createWebHistory } from 'vue-router'
import HomeView     from '../views/HomeView.vue'
import AboutView    from '../views/AboutView.vue'
import ProductView  from '../views/ProductView.vue'
import BrandsView   from '../views/BrandsView.vue'
import LoginView    from '../views/LoginView.vue'
import CartView     from '../views/CartView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import OrdersView   from '../views/OrdersView.vue'
import TrackView    from '../views/TrackView.vue'
import ContactView  from '../views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/product', name: 'product', component: ProductView },
    { path: '/brands', name: 'brands', component: BrandsView },
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
      meta: { requiresAuth: true },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
      meta: { requiresAuth: true },
    },
    {
      path: '/track/:orderNumber',
      name: 'track',
      component: TrackView,
      meta: { requiresAuth: true },
    },
    { path: '/contact', name: 'contact', component: ContactView },
  ],

  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition

    // Handle hash links like /brands#scanners
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const el = document.querySelector(to.hash)
          if (el) {
            resolve({ el: to.hash, top: 90, behavior: 'smooth' })
          } else {
            resolve({ top: 0 })
          }
        }, 300) // wait for page to render
      })
    }

    return { top: 0 }
  },
})

// ── Auth guard ────────────────────────────────────────────────────────────────
// Saves intended destination so login page can redirect back after sign-in
router.beforeEach((to, _from, next) => {
  const isLoggedIn = !!localStorage.getItem('user')

  if (to.meta.requiresAuth && !isLoggedIn) {
    // Store where user was trying to go
    localStorage.setItem('redirect_after_login', to.fullPath)
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router