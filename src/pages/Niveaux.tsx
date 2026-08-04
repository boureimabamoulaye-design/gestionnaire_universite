import React from 'react';
import { useApp } from '../context/AppContext';

export const Niveaux: React.FC = () => {
  const { niveaux, semestres } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Niveaux LMD & Semestres</h1>
        <p className="text-xs text-gray-400 mt-1">Structure des grades Licence, Master et Doctorat conforme au système LMD national</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Niveaux */}
        <div className="bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E5E7EB] bg-white">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Niveaux Académiques</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Code</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Intitulé</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Ordre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(niveaux || []).map(n => (
                  <tr key={n.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-bold text-[#2563EB] font-mono">{n.code}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-gray-900">{n.nom}</td>
                    <td className="px-5 py-3.5 text-xs font-mono text-gray-600">{n.ordre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Semestres */}
        <div className="bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E5E7EB] bg-white">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Semestres Associés</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Code</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Semestre</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Niveau Rattaché</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(semestres || []).map(s => {
                  const niv = (niveaux || []).find(n => n.id === s.id_niveau);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5 text-xs font-bold text-[#2563EB] font-mono">{s.code}</td>
                      <td className="px-5 py-3.5 text-xs font-bold text-gray-900">{s.nom}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-600 font-medium">{niv?.nom}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

