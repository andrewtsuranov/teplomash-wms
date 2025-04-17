import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {fileURLToPath, URL} from 'node:url'
// https://vitejs.dev/config
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [

            ],
        })
    ],
    build: {
        sourcemap: true,
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
    },
    resolve: {
        "alias": {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
})
