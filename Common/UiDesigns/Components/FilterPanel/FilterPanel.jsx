import React from "react";
import "./FilterPanel.css";

const joinClassNames = (...classNames) =>
  classNames.filter(Boolean).join(" ");

export function FilterPanel({
  children,
  onClear,
  onSubmit,
  onFilter,
  showClearButton = true,
  showFilterButton = true,
  clearLabel = "Limpiar",
  filterLabel = "Filtrar",
  loading = false,
  loadingLabel = "Filtrando...",
  actions = null,
  className = "",
  style,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(event);
    } else if (onFilter) {
      onFilter(event);
    }
  };

  const handleClear = (event) => {
    onClear?.(event);
  };

  return (
    <form
      className={joinClassNames("common-filter-panel", className)}
      style={style}
      onSubmit={handleSubmit}
    >
      <div className="common-filter-panel__grid">
        {children}
      </div>

      {(showClearButton || showFilterButton || actions) && (
        <div className="common-filter-panel__actions">
          {actions}

          {showClearButton && (
            <button
              type="button"
              className="common-filter-panel__button common-filter-panel__button--clear ui-button"
              onClick={handleClear}
              disabled={loading}
            >
              {clearLabel}
            </button>
          )}

          {showFilterButton && (
            <button
              type="submit"
              className="common-filter-panel__button common-filter-panel__button--filter ui-button ui-button--primary"
              disabled={loading}
            >
              {loading ? loadingLabel : filterLabel}
            </button>
          )}
        </div>
      )}
    </form>
  );
}

export default FilterPanel;
