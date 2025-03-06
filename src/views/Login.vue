<template>
  <div class="login container">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-8 col-md-6 col-lg-9">
        <h2 class="text-center text-white mb-4">Iniciar sesión</h2>
        <form @submit.prevent="iniciarSesion">
          <div class="form-group">
            <label for="username" class="text-white">Usuario:</label>
            <input type="text" id="username" v-model="username" class="form-control" required placeholder="Ingresa tu nombre de usuario" />
          </div>
          <div class="form-group">
            <label for="password" class="text-white">Contraseña:</label>
            <input type="password" id="password" v-model="password" class="form-control" required placeholder="Ingresa tu contraseña" />
          </div>
          <button type="submit" class="btn btn-pink btn-block">Iniciar sesión</button>
        </form>
        <div v-if="mensaje" class="mensaje mt-3 text-center">{{ mensaje }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      mensaje: ''
    };
  },
  methods: {
    async iniciarSesion() {
  const datosUsuario = {
    username: this.username,
    password: this.password
  };

  try {
    const respuesta = await axios.post('http://127.0.0.1:5000/login', datosUsuario);

    // Imprimir la respuesta completa en la consola
    console.log(respuesta);

    if (respuesta.status === 200 || respuesta.status === 201) {
      const token = respuesta.data.access_token;  // Acceder a 'access_token' en lugar de 'token'

if (token) {
  // Guardar el token en localStorage
  localStorage.setItem('token', token);

  this.mensaje = 'Inicio de sesión exitoso';
  this.$emit('authenticated', true);

  // Redirigir al usuario
  this.$router.push('/user');
    } else {
      this.mensaje = 'No se recibió el token';
    }
    } else {
      this.mensaje = `Error: ${respuesta.status} - ${respuesta.statusText}`;
    }
  } catch (error) {
    if (error.response) {
      this.mensaje = 'Usuario no registrado';
    } else {
      this.mensaje = 'No se pudo conectar con el servidor, por favor intente nuevamente';
    }
  }
}
  }
};
</script>

<style scoped>
  @import url(src/assets/styles/LoginStyle.scss);
</style>
