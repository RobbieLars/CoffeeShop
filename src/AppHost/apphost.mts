// AppHost local para observar la API y la UI de CoffeeShop.

import { resolve } from 'node:path';
import { createBuilder } from './.aspire/modules/aspire.mjs';

const builder = await createBuilder();
const projectDirectory = resolve(import.meta.dirname, '../..');
const uiDirectory = resolve(projectDirectory, 'src/UI');

const coffeeShopApi = builder
    .addExecutable(
        'coffeeshop-api',
        'node',
        projectDirectory,
        ['--watch', 'src/Api/server.js']
    )
    .withEnvironment('PORT', '5003')
    .withHttpEndpoint({
        name: 'http',
        port: 5003,
        targetPort: 5003,
        isProxied: false
    })
    .withHttpHealthCheck({
        endpointName: 'http',
        path: '/api/health',
        statusCode: 200
    });

await builder
    .addExecutable(
        'coffeeshop-ui',
        'npm',
        uiDirectory,
        [
            'run',
            'dev',
            '--',
            '--host',
            '127.0.0.1',
            '--port',
            '5176',
            '--strictPort'
        ]
    )
    .withEnvironment('VITE_API_BASE_URL', '/api')
    .withEnvironment(
        'COFFEESHOP_API_PROXY_TARGET',
        'http://localhost:5003'
    )
    .withHttpEndpoint({
        name: 'http',
        port: 5176,
        targetPort: 5176,
        isProxied: false
    })
    .withHttpHealthCheck({
        endpointName: 'http',
        path: '/',
        statusCode: 200
    })
    .waitFor(coffeeShopApi);

console.info('[AppHost] CoffeeShop API/UI configuradas.');

await builder.build().run();
