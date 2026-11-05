<template>
  <q-layout view="hHh lpR fff">
    <q-header class="bg-white text-dark" bordered>
      <q-toolbar class="contenedor q-py-sm">
        <q-btn flat no-caps to="/" class="q-px-sm">
          <q-icon name="confirmation_number" color="primary" size="28px" class="q-mr-sm" />
          <span class="text-h6 text-weight-bold"
            >Eventos<span class="text-primary">PeruIA</span></span
          >
        </q-btn>

        <q-space />

        <q-btn flat no-caps label="Inicio" to="/" class="gt-xs" />
        <q-btn flat no-caps label="Eventos" to="/eventos" class="gt-xs" />

        <!-- Sin sesión -->
        <template v-if="!auth.haySesion">
          <q-btn flat no-caps label="Iniciar sesión" to="/login" class="q-ml-sm" />
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Regístrate"
            to="/registro"
            class="q-ml-sm"
          />
        </template>

        <!-- Con sesión -->
        <q-btn v-else flat round class="q-ml-sm">
          <q-avatar size="36px" color="primary" text-color="white">{{ auth.iniciales }}</q-avatar>
          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width: 220px">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ auth.nombre }}</q-item-label>
                  <q-item-label caption>{{ auth.usuario.correo }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="cerrarSesion">
                <q-item-section avatar><q-icon name="logout" /></q-item-section>
                <q-item-section>Cerrar sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-secondary text-white">
      <div class="contenedor q-pa-md text-center text-caption">
        EventosPeruIA · Encuentra y compra entradas para eventos en todo el Perú
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

function cerrarSesion() {
  auth.logout()
  $q.notify({ type: 'info', message: 'Cerraste sesión.' })
  router.push('/')
}
</script>
