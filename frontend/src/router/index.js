import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import relatoriosView from '../views/RelatoriosView.vue';
import { useUserStore } from '../stores/userStore';

const routes = [
  
	{
    path: '/',
    name: 'Login',
    component: LoginView,
  },
  // Outras rotas, como /dashboard
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/relatorios',
    name: 'relatoriosView',
    component: () => import('../views/RelatoriosView.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware para proteger rotas
// router.beforeEach((to, from, next) => {
//   const userStore = useUserStore();
//   if (to.meta.requiresAuth && !userStore.token) {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router;
