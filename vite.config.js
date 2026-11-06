import { defineConfig } from 'vite';

// BASE_PATH is set by the GitHub Pages workflow (e.g. "/repo-name/").
export default defineConfig({
  base: process.env.BASE_PATH || '/',
});
