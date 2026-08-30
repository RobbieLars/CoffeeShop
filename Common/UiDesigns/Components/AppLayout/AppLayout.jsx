import "./AppLayout.css";

const joinClassNames = (...classNames) =>
  classNames.filter(Boolean).join(" ");

export function AppLayout({
  header = null,
  sidebar = null,
  children,
  sidebarOpen = false,
  sidebarId = "common-app-sidebar",
  sidebarLabel = "Navegación principal",
  onSidebarClose,
  className = "",
  sidebarClassName = "",
  headerClassName = "",
  mainClassName = "",
  contentClassName = "",
  style,
}) {
  const hasSidebar = Boolean(sidebar);

  return (
    <div
      className={joinClassNames(
        "common-app-layout",
        hasSidebar && "common-app-layout--with-sidebar",
        hasSidebar && sidebarOpen && "common-app-layout--sidebar-open",
        className
      )}
      style={style}
    >
      {hasSidebar && (
        <aside
          id={sidebarId}
          className={joinClassNames(
            "common-app-layout__sidebar",
            sidebarClassName
          )}
          aria-label={sidebarLabel}
        >
          {sidebar}
        </aside>
      )}

      {hasSidebar && sidebarOpen && (
        <button
          type="button"
          className="common-app-layout__backdrop"
          aria-label="Cerrar menú lateral"
          onClick={onSidebarClose}
        />
      )}

      <div
        className={joinClassNames(
          "common-app-layout__main",
          mainClassName
        )}
      >
        {header && (
          <div
            className={joinClassNames(
              "common-app-layout__header",
              headerClassName
            )}
          >
            {header}
          </div>
        )}

        <main
          className={joinClassNames(
            "common-app-layout__content",
            contentClassName
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
