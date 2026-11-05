<template>
  <q-form class="row q-col-gutter-md" @submit="onSubmit">
    <!-- ¿Qué deseas hacer? -->
    <div class="col-12">
      <div class="text-subtitle2 q-mb-xs">¿Qué deseas hacer en EventosPeruIA?</div>
      <q-btn-toggle
        v-model="form.perfil"
        spread
        no-caps
        unelevated
        toggle-color="primary"
        color="grey-2"
        text-color="dark"
        :options="[
          { label: 'Comprar entradas', value: 'Comprar' },
          { label: 'Publicar eventos', value: 'Publicar' },
          { label: 'Ambas', value: 'Ambas' },
        ]"
      />
    </div>

    <div v-if="form.perfil !== 'Comprar'" class="col-12">
      <q-input
        v-model="form.nombreOrganizador"
        outlined
        label="Nombre del organizador *"
        hint="Así verán tu nombre los asistentes. Ej: Lima Live Producciones"
        lazy-rules
        :rules="[(v) => (v && v.trim().length >= 3 && v.length <= 80) || 'Entre 3 y 80 caracteres']"
      />
    </div>

    <div class="col-12 col-sm-6">
      <q-input v-model="form.nombre" outlined label="Nombres *" lazy-rules :rules="reglasNombre" />
    </div>
    <div class="col-12 col-sm-6">
      <q-input
        v-model="form.apellido"
        outlined
        label="Apellidos *"
        lazy-rules
        :rules="reglasNombre"
      />
    </div>

    <div class="col-12 col-sm-6">
      <q-input
        v-model="form.correo"
        outlined
        type="email"
        label="Correo electrónico *"
        lazy-rules
        :rules="[
          (v) => !!v || 'El correo es obligatorio',
          (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Formato válido: usuario@dominio.com',
        ]"
      />
    </div>
    <div class="col-12 col-sm-6">
      <q-input
        v-model="form.celular"
        outlined
        label="Celular *"
        mask="#########"
        lazy-rules
        :rules="[(v) => /^9\d{8}$/.test(v) || '9 dígitos y empieza con 9']"
      />
    </div>

    <div class="col-12 col-sm-4">
      <q-input
        v-model="form.fechaNacimiento"
        outlined
        type="date"
        stack-label
        label="Fecha de nacimiento *"
        lazy-rules
        :rules="[(v) => !!v || 'Obligatoria', (v) => esMayorDeEdad(v) || 'Debes ser mayor de edad']"
      />
    </div>
    <div class="col-12 col-sm-4">
      <q-select
        v-model="form.departamento"
        outlined
        label="Departamento *"
        :options="departamentos"
        lazy-rules
        :rules="[(v) => !!v || 'Obligatorio']"
      />
    </div>
    <div class="col-12 col-sm-4">
      <q-input
        v-model="form.distrito"
        outlined
        label="Distrito *"
        lazy-rules
        :rules="[(v) => !!v || 'Obligatorio']"
      />
    </div>

    <div class="col-12 col-sm-6">
      <q-input
        v-model="form.password"
        outlined
        type="password"
        label="Contraseña *"
        hint="Mínimo 8 caracteres, una mayúscula, una minúscula y un número"
        lazy-rules
        :rules="[
          (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v) || 'No cumple los requisitos',
        ]"
      />
    </div>
    <div class="col-12 col-sm-6">
      <q-input
        v-model="form.confirmarPassword"
        outlined
        type="password"
        label="Confirmar contraseña *"
        lazy-rules
        :rules="[(v) => v === form.password || 'Las contraseñas no coinciden']"
      />
    </div>

    <div class="col-12">
      <q-checkbox v-model="form.aceptaTerminos" label="Acepto los términos y condiciones" />
    </div>

    <div v-if="error" class="col-12">
      <q-banner dense rounded class="bg-red-1 text-negative">{{ error }}</q-banner>
    </div>

    <div class="col-12">
      <q-btn
        type="submit"
        unelevated
        no-caps
        color="primary"
        size="lg"
        class="full-width"
        label="Crear cuenta"
        :loading="cargando"
      />
    </div>
  </q-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api, mensajeError } from '@/boot/axios'
import { departamentos } from '@/utils/formato'

const emit = defineEmits(['registrado'])
const $q = useQuasar()

const form = reactive({
  perfil: 'Comprar',
  nombre: '',
  apellido: '',
  correo: '',
  celular: '',
  fechaNacimiento: '',
  departamento: null,
  distrito: '',
  password: '',
  confirmarPassword: '',
  nombreOrganizador: '',
  aceptaTerminos: false,
})
const cargando = ref(false)
const error = ref('')

const reglasNombre = [
  (v) => (v && v.trim().length >= 2) || 'Mínimo 2 caracteres',
  (v) => /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/.test(v) || 'Solo letras y espacios',
]

function esMayorDeEdad(fecha) {
  const limite = new Date()
  limite.setFullYear(limite.getFullYear() - 18)
  return new Date(fecha) <= limite
}

async function onSubmit() {
  error.value = ''
  if (!form.aceptaTerminos) {
    error.value = 'Debes aceptar los términos y condiciones.'
    return
  }
  cargando.value = true
  try {
    const datos = {
      ...form,
      nombreOrganizador: form.perfil === 'Comprar' ? null : form.nombreOrganizador,
    }
    const { data } = await api.post('/Usuario/registro', datos)
    $q.notify({ type: 'positive', message: data.mensaje })
    emit('registrado', form.correo)
  } catch (e) {
    error.value = mensajeError(e)
  } finally {
    cargando.value = false
  }
}
</script>
