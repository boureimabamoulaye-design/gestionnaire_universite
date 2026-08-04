import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans text-gray-800 overflow-hidden antialiased">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
      />
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-200 ${
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        <Header
          onToggleSidebar={() => {
            // On desktop toggle collapse, on mobile toggle open
            if (window.innerWidth >= 1024) {
              setSidebarCollapsed(!sidebarCollapsed);
            } else {
              setSidebarOpen(!sidebarOpen);
            }
          }}
          isCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          {children}
        </main>
        <footer className="h-12 px-6 lg:px-10 border-t border-[#E5E7EB] bg-white flex items-center justify-between text-[10px] text-gray-400 font-medium shrink-0">
          <p>© 2026 Université de Bamako &bull; Système de Gestion Académique (MESRS)</p>
          <div className="hidden sm:flex space-x-6">
            <span>Serveur: Connecté (Cloud API)</span>
            <span>Base de données: postgres_univ</span>
            <span>v2.4.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

