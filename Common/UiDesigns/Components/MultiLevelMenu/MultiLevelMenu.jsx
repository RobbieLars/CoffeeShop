import { useId } from "react";
import "./MultiLevelMenu.css";
import {
  containsActivePath,
  hasMenuChildren,
  resolveMenuItemId,
  useMultiLevelMenu,
} from "./useMultiLevelMenu";

function MenuIcon({ icon }) {
  if (!icon) return null;

  if (typeof icon === "string") {
    return (
      <i
        className={`multilevel-menu__icon ${icon}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <span className="multilevel-menu__icon" aria-hidden="true">
      {icon}
    </span>
  );
}

function MenuLevel({
  items,
  level,
  parentKey,
  activePath,
  defaultExpandedIds,
  onItemClick,
}) {
  const componentId = useId().replaceAll(":", "");
  const { isItemOpen, toggleItem } = useMultiLevelMenu({
    items,
    parentKey,
    activePath,
    defaultExpandedIds,
  });

  return (
    <ul
      className={
        level === 0
          ? "multilevel-menu__list multilevel-menu__list--root"
          : "multilevel-menu__list multilevel-menu__list--nested"
      }
    >
      {items.map((item, index) => {
        const itemId = resolveMenuItemId(item, index, parentKey);
        const submenuId = `${componentId}-${itemId.replace(
          /[^a-zA-Z0-9_-]/g,
          "-"
        )}`;

        const branch = hasMenuChildren(item);
        const opened = branch && isItemOpen(itemId);
        const active =
          item.path === activePath ||
          (branch && containsActivePath(item, activePath));

        const content = (
          <>
            <MenuIcon icon={item.icon} />

            <span className="multilevel-menu__label">{item.label}</span>

            {branch && (
              <span
                className={`multilevel-menu__arrow ${
                  opened ? "multilevel-menu__arrow--open" : ""
                }`}
                aria-hidden="true"
              />
            )}
          </>
        );

        return (
          <li
            key={itemId}
            className={`multilevel-menu__item ${
              active ? "multilevel-menu__item--active" : ""
            } ${
              item.disabled ? "multilevel-menu__item--disabled" : ""
            }`}
            data-level={level}
          >
            {branch ? (
              <>
                <button
                  type="button"
                  className={`multilevel-menu__button ${
                    opened ? "multilevel-menu__button--open" : ""
                  }`}
                  disabled={item.disabled}
                  aria-expanded={opened}
                  aria-controls={submenuId}
                  onClick={() => toggleItem(itemId)}
                >
                  {content}
                </button>

                <div
                  id={submenuId}
                  className={`multilevel-menu__collapse ${
                    opened ? "multilevel-menu__collapse--open" : ""
                  }`}
                >
                  <div>
                    <MenuLevel
                      items={item.children}
                      level={level + 1}
                      parentKey={itemId}
                      activePath={activePath}
                      defaultExpandedIds={defaultExpandedIds}
                      onItemClick={onItemClick}
                    />
                  </div>
                </div>
              </>
            ) : (
              <a
                href={item.path ?? "#"}
                className="multilevel-menu__link"
                aria-current={item.path === activePath ? "page" : undefined}
                aria-disabled={item.disabled || undefined}
                onClick={(event) => {
                  if (item.disabled) {
                    event.preventDefault();
                    return;
                  }

                  onItemClick?.(item, event);
                }}
              >
                {content}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function MultiLevelMenu({
  items = [],
  activePath = "",
  defaultExpandedIds = [],
  className = "",
  ariaLabel = "Menú principal",
  onItemClick,
  style,
}) {
  return (
    <nav
      className={`multilevel-menu ${className}`}
      aria-label={ariaLabel}
      style={style}
    >
      <MenuLevel
        items={items}
        level={0}
        parentKey="root"
        activePath={activePath}
        defaultExpandedIds={defaultExpandedIds}
        onItemClick={onItemClick}
      />
    </nav>
  );
}

export default MultiLevelMenu;
