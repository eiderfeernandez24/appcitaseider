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
      <!-- <p><strong>Centro seleccionado:</strong> {{ centroSeleccionado }}</p> -->
    </div>

    <notifications position="top right" />
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      centros: [],
      centroSeleccionado: "",
      fecha: "",
      hora: ""
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
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No estás autenticado. Por favor, inicia sesión.",
            confirmButtonColor: "#ff69b4"
          });
          return;
        }

        const respuesta = await axios.get("http://127.0.0.1:5000/centers", {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.centros = respuesta.data;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los centros.",
          confirmButtonColor: "#ff69b4"
        });
      }
    },

    async reservar() {
      if (!this.centroSeleccionado || !this.fecha || !this.hora) {
        Swal.fire({
          icon: "warning",
          title: "Atención",
          text: "Por favor, completa todos los campos.",
          confirmButtonColor: "#ff69b4"
        });
        return;
      }

      const fechaHora = `${this.fecha.split("-").reverse().join("/")} ${this.hora}:00`;
      const cita = { center: this.centroSeleccionado, date: fechaHora };

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No estás autenticado. Por favor, inicia sesión.",
            confirmButtonColor: "#ff69b4"
          });
          return;
        }

        await axios.post("http://127.0.0.1:5000/date/create", cita, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });

        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Cita reservada con éxito.",
          confirmButtonColor: "#ff69b4"
        }).then(() => {
          this.$router.push("/user");
        });

        this.agregarCitaAlCalendario(cita);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo reservar la cita.",
          confirmButtonColor: "#ff69b4"
        });
      }
    },

    agregarCitaAlCalendario(cita) {
      if (typeof cita.date === "string") {
        cita.date = new Date(cita.date);
      }
      this.$emit("cita-reservada", cita);
    }
  }
};
</script>

<style scoped>
   @import "../assets/styles/ReservarCitaStyle.scss";
</style>