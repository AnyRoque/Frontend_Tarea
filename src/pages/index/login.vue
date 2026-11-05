<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card flat bordered class="auth-card">
      <q-card-section class="text-center q-pt-lg">
        <q-icon name="confirmation_number" color="primary" size="48px" />
        <div class="text-h5 text-weight-bold q-mt-sm">Inicia sesión</div>
        <div class="text-grey-7">Compra entradas y recibe recomendaciones para ti</div>
      </q-card-section>

      <q-card-section>
        <LoginForm @ingreso="irDespues" />
      </q-card-section>

      <q-card-section class="text-center q-pt-none q-pb-lg">
        ¿No tienes cuenta?
        <router-link to="/registro" class="text-primary text-weight-bold">Regístrate</router-link>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'

const route = useRoute()
const router = useRouter()

// Vuelve a la página desde donde vino (por ejemplo, el detalle de un evento)
function irDespues() {
  router.push(route.query.redirect || '/')
}
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 420px;
  border-radius: 18px;
}
</style>
