<template>
  <q-form class="q-gutter-md" @submit="onSubmit">
    <q-input
      v-model="correo"
      outlined
      type="email"
      label="Correo electrónico"
      autocomplete="email"
      lazy-rules
      :rules="[
        (v) => !!v || 'El correo es obligatorio',
        (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Formato válido: usuario@dominio.com',
      ]"
    >
      <template #prepend><q-icon name="mail" /></template>
    </q-input>

    <q-input
      v-model="password"
      outlined
      :type="verPassword ? 'text' : 'password'"
      label="Contraseña"
      autocomplete="current-password"
      lazy-rules
      :rules="[(v) => !!v || 'La contraseña es obligatoria']"
    >
      <template #prepend><q-icon name="lock" /></template>
      <template #append>
        <q-icon
          :name="verPassword ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="verPassword = !verPassword"
        />
      </template>
    </q-input>

    <q-banner v-if="error" dense rounded class="bg-red-1 text-negative">{{ error }}</q-banner>

    <div>
      <q-btn
        type="submit"
        unelevated
        no-caps
        color="primary"
        size="lg"
        class="full-width"
        label="Iniciar sesión"
        :loading="cargando"
      />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { mensajeError } from '@/boot/axios'
import { useAuthStore } from '@/stores/auth-store'

const emit = defineEmits(['ingreso'])

const $q = useQuasar()
const auth = useAuthStore()

const correo = ref('')
const password = ref('')
const verPassword = ref(false)
const cargando = ref(false)
const error = ref('')

async function onSubmit() {
  cargando.value = true
  error.value = ''
  try {
    await auth.login(correo.value, password.value)
    $q.notify({ type: 'positive', message: `¡Hola, ${auth.usuario.nombre}!` })
    emit('ingreso')
  } catch (e) {
    error.value = mensajeError(e)
  } finally {
    cargando.value = false
  }
}
</script>
