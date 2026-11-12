// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    geminiApiKey: "",
  },
  nitro: {
    devStorage: {
      blogs: { driver: "fs", base: "./.data/blogs" },
    },
  },
  css: ["~/assets/css/main.css"],
});
