// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    geminiApiKey: "",
  },
  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        name: "beauhurst-seo-blog",
        kv_namespaces: [{ binding: "BLOGS", id: "39b5a93801dd4073a1a1260064b31e55" }],
      },
    },
    storage: {
      blogs: { driver: "cloudflare-kv-binding", binding: "BLOGS" },
    },
    devStorage: {
      blogs: { driver: "fs", base: "./.data/blogs" },
    },
  },
  css: ["~/assets/css/main.css"],
});
