import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, LogOut, GraduationCap, Search, Bell, PanelLeftClose, PanelLeft } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isCollapsed }) => {
  const { currentUser, logout, activeAnnee } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNotifications, setHasNotifications] = useState(true);

  return (
    <header className="h-20 bg-white border-b border-[#E5E7EB] px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 rounded-[12px] text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors flex items-center justify-center"
          title="Réduire / Agrandir la barre latérale"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <PanelLeft className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
        </button>

        <div>
          <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Université de Bamako</span>
            <span className="text-[10px] uppercase font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">MESRS</span>
          </h2>
          <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
            <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Année Académique Active : <strong className="text-gray-700">{activeAnnee?.libelle || '2025 - 2026'}</strong></span>
          </p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:block w-72 lg:w-96 relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Rechercher étudiant, enseignant, filière..."
          className="w-full pl-10 pr-4 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#2563EB] transition-colors"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications Icon Button */}
        <button
          onClick={() => setHasNotifications(false)}
          className="relative p-2.5 rounded-[12px] bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>

        {/* User Profile */}
        <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-gray-100">
          <div className="w-9 h-9 rounded-[10px] bg-blue-50 text-[#2563EB] font-bold flex items-center justify-center text-xs border border-blue-100 shrink-0">
            {currentUser?.name?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-gray-900">{currentUser?.name || 'Administrateur'}</div>
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              {currentUser?.type === 'admin' ? 'Administrateur' : 'Étudiant'}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-[12px] border border-gray-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
          title="Déconnexion"
        >
          <LogOut className="w-3.5 h-3.5 text-gray-500" />
          <span className="hidden lg:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
};

