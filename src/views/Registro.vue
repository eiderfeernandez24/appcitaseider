<template>
  <div class="registro">
    <h2 class="text-center text-white mb-3">Registro de Usuario</h2>
    <form @submit.prevent="registrarUsuario">
      <!-- Fila para Nombre y Apellido -->
      <div class="row mb-2">
        <div class="col-12 col-sm-6">
          <label for="nombre" class="form-label text-white">Nombre:</label>
          <input type="text" class="form-control" id="nombre" v-model="nombre" required />
        </div>
        <div class="col-12 col-sm-6">
          <label for="apellido" class="form-label text-white">Apellido:</label>
          <input type="text" class="form-control" id="apellido" v-model="apellido" required />
        </div>
      </div>

      <!-- Fila para Nombre de Usuario y Correo -->
      <div class="row mb-2">
        <div class="col-12 col-sm-6">
          <label for="username" class="form-label text-white">Nombre de usuario:</label>
          <input type="text" class="form-control" id="username" v-model="username" required />
        </div>
        <div class="col-12 col-sm-6">
          <label for="correo" class="form-label text-white">Correo electrónico:</label>
          <input type="email" class="form-control" id="correo" v-model="correo" required />
        </div>
      </div>

      <!-- Fila para Teléfono y Fecha de Nacimiento -->
      <div class="row mb-2">
        <div class="col-12 col-sm-6">
          <label for="telefono" class="form-label text-white">Teléfono:</label>
          <input type="text" class="form-control" id="telefono" v-model="telefono" required />
        </div>
        <div class="col-12 col-sm-6">
          <label for="fechaNacimiento" class="form-label text-white">Fecha de nacimiento:</label>
          <input type="date" class="form-control" id="fechaNacimiento" v-model="fechaNacimiento" required />
        </div>
      </div>

      <!-- Fila para Contraseña -->
      <div class="row mb-2">
        <div class="col-12">
          <label for="contrasena" class="form-label text-white">Contraseña:</label>
          <input type="password" class="form-control" id="contrasena" v-model="contrasena" required />
        </div>
      </div>

      <!-- Botón de registro -->
      <button type="submit" class="btn btn-pink w-100 mb-10">Registrar</button>
    </form>
    <div v-if="mensaje" class="mt-3 text-white text-center">
      <p>{{ mensaje }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nombre: '',
      apellido: '',
      username: '',
      correo: '',
      telefono: '',
      fechaNacimiento: '',
      contrasena: '',
      mensaje: ''
    };
  },
  methods: {
    async registrarUsuario() {
      if (!this.nombre || !this.apellido || !this.username || !this.correo || !this.telefono || !this.fechaNacimiento || !this.contrasena) {
        this.mensaje = 'Por favor complete todos los campos';
        return;
      }

      const fechaFormateada = this.formatearFecha(this.fechaNacimiento);

      const datosUsuario = {
        date: fechaFormateada,
        email: this.correo,
        lastname: this.apellido,
        name: this.nombre,
        password: this.contrasena,
        phone: this.telefono,
        username: this.username
      };

      try {
        const respuesta = await axios.post('http://127.0.0.1:5000/register', datosUsuario, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (respuesta.status === 200 || respuesta.status === 201) {
          this.mensaje = 'Registro exitoso';
        } else {
          this.mensaje = `Error en el registro: ${respuesta.status} - ${respuesta.statusText}`;
        }
      } catch (error) {
        if (error.response) {
          this.mensaje = `Error en el registro: ${error.response.data.message || error.response.statusText}`;
        } else if (error.request) {
          this.mensaje = 'No se pudo conectar con el servidor, por favor intente nuevamente';
        } else {
          this.mensaje = `Error desconocido: ${error.message}`;
        }
      }
    },

    formatearFecha(fecha) {
      const fechaObjeto = new Date(fecha);
      const dia = String(fechaObjeto.getDate()).padStart(2, '0');
      const mes = String(fechaObjeto.getMonth() + 1).padStart(2, '0');
      const año = fechaObjeto.getFullYear();
      return `${dia}/${mes}/${año}`;
    }
  }
};
</script>

<style scoped>
   @import "../assets/styles/RegistroStyle.scss";
</style>
