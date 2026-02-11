// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-02-09',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@tresjs/nuxt',
  ],

  // Runtime config
  runtimeConfig: {
    // Server-side only
    databaseUrl: process.env.DATABASE_URL || '',
    sessionSecret: process.env.NUXT_SESSION_PASSWORD || 'at-least-32-characters-long-secret-key',
    // Public (exposed to client)
    public: {
      appName: 'Dungeon Master AI',
    },
  },

  // Nuxt UI configuration
  ui: {
    colorMode: true,
    fonts: true,
  },

  // TresJS configuration
  tres: {
    glsl: true,
  },

  // TypeScript
  typescript: {
    strict: true,
  },

  // Nitro server config
  nitro: {
    experimental: {
      tasks: true,
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  // App meta
  app: {
    head: {
      title: 'Dungeon Master AI - Your AI-Powered D&D Experience',
      meta: [
        { name: 'description', content: 'Your personal AI Dungeon Master that creates immersive adventures, tracks your campaign, and brings your fantasy world to life.' },
        { name: 'theme-color', content: '#0a0a0f' },
      ],
    },
  },
})
