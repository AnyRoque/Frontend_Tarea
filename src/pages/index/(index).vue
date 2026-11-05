<template>
  <q-page>
    <!-- Portada con buscador (US-05) -->
    <section class="portada text-white">
      <div class="contenedor q-px-md q-py-xl">
        <div class="text-h3 text-weight-bold portada__titulo">Descubre eventos en todo el Perú</div>
        <div class="text-subtitle1 q-mt-sm portada__texto">
          Conciertos, talleres, ferias y charlas. Compra tus entradas en minutos.
        </div>

        <q-form class="row q-col-gutter-sm q-mt-lg buscador" @submit="buscar">
          <div class="col-12 col-sm">
            <q-input
              v-model="palabra"
              bg-color="white"
              outlined
              dense
              placeholder="¿Qué quieres hacer? Ej: rock, cerámica, feria"
            >
              <template #prepend><q-icon name="search" /></template>
            </q-input>
          </div>
          <div class="col-12 col-sm-auto">
            <q-btn
              type="submit"
              color="accent"
              text-color="dark"
              unelevated
              no-caps
              label="Buscar"
              class="full-width"
              style="height: 40px"
            />
          </div>
        </q-form>

        <div class="q-mt-md q-gutter-sm">
          <q-chip
            v-for="c in categorias"
            :key="c.idCategoria"
            clickable
            :icon="estiloCategoria(c.nombre).icono"
            color="white"
            text-color="dark"
            @click="router.push({ path: '/eventos', query: { idCategoria: c.idCategoria } })"
          >
            {{ c.nombre }}
          </q-chip>
        </div>
      </div>
    </section>

    <div class="contenedor q-px-md q-py-lg">
      <!-- US-08: Recomendado para ti / Populares cerca de ti (solo con sesión) -->
      <section v-if="auth.haySesion && recomendados.length" class="q-mb-xl">
        <div class="text-h5 text-weight-bold q-mb-md">
          <q-icon name="auto_awesome" color="accent" /> {{ tituloRecomendados }}
        </div>
        <div class="row q-col-gutter-md">
          <div v-for="e in recomendados" :key="e.idEvento" class="col-12 col-sm-6 col-md-4">
            <EventoCard :evento="e" />
          </div>
        </div>
      </section>

      <!-- Próximos eventos -->
      <section>
        <div class="row items-center q-mb-md">
          <div class="text-h5 text-weight-bold">Próximos eventos</div>
          <q-space />
          <q-btn
            flat
            no-caps
            color="primary"
            label="Ver todos"
            icon-right="arrow_forward"
            to="/eventos"
          />
        </div>

        <div v-if="cargando" class="row q-col-gutter-md">
          <div v-for="n in 4" :key="n" class="col-12 col-sm-6 col-md-3">
            <q-skeleton height="290px" style="border-radius: 14px" />
          </div>
        </div>

        <q-banner v-else-if="error" class="bg-red-1 text-negative" rounded>
          <template #avatar><q-icon name="cloud_off" /></template>
          {{ error }}
        </q-banner>

        <div v-else class="row q-col-gutter-md">
          <div v-for="e in proximos" :key="e.idEvento" class="col-12 col-sm-6 col-md-3">
            <EventoCard :evento="e" />
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api, mensajeError } from '@/boot/axios'
import { useAuthStore } from '@/stores/auth-store'
import { estiloCategoria } from '@/utils/formato'
import EventoCard from '@/components/eventos/EventoCard.vue'

const router = useRouter()
const auth = useAuthStore()

const palabra = ref('')
const categorias = ref([])
const proximos = ref([])
const recomendados = ref([])
const tituloRecomendados = ref('')
const cargando = ref(true)
const error = ref('')

function buscar() {
  router.push({ path: '/eventos', query: palabra.value ? { palabra: palabra.value } : {} })
}

onMounted(async () => {
  try {
    const [resCategorias, resEventos] = await Promise.all([
      api.get('/Categoria'),
      api.get('/Evento'),
    ])
    categorias.value = resCategorias.data
    proximos.value = resEventos.data.datos.items.slice(0, 8)
  } catch (e) {
    error.value = mensajeError(e)
  } finally {
    cargando.value = false
  }

  if (auth.haySesion) {
    try {
      const { data } = await api.get('/Recomendacion')
      tituloRecomendados.value = data.datos.titulo
      recomendados.value = data.datos.eventos
    } catch {
      // Si falla, simplemente no se muestra la sección
    }
  }
})
</script>

<style scoped>
.portada {
  background:
    radial-gradient(circle at 85% 20%, rgba(244, 162, 97, 0.35), transparent 40%),
    linear-gradient(120deg, #1b263b 0%, #c8102e 100%);
}
.portada__titulo {
  max-width: 640px;
  line-height: 1.15;
}
.portada__texto {
  opacity: 0.85;
}
.buscador {
  max-width: 640px;
}
</style>
