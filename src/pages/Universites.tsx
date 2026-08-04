import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { Plus, Edit2, Trash2, Search, Building2, ExternalLink } from 'lucide-react';

export const Universites: React.FC = () => {
  const { universites, addUniversite, updateUniversite, deleteUniversite } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [code, setCode] = useState('');
  const [nom, setNom] = useState('');
  const [ville, setVille] = useState('Bamako');
  const [recteur, setRecteur] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');

  const openAdd = () => {
    setEditingId(null);
    setCode('');
    setNom('');
    setVille('Bamako');
    setRecteur('');
    setEmail('');
    setTelephone('');
    setIsModalOpen(true);
  };

  const openEdit = (u: any) => {
    setEditingId(u.id);
    setCode(u.code);
    setNom(u.nom);
    setVille(u.ville);
    setRecteur(u.recteur);
    setEmail(u.email);
    setTelephone(u.telephone);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateUniversite(editingId, { code, nom, ville, recteur, email, telephone });
    } else {
      addUniversite({ code, nom, ville, adresse: ville, recteur, email, telephone, statut: 'actif' });
    }
    setIsModalOpen(false);
  };

  const filtered = (universites || []).filter(u =>
    u.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.ville.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Gestion des Universités</h1>
          <p className="text-xs text-gray-400 mt-1">Établissements d'enseignement supérieur de la République du Mali</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[12px] text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Université</span>
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
              placeholder="Filtrer les universités..."
              className="w-full pl-10 pr-4 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#2563EB] transition-colors"
            />
          </div>
          <div className="text-xs text-gray-400 font-medium">
            Affichage de <strong className="text-gray-900">{filtered.length}</strong> établissement(s)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Code</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Nom de l'Université</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Ville</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Recteur</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Contact</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-[#2563EB] font-mono">{u.code}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-900">{u.nom}</td>
                  <td className="px-6 py-4 text-xs text-gray-600 font-medium">{u.ville}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{u.recteur}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">{u.telephone} &bull; {u.email}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(u)}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/60 rounded-[10px] text-xs font-semibold inline-flex items-center gap-1 transition-colors mr-2"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Modifier</span>
                    </button>
                    <button
                      onClick={() => deleteUniversite(u.id)}
                      className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/60 rounded-[10px] text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Modifier l'Université" : "Ajouter une Université"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Code / Sigle</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                placeholder="USTTB"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ville</label>
              <input
                type="text"
                value={ville}
                onChange={e => setVille(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                placeholder="Bamako"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nom complet de l'Université</label>
            <input
              type="text"
              value={nom}
              onChange={e => setNom(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              placeholder="Université des Sciences, des Techniques et des Technologies de Bamako"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nom du Recteur</label>
            <input
              type="text"
              value={recteur}
              onChange={e => setRecteur(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              placeholder="Pr. Ouaténi DIALLO"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Téléphone</label>
              <input
                type="text"
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                placeholder="+223 20 22 32 44"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Adresse Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                placeholder="contact@usttb.edu.ml"
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
              Enregistrer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

