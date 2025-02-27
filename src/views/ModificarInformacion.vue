<template>
    <div class="registro">
      <h2 class="text-center text-white mb-3">Actualizar Información de Perfil</h2>
      <form @submit.prevent="actualizarPerfil">
        <!-- Fila para Nombre y Apellido -->
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
  
        <!-- Fila para Correo y Teléfono -->
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
  
        <!-- Fila para Fecha de Nacimiento -->
        <div class="row mb-2">
          <div class="col-12 col-sm-6">
            <label for="fechaNacimiento" class="form-label text-white">Fecha de nacimiento:</label>
            <input type="date" class="form-control" id="fechaNacimiento" v-model="usuario.date" required />
          </div>
        </div>
  
        <!-- Botón de actualización -->
        <button type="submit" class="btn btn-pink w-100 mb-10">Actualizar</button>
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
      // Obtener perfil actual del usuario
      async obtenerPerfil() {
        try {
          const response = await axios.get('http://127.0.0.1:5000/profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
  
          // Asegurarse de que la fecha esté en formato adecuado para el input[type="date"]
          if (response.data.date) {
            this.usuario.date = this.convertirFechaADateInput(response.data.date);
          }
  
          // Rellenar los campos con los datos del perfil
          this.usuario = { ...this.usuario, ...response.data };
        } catch (error) {
          console.error("Error al obtener el perfil:", error);
          this.mensaje = "Hubo un error al obtener los datos del perfil.";
        }
      },
  
      // Función para convertir la fecha en formato DD/MM/YYYY a YYYY-MM-DD
      convertirFechaADateInput(fecha) {
        // Verifica que la fecha no sea nula o vacía
        if (!fecha) return '';
  
        const partes = fecha.split('/');
        // Ajustamos la fecha para asegurar el formato correcto (añadimos ceros si es necesario)
        const dia = partes[0].padStart(2, '0');
        const mes = partes[1].padStart(2, '0');
        const anio = partes[2];
  
        // Retornamos la fecha en el formato esperado "YYYY-MM-DD"
        return `${anio}-${mes}-${dia}`;
      },
    }
  };
  </script>  
  
  <style scoped>
  /* Estilos personalizados */
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
  
  /* Responsivo: Mejorar el ajuste en pantallas pequeñas */
  @media (max-width: 576px) {
    .registro {
      width: 90%;  /* Ajustar al 90% en dispositivos pequeños */
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