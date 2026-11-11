import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('quantum_sidebar_collapsed');
      if (stored !== null) return stored === 'true';
      return window.innerWidth < 1200;
    }
    return false;
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('quantum_sidebar_collapsed', String(next));
      return next;
    });
  };

  const toggleMobile = () => setMobileOpen(prev => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapse, mobileOpen, toggleMobile, closeMobile }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    return {
      collapsed: false,
      toggleCollapse: () => {},
      mobileOpen: false,
      toggleMobile: () => {},
      closeMobile: () => {}
    };
  }
  return context;
};
