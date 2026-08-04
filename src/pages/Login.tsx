import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { loginAdmin, loginEtudiant } = useApp();
  const [tab, setTab] = useState<'admin' | 'etudiant'>('admin');
  const [identifier, setIdentifier] = useState('admin@universite.ml');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleTabChange = (newTab: 'admin' | 'etudiant') => {
    setTab(newTab);
    setError('');
    if (newTab === 'admin') {
      setIdentifier('admin@universite.ml');
      setPassword('admin123');
    } else {
      setIdentifier('2025-001');
      setPassword('etudiant123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (tab === 'admin') {
      const ok = loginAdmin(identifier, password);
      if (!ok) setError('Identifiants administrateur incorrects (Utilisez admin@universite.ml / admin123)');
    } else {
      const ok = loginEtudiant(identifier, password);
      if (!ok) setError('Matricule ou mot de passe étudiant incorrect (Utilisez 2025-001 / etudiant123)');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-[20px] p-8 shadow-xs">
        <div className="text-center mb-8">
          <h1 className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Université de Bamako</h1>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">Portail de Gestion Scolaire</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-[12px] bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="flex bg-[#F8F9FA] p-1.5 rounded-[12px] mb-6 border border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`flex-1 py-2 text-xs font-bold rounded-[10px] flex items-center justify-center gap-1.5 transition-all ${
              tab === 'admin'
                ? 'bg-white text-[#2563EB] shadow-2xs border border-[#E5E7EB]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('etudiant')}
            className={`flex-1 py-2 text-xs font-bold rounded-[10px] flex items-center justify-center gap-1.5 transition-all ${
              tab === 'etudiant'
                ? 'bg-white text-[#2563EB] shadow-2xs border border-[#E5E7EB]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Étudiant</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-2">
              {tab === 'admin' ? 'Adresse Email' : 'Matricule Étudiant'}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              className="w-full px-4 py-2.5 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors text-gray-900 font-medium font-mono"
              placeholder={tab === 'admin' ? 'admin@universite.ml' : '2025-001'}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors text-gray-900 font-medium font-mono"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#2563EB] text-white rounded-[12px] text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs"
          >
            Se Connecter
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-gray-100 text-center text-[10px] text-gray-400 font-medium uppercase tracking-wider">
          Système Sécurisé &bull; MESRS République du Mali
        </div>
      </div>
    </div>
  );
};

