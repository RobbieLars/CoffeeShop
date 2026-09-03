import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import "./ComboBox.css";

import { useComboBox } from "./useComboBox";

const joinClassNames = (...classNames) =>
  classNames.filter(Boolean).join(" ");

const defaultGetOptionValue = (option) =>
  option?.value ?? option?.id ?? option;

const defaultGetOptionLabel = (option) =>
  option?.label ?? option?.name ?? String(option ?? "");

export function ComboBox({
  id,
  name,
  label,
  options = [],
  value = null,
  onChange,
  getOptionValue = defaultGetOptionValue,
  getOptionLabel = defaultGetOptionLabel,
  renderOption,
  placeholder = "Seleccione una opción",
  searchable = false,
  searchPlaceholder = "Buscar",
  searchTypes = [],
  initialSearchType = null,
  paginated = false,
  pageSize = 10,
  loading = false,
  loadingMessage = "Cargando opciones...",
  emptyMessage = "No hay opciones disponibles.",
  previousPageLabel = "Página anterior",
  nextPageLabel = "Página siguiente",
  clearable = false,
  clearLabel = "Limpiar selección",
  disabled = false,
  ariaLabel,
  className = "",
}) {
  const generatedId = useId();
  const comboBoxId = id ?? `common-combo-box-${generatedId}`;
  const listBoxId = `${comboBoxId}-listbox`;
  const searchInputId = `${comboBoxId}-search`;

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  const {
    search,
    setSearch,
    searchType,
    setSearchType,
    availableSearchTypes,
    filteredOptions,
    visibleOptions,
    currentPage,
    totalPages,
    goToPage,
    goToPreviousPage,
    goToNextPage,
  } = useComboBox({
    options,
    getOptionLabel,
    searchable,
    searchTypes,
    initialSearchType,
    paginated,
    pageSize,
  });

  const selectedValue =
    value && typeof value === "object"
      ? getOptionValue(value)
      : value;

  const selectedOption = useMemo(
    () =>
      options.find((option) =>
        Object.is(getOptionValue(option), selectedValue)
      ) ?? null,
    [getOptionValue, options, selectedValue]
  );

  useEffect(() => {
    if (!expanded) return undefined;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, [expanded]);

  useEffect(() => {
    if (expanded && searchable) {
      searchInputRef.current?.focus();
    }
  }, [expanded, searchable]);

  const toggleExpanded = () => {
    if (!disabled) {
      setExpanded((currentValue) => !currentValue);
    }
  };

  const selectOption = (option) => {
    onChange?.(option);
    setExpanded(false);
    triggerRef.current?.focus();
  };

  const clearSelection = () => {
    onChange?.(null);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && expanded) {
      event.preventDefault();
      setExpanded(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div
      ref={rootRef}
      className={joinClassNames(
        "common-combo-box",
        expanded && "common-combo-box--expanded",
        disabled && "common-combo-box--disabled",
        className
      )}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label
          className="common-combo-box__label"
          htmlFor={comboBoxId}
        >
          {label}
        </label>
      )}

      {name && (
        <input
          type="hidden"
          name={name}
          value={selectedValue ?? ""}
        />
      )}

      <div className="common-combo-box__control">
        <button
          ref={triggerRef}
          id={comboBoxId}
          type="button"
          role="combobox"
          className="common-combo-box__trigger"
          aria-label={ariaLabel ?? label ?? placeholder}
          aria-expanded={expanded}
          aria-controls={listBoxId}
          aria-haspopup="listbox"
          disabled={disabled}
          onClick={toggleExpanded}
        >
          <span className="common-combo-box__selected-value">
            {selectedOption
              ? getOptionLabel(selectedOption)
              : placeholder}
          </span>

          <span
            className="common-combo-box__indicator"
            aria-hidden="true"
          >
            {expanded ? "▴" : "▾"}
          </span>
        </button>

        {clearable && selectedOption && !disabled && (
          <button
            type="button"
            className="common-combo-box__clear"
            aria-label={clearLabel}
            onClick={clearSelection}
          >
            ×
          </button>
        )}
      </div>

      {expanded && (
        <div className="common-combo-box__panel">
          {searchable && (
            <div className="common-combo-box__search-area">
              <label
                className="common-combo-box__search-label"
                htmlFor={searchInputId}
              >
                {searchPlaceholder}
              </label>

              <input
                ref={searchInputRef}
                id={searchInputId}
                type="search"
                className="common-combo-box__search-input"
                value={search}
                placeholder={searchPlaceholder}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          )}

          {searchable && availableSearchTypes.length > 0 && (
            <div
              className="common-combo-box__search-types"
              role="group"
              aria-label="Tipo de búsqueda"
            >
              {availableSearchTypes.map((searchTypeOption) => (
                <button
                  key={searchTypeOption.id}
                  type="button"
                  className={joinClassNames(
                    "common-combo-box__search-type",
                    searchTypeOption.id === searchType &&
                      "common-combo-box__search-type--active"
                  )}
                  aria-pressed={
                    searchTypeOption.id === searchType
                  }
                  onClick={() =>
                    setSearchType(searchTypeOption.id)
                  }
                >
                  {searchTypeOption.label ?? searchTypeOption.id}
                </button>
              ))}
            </div>
          )}

          <ul
            id={listBoxId}
            className="common-combo-box__options"
            role="listbox"
            aria-busy={loading}
          >
            {loading && (
              <li className="common-combo-box__message">
                {loadingMessage}
              </li>
            )}

            {!loading && filteredOptions.length === 0 && (
              <li className="common-combo-box__message">
                {emptyMessage}
              </li>
            )}

            {!loading &&
              visibleOptions.map((option, index) => {
                const optionValue = getOptionValue(option);
                const selected = Object.is(
                  optionValue,
                  selectedValue
                );

                return (
                  <li
                    key={String(optionValue ?? index)}
                    role="option"
                    aria-selected={selected}
                    className={joinClassNames(
                      "common-combo-box__option",
                      selected &&
                        "common-combo-box__option--selected"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => selectOption(option)}
                    >
                      {typeof renderOption === "function"
                        ? renderOption(option, selected)
                        : getOptionLabel(option)}
                    </button>
                  </li>
                );
              })}
          </ul>

          {paginated && !loading && (
            <footer className="common-combo-box__pagination">
              <button
                type="button"
                disabled={currentPage === 1}
                aria-label={previousPageLabel}
                onClick={goToPreviousPage}
              >
                ‹
              </button>

              <div className="common-combo-box__pages">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={joinClassNames(
                      "common-combo-box__page",
                      page === currentPage &&
                        "common-combo-box__page--active"
                    )}
                    aria-current={
                      page === currentPage
                        ? "page"
                        : undefined
                    }
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                aria-label={nextPageLabel}
                onClick={goToNextPage}
              >
                ›
              </button>
            </footer>
          )}
        </div>
      )}
    </div>
  );
}

export default ComboBox;
