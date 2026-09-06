import { defineConfig, loadEnv, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const commonUiPath = fileURLToPath(
    new URL('../../Common/UiDesigns', import.meta.url)
);

const repoRoot = fileURLToPath(
    new URL('../../', import.meta.url)
);

const petMockServicePath = fileURLToPath(
    new URL(
        '../Application/Mock/AsyncServices/PetMockService.js',
        import.meta.url
    )
);

export default defineConfig(({ mode }) => {
    const environment = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@common-ui': commonUiPath,
                '@coffeeshop/pet-mock-service': petMockServicePath
            },
            dedupe: ['react', 'react-dom']
        },
        optimizeDeps: {
            include: ['@coffeeshop/pet-mock-service']
        },
        server: {
            port: 5176,
            strictPort: true,
            fs: {
                allow: [
                    searchForWorkspaceRoot(process.cwd()),
                    repoRoot,
                    commonUiPath
                ]
            },
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
