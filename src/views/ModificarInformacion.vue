<template>
  <div class="registro">
    <h2 class="text-center text-white mb-3">Actualizar Información de Perfil</h2>
    <form @submit.prevent="actualizarPerfil">
      <div class="row mb-2">
        <div class="col-12 col-sm-6">
          <label for="nombre" class="form-label text-white">Nombre:</label>
          <input type="text" class="form-control" id="nombre" v-model="usuario.name" required />
        </div>
        <div class="col-12 col-sm-6">
          <label for="apellido" class="form-label text-white">Apellido:</label>
          <input type="text" class="form-control" id="apellido" v-model="usuario.lastname" required />
        </div>
      </div>

      <div class="row mb-2">
        <div class="col-12 col-sm-6">
          <label for="correo" class="form-label text-white">Correo electrónico:</label>
          <input type="email" class="form-control" id="correo" v-model="usuario.email" required />
        </div>
        <div class="col-12 col-sm-6">
          <label for="telefono" class="form-label text-white">Teléfono:</label>
          <input type="text" class="form-control" id="telefono" v-model="usuario.phone" required />
        </div>
      </div>

      <div class="row mb-2">
        <div class="col-12 col-sm-6">
          <label for="fechaNacimiento" class="form-label text-white">Fecha de nacimiento:</label>
          <input type="date" class="form-control" id="fechaNacimiento" v-model="usuario.date" required />
        </div>
      </div>

      <button type="submit" class="btn btn-pink w-100 mb-10">Actualizar</button>
    </form>

    <div v-if="mensaje" class="mt-3 text-white text-center">
      <p>{{ mensaje }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'; // Importa SweetAlert2

export default {
  data() {
    return {
      usuario: {
        name: '',
        lastname: '',
        email: '',
        phone: '',
        date: ''
      },
      mensaje: ''
    };
  },
  created() {
    this.obtenerPerfil();
  },
  methods: {
    async obtenerPerfil() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (response.data.date) {
          this.usuario.date = this.convertirFechaADateInput(response.data.date);
        }

        this.usuario = { ...this.usuario, ...response.data };
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
        this.mensaje = "Hubo un error al obtener los datos del perfil.";
      }
    },

    convertirFechaADateInput(fecha) {
      if (!fecha) return '';
      const partes = fecha.split('/');
      const dia = partes[0].padStart(2, '0');
      const mes = partes[1].padStart(2, '0');
      const anio = partes[2];
      return `${anio}-${mes}-${dia}`;
    },

    async actualizarPerfil() {
      try {
        const fechaBackend = this.convertirFechaADateBackend(this.usuario.date);
        const response = await axios.patch('http://127.0.0.1:5000/currentUser', {
          name: this.usuario.name,
          lastname: this.usuario.lastname,
          email: this.usuario.email,
          phone: this.usuario.phone,
          date: fechaBackend
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (response.status === 201) {
          Swal.fire({
            icon: 'success',
            title: '¡Perfil actualizado!',
            text: 'Tu perfil se ha modificado correctamente.',
            confirmButtonColor: '#ff69b4'
          }).then(() => {
          this.$router.push("/user");
        });
        } else {
          this.mensaje = "Error al actualizar el perfil.";
        }
      } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        this.mensaje = "Hubo un error al actualizar el perfil.";
      }
    },

    convertirFechaADateBackend(fecha) {
      if (!fecha) return '';
      const partes = fecha.split('-');
      const anio = partes[0];
      const mes = partes[1].padStart(2, '0');
      const dia = partes[2].padStart(2, '0');
      return `${dia}/${mes}/${anio}`;
    }
  }
};
</script>

<style scoped>
.registro {
  margin: 50px auto;
  padding: 15px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ffb6c1, #ff69b4);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.registro h2 {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.form-label {
  font-size: 14px;
}

.form-control {
  font-size: 14px;
  padding: 8px;
}

.btn-pink {
  background-color: #ff69b4;
  color: white;
  font-size: 14px;
  border-radius: 8px;
}

.btn-pink:hover {
  background-color: #ff1493;
}

@media (max-width: 576px) {
  .registro {
    width: 90%;
    padding: 15px;
  }

  .form-label {
    font-size: 14px;
  }

  .form-control {
    font-size: 14px;
    padding: 10px;
  }

  .btn-pink {
    font-size: 14px;
  }
}
</style>