import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const valueCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

const getNestedValue = (source, path) => {
  if (!source || !path) return undefined;

  return String(path)
    .split(".")
    .reduce(
      (currentValue, property) => currentValue?.[property],
      source
    );
};

export const resolveColumnId = (column, index) =>
  String(column.id ?? column.key ?? `column-${index}`);

export const resolveColumnValue = (row, column) => {
  if (typeof column.accessor === "function") {
    return column.accessor(row);
  }

  const property = column.accessor ?? column.key ?? column.id;

  return getNestedValue(row, property);
};

const normalizeSearchValue = (value) => {
  if (value === null || value === undefined) return "";

  return String(value).toLocaleLowerCase();
};

const defaultCompare = (leftValue, rightValue) => {
  if (leftValue === rightValue) return 0;
  if (leftValue === null || leftValue === undefined) return -1;
  if (rightValue === null || rightValue === undefined) return 1;

  if (
    typeof leftValue === "number" &&
    typeof rightValue === "number"
  ) {
    return leftValue - rightValue;
  }

  return valueCollator.compare(
    String(leftValue),
    String(rightValue)
  );
};

export function useDataTable({
  rows = [],
  columns = [],
  initialPageSize = 10,
  initialSearch = "",
  initialSort = null,
  paginateRows = true,
} = {}) {
  const [search, setSearchState] = useState(initialSearch);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState(initialSort);

  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    if (!normalizedSearch) return rows;

    const searchableColumns = columns.filter(
      (column) => column.searchable !== false
    );

    return rows.filter((row) =>
      searchableColumns.some((column) => {
        const value =
          typeof column.searchValue === "function"
            ? column.searchValue(row)
            : resolveColumnValue(row, column);

        return normalizeSearchValue(value).includes(
          normalizedSearch
        );
      })
    );
  }, [columns, rows, search]);

  const sortedRows = useMemo(() => {
    if (!sort?.columnId) return filteredRows;

    const columnIndex = columns.findIndex(
      (column, index) =>
        resolveColumnId(column, index) === sort.columnId
    );

    if (columnIndex < 0) return filteredRows;

    const column = columns[columnIndex];

    return [...filteredRows].sort((leftRow, rightRow) => {
      const leftValue =
        typeof column.sortValue === "function"
          ? column.sortValue(leftRow)
          : resolveColumnValue(leftRow, column);

      const rightValue =
        typeof column.sortValue === "function"
          ? column.sortValue(rightRow)
          : resolveColumnValue(rightRow, column);

      const comparison =
        typeof column.compare === "function"
          ? column.compare(
              leftValue,
              rightValue,
              leftRow,
              rightRow
            )
          : defaultCompare(leftValue, rightValue);

      return sort.direction === "descending"
        ? comparison * -1
        : comparison;
    });
  }, [columns, filteredRows, sort]);

  const totalRows = sortedRows.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalRows / pageSize)
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const visibleRows = useMemo(() => {
    if (!paginateRows) return sortedRows;

    const firstIndex = (currentPage - 1) * pageSize;

    return sortedRows.slice(
      firstIndex,
      firstIndex + pageSize
    );
  }, [currentPage, pageSize, paginateRows, sortedRows]);

  const setSearch = useCallback((value) => {
    setSearchState(value);
    setCurrentPage(1);
  }, []);

  const setPageSize = useCallback((value) => {
    setPageSizeState(Number(value));
    setCurrentPage(1);
  }, []);

  const toggleSort = useCallback((columnId) => {
    setSort((currentSort) => {
      if (currentSort?.columnId !== columnId) {
        return {
          columnId,
          direction: "ascending",
        };
      }

      if (currentSort.direction === "ascending") {
        return {
          columnId,
          direction: "descending",
        };
      }

      return null;
    });

    setCurrentPage(1);
  }, []);

  const goToPage = useCallback(
    (page) => {
      setCurrentPage(
        Math.min(Math.max(Number(page), 1), totalPages)
      );
    },
    [totalPages]
  );

  return {
    search,
    setSearch,
    sort,
    setSort,
    toggleSort,
    pageSize,
    setPageSize,
    currentPage,
    totalPages,
    totalRows,
    visibleRows,
    goToPage,
    goToPreviousPage: () => goToPage(currentPage - 1),
    goToNextPage: () => goToPage(currentPage + 1),
  };
}

export default useDataTable;
