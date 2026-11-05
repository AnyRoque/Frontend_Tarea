<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card flat bordered class="registro-card">
      <q-card-section class="q-pt-lg">
        <div class="text-h5 text-weight-bold">Crea tu cuenta</div>
        <div class="text-grey-7">Es gratis y solo toma un minuto</div>
      </q-card-section>

      <q-card-section>
        <RegisterForm @registrado="router.push('/login')" />
      </q-card-section>

      <q-card-section class="text-center q-pt-none q-pb-lg">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="text-primary text-weight-bold">Inicia sesión</router-link>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const router = useRouter()
</script>

<style scoped>
.registro-card {
  width: 100%;
  max-width: 720px;
  border-radius: 18px;
}
</style>
