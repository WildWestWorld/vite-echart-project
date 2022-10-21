import { defineConfig } from 'vite'

import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'




// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        // 配置路径别名
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },

    css: {
        preprocessorOptions: {
            scss: {
                // 两种方式都可以
                // additionalData: '@import "@/assets/scss/global.scss";'
                // additionalData: '@use "@/assets/scss/global.scss" as *;'
            }
        }
    },
    server: {
        proxy: {                 //设置代理，必须填
            '/api': {              //设置拦截器  拦截器格式   斜杠+拦截器名字，名字可以自己定
                target: 'http://127.0.0.1:8888',     //代理的目标地址
                changeOrigin: true,              //是否设置同源，输入是的
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        }
        // 代理 WebSocket 或 socket
        // '/socket.io': {
        //   target: 'ws://localhost:3000',
        //   ws: true
        //  }
    },

    plugins: [vue()]
})
