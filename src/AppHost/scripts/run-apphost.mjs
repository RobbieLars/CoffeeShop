// Inicia CoffeeShop en Aspire y abre su dashboard fuera del editor.

import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import open from 'open';

const ansiPattern = /\u001B\[[0-?]*[ -/]*[@-~]/g;
const dashboardPattern =
    /(?:Dashboard|Panel):\s+(https:\/\/localhost:\d+\/login\?t=[a-f\d]{32})/i;

function extractDashboardUrl(output) {
    const normalizedOutput = output
        .replace(ansiPattern, '')
        .replace(/\r?\n\s+([a-f\d]{1,32})/gi, '$1')
        .replace(/\s+/g, ' ');
    const match = normalizedOutput.match(dashboardPattern);

    return match?.[1] ?? null;
}

async function runAsync() {
    const browserEnabled = !process.argv.includes('--no-browser');

    const aspireEntryPoint = fileURLToPath(
        new URL(
            '../node_modules/@microsoft/aspire-cli/bin/aspire.js',
            import.meta.url
        )
    );
    const appHostDirectory = fileURLToPath(
        new URL('../', import.meta.url)
    );
    const aspireProcess = spawn(
        process.execPath,
        [aspireEntryPoint, 'run'],
        {
            cwd: appHostDirectory,
            env: process.env,
            stdio: [
                'inherit',
                'pipe',
                'pipe'
            ],
            windowsHide: true
        }
    );
    let bufferedOutput = '';
    let browserOpened = false;

    const processOutput = (chunk, destination) => {
        destination.write(chunk);

        if (!browserEnabled || browserOpened) {
            return;
        }

        bufferedOutput = `${bufferedOutput}${chunk.toString()}`.slice(-8192);
        const dashboardUrl = extractDashboardUrl(bufferedOutput);

        if (!dashboardUrl) {
            return;
        }

        browserOpened = true;

        open(dashboardUrl, { wait: false })
            .then(() => {
                process.stdout.write(
                    '\n[AppHost] Dashboard abierto en el navegador externo.\n'
                );
            })
            .catch(error => {
                process.stderr.write(
                    '\n[AppHost] No fue posible abrir el navegador: ' +
                    `${error.message}\n[AppHost] Abre manualmente: ` +
                    `${dashboardUrl}\n`
                );
            });
    };

    aspireProcess.stdout.on(
        'data',
        chunk => processOutput(chunk, process.stdout)
    );
    aspireProcess.stderr.on(
        'data',
        chunk => processOutput(chunk, process.stderr)
    );
    aspireProcess.on('error', error => {
        process.stderr.write(
            `[AppHost] No fue posible iniciar Aspire: ${error.message}\n`
        );
        process.exitCode = 1;
    });
    aspireProcess.on('exit', code => {
        process.exitCode = code ?? 1;
    });

    const stopAspire = signal => {
        if (!aspireProcess.killed) {
            aspireProcess.kill(signal);
        }
    };

    process.once('SIGINT', () => stopAspire('SIGINT'));
    process.once('SIGTERM', () => stopAspire('SIGTERM'));
}

const isMainModule = process.argv[1] && (
    import.meta.url === pathToFileURL(process.argv[1]).href
);

if (isMainModule) {
    runAsync().catch(error => {
        process.stderr.write(`[AppHost] ${error.message}\n`);
        process.exitCode = 1;
    });
}

export {
    extractDashboardUrl
};
