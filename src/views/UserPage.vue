<template>
  <div class="main-content">
    <div class="text-center py-5">
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

      <div class="text-center py-5">
        <div class="mt-5 calendar-container">
          <FullCalendar :options="calendarOptions" />
        </div>

        <div class="mt-5 statistics-container">
          <h3>Estadísticas de Citas</h3>
          <div class="row justify-content-center">
            <div class="col-12 col-md-4">
              <div class="statistic-card total-citas">
                <h4>Total de Citas</h4>
                <p>{{ citas.length }}</p>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="statistic-card proxima-cita">
                <h4>Próxima Cita</h4>
                <p>{{ proximaCita }}</p>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="statistic-card centros-visitados">
                <h4>Centros Visitados</h4>
                <p>{{ centrosVisitados.size }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedEvent" class="modal">
          <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <h3>Detalles de la Cita</h3>
            <p><strong>Centro:</strong> {{ selectedEvent.center }}</p>
            <p><strong>Fecha:</strong> {{ formatDate(selectedEvent.date) }}</p>
            <p><strong>Hora:</strong> {{ formatTime(selectedEvent.date) }}</p>
          </div>
        </div>
      </div>

      <div class="faq">
        <h3>Preguntas Frecuentes</h3>
        <div class="faq-item">
          <h4>¿Cómo puedo reservar una cita?</h4>
          <p>Ve a la sección "Reservar cita" y sigue los pasos.</p>
        </div>
        <div class="faq-item">
          <h4>¿Es Matchify gratis?</h4>
          <p>Sí, la aplicación es completamente gratuita.</p>
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
        height: 400,
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
  computed: {
    proximaCita() {
      if (this.citas.length === 0) return 'Ninguna';
      const fechas = this.citas.map(cita => new Date(cita.date));
      const ahora = new Date();
      const futuras = fechas.filter(fecha => fecha > ahora);
      if (futuras.length === 0) return 'Ninguna';
      const proxima = new Date(Math.min(...futuras));
      return this.formatDate(proxima) + ' ' + this.formatTime(proxima);
    },
    centrosVisitados() {
      const centros = new Set(this.citas.map(cita => cita.center));
      return centros;
    },
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
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Pacifico&display=swap');

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100vh;
}

h2 {
  font-family: 'Pacifico', cursive;
  color: black;
  font-size: 2.5em;
  margin-bottom: 20px;
}

.btn-light {
  background: linear-gradient(to bottom, #ffffff, #f0f0f0);
  color: #ff65a3;
  font-weight: bold;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-light:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.img-custom {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
}

.img-custom:hover {
  transform: scale(1.05);
}

.calendar-container {
  max-width: 100%;
  margin: 20px auto;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  overflow: auto;
  background: white;
  border: 1px solid #ddd;
}

.fc-col-header-cell {
  background-color: #f8f8f8;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.fc-daygrid-day-number {
  padding: 8px;
}

.fc-daygrid-event {
  background-color: #c0c8cd;
  border: 1px solid #b3e5fc;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  font-size: 12px;
  margin: 3px;
  padding: 5px;
}

.fc-daygrid-event:hover {
  transform: scale(1.03);
}

.fc-daygrid-day {
  border: 1px solid #eee;
}

.statistics-container {
  background: #ffe9ec;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  margin-top: 30px;
}

.statistics-container > h3 {
  color: black;
}

.statistic-card {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
}

.statistic-card:hover {
  transform: translateY(-5px);
}

.statistic-icon {
  font-size: 2.5em;
  margin-bottom: 15px;
}

.total-citas .statistic-icon {
  color: #4CAF50;
}

.proxima-cita .statistic-icon {
  color: #2196F3;
}

.centros-visitados .statistic-icon {
  color: #FF9800;
}

.statistic-card h4 {
  color: #333;
  margin-bottom: 8px;
}

.statistic-card p {
  font-size: 1.2em;
  font-weight: bold;
  color: #555;
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
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  padding: 20px;
  max-width: 600px;
  width: 80%;
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

.faq {
  background: #f8f8f8;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}

.faq h3 {
  color: black;
  margin-bottom: 20px;
}

.faq-item {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>