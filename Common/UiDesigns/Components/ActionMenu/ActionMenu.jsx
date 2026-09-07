import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import "./ActionMenu.css";

const joinClassNames = (...classNames) =>
  classNames.filter(Boolean).join(" ");

export function ActionMenu({
  items = [],
  children,
  trigger,
  ariaLabel = "Acciones",
  className = "",
  menuClassName = "",
  triggerClassName = "",
  itemClassName = "",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("bottom");
  const [menuStyle, setMenuStyle] = useState({});

  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimatedHeight = 160;

    const openUp = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
    setPlacement(openUp ? "top" : "bottom");

    const right = window.innerWidth - rect.right;

    setMenuStyle({
      position: "fixed",
      zIndex: 9999,
      right: `${Math.max(8, right)}px`,
      ...(openUp
        ? {
            bottom: `${Math.max(8, window.innerHeight - rect.top + 6)}px`,
            top: "auto",
          }
        : {
            top: `${rect.bottom + 6}px`,
            bottom: "auto",
          }),
    });
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    if (!open) {
      updatePosition();
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const closeMenu = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return undefined;

    updatePosition();

    const handlePointerDown = (event) => {
      if (
        triggerRef.current?.contains(event.target) ||
        menuRef.current?.contains(event.target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleScroll = (event) => {
      if (menuRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    const handleResize = () => {
      setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, { capture: true });
      window.removeEventListener("resize", handleResize);
    };
  }, [open, updatePosition]);

  return (
    <div
      className={joinClassNames(
        "common-action-menu",
        open && "common-action-menu--open",
        className
      )}
    >
      <button
        ref={triggerRef}
        type="button"
        className={joinClassNames(
          "common-action-menu__trigger",
          "ui-action-menu__trigger",
          open && "common-action-menu__trigger--active",
          triggerClassName
        )}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        onClick={handleToggle}
      >
        {trigger ?? <span aria-hidden="true">⋮</span>}
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={ariaLabel}
            className={joinClassNames(
              "common-action-menu__list",
              "ui-action-menu__list",
              placement === "top"
                ? "common-action-menu__list--top"
                : "common-action-menu__list--bottom",
              menuClassName
            )}
            style={menuStyle}
          >
            {typeof children === "function"
              ? children({ close: closeMenu })
              : children ??
                items.map((item, index) => (
                  <button
                    key={item.id ?? index}
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    className={joinClassNames(
                      "common-action-menu__item",
                      "ui-action-menu__item",
                      item.danger && "common-action-menu__item--danger ui-action-menu__item--danger",
                      itemClassName,
                      item.className
                    )}
                    onClick={() => {
                      closeMenu();
                      item.onClick?.();
                    }}
                  >
                    {item.icon && (
                      <span className="common-action-menu__item-icon" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    <span>{item.label}</span>
                  </button>
                ))}
          </div>,
          document.body
        )}
    </div>
  );
}

export default ActionMenu;
