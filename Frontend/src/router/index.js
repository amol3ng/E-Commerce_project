import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ProductView from '../views/ProductView.vue'
import BrandsView from '../views/BrandsView.vue'
import LoginView from '../views/LoginView.vue'
import CartView from '../views/CartView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import ContactView from '../views/Contactview.vue'

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
},
{
  path: '/checkout',
  name: 'checkout',
  component: CheckoutView,
},
{ path: '/contact', name: 'contact', component: ContactView },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router