import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Award } from 'lucide-react';

export const Rapports: React.FC = () => {
  const { etudiants, inscriptions, paiements, filieres, activeAnnee } = useApp();

  const activeAnneeId = activeAnnee?.id || 1;

  // Filière breakdown
  const filiereData = (filieres || []).map(f => {
    const count = (inscriptions || []).filter(i => i.id_filiere === f.id && i.id_annee_academique === activeAnneeId).length;
    return { name: f.code, count };
  });

  // Gender breakdown
  const maleCount = (etudiants || []).filter(e => e.genre === 'M').length;
  const femaleCount = (etudiants || []).filter(e => e.genre === 'F').length;
  const genderData = [
    { name: 'Hommes (M)', value: maleCount, color: '#2563eb' },
    { name: 'Femmes (F)', value: femaleCount, color: '#64748b' }
  ];

  // Financial summary
  const totalCollected = (paiements || []).reduce((acc, p) => acc + p.montant, 0);
  const totalExpected = (inscriptions || []).reduce((acc, i) => acc + i.montant_total, 0);
  const remainingDebt = totalExpected - totalCollected;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Rapports & Statistiques Universitaires</h1>
          <p className="text-xs text-gray-400 mt-1">Analytique globale pour l'année académique active {activeAnnee?.libelle}</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-xs flex items-center gap-4">
          <div className="p-3 bg-[#F8F9FA] border border-[#E5E7EB] text-[#2563EB] rounded-[12px]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Inscriptions Actives</span>
            <div className="text-2xl font-bold text-gray-900 mt-0.5">{inscriptions.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-xs flex items-center gap-4">
          <div className="p-3 bg-[#F8F9FA] border border-[#E5E7EB] text-emerald-600 rounded-[12px]">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Recouvrement Total</span>
            <div className="text-xl font-bold text-gray-900 font-mono mt-0.5">{totalCollected.toLocaleString()} FCFA</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-xs flex items-center gap-4">
          <div className="p-3 bg-[#F8F9FA] border border-[#E5E7EB] text-amber-600 rounded-[12px]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Reliquat à Recouvrer</span>
            <div className="text-xl font-bold text-gray-900 font-mono mt-0.5">{remainingDebt.toLocaleString()} FCFA</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-xs flex items-center gap-4">
          <div className="p-3 bg-[#F8F9FA] border border-[#E5E7EB] text-[#2563EB] rounded-[12px]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Taux de Réussite Est.</span>
            <div className="text-2xl font-bold text-gray-900 mt-0.5">88.5%</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Filière Chart */}
        <div className="bg-white p-6 rounded-[18px] border border-[#E5E7EB] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Répartition des Inscrits par Filière</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filiereData}>
                <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Breakdown Chart */}
        <div className="bg-white p-6 rounded-[18px] border border-[#E5E7EB] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Parité Genre des Étudiants</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs font-semibold pt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2563eb]"></span>
              <span className="text-gray-700">Hommes ({maleCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#64748b]"></span>
              <span className="text-gray-700">Femmes ({femaleCount})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

