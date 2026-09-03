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
}) {
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

  return (
    <section
      className={joinClassNames(
        "common-data-table",
        className
      )}
      aria-label={ariaLabel}
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

      <div className="common-data-table__container">
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

          <tbody>
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
      </div>

      {paginated && !loading && (
        <footer className="common-data-table__footer">
          <div className="common-data-table__page-size">
            <label>
              <span>{pageSizeLabel}</span>

              <select
                value={displayedPageSize}
                onChange={(event) =>
                  changePageSize(event.target.value)
                }
              >
                {normalizedPageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

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
