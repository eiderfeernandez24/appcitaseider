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
import Swal from 'sweetalert2';

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
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No estás autenticado. Por favor, inicia sesión.',
            confirmButtonColor: '#ff69b4'
          });
          return;
        }

        const respuesta = await axios.get('http://127.0.0.1:5000/date/getByUser', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        this.citas = respuesta.data;
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las citas.',
          confirmButtonColor: '#ff69b4'
        });
      }
    },

    async cancelarCita(cita) {
      const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción cancelará tu cita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff69b4',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, mantener'
      });

      if (!confirmacion.isConfirmed) {
        Swal.fire({
          icon: 'info',
          title: 'Cancelación abortada',
          text: 'Tu cita sigue activa.',
          confirmButtonColor: '#ff69b4'
        });
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No estás autenticado. Por favor, inicia sesión.',
            confirmButtonColor: '#ff69b4'
          });
          return;
        }

        const datos = {
          center: cita.center,
          date: cita.date, // Se pasa la fecha tal cual
        };

        await axios.post('http://127.0.0.1:5000/date/delete', datos, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        Swal.fire({
          icon: 'success',
          title: 'Cita cancelada',
          html: `
            <p><strong>Centro:</strong> ${cita.center}</p>
            <p><strong>Fecha:</strong> ${this.formatDate(cita.date)}</p>
            <p><strong>Hora:</strong> ${this.formatTime(cita.date)}</p>
          `,
          confirmButtonColor: '#ff69b4'
        });

        this.obtenerCitas(); // Recargar la lista de citas
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cancelar la cita.',
          confirmButtonColor: '#ff69b4'
        });
      }
    },

    formatDate(dateString) {
  if (!dateString) return 'Fecha no disponible';

  // Convertimos la fecha de "DD/MM/YYYY HH:mm:ss" a "YYYY-MM-DD HH:mm:ss"
  const partes = dateString.split(" ");
  if (partes.length !== 2) return 'Fecha inválida';

  const [fecha, hora] = partes;
  const [day, month, year] = fecha.split("/");

  if (!day || !month || !year) return 'Fecha inválida';

  const formattedDate = new Date(`${year}-${month}-${day}T${hora}`);
  
  if (isNaN(formattedDate.getTime())) return 'Fecha inválida';

  return `${day}/${month}/${year}`;
},

formatTime(dateString) {
  if (!dateString) return 'Hora no disponible';

  const partes = dateString.split(" ");
  if (partes.length !== 2) return 'Hora inválida';

  const hora = partes[1];
  return hora.substring(0, 5); // Solo HH:mm
},

  },
};

  </script>
  
  <style scoped>
.container {
  background: #f7c6d6;
  margin-top: 20px;
  color: white;
  height: 100%; 
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
  