import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {BootstrapVueNextResolver} from 'bootstrap-vue-next'
// https://vitejs.dev/config
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [
                BootstrapVueNextResolver({
                    aliases: {
                        BInput: 'BFormInput',
                    },
                }),
            ],
        })
    ],
    build: {
        sourcemap: false,
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: {
            '/printer': {
                target: 'http://192.168.0.190:9100',
                rewrite: (path) => path.replace(/^\/printer/, ''),
                changeOrigin: true,
                // Добавляем конфигурацию для обработки Basic Auth
                // configure: (proxy, options) => {
                //     // Если нужно добавить какие-то специфические настройки прокси
                //     proxy.on('proxyReq', (proxyReq, req, res) => {
                //         // Здесь можно добавить дополнительную обработку запроса
                //     });
                // }
            }
        },
    },
    resolve: {
        "alias": {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
})
