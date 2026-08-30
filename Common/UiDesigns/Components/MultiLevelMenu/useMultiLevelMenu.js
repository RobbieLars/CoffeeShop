import { useCallback, useEffect, useMemo, useState } from "react";

export const hasMenuChildren = (item) =>
  Array.isArray(item?.children) && item.children.length > 0;

export const resolveMenuItemId = (item, index, parentKey = "root") =>
  String(item?.id ?? `${parentKey}-${index}`);

export const containsActivePath = (item, activePath) => {
  if (!activePath || !item) return false;
  if (item.path === activePath) return true;

  return item.children?.some((child) =>
    containsActivePath(child, activePath)
  ) ?? false;
};

const normalizeExpandedIds = (defaultExpandedIds) => {
  const ids = defaultExpandedIds instanceof Set
    ? [...defaultExpandedIds]
    : defaultExpandedIds;

  return new Set((ids ?? []).map(String));
};

const findSuggestedOpenId = ({
  items,
  parentKey,
  activePath,
  expandedIds,
}) => {
  const openedIndex = items.findIndex((item, index) => {
    if (!hasMenuChildren(item)) return false;

    const itemId = resolveMenuItemId(item, index, parentKey);

    return (
      expandedIds.has(itemId) || containsActivePath(item, activePath)
    );
  });

  if (openedIndex < 0) return null;

  return resolveMenuItemId(items[openedIndex], openedIndex, parentKey);
};

/**
 * Comportamiento reutilizable de un nivel del menu.
 * Puede consumirse sin MultiLevelMenu cuando un sistema requiera otro marcado
 * o una presentacion completamente diferente.
 */
export function useMultiLevelMenu({
  items = [],
  parentKey = "root",
  activePath = "",
  defaultExpandedIds = [],
} = {}) {
  const expandedIds = useMemo(
    () => normalizeExpandedIds(defaultExpandedIds),
    [defaultExpandedIds]
  );

  const suggestedOpenId = useMemo(
    () =>
      findSuggestedOpenId({
        items,
        parentKey,
        activePath,
        expandedIds,
      }),
    [activePath, expandedIds, items, parentKey]
  );

  const [openId, setOpenId] = useState(suggestedOpenId);

  // Sincroniza rutas, permisos o elementos que lleguen de forma asincrona.
  useEffect(() => {
    setOpenId((currentId) => {
      if (suggestedOpenId !== null) return suggestedOpenId;

      const currentItemStillExists = items.some(
        (item, index) =>
          hasMenuChildren(item) &&
          resolveMenuItemId(item, index, parentKey) === currentId
      );

      return currentItemStillExists ? currentId : null;
    });
  }, [items, parentKey, suggestedOpenId]);

  const toggleItem = useCallback((itemId) => {
    const normalizedId = String(itemId);

    setOpenId((currentId) =>
      currentId === normalizedId ? null : normalizedId
    );
  }, []);

  const isItemOpen = useCallback(
    (itemId) => openId === String(itemId),
    [openId]
  );

  return {
    openId,
    setOpenId,
    toggleItem,
    isItemOpen,
  };
}

export default useMultiLevelMenu;
