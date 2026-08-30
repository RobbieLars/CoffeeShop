import { useCallback, useState } from "react";

export function useAppLayout({ initialSidebarOpen = false } = {}) {
  const [sidebarOpen, setSidebarOpen] = useState(initialSidebarOpen);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(
    () => setSidebarOpen((open) => !open),
    []
  );

  return {
    sidebarOpen,
    setSidebarOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,
  };
}

export default useAppLayout;
