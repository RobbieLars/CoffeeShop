# AppLayout

Estructura comun inspirada en la distribucion de Preclinic. No contiene rutas,
clientes HTTP, permisos, branding ni reglas de un sistema concreto.

```text
AppLayout
├── sidebar: logo, selector y MultiLevelMenu del sistema
└── main
    ├── header: TopHeader o encabezado propio
    └── content: pagina u Outlet del sistema
```

## Uso

```jsx
const layout = useAppLayout();

const header = (
  <TopHeader
    user={currentUser}
    actions={headerActions}
    onSearch={search}
    onMenuToggle={layout.toggleSidebar}
    menuExpanded={layout.sidebarOpen}
  />
);

<AppLayout
  sidebar={<SystemSidebar />}
  header={header}
  sidebarOpen={layout.sidebarOpen}
  onSidebarClose={layout.closeSidebar}
  className="medikey-layout"
>
  <Outlet />
</AppLayout>;
```

`Outlet` pertenece al sistema consumidor. `AppLayout` no depende de
`react-router-dom`.

## Tema por sistema

Cada interfaz define sus propios tokens:

```css
.medikey-layout {
  --app-layout-background: #f4f8f7;
  --app-layout-surface: #ffffff;
  --app-layout-text: #17332d;
  --app-layout-muted: #687b75;
  --app-layout-primary: #20a77c;
  --app-layout-on-primary: #ffffff;
  --app-layout-border: #d9e9e4;
  --app-layout-hover: #edf7f4;
  --app-layout-danger: #c53030;
  --app-layout-badge: #dc2626;
  --app-layout-online: #16a34a;
  --app-layout-avatar-background: #d9e9e4;
  --app-layout-avatar-text: #17332d;
  --app-layout-dropdown-shadow: 0 12px 30px rgb(15 23 42 / 14%);
}
```

Los valores anteriores son solamente un ejemplo del sistema consumidor; no
forman parte del componente comun.
