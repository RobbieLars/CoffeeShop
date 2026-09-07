import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./DataTable.css";

import {
  resolveColumnId,
  resolveColumnValue,
  useDataTable,
} from "./useDataTable";

const joinClassNames = (...classNames) =>
  classNames.filter(Boolean).join(" ");

const resolveRowKey = (row, index, rowKey) => {
  if (typeof rowKey === "function") {
    return rowKey(row, index);
  }

  return row?.[rowKey] ?? index;
};

function PageSizeSelect({
  value,
  options = [10, 25, 50],
  onChange,
  ariaLabel = "Filas por página",
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={joinClassNames(
        "common-data-table__page-size-select",
        open && "common-data-table__page-size-select--open"
      )}
    >
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="common-data-table__page-size-trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="common-data-table__page-size-value">{value}</span>
        <span
          className="common-data-table__page-size-chevron"
          aria-hidden="true"
        >
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="common-data-table__page-size-menu"
        >
          {options.map((option) => {
            const isSelected = Number(option) === Number(value);
            return (
              <li
                key={option}
                role="option"
                aria-selected={isSelected}
                className={joinClassNames(
                  "common-data-table__page-size-item",
                  isSelected &&
                    "common-data-table__page-size-item--selected"
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    onChange(Number(option));
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function DataTable({
  columns = [],
  rows = [],
  rowKey = "id",
  initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  initialSearch = "",
  initialSort = null,
  searchable = true,
  paginated = true,
  externalPagination = null,
  loading = false,
  searchLabel = "Buscar",
  searchPlaceholder = "Buscar",
  pageSizeLabel = "Filas por página",
  loadingMessage = "Cargando información...",
  emptyMessage = "No hay información disponible.",
  previousPageLabel = "Página anterior",
  nextPageLabel = "Página siguiente",
  ariaLabel = "Tabla de datos",
  caption,
  className = "",
  tableClassName = "",
  rowClassName,
  onRowClick,
  maxHeight,
  autoMaxHeight = true,
  bottomOffset = 24,
  stickyHeader = true,
  renderCard = null,
  actionsLabel = "Acciones",
  showCardId = true,
  style,
}) {
  const rootRef = useRef(null);
  const [dynamicMaxHeight, setDynamicMaxHeight] = useState(null);

  const {
    search,
    setSearch,
    sort,
    toggleSort,
    pageSize,
    setPageSize,
    currentPage,
    totalPages,
    totalRows,
    visibleRows,
    goToPage,
    goToPreviousPage,
    goToNextPage,
  } = useDataTable({
    rows,
    columns,
    initialPageSize,
    initialSearch,
    initialSort,
    paginateRows: !externalPagination,
  });

  const calculateMaxHeight = useCallback(() => {
    if (!autoMaxHeight || maxHeight !== undefined || !rootRef.current) {
      return;
    }

    const rect = rootRef.current.getBoundingClientRect();
    const offset = Number(bottomOffset) || 24;
    const available = window.innerHeight - rect.top - offset;

    if (available >= 200) {
      setDynamicMaxHeight(`${Math.floor(available)}px`);
    } else {
      setDynamicMaxHeight(null);
    }
  }, [autoMaxHeight, maxHeight, bottomOffset]);

  useEffect(() => {
    if (!autoMaxHeight || maxHeight !== undefined) return undefined;

    calculateMaxHeight();

    const handleResize = () => {
      calculateMaxHeight();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    let resizeObserver;
    if (
      typeof ResizeObserver !== "undefined" &&
      rootRef.current?.parentElement
    ) {
      resizeObserver = new ResizeObserver(() => {
        calculateMaxHeight();
      });
      resizeObserver.observe(rootRef.current.parentElement);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
    };
  }, [
    autoMaxHeight,
    maxHeight,
    calculateMaxHeight,
    visibleRows.length,
    loading,
  ]);

  const displayedPage = externalPagination
    ? Math.max(1, Number(externalPagination.page) || 1)
    : currentPage;

  const displayedPageSize = externalPagination
    ? Math.max(
        1,
        Number(externalPagination.pageSize) || initialPageSize
      )
    : pageSize;

  const displayedTotalRows = externalPagination
    ? Math.max(
        0,
        Number(externalPagination.totalItems) || 0
      )
    : totalRows;

  const displayedTotalPages = externalPagination
    ? Math.max(
        1,
        Number(externalPagination.totalPages) || 1
      )
    : totalPages;

  const normalizedPageSizeOptions = [
    ...new Set([displayedPageSize, ...pageSizeOptions]),
  ];

  const actionColumn = useMemo(() => {
    return (
      columns.find((col, idx) => {
        const id = String(resolveColumnId(col, idx)).toLowerCase();
        return (
          id === "actions" ||
          id === "acciones" ||
          id === "action" ||
          id === "accion" ||
          Boolean(col.isAction)
        );
      }) ?? null
    );
  }, [columns]);

  const dataColumns = useMemo(() => {
    return columns.filter((col) => col !== actionColumn);
  }, [columns, actionColumn]);

  const firstVisibleRow =
    displayedTotalRows === 0
      ? 0
      : (displayedPage - 1) * displayedPageSize + 1;

  const lastVisibleRow = Math.min(
    displayedPage * displayedPageSize,
    displayedTotalRows
  );

  const changePageSize = (value) => {
    if (externalPagination) {
      externalPagination.onPageSizeChange?.(Number(value));
      return;
    }

    setPageSize(value);
  };

  const changePage = (page) => {
    if (externalPagination) {
      externalPagination.onPageChange?.(page);
      return;
    }

    goToPage(page);
  };

  const goToDisplayedPreviousPage = () => {
    if (externalPagination) {
      changePage(Math.max(1, displayedPage - 1));
      return;
    }

    goToPreviousPage();
  };

  const goToDisplayedNextPage = () => {
    if (externalPagination) {
      changePage(
        Math.min(displayedTotalPages, displayedPage + 1)
      );
      return;
    }

    goToNextPage();
  };

  const dynamicStyle = {
    ...(maxHeight
      ? {
          "--data-table-max-height-dynamic":
            typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
        }
      : {}),
    ...(dynamicMaxHeight
      ? { "--data-table-max-height-dynamic": dynamicMaxHeight }
      : {}),
    ...style,
  };

  return (
    <section
      ref={rootRef}
      className={joinClassNames(
        "common-data-table",
        stickyHeader && "common-data-table--sticky-header",
        className
      )}
      aria-label={ariaLabel}
      style={dynamicStyle}
    >
      {searchable && (
        <div className="common-data-table__toolbar">
          <label className="common-data-table__search">
            <span className="common-data-table__search-label">
              {searchLabel}
            </span>

            <input
              type="search"
              value={search}
              placeholder={searchPlaceholder}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </label>
        </div>
      )}

      <div className="common-data-table__container common-data-table__records-container">
        <table
          className={joinClassNames(
            "common-data-table__table",
            tableClassName
          )}
        >
          {caption && (
            <caption className="common-data-table__caption">
              {caption}
            </caption>
          )}

          <thead>
            <tr>
              {columns.map((column, index) => {
                const columnId = resolveColumnId(column, index);
                const sorted =
                  sort?.columnId === columnId
                    ? sort.direction
                    : "none";

                return (
                  <th
                    key={columnId}
                    scope="col"
                    aria-sort={
                      column.sortable ? sorted : undefined
                    }
                    className={column.headerClassName}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className="common-data-table__sort-button"
                        onClick={() => toggleSort(columnId)}
                      >
                        <span>{column.header}</span>

                        <span
                          className="common-data-table__sort-indicator"
                          aria-hidden="true"
                        >
                          {sorted === "ascending" && "↑"}
                          {sorted === "descending" && "↓"}
                          {sorted === "none" && "↕"}
                        </span>
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody key={displayedPage} className="common-data-table__body">
            {loading && (
              <tr>
                <td colSpan={Math.max(columns.length, 1)}>
                  <div className="common-data-table__message">
                    {loadingMessage}
                  </div>
                </td>
              </tr>
            )}

            {!loading && visibleRows.length === 0 && (
              <tr>
                <td colSpan={Math.max(columns.length, 1)}>
                  <div className="common-data-table__message">
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              visibleRows.map((row, rowIndex) => {
                const absoluteIndex =
                  (currentPage - 1) * pageSize + rowIndex;

                return (
                  <tr
                    key={resolveRowKey(
                      row,
                      absoluteIndex,
                      rowKey
                    )}
                    className={
                      typeof rowClassName === "function"
                        ? rowClassName(row, absoluteIndex)
                        : rowClassName
                    }
                    onClick={
                      onRowClick
                        ? (event) =>
                            onRowClick(
                              row,
                              absoluteIndex,
                              event
                            )
                        : undefined
                    }
                  >
                    {columns.map((column, columnIndex) => {
                      const columnId = resolveColumnId(
                        column,
                        columnIndex
                      );

                      const value = resolveColumnValue(
                        row,
                        column
                      );

                      return (
                        <td
                          key={columnId}
                          className={column.cellClassName}
                        >
                          {typeof column.render === "function"
                            ? column.render(
                                value,
                                row,
                                absoluteIndex
                              )
                            : value ?? ""}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>

        <div
          className="common-data-table__cards"
          role="region"
          aria-label="Registros en tarjetas"
        >
          {loading && (
            <div className="common-data-table__cards-message">
              {loadingMessage}
            </div>
          )}

          {!loading && visibleRows.length === 0 && (
            <div className="common-data-table__cards-message">
              {emptyMessage}
            </div>
          )}

          {!loading &&
            visibleRows.map((row, rowIndex) => {
              const absoluteIndex =
                (currentPage - 1) * pageSize + rowIndex;
              const key = resolveRowKey(row, absoluteIndex, rowKey);

              if (typeof renderCard === "function") {
                return (
                  <div
                    key={key}
                    className={joinClassNames(
                      "common-data-table__card",
                      typeof rowClassName === "function"
                        ? rowClassName(row, absoluteIndex)
                        : rowClassName
                    )}
                    onClick={
                      onRowClick
                        ? (event) => onRowClick(row, absoluteIndex, event)
                        : undefined
                    }
                  >
                    {renderCard(row, absoluteIndex, {
                      columns,
                      actionColumn,
                      dataColumns,
                    })}
                  </div>
                );
              }

              const hasExplicitId =
                Boolean(showCardId) &&
                ((row?.[rowKey] !== undefined &&
                  row?.[rowKey] !== null &&
                  row?.[rowKey] !== "") ||
                  (row?.id !== undefined &&
                    row?.id !== null &&
                    row?.id !== ""));

              const idVal = hasExplicitId
                ? row?.[rowKey] ?? row?.id
                : null;

              const renderedAction = actionColumn
                ? typeof actionColumn.render === "function"
                  ? actionColumn.render(
                      resolveColumnValue(row, actionColumn),
                      row,
                      absoluteIndex
                    )
                  : resolveColumnValue(row, actionColumn)
                : null;

              return (
                <article
                  key={key}
                  className={joinClassNames(
                    "common-data-table__card",
                    typeof rowClassName === "function"
                      ? rowClassName(row, absoluteIndex)
                      : rowClassName
                  )}
                  onClick={
                    onRowClick
                      ? (event) => onRowClick(row, absoluteIndex, event)
                      : undefined
                  }
                >
                  {(hasExplicitId || renderedAction) && (
                    <header className="common-data-table__card-header">
                      <div className="common-data-table__card-header-main">
                        {hasExplicitId && (
                          <span className="common-data-table__card-id">
                            ID: {String(idVal)}
                          </span>
                        )}
                      </div>

                      {renderedAction && (
                        <div className="common-data-table__card-actions">
                          <span className="common-data-table__card-actions-label">
                            {actionsLabel}:
                          </span>
                          {renderedAction}
                        </div>
                      )}
                    </header>
                  )}

                  <div className="common-data-table__card-body">
                    {dataColumns.map((column, columnIndex) => {
                      const columnId = resolveColumnId(column, columnIndex);
                      const value = resolveColumnValue(row, column);
                      const rendered =
                        typeof column.render === "function"
                          ? column.render(value, row, absoluteIndex)
                          : value ?? "—";

                      return (
                        <div
                          key={columnId}
                          className="common-data-table__card-field"
                        >
                          <span className="common-data-table__card-field-label">
                            {column.header}
                          </span>
                          <div className="common-data-table__card-field-value">
                            {rendered}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
        </div>
      </div>

      {paginated && !loading && (
        <footer className="common-data-table__footer">
          <div className="common-data-table__page-size">
            <span className="common-data-table__page-size-label">
              {pageSizeLabel}
            </span>

            <PageSizeSelect
              value={displayedPageSize}
              options={normalizedPageSizeOptions}
              onChange={changePageSize}
              ariaLabel={pageSizeLabel}
            />

            <span className="common-data-table__range">
              {firstVisibleRow}–{lastVisibleRow} de{" "}
              {displayedTotalRows}
            </span>
          </div>

          <nav
            className="common-data-table__pagination"
            aria-label="Paginación de la tabla"
          >
            <button
              type="button"
              className="common-data-table__page-button"
              disabled={displayedPage === 1}
              aria-label={previousPageLabel}
              onClick={goToDisplayedPreviousPage}
            >
              ‹
            </button>

            {Array.from(
              { length: displayedTotalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                className={joinClassNames(
                  "common-data-table__page-button",
                  page === displayedPage &&
                    "common-data-table__page-button--active"
                )}
                aria-current={
                  page === displayedPage ? "page" : undefined
                }
                onClick={() => changePage(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="common-data-table__page-button"
              disabled={
                displayedPage === displayedTotalPages
              }
              aria-label={nextPageLabel}
              onClick={goToDisplayedNextPage}
            >
              ›
            </button>
          </nav>
        </footer>
      )}
    </section>
  );
}

export default DataTable;
