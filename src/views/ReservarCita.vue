<template>
    <div class="container text-center py-5">
      <h2>Reserva tu cita</h2>
      <form @submit.prevent="reservar">
        <div class="mb-3">
          <label for="centro" class="form-label">Selecciona el Centro de Salud:</label>
          <select v-model="centroSeleccionado" class="form-control" required>
            <option value="" disabled selected>Selecciona un centro</option>
            <option v-for="centro in centros" :key="centro.name" :value="centro.name">
              {{ centro.name }} - {{ centro.address }}
            </option>
          </select>
        </div>
  
        <div class="mb-3">
          <label for="fecha" class="form-label">Fecha de la cita:</label>
          <input type="date" class="form-control" v-model="fecha" required />
        </div>
  
        <div class="mb-3">
          <label for="hora" class="form-label">Hora:</label>
          <input type="time" class="form-control" v-model="hora" required />
        </div>
  
        <button type="submit" class="btn btn-pink w-100">Reservar cita</button>
      </form>
  
      <div v-if="centroSeleccionado">
        <p><strong>Centro seleccionado:</strong> {{ centroSeleccionado }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        centros: [],           // Lista de centros
        centroSeleccionado: '', // Centro seleccionado por el usuario
        fecha: '',              // Fecha de la cita
        hora: ''                // Hora de la cita
      };
    },
    
    mounted() {
      this.obtenerCentros();
    },
  
    methods: {
      async obtenerCentros() {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("No se encontró el token en localStorage");
            alert("No estás autenticado. Por favor, inicia sesión.");
            return;
          }
  
          const respuesta = await axios.get("http://127.0.0.1:5000/centers", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          this.centros = respuesta.data;
        } catch (error) {
          console.error("Error al obtener los centros:", error.response ? error.response.data : error.message);
          alert("No se pudieron cargar los centros");
        }
      },
  
      async reservar() {
        console.log("Centro seleccionado:", this.centroSeleccionado);
        console.log("Fecha seleccionada:", this.fecha);
        console.log("Hora seleccionada:", this.hora);
  
        // Validaciones
        if (!this.centroSeleccionado || !this.fecha || !this.hora) {
          alert("Por favor, completa todos los campos");
          return;
        }
  
        // Convertir la fecha de "YYYY-MM-DD" a "DD/MM/YYYY"
        const fechaArray = this.fecha.split("-");
        if (fechaArray.length !== 3) {
          alert("Formato de fecha no válido.");
          return;
        }
        const fechaFormateada = `${fechaArray[2]}/${fechaArray[1]}/${fechaArray[0]}`;
  
        // Convertir la hora de "HH:MM" a "HH:MM:00"
        const horaArray = this.hora.split(":");
        if (horaArray.length !== 2) {
          alert("Formato de hora no válido.");
          return;
        }
        const horaFormateada = `${horaArray[0]}:${horaArray[1]}:00`;
  
        // Construir la fecha completa en el formato "DD/MM/YYYY HH:MM:SS"
        const fechaHora = `${fechaFormateada} ${horaFormateada}`;
  
        const cita = {
          center: this.centroSeleccionado,
          date: fechaHora
        };
  
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("No se encontró el token en localStorage");
            alert("No estás autenticado. Por favor, inicia sesión.");
            return;
          }
  
          const respuesta = await axios.post("http://127.0.0.1:5000/date/create", cita, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
  
          alert("Cita reservada con éxito");
          this.$router.push("/user"); // Redirige a la página de usuario

          // Agregar la cita al calendario
          this.agregarCitaAlCalendario(cita);
        } catch (error) {
          console.error("Error al reservar la cita:", error.response ? error.response.data : error.message);
          alert("No se pudo reservar la cita");
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background: linear-gradient(135deg, #ffb6c1, #ff69b4);
    color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  .form-control {
    font-size: 16px;
    padding: 10px;
    border-radius: 8px;
  }
  
  .btn-pink {
    background-color: #ff69b4;
    color: white;
    font-size: 16px;
    border-radius: 8px;
  }
  
  .btn-pink:hover {
    background-color: #ff1493;
  }
  </style>
  