import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy para redirecionar requisições da API para o backend durante o desenvolvimento.
      '/lugares': {
        // Endereço do servidor backend onde a API está rodando.
        target: 'http://localhost:8888',

        // Permite que o servidor de destino veja a requisição como se viesse do próprio servidor,
        // útil para evitar problemas de CORS durante o desenvolvimento.
        changeOrigin: true,
      }
    }
  }
})
