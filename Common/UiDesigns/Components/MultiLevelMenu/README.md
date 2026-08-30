# MultiLevelMenu

Componente comun para representar menus jerarquicos sin conocer rutas,
permisos, clientes HTTP ni reglas de un sistema concreto.

## Componente con estructura compartida

```jsx
<MultiLevelMenu
  items={menuItems}
  activePath={location.pathname}
  className="vaultcore-menu"
  onItemClick={(item, event) => {
    event.preventDefault();
    navigate(item.path);
  }}
/>
```

Los elementos aceptan `id`, `label`, `path`, `icon`, `disabled` y `children`.
`icon` puede ser una clase CSS o un elemento React.

## Tema por sistema

Cada sistema puede personalizar el componente sin modificar su funcionalidad:

```css
.vaultcore-menu {
  --menu-primary: #6f42c1;
  --menu-background: #16131d;
  --menu-text: #d8d2e3;
  --menu-hover: #292033;
}
```

## Funcionalidad sin estructura visual

Si un sistema necesita un marcado totalmente diferente, puede consumir
`useMultiLevelMenu` directamente y crear su propia presentacion.
