import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserCheck } from 'lucide-react';

export const Utilisateurs: React.FC = () => {
  const { administrateurs } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Comptes Administrateurs & Secrétariat</h1>
          <p className="text-xs text-gray-400 mt-1">Personnel disposant d'un accès de gestion au système d'information universitaire</p>
        </div>
      </div>

      <div className="bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Nom & Prénom</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Identifiant</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Adresse Email</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Rôle Systémique</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(administrateurs || []).map(a => (
                <tr key={a.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-gray-900">{a.nom} {a.prenom}</td>
                  <td className="px-6 py-4 text-xs font-mono font-bold text-[#2563EB]">{a.username}</td>
                  <td className="px-6 py-4 text-xs text-gray-600 font-mono">{a.email}</td>
                  <td className="px-6 py-4 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#2563EB] rounded-[8px] text-[11px] font-bold border border-blue-100 uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{a.role}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{a.statut}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

