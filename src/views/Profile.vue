<template>
  <div class="profile">
    <h2>Perfil del Usuario</h2>
    <form @submit.prevent="guardarCambios">
      <div class="form-group">
        <label for="username">Nombre de usuario:</label>
        <input type="text" id="username" v-model="user.username" required />
      </div>
      <div class="form-group">
        <label for="email">Correo electrónico:</label>
        <input type="email" id="email" v-model="user.email" required />
      </div>
      <div class="form-group">
        <label for="telefono">Teléfono:</label>
        <input type="text" id="telefono" v-model="user.phone" />
      </div>
      <button type="submit">Guardar cambios</button>
    </form>
    <div v-if="mensaje" class="mensaje">{{ mensaje }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
  computed: {
    ...mapState(['user']) // Obtener los datos del usuario desde Vuex
  },
  data() {
    return {
      mensaje: ''
    };
  },
  methods: {
    async guardarCambios() {
      try {
        const respuesta = await axios.put('http://127.0.0.1:5000/user/update', this.user);
        if (respuesta.status === 200) {
          this.mensaje = 'Datos actualizados exitosamente';
        } else {
          this.mensaje = `Error: ${respuesta.status} - ${respuesta.statusText}`;
        }
      } catch (error) {
        if (error.response) {
          this.mensaje = `Error: ${error.response.data.message || error.response.statusText}`;
        } else {
          this.mensaje = 'No se pudo conectar con el servidor, por favor intente nuevamente';
        }
      }
    }
  }
};
</script>

<style scoped>
/* Estilos para el perfil del usuario... */
</style>
