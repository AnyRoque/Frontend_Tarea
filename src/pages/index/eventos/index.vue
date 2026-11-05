<template>
  <q-page class="contenedor q-px-md q-py-lg">
    <div class="text-h4 text-weight-bold q-mb-md">Explorar eventos</div>

    <!-- Filtros (US-05) -->
    <q-card flat bordered class="q-pa-md q-mb-lg" style="border-radius: 14px">
      <q-form class="row q-col-gutter-md items-start" @submit="buscar(1)">
        <div class="col-12 col-md-4">
          <q-input
            v-model="filtro.palabra"
            outlined
            dense
            clearable
            label="Palabra clave"
            :rules="[(v) => !v || v.length >= 3 || 'Escribe mínimo 3 caracteres']"
            hide-bottom-space
          >
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
        <div class="col-6 col-md-2">
          <q-select
            v-model="filtro.idCategoria"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Categoría"
            :options="categorias"
            option-value="idCategoria"
            option-label="nombre"
          />
        </div>
        <div class="col-6 col-md-2">
          <q-select
            v-model="filtro.departamento"
            outlined
            dense
            clearable
            label="Departamento"
            :options="departamentos"
          />
        </div>
        <div class="col-6 col-md-2">
          <q-input v-model="filtro.desde" outlined dense type="date" label="Desde" stack-label />
        </div>
        <div class="col-6 col-md-2">
          <q-input
            v-model="filtro.hasta"
            outlined
            dense
            type="date"
            label="Hasta"
            stack-label
            :rules="[
              (v) =>
                !v || !filtro.desde || v >= filtro.desde || 'Debe ser igual o posterior a «Desde»',
            ]"
            hide-bottom-space
          />
        </div>
        <div class="col-12 row justify-end q-gutter-sm">
          <q-btn flat no-caps label="Limpiar" @click="limpiar" />
          <q-btn type="submit" unelevated no-caps color="primary" icon="search" label="Buscar" />
        </div>
      </q-form>
    </q-card>

    <!-- Resultados -->
    <div v-if="!cargando && !error" class="text-grey-7 q-mb-md">{{ mensaje }}</div>

    <div v-if="cargando" class="row q-col-gutter-md">
      <div v-for="n in 8" :key="n" class="col-12 col-sm-6 col-md-3">
        <q-skeleton height="290px" style="border-radius: 14px" />
      </div>
    </div>

    <q-banner v-else-if="error" class="bg-red-1 text-negative" rounded>{{ error }}</q-banner>

    <div v-else-if="eventos.length === 0" class="text-center q-py-xl text-grey-7">
      <q-icon name="event_busy" size="64px" />
      <div class="text-h6 q-mt-sm">No se encontraron eventos</div>
      <div>Prueba con otra palabra o quita algunos filtros.</div>
    </div>

    <template v-else>
      <div class="row q-col-gutter-md">
        <div v-for="e in eventos" :key="e.idEvento" class="col-12 col-sm-6 col-md-3">
          <EventoCard :evento="e" />
        </div>
      </div>

      <div v-if="totalPaginas > 1" class="flex flex-center q-mt-lg">
        <q-pagination
          v-model="pagina"
          :max="totalPaginas"
          direction-links
          @update:model-value="buscar"
        />
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { api, mensajeError } from '@/boot/axios'
import { departamentos } from '@/utils/formato'
import EventoCard from '@/components/eventos/EventoCard.vue'

const route = useRoute()

const filtro = reactive({
  palabra: route.query.palabra || '',
  idCategoria: route.query.idCategoria ? Number(route.query.idCategoria) : null,
  departamento: null,
  desde: '',
  hasta: '',
})

const categorias = ref([])
const eventos = ref([])
const pagina = ref(1)
const totalPaginas = ref(0)
const mensaje = ref('')
const cargando = ref(true)
const error = ref('')

async function buscar(numero) {
  pagina.value = numero
  cargando.value = true
  error.value = ''
  try {
    // Solo se envían los filtros que tienen valor
    const params = { pagina: pagina.value }
    for (const [clave, valor] of Object.entries(filtro)) {
      if (valor !== null && valor !== '') params[clave] = valor
    }
    const { data } = await api.get('/Evento', { params })
    eventos.value = data.datos.items
    totalPaginas.value = data.datos.totalPaginas
    mensaje.value = data.mensaje
  } catch (e) {
    error.value = mensajeError(e)
  } finally {
    cargando.value = false
  }
}

function limpiar() {
  Object.assign(filtro, {
    palabra: '',
    idCategoria: null,
    departamento: null,
    desde: '',
    hasta: '',
  })
  buscar(1)
}

onMounted(async () => {
  try {
    categorias.value = (await api.get('/Categoria')).data
  } catch {
    // Sin categorías el filtro queda vacío, la búsqueda igual funciona
  }
  buscar(1)
})
</script>
