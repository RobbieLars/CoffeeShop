import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const commonUiPath = fileURLToPath(
    new URL('../../Common/UiDesigns', import.meta.url)
);

export default defineConfig(({ mode }) => {
    const environment = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@common-ui': commonUiPath
            },
            dedupe: ['react', 'react-dom']
        },
        server: {
            port: 5176,
            strictPort: true,
            proxy: {
                '/api': {
                    target:
                        environment.COFFEESHOP_API_PROXY_TARGET ??
                        'http://localhost:5003',
                    changeOrigin: true
                }
            }
        }
    };
});
