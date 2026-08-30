# Uso

```js
const HttpClientService = require('../HttpClientService');

const httpClient = new HttpClientService({
    baseUrl: 'http://localhost:5001'
});

const users = await httpClient.getAsync('/api/user', {
    queryParams: {
        page: 1,
        pageSize: 20,
        enabled: true
    },
    bearerToken: accessToken
});
```

Para enviar JSON:

```js
const result = await httpClient.postAsync('/api/user', {
    username: 'example',
    email: 'example@sivardoctor.com'
});
```

Para cancelar una petición:

```js
const controller = new AbortController();

const request = httpClient.getAsync('/api/user', {
    signal: controller.signal
});

controller.abort();
await request;
```

`HttpClientException` expone `statusCode`, `url`, `method` y `responseBody`
cuando la API responde con un código no exitoso o existe un fallo de red.
