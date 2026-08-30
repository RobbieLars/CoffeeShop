# Cliente HTTP común

`IHttpClientService` define el contrato y `HttpClientService` lo implementa
utilizando `fetch`, disponible en Node.js moderno y navegadores.

La dependencia permitida es:

```text
System client -> IHttpClientService <- HttpClientService
```

El cliente común conoce transporte HTTP, serialización y errores. No conoce
URLs de VaultCore, MediKey ni variables de entorno específicas.

Las URL base se inyectan al construir cada cliente. Los headers y tokens se
aplican por petición para evitar compartir credenciales entre solicitudes
concurrentes.

Los clientes específicos de cada sistema deben envolver este servicio para
exponer operaciones como `getUserByIdAsync`, sin colocar rutas de negocio en
`Common`.
