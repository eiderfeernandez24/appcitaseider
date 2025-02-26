<template>
    <div class="container text-center py-5">
      <h2 class="">Bienvenido a Matchify</h2>
      <p class="intro-text lead">
        Matchify es tu nueva aplicación para encontrar citas y conectar con personas interesantes. Explora, reserva y gestiona tus encuentros de forma fácil y rápida. ¡Haz nuevos amigos o encuentra a esa persona especial hoy mismo!
      </p>
  
      <!-- Imágenes en línea -->
      <div class="row justify-content-center my-4">
        <div class="col-12 col-md-4">
          <img src="https://s2.ppllstatics.com/rc/www/multimedia/2024/02/21/GF4J6EB1.jpg" alt="Imagen 1" class="img-custom">
        </div>
        <div class="col-12 col-md-4">
          <img src="https://lamenteesmaravillosa.com/wp-content/uploads/2021/07/moviles-app-citas.jpg" alt="Imagen 2" class="img-custom">
        </div>
        <div class="col-12 col-md-4">
          <img src="https://neubox.com/blog/wp-content/uploads/2024/01/860x436-CITAS-2.webp" alt="Imagen 3" class="img-custom">
        </div>
      </div>
  
      <!-- Botones con dos columnas -->
      <div class="row justify-content-center g-3">
        <div class="col-12 col-md-5">
          <button class="btn btn-light w-100 py-2" @click="modificarInformacion">
            <img src="https://cdn-icons-png.flaticon.com/512/263/263164.png" alt="Modificar información" class="icon me-2" width="30">
            Modificar información
          </button>
        </div>
        <div class="col-12 col-md-5">
          <button class="btn btn-light w-100 py-2" @click="reservarCita">
            <img src="https://cdn-icons-png.flaticon.com/512/7322/7322265.png" alt="Reservar cita" class="icon me-2" width="30">
            Reservar cita
          </button>
        </div>
        <div class="col-12 col-md-5">
          <button class="btn btn-light w-100 py-2" @click="verCitas">
            <img src="https://cdn-icons-png.freepik.com/512/2150/2150419.png" alt="Ver citas" class="icon me-2" width="30">
            Ver mis citas
          </button>
        </div>
        <div class="col-12 col-md-5">
          <button class="btn btn-light w-100 py-2" @click="cancelarCitas">
            <img src="https://cdn.iconscout.com/icon/free/png-256/free-cancelar-cita-1131241.png" alt="Cancelar cita" class="icon me-2" width="30">
            Cancelar cita
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      modificarInformacion() {
        this.$router.push('/modificar-informacion');
      },
      reservarCita() {
        this.$router.push('/reservar-cita');
      },
      verCitas() {
        this.$router.push('/ver-citas');
      },
      cancelarCitas() {
        this.$router.push('/cancelar-cita');
      },
    },
  };
  </script>
  
  <style scoped>
  /* Contenedor ocupa todo el ancho */
  .container {
    width: 100%;
    height: 100%;
    max-width: 100%;
    background: linear-gradient(135deg, #f3b9c9, #f7c6d6);ackground: linear-gradient(135deg, #f4a6c6, #ff77b5);
    color: white;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    margin: 0;

  }
  
  /* Estilos para los botones */
  .btn-light {
    color: #ff65a3;
    font-weight: bold;
    border-radius: 25px;
    transition: transform 0.3s;
    font-size: 14px; /* Hacer los botones más pequeños */
    padding: 8px 12px; /* Ajustar el tamaño del botón */
  }
  
  .btn-light:hover {
    transform: scale(1.05);
    background: white;
  }
  
  /* Ajustar botones en dos columnas */
  .row.g-4 {
    display: flex;
    flex-wrap: wrap;
    justify-content: center; /* Centrar las dos columnas */
  }
  
  /* Ajustes para las imágenes */
  .img-custom {
    width: 300px;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  </style>  