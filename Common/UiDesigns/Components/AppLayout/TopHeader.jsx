import { useEffect, useId, useRef, useState } from "react";
import { useOptionalTheme } from "../Theme";

const joinClassNames = (...classNames) =>
  classNames.filter(Boolean).join(" ");

export const getUserInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

function HeaderIcon({ icon, className = "" }) {
  if (!icon) return null;

  if (typeof icon === "string") {
    return (
      <i
        className={joinClassNames(className, icon)}
        aria-hidden="true"
      />
    );
  }

  return (
    <span className={className} aria-hidden="true">
      {icon}
    </span>
  );
}

export function TopHeader({
  user = {},
  actions = [],
  profileItems = [],
  primaryAction = null,
  showThemeToggle = true,
  searchValue,
  defaultSearchValue = "",
  searchPlaceholder = "Buscar",
  searchShortcut = null,
  searchIcon = null,
  menuIcon = null,
  menuControls = "common-app-sidebar",
  menuExpanded = false,
  onSearch,
  onSearchChange,
  onMenuToggle,
  leftSlot = null,
  rightSlot = null,
  className = "",
}) {
  const themeContext = useOptionalTheme();
  const [internalSearch, setInternalSearch] = useState(defaultSearchValue);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const profileMenuId = useId().replaceAll(":", "");
  const currentSearch = searchValue ?? internalSearch;

  const themeAction =
    showThemeToggle && themeContext
      ? {
          id: "common-theme-toggle",
          label: themeContext.isDark
            ? "Cambiar a modo claro"
            : "Cambiar a modo oscuro",
          icon: themeContext.isDark ? "ti ti-sun" : "ti ti-moon",
          onClick: themeContext.toggleTheme,
        }
      : null;

  const resolvedActions =
    themeAction &&
    !actions.some(
      (action) =>
        action.id === "common-theme-toggle" || action.id === "theme-toggle"
    )
      ? [...actions, themeAction]
      : actions;

  const resolvedProfileItems =
    themeAction &&
    !profileItems.some(
      (item) =>
        item.id === "common-theme-toggle-profile" ||
        item.id === "toggle-theme-profile" ||
        item.id === "theme"
    )
      ? [
          {
            id: "common-theme-toggle-profile",
            label: themeContext.isDark ? "Modo claro" : "Modo oscuro",
            icon: themeContext.isDark ? "ti ti-sun" : "ti ti-moon",
            onClick: themeContext.toggleTheme,
          },
          ...profileItems,
        ]
      : profileItems;

  useEffect(() => {
    if (!profileOpen) return undefined;

    const closeOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    const closeWithEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [profileOpen]);

  const changeSearch = (event) => {
    const nextValue = event.target.value;

    if (searchValue === undefined) {
      setInternalSearch(nextValue);
    }

    onSearchChange?.(nextValue);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    onSearch?.(currentSearch);
  };

  return (
    <header
      className={joinClassNames("common-top-header", className)}
    >
      <div className="common-top-header__left">
        {onMenuToggle && (
          <button
            type="button"
            className="common-top-header__menu-button"
            aria-label="Abrir o cerrar menú"
            aria-controls={menuControls}
            aria-expanded={menuExpanded}
            onClick={onMenuToggle}
          >
            <HeaderIcon
              icon={menuIcon}
              className="common-top-header__button-icon"
            />
            {!menuIcon && (
              <span aria-hidden="true">☰</span>
            )}
          </button>
        )}

        {onSearch && (
          <form
            className="common-top-header__search"
            role="search"
            onSubmit={submitSearch}
          >
            <HeaderIcon
              icon={searchIcon}
              className="common-top-header__search-icon"
            />

            <input
              type="search"
              value={currentSearch}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              onChange={changeSearch}
            />

            {searchShortcut && (
              <span className="common-top-header__shortcut">
                {searchShortcut}
              </span>
            )}
          </form>
        )}

        {leftSlot}
      </div>

      <div className="common-top-header__right">
        {primaryAction && (
          <button
            type="button"
            className="common-top-header__primary-action"
            disabled={primaryAction.disabled}
            onClick={primaryAction.onClick}
          >
            <span>{primaryAction.label}</span>
            <HeaderIcon
              icon={primaryAction.icon}
              className="common-top-header__primary-icon"
            />
          </button>
        )}

        {resolvedActions.length > 0 && (
          <div
            className="common-top-header__actions"
            aria-label="Acciones rápidas"
          >
            {resolvedActions.map((action) => (
              <button
                key={action.id}
                type="button"
                className="common-top-header__action"
                aria-label={action.label}
                title={action.label}
                disabled={action.disabled}
                onClick={action.onClick}
              >
                <HeaderIcon
                  icon={action.icon}
                  className="common-top-header__action-icon"
                />

                {action.badge !== undefined && action.badge !== false && (
                  <span className="common-top-header__badge">
                    {action.badge === true ? "" : action.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {rightSlot}

        <div ref={profileRef} className="common-top-header__profile">
          <button
            type="button"
            className="common-top-header__profile-button"
            aria-label="Abrir menú de perfil"
            aria-controls={profileMenuId}
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((open) => !open)}
          >
            {user.avatar ? (
              <img src={user.avatar} alt="" />
            ) : (
              <span>{getUserInitials(user.name) || "U"}</span>
            )}

            {user.online && (
              <span
                className="common-top-header__online"
                aria-label="En línea"
              />
            )}
          </button>

          {profileOpen && (
            <div
              id={profileMenuId}
              className="common-top-header__profile-menu"
              role="menu"
            >
              <div className="common-top-header__profile-info">
                <strong>{user.name ?? "Usuario"}</strong>
                {user.role && <span>{user.role}</span>}
              </div>

              {resolvedProfileItems.length > 0 && (
                <div className="common-top-header__profile-options">
                  {resolvedProfileItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      className={joinClassNames(
                        "common-top-header__profile-option",
                        item.danger &&
                          "common-top-header__profile-option--danger"
                      )}
                      disabled={item.disabled}
                      onClick={() => {
                        setProfileOpen(false);
                        item.onClick?.();
                      }}
                    >
                      <HeaderIcon
                        icon={item.icon}
                        className="common-top-header__profile-icon"
                      />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopHeader;
