<template>
  <div class="main-content">
    <div class="text-center py-5">
      <h2>Bienvenido a MediConnect</h2>
      <p class="intro-text lead">
        Bienvenido a MediConnect, tu aplicación para gestionar citas médicas de manera sencilla y rápida.  
        Encuentra especialistas, reserva consultas y mantén el control de tu salud sin complicaciones.  
        ¡Tu bienestar, a solo un clic de distancia!
      </p>
      <div class="row justify-content-center my-4">
        <div class="col-12 col-md-4">
          <img src="https://image.freepik.com/vetores-gratis/telas-do-aplicativo-de-marcacao-de-consultas-medicas_23-2148563062.jpg" alt="Imagen 1" class="img-custom">
        </div>
        <div class="col-12 col-md-4">
          <img src="https://static.vecteezy.com/system/resources/previews/002/990/983/non_2x/personal-doctor-appointment-2d-isolated-illustration-vector.jpg" alt="Imagen 2" class="img-custom">
        </div>
        <div class="col-12 col-md-4">
          <img src="https://img.freepik.com/vector-premium/concepto-redondo-cita-medica-linea-escena-personas-estilo-dibujos-animados-planos_198565-3855.jpg?w=2000" alt="Imagen 3" class="img-custom">
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
            <img src="https://cdn-icons-png.flaticon.com/512/1316/1316214.png" alt="Ver citas" class="icon me-2" width="30">
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
            <button class="btn btn-danger" @click="cancelarCitaSeleccionada">Cancelar Cita</button>
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
          <h4>¿Es MediConnect gratis?</h4>
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
import Swal from 'sweetalert2';

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
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        this.citas = respuesta.data;
        this.actualizarCalendario();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las citas.',
          confirmButtonColor: '#ff69b4'
        });
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
    async cancelarCitaSeleccionada() {
      const cita = this.selectedEvent;
      const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción cancelará tu cita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff69b4',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, mantener',
      });

      if (confirmacion.isConfirmed) {
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
            date: cita.date,
          };

          await axios.post('http://127.0.0.1:5000/date/delete', datos, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          });

          Swal.fire({
            icon: 'success',
            title: 'Cita cancelada',
            text: `La cita en ${cita.center} ha sido cancelada.`,
            confirmButtonColor: '#ff69b4'
          });

          this.obtenerCitas(); // Recargar citas
          this.selectedEvent = null; // Cerrar el modal
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cancelar la cita.',
            confirmButtonColor: '#ff69b4'
          });
        }
      }
    },
  },
};
</script>

<style scoped>
   @import "../assets/styles/UserPageStyle.scss";
</style>