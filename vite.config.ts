import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: './', // GitHub Pages 호환 상대 경로 설정
  plugins: [react()],
});
