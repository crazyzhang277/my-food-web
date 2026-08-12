import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/my-food-web/' : '/',
  server: {
    port: 3000,
    host: true
  }
});
