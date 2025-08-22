// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: false,
  app: {
    baseURL: '/',
  },
  css: [
    "~/assets/styles/main.scss"
  ],
  plugins: [
    './plugins/wee-ui-library.ts'
  ],

  runtimeConfig: {
    public: {
      slug: process.env.SLUG,
    }
  }
})
