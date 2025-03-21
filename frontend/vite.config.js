import path from 'node:path';

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    const proxy_url =
        process.env.VITE_DEV_REMOTE === 'remote'
            ? process.env.VITE_BACKEND_SERVER
            : 'http://localhost:8888/';

    const config = {
        plugins: [react()],
        build: {
            sourcemap: true, // Ensure source maps are generated
        },
        resolve: {
            base: '/',
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        server: {
            port: 3000,
            proxy: {
                '/api': {
                    target: proxy_url,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    };
    return defineConfig(config);
};
