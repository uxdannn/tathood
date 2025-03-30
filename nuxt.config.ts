// nuxt.config.ts

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
  // ❌ Das hier rausnehmen:
  // vite: {
  //   plugins: [require('vite-tsconfig-paths').default()]
  // }
})