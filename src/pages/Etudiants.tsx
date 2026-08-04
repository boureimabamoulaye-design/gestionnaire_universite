import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { Plus, Search, Edit2, Trash2, FileSpreadsheet, Download, Upload, User, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Etudiants: React.FC = () => {
  const { etudiants, filieres, classes, addEtudiant, updateEtudiant, deleteEtudiant, importEtudiants } = useApp();
  const [search, setSearch] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [matricule, setMatricule] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [dateNaissance, setDateNaissance] = useState('2003-01-01');
  const [lieuNaissance, setLieuNaissance] = useState('Bamako');
  const [genre, setGenre] = useState<'M' | 'F'>('M');
  const [adresse, setAdresse] = useState('');
  const [motDePasse, setMotDePasse] = useState('etudiant123');

  const openAdd = () => {
    setEditingId(null);
    setMatricule(`2025-${Math.floor(100 + Math.random() * 900)}`);
    setNom('');
    setPrenom('');
    setEmail('');
    setTelephone('+223 ');
    setDateNaissance('2003-01-01');
    setLieuNaissance('Bamako');
    setGenre('M');
    setAdresse('Bamako');
    setMotDePasse('etudiant123');
    setIsModalOpen(true);
  };

  const openEdit = (e: any) => {
    setEditingId(e.id);
    setMatricule(e.matricule);
    setNom(e.nom);
    setPrenom(e.prenom);
    setEmail(e.email);
    setTelephone(e.telephone);
    setDateNaissance(e.date_naissance);
    setLieuNaissance(e.lieu_naissance);
    setGenre(e.genre);
    setAdresse(e.adresse);
    setMotDePasse(e.mot_de_passe || 'etudiant123');
    setIsModalOpen(true);
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (editingId) {
      updateEtudiant(editingId, { matricule, nom, prenom, email, telephone, date_naissance: dateNaissance, lieu_naissance: lieuNaissance, genre, adresse, mot_de_passe: motDePasse });
    } else {
      addEtudiant({ matricule, nom, prenom, email, telephone, date_naissance: dateNaissance, lieu_naissance: lieuNaissance, genre, adresse, photo: '', statut: 'actif', mot_de_passe: motDePasse });
    }
    setIsModalOpen(false);
  };

  // Filtered students
  const filteredEtudiants = (etudiants || []).filter(e => {
    const matchesSearch = `${e.nom} ${e.prenom} ${e.matricule} ${e.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesGender = selectedGender === 'all' || e.genre === selectedGender;
    return matchesSearch && matchesGender;
  });

  // Export to Excel
  const handleExportExcel = () => {
    const data = filteredEtudiants.map(e => ({
      Matricule: e.matricule,
      Nom: e.nom,
      Prénom: e.prenom,
      Email: e.email,
      Téléphone: e.telephone,
      Genre: e.genre,
      'Date de Naissance': e.date_naissance,
      'Lieu de Naissance': e.lieu_naissance,
      Statut: e.statut
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Etudiants');
    XLSX.writeFile(workbook, 'Liste_Etudiants_Mali.xlsx');
  };

  // Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Université des Sciences et Technologies de Bamako', 14, 15);
    doc.setFontSize(10);
    doc.text('Liste Officielle des Étudiants Inscrits', 14, 22);

    const tableRows = filteredEtudiants.map(e => [
      e.matricule,
      `${e.nom} ${e.prenom}`,
      e.genre,
      e.telephone,
      e.email,
      e.date_naissance
    ]);

    autoTable(doc, {
      startY: 28,
      head: [['Matricule', 'Nom & Prénom', 'Genre', 'Téléphone', 'Email', 'Date Naiss.']],
      body: tableRows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save('Liste_Etudiants.pdf');
  };

  // Handle Excel File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsName = wb.SheetNames[0];
      const ws = wb.Sheets[wsName];
      const data = XLSX.utils.sheet_to_json(ws) as any[];

      const imported = data.map((row, i) => ({
        matricule: row.Matricule || `2025-IMP${100 + i}`,
        nom: row.Nom || 'ETUDIANT',
        prenom: row['Prénom'] || 'Nouveau',
        email: row.Email || `imp${i}@etudiant.ml`,
        telephone: row['Téléphone'] || '+223 70000000',
        date_naissance: row['Date de Naissance'] || '2003-01-01',
        lieu_naissance: row['Lieu de Naissance'] || 'Bamako',
        genre: (row.Genre === 'F' ? 'F' : 'M') as 'M' | 'F',
        adresse: 'Bamako',
        photo: '',
        statut: 'actif' as const
      }));

      importEtudiants(imported);
      setIsImportModalOpen(false);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Gestion des Étudiants</h1>
          <p className="text-xs text-gray-400 mt-1">{etudiants.length} étudiants régulièrement inscrits au registre</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-[12px] text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importer Excel</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 rounded-[12px] text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 rounded-[12px] text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
          <button
            onClick={openAdd}
            className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[12px] text-xs font-bold transition-colors shadow-2xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Étudiant</span>
          </button>
        </div>
      </div>

      {/* Student Table Container */}
      <div className="bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col">
        {/* Table Filter Toolbar */}
        <div className="p-4 border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4 bg-white">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Recherche nom, matricule, email..."
                className="w-full pl-10 pr-4 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#2563EB] transition-colors"
              />
            </div>
            <select
              value={selectedGender}
              onChange={e => setSelectedGender(e.target.value)}
              className="px-3.5 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#2563EB]"
            >
              <option value="all">Tous les genres</option>
              <option value="M">Masculin (M)</option>
              <option value="F">Féminin (F)</option>
            </select>
          </div>
          <div className="text-xs text-gray-400 font-medium">
            Affichage de <strong className="text-gray-900">{filteredEtudiants.length}</strong> / {etudiants.length} étudiants
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Matricule</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Nom & Prénom</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Genre</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Contact</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Lieu de Naissance</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Statut</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEtudiants.map(e => (
                <tr key={e.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold font-mono text-[#2563EB]">{e.matricule}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-900">{e.nom} {e.prenom}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-700">{e.genre}</td>
                  <td className="px-6 py-4 text-xs text-gray-600 font-mono">{e.telephone} &bull; {e.email}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{e.lieu_naissance} ({e.date_naissance})</td>
                  <td className="px-6 py-4 text-[10px]">
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full font-bold uppercase inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {e.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(e)}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/60 rounded-[10px] text-xs font-semibold inline-flex items-center gap-1 transition-colors mr-2"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Modifier</span>
                    </button>
                    <button
                      onClick={() => deleteEtudiant(e.id)}
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

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Modifier l'Étudiant" : "Ajouter un Étudiant"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Matricule</label>
              <input
                type="text"
                value={matricule}
                onChange={e => setMatricule(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Genre</label>
              <select
                value={genre}
                onChange={e => setGenre(e.target.value as 'M' | 'F')}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              >
                <option value="M">Masculin (M)</option>
                <option value="F">Féminin (F)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nom</label>
              <input
                type="text"
                value={nom}
                onChange={e => setNom(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                placeholder="KEITA"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Prénom</label>
              <input
                type="text"
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                placeholder="Amadou"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Adresse Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                placeholder="amadou@etudiant.ml"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Téléphone</label>
              <input
                type="text"
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                placeholder="+223 70 00 11 22"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date de Naissance</label>
              <input
                type="date"
                value={dateNaissance}
                onChange={e => setDateNaissance(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Lieu de Naissance</label>
              <input
                type="text"
                value={lieuNaissance}
                onChange={e => setLieuNaissance(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
                placeholder="Bamako"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Adresse Domicile</label>
            <input
              type="text"
              value={adresse}
              onChange={e => setAdresse(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs font-medium text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
              placeholder="Badalabougou Rue 12"
            />
          </div>

          <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-[14px]">
            <label className="block text-xs font-bold text-gray-900 mb-1">
              Mot de passe de connexion attribué
            </label>
            <p className="text-[11px] text-gray-500 mb-2">
              Ce mot de passe permettra à l'étudiant de se connecter à son portail.
            </p>
            <input
              type="text"
              value={motDePasse}
              onChange={e => setMotDePasse(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-[12px] text-xs font-mono font-bold text-[#2563EB] focus:border-[#2563EB] focus:outline-none transition-colors"
              placeholder="ex: etudiant123"
            />
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

      {/* Import Modal */}
      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Importer des Étudiants (Excel / CSV)">
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Sélectionnez un fichier Excel (`.xlsx` ou `.csv`) contenant les colonnes :
            <span className="font-mono bg-gray-100 px-2 py-1 rounded-[8px] text-[11px] block mt-2 text-gray-800 border border-gray-200">
              Matricule, Nom, Prénom, Email, Téléphone, Genre, Date de Naissance, Lieu de Naissance
            </span>
          </p>

          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            className="block w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-[12px] file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#2563EB] hover:file:bg-blue-100 transition-colors"
          />

          <div className="pt-4 flex justify-end border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(false)}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-[12px] text-xs font-semibold transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

