// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }, // 👈 hier fehlte das Komma
  vite: {
    plugins: [require('vite-tsconfig-paths').default()]
  }
})