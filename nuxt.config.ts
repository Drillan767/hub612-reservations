// https://nuxt.com/docs/api/configuration/nuxt-config
import { en, fr } from 'vuetify/locale';

export default defineNuxtConfig({
    ssr: false,
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    modules: [
      '@nuxt/eslint',
      '@nuxt/image',
      '@artmizu/nuxt-prometheus',
      '@vee-validate/nuxt',
      '@vueuse/nuxt',
      'dayjs-nuxt',
      'vuetify-nuxt-module',
    ],

    vuetify: {
        vuetifyOptions: {
            defaults: {
                VTextField: {
                    variant: 'outlined',
                },
                VFileInput: {
                    variant: 'outlined',
                },
                VDataTable: {
                    rounded: 'xl',
                    mobileBreakpoint: 'sm',
                    mobile: null,
                    hover: true,
                    itemsPerPageOptions: [10, 25, 50],
                },
            },
            locale: {
                locale: 'fr',
                fallback: 'en',
                messages: { fr, en },
            },
        },
    },

    runtimeConfig: {
        public: {
            pocketbase: {
                url: '',
            }
        }
    },

    css: [
        '@mdi/font/css/materialdesignicons.css',
        '~/assets/main.scss',
    ],
})