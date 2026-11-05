<template>
  <q-card
    class="evento-card cursor-pointer"
    flat
    bordered
    @click="router.push(`/eventos/${evento.idEvento}`)"
  >
    <div class="evento-card__imagen" :style="{ background: estilo.fondo }">
      <img v-if="evento.imagenUrl" :src="evento.imagenUrl" :alt="evento.nombre" />
      <q-icon v-else :name="estilo.icono" size="56px" color="white" />
      <q-badge class="evento-card__fecha" color="white" text-color="dark">
        {{ fechaCorta(evento.fechaHoraInicio) }}
      </q-badge>
      <q-badge v-if="evento.agotado" class="evento-card__estado" color="negative" label="Agotado" />
    </div>

    <q-card-section class="q-pb-sm">
      <div class="text-overline text-primary">{{ evento.categoria }}</div>
      <div class="text-subtitle1 text-weight-bold ellipsis-2-lines">{{ evento.nombre }}</div>
      <div class="text-caption text-grey-7 q-mt-xs">
        <q-icon name="place" size="16px" /> {{ evento.distrito }}, {{ evento.departamento }}
      </div>
      <div class="text-caption text-grey-7">
        <q-icon name="schedule" size="16px" /> {{ hora(evento.fechaHoraInicio) }}
      </div>
    </q-card-section>

    <!-- US-08: por qué se recomienda -->
    <q-card-section v-if="evento.motivo" class="q-pt-none">
      <q-chip dense icon="auto_awesome" color="amber-1" text-color="brown-9" class="q-ma-none">
        {{ evento.motivo }}
      </q-chip>
    </q-card-section>

    <q-separator />
    <q-card-section class="row items-center justify-between q-py-sm">
      <span class="text-weight-bold" :class="evento.precio === 0 ? 'text-positive' : 'text-dark'">
        {{ evento.precioTexto }}
      </span>
      <span v-if="!evento.agotado" class="text-caption text-grey-7">
        {{ evento.cuposDisponibles }} cupos
      </span>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { estiloCategoria, fechaCorta, hora } from '@/utils/formato'

const props = defineProps({
  evento: { type: Object, required: true },
})

const router = useRouter()
const estilo = computed(() => estiloCategoria(props.evento.categoria))
</script>

<style scoped>
.evento-card {
  border-radius: 14px;
  overflow: hidden;
  height: 100%;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}
.evento-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
}
.evento-card__imagen {
  position: relative;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.evento-card__imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.evento-card__fecha {
  position: absolute;
  top: 10px;
  left: 10px;
  font-weight: 700;
  padding: 4px 8px;
}
.evento-card__estado {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
