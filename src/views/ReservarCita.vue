<template>
  <div class="container text-center py-5">
    <h2>Reserva tu cita</h2>
    <form @submit.prevent="reservar">
      <div class="mb-3">
        <label for="centro" class="form-label">Selecciona el Centro de Salud:</label>
        <!-- El v-model está vinculado a centroSeleccionado y el valor de cada opción es el _id -->
        <select v-model="centroSeleccionado" class="form-control" required>
          <!-- Valor predeterminado para evitar selecciones vacías -->
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

    <!-- Depuración para ver el valor del centro seleccionado -->
    <div v-if="centroSeleccionado">
      <p><strong>Centro seleccionado:</strong> {{ centroSeleccionado }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      centros: [],           // Lista de centros
      centroSeleccionado: '', // Valor del centro seleccionado, inicialmente vacío
      fecha: '',              // Fecha seleccionada
      hora: ''                // Hora seleccionada
    };
  },
  mounted() {
    this.obtenerCentros();  // Llamar a obtenerCentros al montar el componente
  },
  methods: {
    async obtenerCentros() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No se encontró el token en localStorage');
          alert('No estás autenticado. Por favor, inicia sesión.');
          return;
        }

        const respuesta = await axios.get('http://localhost:5000/centers', {
          headers: {
            'Authorization': `Bearer ${token}`  // Enviar el token en el encabezado Authorization
          }
        });

        // Asegurarse de que la respuesta contiene los centros correctamente
        console.log('Centros obtenidos:', respuesta.data);
        this.centros = respuesta.data;  // Si los centros están directamente en la respuesta
      } catch (error) {
        console.error('Error al obtener los centros:', error.response ? error.response.data : error.message);
        alert('No se pudieron cargar los centros');
      }
    },
    async reservar() {
  console.log("Centro seleccionado:", this.centroSeleccionado);
  console.log("Fecha seleccionada:", this.fecha);
  console.log("Hora seleccionada:", this.hora);

  // Comprobar si alguno de los campos está vacío
  if (!this.centroSeleccionado || !this.fecha || !this.hora) {
    alert('Por favor, completa todos los campos');
    return;
  }

  // Comprobar si la fecha tiene un formato válido
  const fechaArray = this.fecha.split('-');  // Divide la fecha YYYY-MM-DD en un array
  if (fechaArray.length !== 3 || isNaN(new Date(this.fecha))) {
    alert('La fecha seleccionada no es válida.');
    return;
  }

  // Comprobar si la hora tiene un formato válido (HH:mm)
  const horaArray = this.hora.split(':');
  if (horaArray.length !== 2 || isNaN(parseInt(horaArray[0])) || isNaN(parseInt(horaArray[1]))) {
    alert('La hora seleccionada no es válida.');
    return;
  }

  // Formatear la fecha a DD/MM/YYYY
  const fechaFormateada = `${fechaArray[2]}/${fechaArray[1]}/${fechaArray[0]}`;

  // Crear la cadena de fecha completa con la hora
  const fechaHora = `${fechaFormateada} ${this.hora}:00`;  // Se asegura de que esté en el formato "DD/MM/YYYY HH:mm:ss"

  const cita = {
    center: this.centroSeleccionado,
    date: fechaHora
  };

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No se encontró el token en localStorage');
      alert('No estás autenticado. Por favor, inicia sesión.');
      return;
    }

    const respuesta = await axios.post('http://127.0.0.1:5000/date/create', cita, {
      headers: {
        'Authorization': `Bearer ${token}`  // Enviar el token en el encabezado Authorization
      }
    });

    alert('Cita reservada con éxito');
    this.$router.push('/user');  // Redirigir al usuario a la página principal
  } catch (error) {
    console.error('Error al reservar la cita:', error.response ? error.response.data : error.message);
    alert('No se pudo reservar la cita');
  }
}

  }
};
</script>

<style scoped>
/* Estilos para el formulario de reserva */
.container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f3b9c9, #f7c6d6);
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
