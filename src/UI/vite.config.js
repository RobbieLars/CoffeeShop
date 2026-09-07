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

const productMockServicePath = fileURLToPath(
    new URL(
        '../Application/Mock/AsyncServices/ProductMockService.js',
        import.meta.url
    )
);

const commentMockServicePath = fileURLToPath(
    new URL(
        '../Application/Mock/AsyncServices/CommentMockService.js',
        import.meta.url
    )
);

const purchaseMockServicePath = fileURLToPath(
    new URL(
        '../Application/Mock/AsyncServices/PurchaseMockService.js',
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
                '@coffeeshop/pet-mock-service': petMockServicePath,
                '@coffeeshop/product-mock-service': productMockServicePath,
                '@coffeeshop/comment-mock-service': commentMockServicePath,
                '@coffeeshop/purchase-mock-service': purchaseMockServicePath
            },
            dedupe: ['react', 'react-dom']
        },
        optimizeDeps: {
            include: [
                '@coffeeshop/pet-mock-service',
                '@coffeeshop/product-mock-service',
                '@coffeeshop/comment-mock-service',
                '@coffeeshop/purchase-mock-service'
            ]
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
