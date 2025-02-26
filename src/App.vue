<template>
  <header v-if="!isUserPage"> <!-- Solo muestra el header si NO estamos en la página de usuario -->
    <div class="wrapper">
      <!-- Logo y título -->
      <div class="logo-container text-center">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/2555/2555936.png" 
          alt="Logo de la app de citas" 
          class="logo img-fluid" 
        />
        <h1 class="display-4">Matchify</h1>
      </div>

      <!-- Botones de Login y Registro -->
      <div class="buttons-container d-flex flex-column flex-sm-row justify-content-center gap-3 mt-3">
        <RouterLink to="/login">
          <button class="login-btn btn btn-lg btn-pink">Iniciar sesión</button>
        </RouterLink>
        <RouterLink to="/registro">
          <button class="register-btn btn btn-lg btn-pink">Registrarse</button>
        </RouterLink>
      </div>
    </div>
  </header>

  <!-- Aquí se mostrará el contenido dependiendo de la ruta -->
  <RouterView></RouterView>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router'; // Para acceder a la ruta actual

// Estado para saber si estamos en la página de usuario
const isUserPage = ref(false);

// Obtenemos la ruta actual
const route = useRoute();

// Usamos un watcher para detectar cambios en la ruta y ocultar el header si estamos en la página de usuario
watchEffect(() => {
  isUserPage.value = route.path === '/user'; // Cambia '/user' por la ruta que corresponde a tu página de usuario
});
</script>

<style scoped>
/* Estilos globales para el header */
header {
  /* background: linear-gradient(135deg, #f4a6c6, #ff77b5); */
  color: #fff;
  padding: 60px 20px;
  text-align: center;
  min-height: 70vh; /* Altura mínima para que no se quede pegado al contenido en pantallas pequeñas */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.1); */
  position: relative;
}

/* Contenedor para el logo y título */
.wrapper {
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* Estilos para el logo */
.logo-container {
  margin-bottom: 30px;
}

.logo {
  width: 120px; /* Ajuste de tamaño del logo */
  height: auto;
  margin-bottom: 20px;
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  letter-spacing: 1px;
  margin-bottom: 30px;
  text-transform: uppercase;
  color: white;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3); /* Sombra de texto */
}

/* Estilos para la imagen decorativa */
.header-image {
  margin-bottom: 20px;
}

.header-img {
  max-width: 100%;
  height: auto;
  border-radius: 10px; /* Bordes redondeados para la imagen */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Sombra sutil para la imagen */
}

/* Contenedor de los botones */
.buttons-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
}

/* Estilos para los botones */
button {
  font-size: 1.2rem;
  padding: 12px 35px;
  border-radius: 8px; /* Bordes rectangulares */
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-btn {
  background-color: #ff66b2; /* Rosa para login */
  color: white;
}

.login-btn:hover {
  background-color: #ff4d94;
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2); /* Sombra más intensa */
}

.register-btn {
  background-color: #ff4081; /* Rosa fuerte para registro */
  color: white;
}

.register-btn:hover {
  background-color: #e03069;
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2); /* Sombra más intensa */
}

/* Responsividad para pantallas más pequeñas */
@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }

  .logo {
    width: 100px;
  }

  /* Los botones se mostrarán en columna en pantallas pequeñas */
  .buttons-container {
    flex-direction: column;
    gap: 10px;
  }

  button {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    margin: 5px 0;
  }

  .header-img {
    width: 100%;
  }
}

@media (max-width: 576px) {
  h1 {
    font-size: 2rem;
  }

  .logo {
    width: 80px;
  }

  .buttons-container {
    gap: 8px;
  }

  button {
    width: 100%;
    font-size: 0.9rem;
    padding: 10px;
  }
}
</style>
