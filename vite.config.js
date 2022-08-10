import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from "@vitejs/plugin-vue";
import vuetify from 'vite-plugin-vuetify'
import { resolve } from 'path'

export default defineConfig({
    resolve: {
        alias: {
          '@': resolve(__dirname, './resources/js'),
        },
      },
  
    plugins: [
        laravel([
            //'resources/css/app.css',
            'resources/js/app.ts',
        ]),
        vue(),
        vuetify({ autoImport: true }),
    ],
});