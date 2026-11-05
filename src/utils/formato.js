// Funciones de apoyo para mostrar los datos de la API

export function fechaLarga(valor) {
  return new Date(valor).toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function fechaCorta(valor) {
  return new Date(valor).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
}

export function hora(valor) {
  return new Date(valor).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}

// Ícono y color de cada categoría (los eventos de prueba no tienen imagen)
const estilos = {
  Concierto: { icono: 'music_note', fondo: 'linear-gradient(135deg, #c8102e, #7b2cbf)' },
  Taller: { icono: 'palette', fondo: 'linear-gradient(135deg, #f4a261, #e76f51)' },
  Feria: { icono: 'storefront', fondo: 'linear-gradient(135deg, #2a9d8f, #264653)' },
  Charla: { icono: 'record_voice_over', fondo: 'linear-gradient(135deg, #1b263b, #415a77)' },
}

export function estiloCategoria(categoria) {
  return (
    estilos[categoria] ?? { icono: 'event', fondo: 'linear-gradient(135deg, #6c757d, #343a40)' }
  )
}

export const departamentos = [
  'Amazonas',
  'Áncash',
  'Apurímac',
  'Arequipa',
  'Ayacucho',
  'Cajamarca',
  'Callao',
  'Cusco',
  'Huancavelica',
  'Huánuco',
  'Ica',
  'Junín',
  'La Libertad',
  'Lambayeque',
  'Lima',
  'Loreto',
  'Madre de Dios',
  'Moquegua',
  'Pasco',
  'Piura',
  'Puno',
  'San Martín',
  'Tacna',
  'Tumbes',
  'Ucayali',
]
