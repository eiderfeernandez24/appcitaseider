import { createRouter, createWebHistory } from 'vue-router';
import Registro from '../views/Registro.vue'; // Asegúrate de que esta ruta sea correcta
import Login from '../views/Login.vue';
import UserPage from '@/views/UserPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/registro',
      name: 'registro',   // Ruta para el registro
      component: Registro,  // Componente de registro
    },
    {
      path: '/login',
      name: 'login',   // Ruta para el registro
      component: Login,  // Componente de registro
    },
    {
      path: '/user',
      name: 'UserPage',
      component: UserPage,
    },
    // Puedes agregar más rutas si es necesario
  ],
});

export default router;
