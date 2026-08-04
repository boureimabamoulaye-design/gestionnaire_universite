import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save } from 'lucide-react';

export const Parametres: React.FC = () => {
  const { parametres, updateParametres } = useApp();

  const [nomUniv, setNomUniv] = useState(parametres.nom_universite);
  const [sigle, setSigle] = useState(parametres.sigle);
  const [ministere, setMinistere] = useState(parametres.ministere);
  const [devise, setDevise] = useState(parametres.devise);
  const [adresse, setAdresse] = useState(parametres.adresse);
  const [telephone, setTelephone] = useState(parametres.telephone);
  const [email, setEmail] = useState(parametres.email);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParametres({
      nom_universite: nomUniv,
      sigle,
      ministere,
      devise,
      adresse,
      telephone,
      email
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Paramètres Généraux du Système</h1>
        <p className="text-xs text-gray-400 mt-1">Informations officielles de l'établissement figurant sur les reçus, bulletins et actes officiels</p>
      </div>

      <div className="bg-white rounded-[18px] border border-[#E5E7EB] p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          {saved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[12px] text-xs font-semibold">
              &check; Configuration sauvegardée avec succès.
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ministère de Tutelle</label>
            <input
              type="text"
              value={ministere}
              onChange={e => setMinistere(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nom Officiel de l'Établissement</label>
              <input
                type="text"
                value={nomUniv}
                onChange={e => setNomUniv(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sigle / Acronyme</label>
              <input
                type="text"
                value={sigle}
                onChange={e => setSigle(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Adresse Siège / Campus</label>
              <input
                type="text"
                value={adresse}
                onChange={e => setAdresse(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Devise Monétaire</label>
              <input
                type="text"
                value={devise}
                onChange={e => setDevise(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Téléphone Principal</label>
              <input
                type="text"
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Officiel</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t border-gray-100">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[12px] text-xs font-bold transition-colors shadow-2xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Sauvegarder les Paramètres</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

