import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from '@/boot/axios'

// Sesión del usuario (US-02). Se guarda en localStorage para no perderla al recargar.
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    usuario: JSON.parse(localStorage.getItem('usuario') || 'null'),
  }),

  getters: {
    haySesion: (state) => !!state.token,
    nombre: (state) => (state.usuario ? `${state.usuario.nombre} ${state.usuario.apellido}` : ''),
    iniciales: (state) =>
      state.usuario ? `${state.usuario.nombre[0]}${state.usuario.apellido[0]}`.toUpperCase() : '',
  },

  actions: {
    async login(correo, password) {
      const { data } = await api.post('/Usuario/login', { correo, password })
      this.token = data.datos.token
      this.usuario = data.datos
      localStorage.setItem('token', this.token)
      localStorage.setItem('usuario', JSON.stringify(this.usuario))
      return data.mensaje
    },

    logout() {
      this.token = null
      this.usuario = null
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
