# CoffeeShop AppHost

AppHost de desarrollo basado en Aspire para iniciar y observar la API y la UI
de CoffeeShop desde un solo dashboard.

## Instalación

```bash
npm install
npm run restore
```

## Ejecución

```bash
npm run host
```

El comando inicia estos recursos:

- `coffeeshop-api`: `http://localhost:5003`
- `coffeeshop-ui`: `http://localhost:5176`

La UI espera a que `/api/health` confirme que la API y MongoDB están
disponibles. Para iniciar sin abrir automáticamente el dashboard:

```bash
npm run host:no-browser
```
