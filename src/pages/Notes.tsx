import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Save,
  CheckCircle2,
  Zap,
  Users,
  Calculator,
  Upload,
  Printer,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Filter,
  RefreshCw,
  Sparkles,
  Grid,
  List
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const Notes: React.FC = () => {
  const {
    notes,
    matieres,
    etudiants,
    inscriptions,
    filieres,
    classes,
    semestres,
    annees,
    activeAnnee,
    saveNote,
    saveBulkNotes,
    parametres
  } = useApp();

  // Core selection states (Année académique, Filière, Semestre, Classe, Session)
  const [selectedAnneeId, setSelectedAnneeId] = useState<number>(activeAnnee?.id || 1);
  const [selectedFiliereId, setSelectedFiliereId] = useState<number>((filieres || [])[0]?.id || 1);
  const [selectedSemestreId, setSelectedSemestreId] = useState<number>((semestres || [])[0]?.id || 1);
  const [selectedClasseId, setSelectedClasseId] = useState<number>(0); // 0 = Toutes les classes
  const [selectedSession, setSelectedSession] = useState<string>('Normale');

  // View Mode: 'matrix' (All subjects in semester) vs 'single' (Focus on 1 subject)
  const [viewMode, setViewMode] = useState<'matrix' | 'single'>('matrix');
  const [selectedMatiereId, setSelectedMatiereId] = useState<number>(0);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Quick fill & feedback
  const [bulkNoteValue, setBulkNoteValue] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  // Saving progress indicator state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveProgress, setSaveProgress] = useState<number>(0);

  // Matrix Grade Entries State: Key is `${etudiantId}_${matiereId}` -> note string value
  const [matrixEntries, setMatrixEntries] = useState<Record<string, string>>({});

  // Sync selected academic year when activeAnnee loads
  useEffect(() => {
    if (activeAnnee?.id) {
      setSelectedAnneeId(activeAnnee.id);
    }
  }, [activeAnnee]);

  // Classes filtered by selected Filière
  const availableClasses = useMemo(() => {
    return (classes || []).filter(c => selectedFiliereId === 0 || c.id_filiere === selectedFiliereId);
  }, [classes, selectedFiliereId]);

  // Subjects (Matières) matching Filière & Semestre
  const semesterMatieres = useMemo(() => {
    return (matieres || []).filter(m => {
      const matchFiliere = selectedFiliereId === 0 || m.id_filiere === selectedFiliereId;
      const matchSemestre = selectedSemestreId === 0 || m.id_semestre === selectedSemestreId;
      return matchFiliere && matchSemestre;
    });
  }, [matieres, selectedFiliereId, selectedSemestreId]);

  // Ensure selectedMatiereId is valid for single view
  useEffect(() => {
    if (semesterMatieres.length > 0) {
      if (!semesterMatieres.some(m => m.id === selectedMatiereId)) {
        setSelectedMatiereId(semesterMatieres[0].id);
      }
    } else {
      setSelectedMatiereId(0);
    }
  }, [semesterMatieres, selectedMatiereId]);

  // Student inscriptions matching active selection (Année + Filière + Classe)
  const classInscriptions = useMemo(() => {
    return (inscriptions || []).filter(i => {
      const matchAnnee = i.id_annee_academique === selectedAnneeId;
      const matchFiliere = selectedFiliereId === 0 || i.id_filiere === selectedFiliereId;
      const matchClasse = selectedClasseId === 0 || i.id_classe === selectedClasseId;
      return matchAnnee && matchFiliere && matchClasse;
    });
  }, [inscriptions, selectedAnneeId, selectedFiliereId, selectedClasseId]);

  // Initialize Matrix Entries when filters or saved notes change
  useEffect(() => {
    const map: Record<string, string> = {};

    classInscriptions.forEach(ins => {
      semesterMatieres.forEach(m => {
        const key = `${ins.id_etudiant}_${m.id}`;
        const existing = (notes || []).find(
          n =>
            n.id_etudiant === ins.id_etudiant &&
            n.id_matiere === m.id &&
            n.id_annee_academique === selectedAnneeId
        );

        if (existing) {
          const val =
            selectedSession === 'Rattrapage' && existing.note_rattrapage !== undefined
              ? existing.note_rattrapage
              : existing.note_finale;
          map[key] = val !== undefined && val !== null ? val.toString() : '';
        } else {
          map[key] = '';
        }
      });
    });

    setMatrixEntries(map);
    setCurrentPage(1);
  }, [selectedAnneeId, selectedFiliereId, selectedSemestreId, selectedClasseId, selectedSession, classInscriptions, semesterMatieres]);

  // Cell note change handler
  const handleCellChange = (etudiantId: number, matiereId: number, valStr: string) => {
    const key = `${etudiantId}_${matiereId}`;
    setMatrixEntries(prev => ({
      ...prev,
      [key]: valStr
    }));
  };

  // Helper validation: returns status object
  const getNoteStatus = (valStr: string) => {
    if (!valStr || valStr.trim() === '') {
      return { isValid: true, isFilled: false, numericVal: 0, obs: 'Non saisie', colorClass: 'text-gray-400 bg-gray-50' };
    }
    const num = parseFloat(valStr.replace(',', '.'));
    if (isNaN(num) || num < 0 || num > 20) {
      return { isValid: false, isFilled: true, numericVal: NaN, obs: 'Invalide (0-20)', colorClass: 'text-red-700 bg-red-50 border-red-200' };
    }

    if (num < 10) {
      return {
        isValid: true,
        isFilled: true,
        numericVal: num,
        obs: selectedSession === 'Rattrapage' ? 'Ajourné' : 'Rattrapage',
        colorClass: 'text-red-700 bg-red-50 border-red-100'
      };
    } else if (num < 12) {
      return { isValid: true, isFilled: true, numericVal: num, obs: 'Passable', colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-100' };
    } else if (num < 14) {
      return { isValid: true, isFilled: true, numericVal: num, obs: 'Assez Bien', colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-100' };
    } else if (num < 16) {
      return { isValid: true, isFilled: true, numericVal: num, obs: 'Bien', colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-100' };
    } else if (num < 18) {
      return { isValid: true, isFilled: true, numericVal: num, obs: 'Très Bien', colorClass: 'text-blue-700 bg-blue-50 border-blue-100' };
    } else {
      return { isValid: true, isFilled: true, numericVal: num, obs: 'Excellent', colorClass: 'text-purple-700 bg-purple-50 border-purple-100' };
    }
  };

  // Student filtering & search
  const filteredStudents = useMemo(() => {
    return classInscriptions.filter(ins => {
      const etu = (etudiants || []).find(e => e.id === ins.id_etudiant);
      if (!etu) return false;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        etu.matricule.toLowerCase().includes(q) ||
        etu.nom.toLowerCase().includes(q) ||
        etu.prenom.toLowerCase().includes(q)
      );
    });
  }, [classInscriptions, etudiants, searchQuery]);

  // Paginated students
  const totalStudentsCount = filteredStudents.length;
  const totalPages = itemsPerPage === 0 ? 1 : Math.ceil(totalStudentsCount / (itemsPerPage || 10));
  const displayedStudents = useMemo(() => {
    if (itemsPerPage === 0) return filteredStudents;
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  // Active Matière for single view
  const activeSingleMatiere = useMemo(() => {
    return semesterMatieres.find(m => m.id === selectedMatiereId);
  }, [semesterMatieres, selectedMatiereId]);

  // Bulk Apply Note to active view or single subject
  const handleApplyBulkNote = () => {
    const status = getNoteStatus(bulkNoteValue);
    if (!status.isValid || !status.isFilled) {
      setSaveErrorMsg('Veuillez saisir une note valide entre 0 et 20 pour le remplissage collectif.');
      setTimeout(() => setSaveErrorMsg(null), 3000);
      return;
    }

    setMatrixEntries(prev => {
      const updated = { ...prev };
      filteredStudents.forEach(ins => {
        if (viewMode === 'single' && selectedMatiereId > 0) {
          updated[`${ins.id_etudiant}_${selectedMatiereId}`] = bulkNoteValue;
        } else {
          semesterMatieres.forEach(m => {
            updated[`${ins.id_etudiant}_${m.id}`] = bulkNoteValue;
          });
        }
      });
      return updated;
    });

    setSaveSuccessMsg(`Note (${bulkNoteValue}/20) appliquée avec succès !`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
    setBulkNoteValue('');
  };

  // Save All Grades
  const handleSaveAllGrades = () => {
    // Validate entries
    let hasError = false;
    Object.values(matrixEntries).forEach((val: string) => {
      if (val && val.trim() !== '') {
        const st = getNoteStatus(val);
        if (!st.isValid) hasError = true;
      }
    });

    if (hasError) {
      setSaveErrorMsg('Veuillez corriger les notes invalides (comprises entre 0 et 20) avant de sauvegarder.');
      setTimeout(() => setSaveErrorMsg(null), 4000);
      return;
    }

    setIsSaving(true);
    setSaveProgress(20);

    const timer1 = setTimeout(() => setSaveProgress(60), 300);

    const timer2 = setTimeout(() => {
      const payload: any[] = [];

      classInscriptions.forEach(ins => {
        semesterMatieres.forEach(m => {
          const key = `${ins.id_etudiant}_${m.id}`;
          const valStr = matrixEntries[key] || '';
          const status = getNoteStatus(valStr);

          if (status.isFilled && status.isValid) {
            const noteVal = status.numericVal;
            payload.push({
              id_etudiant: ins.id_etudiant,
              id_matiere: m.id,
              id_annee_academique: selectedAnneeId,
              id_semestre: selectedSemestreId,
              note_cc: noteVal,
              note_exam: noteVal,
              note_rattrapage: selectedSession === 'Rattrapage' ? noteVal : undefined,
              note_finale: noteVal,
              valide: noteVal >= 10.0,
              date_saisie: new Date().toISOString().split('T')[0]
            });
          }
        });
      });

      if (payload.length > 0) {
        saveBulkNotes(payload);
      }

      setSaveProgress(100);

      setTimeout(() => {
        setIsSaving(false);
        setSaveSuccessMsg(`Succès ! ${payload.length} notes ont été enregistrées avec succès.`);
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      }, 300);
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  // Import Notes from Excel
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<any>(ws);

        let updatedCount = 0;
        setMatrixEntries(prev => {
          const newMap = { ...prev };
          data.forEach(row => {
            const rawMatricule = row.Matricule || row.matricule || row.MATRICULE || row['N° Matricule'];
            const etu = (etudiants || []).find(
              e => e.matricule.trim().toLowerCase() === String(rawMatricule || '').trim().toLowerCase()
            );

            if (etu) {
              semesterMatieres.forEach(m => {
                const rawVal = row[m.nom] || row[m.code] || row.Note || row.note || row['Note (/20)'];
                if (rawVal !== undefined && rawVal !== null) {
                  newMap[`${etu.id}_${m.id}`] = String(rawVal);
                  updatedCount++;
                }
              });
            }
          });
          return newMap;
        });

        setSaveSuccessMsg(`Import Excel réussi : ${updatedCount} cellules de notes mises à jour !`);
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      } catch (err) {
        setSaveErrorMsg("Erreur lors de la lecture du fichier Excel. Vérifiez le format du fichier.");
        setTimeout(() => setSaveErrorMsg(null), 4000);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Export Notes to Excel
  const handleExportExcel = () => {
    const exportData = classInscriptions.map((ins, idx) => {
      const etu = (etudiants || []).find(e => e.id === ins.id_etudiant);
      const rowObj: any = {
        'N°': idx + 1,
        'Matricule': etu?.matricule || '',
        'Nom & Prénom': etu ? `${etu.nom} ${etu.prenom}` : ''
      };

      if (viewMode === 'single' && activeSingleMatiere) {
        const key = `${ins.id_etudiant}_${activeSingleMatiere.id}`;
        const st = getNoteStatus(matrixEntries[key] || '');
        rowObj[`${activeSingleMatiere.nom} (/20)`] = st.isFilled ? st.numericVal : 'N/A';
        rowObj['Observation'] = st.obs;
      } else {
        semesterMatieres.forEach(m => {
          const key = `${ins.id_etudiant}_${m.id}`;
          const st = getNoteStatus(matrixEntries[key] || '');
          rowObj[`${m.code} (/20)`] = st.isFilled ? st.numericVal : 'N/A';
        });
      }

      return rowObj;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Saisie_Notes');
    const selectedFiliereObj = (filieres || []).find(f => f.id === selectedFiliereId);
    XLSX.writeFile(workbook, `Notes_${selectedFiliereObj?.code || 'Filiere'}_Semestre_${selectedSemestreId}.xlsx`);
  };

  // Export Notes to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: semesterMatieres.length > 4 ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' });
    const selectedFiliereObj = (filieres || []).find(f => f.id === selectedFiliereId);
    const selectedSemestreObj = (semestres || []).find(s => s.id === selectedSemestreId);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(parametres?.nom_universite || 'Université - Gestion Académique', 14, 15);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Procès-Verbal de Saisie des Notes - Session ${selectedSession}`, 14, 22);

    doc.setFontSize(9);
    doc.text(`Filière: ${selectedFiliereObj?.nom || 'Toutes'} | Semestre: ${selectedSemestreObj?.code || ''}`, 14, 28);
    doc.text(`Année Académique: ${activeAnnee?.libelle || ''} | Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 33);

    let headCols: string[] = ['N°', 'Matricule', 'Nom Complet'];
    if (viewMode === 'single' && activeSingleMatiere) {
      headCols.push(`${activeSingleMatiere.code} (/20)`, 'Observation');
    } else {
      semesterMatieres.forEach(m => headCols.push(`${m.code} (/20)`));
    }

    const tableRows = classInscriptions.map((ins, idx) => {
      const etu = (etudiants || []).find(e => e.id === ins.id_etudiant);
      const row: string[] = [
        (idx + 1).toString(),
        etu?.matricule || '',
        etu ? `${etu.nom} ${etu.prenom}` : ''
      ];

      if (viewMode === 'single' && activeSingleMatiere) {
        const key = `${ins.id_etudiant}_${activeSingleMatiere.id}`;
        const st = getNoteStatus(matrixEntries[key] || '');
        row.push(st.isFilled ? `${st.numericVal}/20` : '-', st.obs);
      } else {
        semesterMatieres.forEach(m => {
          const key = `${ins.id_etudiant}_${m.id}`;
          const st = getNoteStatus(matrixEntries[key] || '');
          row.push(st.isFilled ? `${st.numericVal}` : '-');
        });
      }

      return row;
    });

    autoTable(doc, {
      startY: 38,
      head: [headCols],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2.5 }
    });

    doc.save(`Notes_${selectedFiliereObj?.code || 'Filiere'}_Semestre_${selectedSemestreId}.pdf`);
  };

  // Print view
  const handlePrint = () => {
    window.print();
  };

  // Compute summary stats
  const totalStudents = classInscriptions.length;
  let totalFilledCells = 0;
  let totalPossibleCells = totalStudents * semesterMatieres.length;
  let sumAllNotes = 0;

  classInscriptions.forEach(ins => {
    semesterMatieres.forEach(m => {
      const key = `${ins.id_etudiant}_${m.id}`;
      const st = getNoteStatus(matrixEntries[key] || '');
      if (st.isFilled && st.isValid) {
        totalFilledCells++;
        sumAllNotes += st.numericVal;
      }
    });
  });

  const overallAvg = totalFilledCells > 0 ? (sumAllNotes / totalFilledCells).toFixed(2) : '0.00';
  const fillPercentage = totalPossibleCells > 0 ? Math.round((totalFilledCells / totalPossibleCells) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-[#2563EB]" />
            Saisie Collective des Notes
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Saisie rapide des notes par Année Académique, Filière et Semestre avec affichage des élèves et matières.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Import Excel */}
          <label className="px-3.5 py-2 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-gray-700 rounded-[12px] text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors shadow-2xs">
            <Upload className="w-4 h-4 text-[#2563EB]" />
            <span>Importer Excel</span>
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleImportExcel} className="hidden" />
          </label>

          {/* Export Excel */}
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-gray-700 rounded-[12px] text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exporter Excel</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-gray-700 rounded-[12px] text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-2xs"
          >
            <FileText className="w-4 h-4 text-red-600" />
            <span>Exporter PDF</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-gray-700 rounded-[12px] text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-gray-600" />
            <span>Imprimer</span>
          </button>

          {/* Save All */}
          <button
            onClick={handleSaveAllGrades}
            disabled={isSaving || totalStudents === 0}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white rounded-[12px] text-xs font-bold inline-flex items-center gap-2 transition-all shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Enregistrement...' : 'Enregistrer Tout'}</span>
          </button>
        </div>
      </div>

      {/* Saving Progress Bar */}
      {isSaving && (
        <div className="bg-white border border-blue-100 rounded-[16px] p-4 shadow-xs space-y-2 animate-fadeIn print:hidden">
          <div className="flex items-center justify-between text-xs font-bold text-gray-900">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#2563EB] animate-spin" />
              Enregistrement collectif des notes en cours...
            </span>
            <span className="font-mono text-[#2563EB]">{saveProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#2563EB] h-full transition-all duration-300 ease-out"
              style={{ width: `${saveProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Notifications */}
      {saveSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-[14px] flex items-center gap-2.5 animate-fadeIn print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {saveErrorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-[14px] flex items-center gap-2.5 animate-fadeIn print:hidden">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{saveErrorMsg}</span>
        </div>
      )}

      {/* Core Academic Selection Controls (Année Académique, Filière, Semestre) */}
      <div className="bg-white border border-[#E5E7EB] rounded-[18px] p-5 shadow-xs space-y-4 print:hidden">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-[#2563EB]" />
            <span>Sélection de la Classe & du Programme</span>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#F8F9FA] p-1 border border-[#E5E7EB] rounded-[10px]">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1 rounded-[8px] text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors ${
                viewMode === 'matrix' ? 'bg-white text-[#2563EB] shadow-2xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Matrice Toutes Matières</span>
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1 rounded-[8px] text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors ${
                viewMode === 'single' ? 'bg-white text-[#2563EB] shadow-2xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Saisie par Matière</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {/* 1. Année Académique */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">1. Année Académique</label>
            <select
              value={selectedAnneeId}
              onChange={e => setSelectedAnneeId(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] font-bold text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
            >
              {(annees || []).map(a => (
                <option key={a.id} value={a.id}>{a.libelle} {a.active ? '(Active)' : ''}</option>
              ))}
            </select>
          </div>

          {/* 2. Filière */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">2. Filière / Spécialité</label>
            <select
              value={selectedFiliereId}
              onChange={e => {
                const fId = Number(e.target.value);
                setSelectedFiliereId(fId);
                setSelectedClasseId(0);
              }}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] font-bold text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
            >
              {(filieres || []).map(f => (
                <option key={f.id} value={f.id}>{f.code} - {f.nom}</option>
              ))}
            </select>
          </div>

          {/* 3. Semestre */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">3. Semestre</label>
            <select
              value={selectedSemestreId}
              onChange={e => setSelectedSemestreId(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] font-bold text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
            >
              {(semestres || []).map(s => (
                <option key={s.id} value={s.id}>{s.code} - {s.nom}</option>
              ))}
            </select>
          </div>

          {/* 4. Classe (Optionnel / Auto-filtré) */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">4. Classe (Groupe)</label>
            <select
              value={selectedClasseId}
              onChange={e => setSelectedClasseId(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] font-semibold text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
            >
              <option value={0}>Toutes les classes</option>
              {availableClasses.map(c => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>

          {/* 5. Session */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">5. Session d'Examen</label>
            <select
              value={selectedSession}
              onChange={e => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] font-semibold text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
            >
              <option value="Normale">Session Normale</option>
              <option value="Rattrapage">Session Rattrapage</option>
            </select>
          </div>
        </div>

        {/* Matière Selector if single view */}
        {viewMode === 'single' && (
          <div className="pt-2 border-t border-gray-100 flex items-center gap-3">
            <span className="text-xs font-bold text-gray-700 whitespace-nowrap">Matière ciblée :</span>
            <select
              value={selectedMatiereId}
              onChange={e => setSelectedMatiereId(Number(e.target.value))}
              className="flex-1 px-3 py-2 bg-blue-50/60 border border-blue-200 rounded-[12px] text-xs font-bold text-[#2563EB] focus:bg-white focus:outline-none"
            >
              {semesterMatieres.map(m => (
                <option key={m.id} value={m.id}>
                  [{m.code}] {m.nom} — ({m.credits} ECTS, Coeff {m.coefficient})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Class Analytics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 print:hidden">
        <div className="bg-white p-4 rounded-[16px] border border-[#E5E7EB] flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Effectif Classe</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{totalStudents} étudiants</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-[16px] border border-[#E5E7EB] flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Matières du Semestre</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{semesterMatieres.length} matières</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-[16px] border border-[#E5E7EB] flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Progression Saisie</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{fillPercentage}% complet</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-[16px] border border-[#E5E7EB] flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Moyenne Globale</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5 font-mono">{overallAvg} / 20</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Calculator className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Quick Fill Toolbar */}
      <div className="bg-white border border-[#E5E7EB] p-4 rounded-[16px] flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        {/* Instant Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Recherche instantanée par nom, prénom ou matricule..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] text-xs text-gray-900 focus:bg-white focus:border-[#2563EB] focus:outline-none transition-colors"
          />
        </div>

        {/* Mass Fill Controls */}
        <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
          <span className="text-xs font-semibold text-gray-600 whitespace-nowrap flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-[#2563EB]" /> Remplissage automatique :
          </span>
          <input
            type="number"
            min="0"
            max="20"
            step="0.5"
            placeholder="ex: 12"
            value={bulkNoteValue}
            onChange={e => setBulkNoteValue(e.target.value)}
            className="w-20 px-3 py-1.5 text-xs font-mono font-bold bg-[#F8F9FA] border border-[#E5E7EB] rounded-[10px] focus:bg-white focus:border-[#2563EB] focus:outline-none"
          />
          <button
            onClick={handleApplyBulkNote}
            className="px-3 py-1.5 bg-[#F8F9FA] border border-[#E5E7EB] hover:bg-gray-100 text-gray-800 rounded-[10px] text-xs font-bold transition-colors"
          >
            Appliquer
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col">
        {/* Table Header Banner */}
        <div className="p-4 border-b border-[#E5E7EB] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              {viewMode === 'matrix'
                ? `Matrice Collective — Toutes les Matières (${semesterMatieres.length})`
                : `Feuille de Saisie : ${activeSingleMatiere?.nom || 'Matière'}`}
            </h3>
          </div>

          <div className="text-xs font-bold text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-[8px]">
            Session {selectedSession} &bull; {filteredStudents.length} Étudiants affichés
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB] sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 w-12">N°</th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 w-28">Matricule</th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Nom & Prénom</th>

                {/* Display subject headers */}
                {viewMode === 'matrix' ? (
                  semesterMatieres.map(m => (
                    <th key={m.id} className="px-3 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-700 text-center border-l border-gray-100 min-w-[120px]">
                      <div>{m.code}</div>
                      <div className="text-[9px] text-gray-400 font-normal truncate max-w-[110px]" title={m.nom}>
                        {m.nom}
                      </div>
                      <div className="text-[9px] text-[#2563EB] font-mono">({m.credits} ECTS)</div>
                    </th>
                  ))
                ) : (
                  <>
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">Crédits</th>
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 w-32">Note (/20)</th>
                    <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Observation</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan={viewMode === 'matrix' ? 3 + semesterMatieres.length : 6} className="px-6 py-12 text-center text-xs text-gray-400">
                    {searchQuery
                      ? 'Aucun étudiant ne correspond à votre recherche.'
                      : 'Aucun étudiant inscrit trouvé pour la Filière et l\'Année sélectionnées.'}
                  </td>
                </tr>
              ) : (
                displayedStudents.map((ins, idx) => {
                  const globalIdx = (currentPage - 1) * (itemsPerPage || displayedStudents.length) + idx + 1;
                  const etu = (etudiants || []).find(e => e.id === ins.id_etudiant);
                  if (!etu) return null;

                  return (
                    <tr key={ins.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* N° */}
                      <td className="px-4 py-3 text-xs text-gray-400 font-mono">{globalIdx}</td>

                      {/* Matricule */}
                      <td className="px-4 py-3 text-xs font-bold text-[#2563EB] font-mono">
                        {etu.matricule}
                      </td>

                      {/* Nom & Prénom */}
                      <td className="px-4 py-3 text-xs font-bold text-gray-900 whitespace-nowrap">
                        {etu.nom} {etu.prenom}
                      </td>

                      {/* Subject Grade Cells */}
                      {viewMode === 'matrix' ? (
                        semesterMatieres.map(m => {
                          const key = `${etu.id}_${m.id}`;
                          const valStr = matrixEntries[key] || '';
                          const status = getNoteStatus(valStr);

                          return (
                            <td key={m.id} className="px-2 py-2 border-l border-gray-100 text-center">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={valStr}
                                onChange={e => handleCellChange(etu.id, m.id, e.target.value)}
                                placeholder="-"
                                className={`w-20 px-2 py-1 text-xs font-mono font-bold text-center rounded-[8px] border transition-all ${
                                  !status.isValid
                                    ? 'bg-red-50 border-red-400 text-red-700'
                                    : valStr !== ''
                                    ? 'bg-white border-[#2563EB] text-gray-900'
                                    : 'bg-[#F8F9FA] border-[#E5E7EB] text-gray-800'
                                }`}
                              />
                            </td>
                          );
                        })
                      ) : (
                        <>
                          {/* Single View: Crédits */}
                          <td className="px-4 py-3 text-xs font-bold text-gray-600 font-mono text-center">
                            {activeSingleMatiere?.credits || 0} ECTS
                          </td>

                          {/* Single View: Note */}
                          <td className="px-4 py-3">
                            {activeSingleMatiere && (() => {
                              const key = `${etu.id}_${activeSingleMatiere.id}`;
                              const valStr = matrixEntries[key] || '';
                              const status = getNoteStatus(valStr);

                              return (
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  step="0.25"
                                  value={valStr}
                                  onChange={e => handleCellChange(etu.id, activeSingleMatiere.id, e.target.value)}
                                  placeholder="Ex: 14"
                                  className={`w-28 px-3 py-1.5 text-xs font-mono font-bold rounded-[10px] border transition-all ${
                                    !status.isValid
                                      ? 'bg-red-50 border-red-400 text-red-700'
                                      : valStr !== ''
                                      ? 'bg-white border-[#2563EB] text-gray-900'
                                      : 'bg-[#F8F9FA] border-[#E5E7EB] text-gray-800'
                                  }`}
                                />
                              );
                            })()}
                          </td>

                          {/* Single View: Observation */}
                          <td className="px-4 py-3 text-xs font-semibold">
                            {activeSingleMatiere && (() => {
                              const key = `${etu.id}_${activeSingleMatiere.id}`;
                              const valStr = matrixEntries[key] || '';
                              const status = getNoteStatus(valStr);

                              return (
                                <span className={`px-2.5 py-1 rounded-[8px] border text-[11px] inline-block ${status.colorClass}`}>
                                  {status.obs}
                                </span>
                              );
                            })()}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Footer Controls */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F8F9FA] flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <div className="text-xs text-gray-500 font-medium">
            Affichage de {totalStudentsCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} à{' '}
            {Math.min(currentPage * itemsPerPage, totalStudentsCount)} sur {totalStudentsCount} étudiants
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-500 font-medium">Lignes par page :</span>
              <select
                value={itemsPerPage}
                onChange={e => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-white border border-[#E5E7EB] rounded-[8px] text-xs font-semibold text-gray-800"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={0}>Tous</option>
              </select>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 bg-white border border-[#E5E7EB] rounded-[8px] disabled:opacity-40 hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs font-mono font-bold text-gray-700 px-2">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 bg-white border border-[#E5E7EB] rounded-[8px] disabled:opacity-40 hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
