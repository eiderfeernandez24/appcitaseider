<template>
    <div class="container text-center py-2">
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
        citas: [], // Lista de citas obtenidas del backend
      };
    },
    mounted() {
      this.obtenerCitas(); // Obtener citas al montar el componente
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
  
          const respuesta = await axios.get('http://127.0.0.1:5000/date/getByUser', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });
  
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

    // Verificar si cita.date está presente
    if (!cita.date) {
      console.error('Fecha no encontrada en la cita:', cita);
      alert('La cita no tiene la información de fecha correcta.');
      return;
    }

    // La fecha debería estar en formato "DD/MM/YYYY HH:mm:ss", lo cual ya debería estar bien si todo es consistente
    const fechaOriginal = cita.date;  // El backend debería haber guardado la fecha en ese formato ya

    const datos = {
      center: cita.center,
      date: fechaOriginal,  // No modificamos la fecha, se pasa tal cual
    };

    console.log('Enviando datos al backend:', JSON.stringify(datos, null, 2)); // Depuración

    await axios.post('http://127.0.0.1:5000/date/delete', datos, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    alert('Cita cancelada exitosamente');
    this.obtenerCitas(); // Recargar la lista de citas
  } catch (error) {
    console.error('Error al cancelar la cita:', error.response ? error.response.data : error.message);
    alert('No se pudo cancelar la cita');
  }
},
  
      formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
  
      formatTime(dateString) {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      },
    },
  };
  </script>
  
  <style scoped>
.container {
  background: linear-gradient(135deg, #ffb6c1, #ff69b4);
  color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  height: 100vh; 
}

.list-group {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Espacio entre las citas */
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
  