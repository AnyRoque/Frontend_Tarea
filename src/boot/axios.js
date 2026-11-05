import { defineBoot } from '#q-app'
import axios from 'axios'

// Dirección de la API (backend EventosPeruIA en Visual Studio)
const api = axios.create({ baseURL: 'http://localhost:5166/api' })

// Si hay sesión iniciada, cada petición lleva el token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Mensaje de error de la API: { mensaje, errores } o un texto genérico
export function mensajeError(error) {
  const data = error.response?.data
  if (data?.errores) return Object.values(data.errores).flat().join(' ')
  if (data?.mensaje) return data.mensaje
  return 'No se pudo conectar con el servidor. ¿Está encendida la API?'
}

export default defineBoot(({ app }) => {
  app.config.globalProperties.$api = api
})

export { api }
