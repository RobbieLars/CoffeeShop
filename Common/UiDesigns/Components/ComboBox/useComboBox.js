import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const getNestedValue = (source, path) => {
  if (!source || !path) return undefined;

  return String(path)
    .split(".")
    .reduce(
      (currentValue, property) => currentValue?.[property],
      source
    );
};

const normalizeSearchValue = (value) => {
  if (value === null || value === undefined) return "";

  return String(value).trim().toLocaleLowerCase();
};

export const resolveSearchTypeId = (searchType, index) =>
  String(
    searchType.id ??
      searchType.key ??
      searchType.accessor ??
      `search-type-${index}`
  );

export const resolveSearchTypeValue = (
  option,
  searchType
) => {
  if (!searchType) return undefined;

  if (typeof searchType.accessor === "function") {
    return searchType.accessor(option);
  }

  const property =
    searchType.accessor ?? searchType.key ?? searchType.id;

  return getNestedValue(option, property);
};

export function useComboBox({
  options = [],
  getOptionLabel,
  searchable = false,
  searchTypes = [],
  initialSearchType = null,
  paginated = false,
  pageSize = 10,
} = {}) {
  const availableOptions = Array.isArray(options)
    ? options
    : [];

  const availableSearchTypes = useMemo(
    () =>
      searchTypes.map((searchType, index) => ({
        ...searchType,
        id: resolveSearchTypeId(searchType, index),
      })),
    [searchTypes]
  );

  const resolveInitialSearchType = useCallback(() => {
    const requestedSearchType = String(
      initialSearchType ?? ""
    );

    return (
      availableSearchTypes.find(
        (searchType) => searchType.id === requestedSearchType
      )?.id ??
      availableSearchTypes[0]?.id ??
      null
    );
  }, [availableSearchTypes, initialSearchType]);

  const [search, setSearchState] = useState("");
  const [searchType, setSearchTypeState] = useState(
    resolveInitialSearchType
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const searchTypeExists = availableSearchTypes.some(
      (item) => item.id === searchType
    );

    if (!searchTypeExists) {
      setSearchTypeState(resolveInitialSearchType());
    }
  }, [
    availableSearchTypes,
    resolveInitialSearchType,
    searchType,
  ]);

  const selectedSearchType = useMemo(
    () =>
      availableSearchTypes.find(
        (item) => item.id === searchType
      ) ?? null,
    [availableSearchTypes, searchType]
  );

  const filteredOptions = useMemo(() => {
    const normalizedSearch = normalizeSearchValue(search);

    if (!searchable || !normalizedSearch) {
      return availableOptions;
    }

    return availableOptions.filter((option) => {
      const searchValue = selectedSearchType
        ? resolveSearchTypeValue(option, selectedSearchType)
        : getOptionLabel(option);

      return normalizeSearchValue(searchValue).includes(
        normalizedSearch
      );
    });
  }, [
    availableOptions,
    getOptionLabel,
    search,
    searchable,
    selectedSearchType,
  ]);

  const normalizedPageSize = Math.max(
    1,
    Number(pageSize) || 1
  );

  const totalPages = paginated
    ? Math.max(
        1,
        Math.ceil(filteredOptions.length / normalizedPageSize)
      )
    : 1;

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const visibleOptions = useMemo(() => {
    if (!paginated) return filteredOptions;

    const firstIndex =
      (currentPage - 1) * normalizedPageSize;

    return filteredOptions.slice(
      firstIndex,
      firstIndex + normalizedPageSize
    );
  }, [
    currentPage,
    filteredOptions,
    normalizedPageSize,
    paginated,
  ]);

  const setSearch = useCallback((value) => {
    setSearchState(String(value ?? ""));
    setCurrentPage(1);
  }, []);

  const setSearchType = useCallback((value) => {
    setSearchTypeState(String(value));
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback(
    (page) => {
      setCurrentPage(
        Math.min(Math.max(Number(page) || 1, 1), totalPages)
      );
    },
    [totalPages]
  );

  return {
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
    goToPreviousPage: () => goToPage(currentPage - 1),
    goToNextPage: () => goToPage(currentPage + 1),
  };
}

export default useComboBox;
