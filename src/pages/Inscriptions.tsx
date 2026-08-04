import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { Plus, Search, CheckCircle2, Clock } from 'lucide-react';

export const Inscriptions: React.FC = () => {
  const { inscriptions, etudiants, filieres, niveaux, classes, activeAnnee, addInscription } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeAnneeId = activeAnnee?.id || 1;
  const [idEtudiant, setIdEtudiant] = useState<number>((etudiants || [])[0]?.id || 1);
  const [idFiliere, setIdFiliere] = useState<number>((filieres || [])[0]?.id || 1);
  const [idNiveau, setIdNiveau] = useState<number>((niveaux || [])[0]?.id || 1);
  const [idClasse, setIdClasse] = useState<number>((classes || [])[0]?.id || 1);
  const [montantTotal, setMontantTotal] = useState(150000);
  const [montantPaye, setMontantPaye] = useState(150000);

  const activeInscriptions = (inscriptions || []).filter(i => i.id_annee_academique === activeAnneeId);

  const openAdd = () => {
    setIdEtudiant((etudiants || [])[0]?.id || 1);
    setIdFiliere((filieres || [])[0]?.id || 1);
    setIdNiveau((niveaux || [])[0]?.id || 1);
    setIdClasse((classes || [])[0]?.id || 1);
    setMontantTotal(150000);
    setMontantPaye(150000);
    setIsModalOpen(true);
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    addInscription({
      id_etudiant: Number(idEtudiant),
      id_annee_academique: activeAnneeId,
      id_filiere: Number(idFiliere),
      id_niveau: Number(idNiveau),
      id_classe: Number(idClasse),
      date_inscription: new Date().toISOString().split('T')[0],
      montant_total: Number(montantTotal),
      montant_paye: Number(montantPaye),
      statut: 'validee'
    });
    setIsModalOpen(false);
  };

  const filtered = activeInscriptions.filter(ins => {
    const etu = (etudiants || []).find(e => e.id === ins.id_etudiant);
    return (
      etu?.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      etu?.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      etu?.matricule.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Inscriptions Académiques</h1>
          <p className="text-xs text-gray-400 mt-1">
            Gestion des inscriptions pour l'année académique active <strong className="text-gray-900">{activeAnnee?.libelle}</strong>
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[12px] text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Inscrire un Étudiant</span>
        </button>
      </div>

      <div className="bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col">
        {/* Table Filter Header */}
        <div className="p-4 border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4 bg-white">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher par étudiant, matricule..."
              className="w-full pl-10 pr-4 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#2563EB] transition-colors"
            />
          </div>
          <div className="text-xs text-gray-400 font-medium">
            Affichage de <strong className="text-gray-900">{filtered.length}</strong> inscription(s)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Matricule</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Étudiant</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Filière</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Classe</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Montant Total</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Reste à payer</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(ins => {
                const etu = (etudiants || []).find(e => e.id === ins.id_etudiant);
                const fil = (filieres || []).find(f => f.id === ins.id_filiere);
                const cls = (classes || []).find(c => c.id === ins.id_classe);
                const reste = ins.montant_total - ins.montant_paye;

                return (
                  <tr key={ins.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-[#2563EB] font-mono">{etu?.matricule}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-900">{etu?.nom} {etu?.prenom}</td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-700">{fil?.code}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{cls?.nom}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-900 font-mono">{ins.montant_total.toLocaleString()} FCFA</td>
                    <td className="px-6 py-4 text-xs font-mono">
                      {reste === 0 ? (
                        <span className="text-emerald-600 font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 0 FCFA (Solder)
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {reste.toLocaleString()} FCFA
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-[8px] border border-emerald-100 text-[11px] capitalize">
                        {ins.statut}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Inscrire un Étudiant">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sélectionner l'Étudiant</label>
            <select
              value={idEtudiant}
              onChange={e => setIdEtudiant(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
            >
              {(etudiants || []).map(e => (
                <option key={e.id} value={e.id}>{e.matricule} - {e.nom} {e.prenom}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Filière</label>
              <select
                value={idFiliere}
                onChange={e => setIdFiliere(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              >
                {(filieres || []).map(f => (
                  <option key={f.id} value={f.id}>{f.code} - {f.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Niveau</label>
              <select
                value={idNiveau}
                onChange={e => setIdNiveau(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              >
                {(niveaux || []).map(n => (
                  <option key={n.id} value={n.id}>{n.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Classe / Groupe</label>
              <select
                value={idClasse}
                onChange={e => setIdClasse(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              >
                {(classes || []).map(c => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Montant Total Scolarité (FCFA)</label>
              <input
                type="number"
                value={montantTotal}
                onChange={e => setMontantTotal(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Versement Initial (FCFA)</label>
              <input
                type="number"
                value={montantPaye}
                onChange={e => setMontantPaye(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-[12px] text-xs font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[12px] text-xs font-bold transition-colors shadow-2xs"
            >
              Valider l'Inscription
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

