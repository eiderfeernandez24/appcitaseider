<template>
    <div class="container text-center py-5">
      <h2>Mis Citas</h2>
      <p class="lead">Aquí puedes ver todas tus citas reservadas.</p>
  
      <!-- Mostrar citas si hay alguna -->
      <div v-if="citas.length > 0" class="list-group">
        <div v-for="cita in citas" :key="cita.id" class="list-group-item mb-3">
          <h5>{{ cita.center }}</h5>
          <p><strong>Fecha:</strong> {{ formatDate(cita.date) }}</p>
          <p><strong>Hora:</strong> {{ formatTime(cita.date) }}</p>
          <button class="btn btn-danger" @click="cancelarCita(cita)">Cancelar</button>
        </div>
      </div>
  
      <!-- Mensaje si no hay citas -->
      <div v-else>
        <p>No tienes citas reservadas aún.</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        citas: [],  // Aquí guardamos las citas obtenidas
      };
    },
    mounted() {
      this.obtenerCitas();  // Llamamos a la función para obtener las citas cuando el componente se monte
    },
    methods: {
      async obtenerCitas() {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('No se encontró el token en localStorage');
            alert('No estás autenticado. Por favor, inicia sesión.');
            return;
          }
  
          // Realizamos la solicitud GET al backend
          const respuesta = await axios.get('http://127.0.0.1:5000/date/getByUser', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
  
          // Guardamos las citas obtenidas en la variable 'citas'
          this.citas = respuesta.data;
          console.log('Citas obtenidas:', this.citas);
        } catch (error) {
          console.error('Error al obtener las citas:', error.response ? error.response.data : error.message);
          alert('No se pudieron cargar las citas');
        }
      },
  
      async cancelarCita(cita) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Por favor, inicia sesión.');
      return;
    }

    // Convertimos la fecha al formato esperado por el backend: "25/12/2025 14:00:00"
    const fechaOriginal = new Date(cita.date);
    const day = String(fechaOriginal.getDate()).padStart(2, '0');
    const month = String(fechaOriginal.getMonth() + 1).padStart(2, '0');
    const year = fechaOriginal.getFullYear();
    const hours = String(fechaOriginal.getHours()).padStart(2, '0');
    const minutes = String(fechaOriginal.getMinutes()).padStart(2, '0');
    const seconds = '00';
    const fechaFormateada = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    const datos = {
      center: cita.center,
      date: fechaFormateada,
    };

    console.log('Enviando datos al backend:', datos); // Verifica qué se está enviando

    await axios.post('http://127.0.0.1:5000/date/delete', datos, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    alert('Cita cancelada exitosamente');
    this.obtenerCitas(); // Recargar la lista de citas
  } catch (error) {
    console.error('Error al cancelar la cita:', error.response ? error.response.data : error.message);
    alert('No se pudo cancelar la cita');
  }
},
  
      // Método para formatear la fecha en formato DD/MM/YYYY
      formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
  
      // Método para obtener solo la hora de la cita
      formatTime(dateString) {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      },
  
      // Método para formatear fecha y hora en el formato esperado por el backend
      formatDateTime(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = '00'; // Suponemos que los segundos son siempre 00
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    background: linear-gradient(135deg, #f3b9c9, #f7c6d6);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  .list-group-item {
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  h5 {
    font-size: 20px;
    font-weight: bold;
  }
  
  p {
    font-size: 16px;
  }
  
  .btn-danger {
    margin-top: 10px;
  }
  </style>
  