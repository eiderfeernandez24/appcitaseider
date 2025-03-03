<template>
  <div class="container text-center py-5">
    <h2>Bienvenido a Matchify</h2>
    <p class="intro-text lead">
      Matchify es tu nueva aplicación para encontrar citas y conectar con personas interesantes. Explora, reserva y gestiona tus encuentros de forma fácil y rápida. ¡Haz nuevos amigos o encuentra a esa persona especial hoy mismo!
    </p>

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

    <div class="mt-5 calendar-container">
      <h3>Mi Calendario de Citas</h3>
      <FullCalendar :options="calendarOptions" />
    </div>

    <div v-if="selectedEvent" class="modal">
  <div class="modal-content">
    <span class="close" @click="closeModal">&times;</span>
    <h3>Detalles de la Cita</h3>
    <p><strong>Centro:</strong> {{ selectedEvent.center }}</p>
    <p><strong>Fecha:</strong> {{ formatDate(selectedEvent.date) }}</p>
    <p><strong>Hora:</strong> {{ formatTime(selectedEvent.date) }}</p> <div class="col-12 col-md-4">
    </div>
  </div>
</div>
</div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      citas: [],
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: [],
        height: 600,
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        },
        eventColor: '#87CEEB',
        eventBorderColor: '#4682B4',
        eventClick: this.handleEventClick,
      },
      selectedEvent: null,
    };
  },
  mounted() {
    this.obtenerCitas();
  },
  methods: {
    formatTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString({ hour: '2-digit', minute: '2-digit' });
    },
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
      this.$router.push('/ver-citas');
    },
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
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        this.citas = respuesta.data;
        this.actualizarCalendario();
      } catch (error) {
        console.error('Error al obtener las citas:', error.response ? error.response.data : error.message);
        alert('No se pudieron cargar las citas');
      }
    },
    actualizarCalendario() {
      this.calendarOptions.events = this.citas.map((cita) => {
        const fecha = new Date(cita.date);
        return {
          title: cita.center,
          start: fecha,
          extendedProps: cita,
        };
      });
    },
    handleEventClick(info) {
      this.selectedEvent = info.event.extendedProps;
    },
    closeModal() {
      this.selectedEvent = null;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  max-width: 100%;
  background: linear-gradient(135deg, #ffb6c1, #ff69b4);
  color: white;
  border-radius: 10px;
  margin: 0;
}

.btn-light {
  color: #ff65a3;
  font-weight: bold;
  border-radius: 25px;
  transition: transform 0.3s;
  font-size: 14px;
  padding: 8px 12px;
}

.btn-light:hover {
  transform: scale(1.05);
  background: white;
}

.row.g-4 {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.img-custom {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.calendar-container {
  max-width: 95%; /* Aumentamos el ancho máximo para que ocupe más espacio horizontal */
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Sombra más pronunciada */
  overflow: hidden; /* Para que los bordes redondeados se vean bien */
  background: linear-gradient(135deg, #ffb6c1, #ff69b4);
}

.fc {
  font-size: 13px; /* Reducimos el tamaño de la fuente */
}

.fc-col-header-cell {
  background-color: #f0f8ff;
  padding: 8px; /* Reducimos el padding */
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.fc-daygrid-day-number {
  padding: 6px; /* Reducimos el padding */
}

.fc-daygrid-event {
  padding: 4px; /* Reducimos el padding */
  margin: 2px; /* Reducimos el margen */
  border-radius: 4px; /* Bordes más redondeados */
  font-size: 11px; /* Reducimos el tamaño de la fuente */
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; /* Agregamos transición para la sombra */
  background-color: #e0f2fe; /* Color de fondo más claro */
  border: 1px solid #b3e5fc; /* Borde más claro */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra suave */
}

.fc-daygrid-event:hover {
  transform: scale(1.03); /* Ligero aumento al pasar el ratón */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15); /* Sombra más pronunciada al pasar el ratón */
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>