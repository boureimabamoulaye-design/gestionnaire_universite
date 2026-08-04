import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  BookOpen,
  Layers,
  Users,
  UserCheck,
  FileCheck,
  DollarSign,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  Calendar,
  Award,
  CreditCard,
  User,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  isCollapsed = false
}) => {
  const { currentUser } = useApp();
  const isAdmin = currentUser?.type === 'admin';

  const adminMenu = [
    {
      category: 'Général',
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard }
      ]
    },
    {
      category: 'Structure Académique',
      items: [
        { id: 'filieres', label: 'Filières', icon: BookOpen },
        { id: 'classes', label: 'Classes', icon: Users },
        { id: 'matieres', label: 'Matières & Crédits', icon: BookOpen },
        { id: 'annees', label: 'Années Académiques', icon: Calendar }
      ]
    },
    {
      category: 'Acteurs & Scolarité',
      items: [
        { id: 'etudiants', label: 'Étudiants', icon: GraduationCap },
        { id: 'enseignants', label: 'Enseignants', icon: UserCheck },
        { id: 'inscriptions', label: 'Inscriptions', icon: FileCheck }
      ]
    },
    {
      category: 'Évaluations & Comptabilité',
      items: [
        { id: 'notes', label: 'Saisie des Notes', icon: Award },
        { id: 'bulletins', label: 'Bulletins & Relevés', icon: FileSpreadsheet },
        { id: 'paiements', label: 'Paiements & Frais', icon: DollarSign }
      ]
    },
    {
      category: 'Système',
      items: [
        { id: 'rapports', label: 'Rapports & Exports', icon: FileSpreadsheet },
        { id: 'utilisateurs', label: 'Utilisateurs', icon: ShieldCheck },
        { id: 'parametres', label: 'Paramètres', icon: Settings }
      ]
    }
  ];

  const etudiantMenu = [
    {
      category: 'Espace Étudiant',
      items: [
        { id: 'etudiant-dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
        { id: 'etudiant-profil', label: 'Mon Profil', icon: User },
        { id: 'etudiant-notes', label: 'Mes Notes', icon: Award },
        { id: 'etudiant-bulletins', label: 'Mes Bulletins', icon: FileSpreadsheet },
        { id: 'etudiant-paiements', label: 'Mes Paiements', icon: CreditCard }
      ]
    }
  ];

  const menuGroups = isAdmin ? adminMenu : etudiantMenu;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 bg-white border-r border-[#E5E7EB] z-50 flex flex-col transition-all duration-200 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-20 px-6 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
          {!isCollapsed ? (
            <div>
              <h1 className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Université Mali</h1>
              <p className="text-[10px] text-gray-400 mt-0.5 uppercase font-semibold">Gestion Scolaire</p>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-[10px] bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs mx-auto">
              UM
            </div>
          )}
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              {!isCollapsed && (
                <div className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  {group.category}
                </div>
              )}
              <div className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        onClose();
                      }}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center ${
                        isCollapsed ? 'justify-center px-0 py-3' : 'px-3.5 py-2.5'
                      } rounded-[12px] text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#F3F4F6] text-[#2563EB] font-bold shadow-2xs'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {!isCollapsed && (
                        <span className={`w-2 h-2 rounded-full mr-2.5 shrink-0 ${isActive ? 'bg-[#2563EB]' : 'bg-gray-300'}`} />
                      )}
                      <Icon className={`w-4 h-4 ${isCollapsed ? '' : 'mr-2.5'} shrink-0 ${isActive ? 'text-[#2563EB]' : 'text-gray-400'}`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto shrink-0 bg-white">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-[10px] bg-blue-50 text-[#2563EB] font-bold flex items-center justify-center text-xs border border-blue-100 shrink-0">
              {currentUser?.name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1 ml-3">
                <p className="text-xs font-bold text-gray-900 truncate">{currentUser?.name || 'Administrateur'}</p>
                <p className="text-[10px] text-gray-400 truncate font-mono">{currentUser?.email || 'admin@univ-mali.ml'}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

