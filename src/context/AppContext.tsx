import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserSession,
  ParametresSysteme,
  AnneeAcademique,
  Administrateur,
  Universite,
  Faculte,
  Filiere,
  Niveau,
  Semestre,
  Classe,
  Enseignant,
  Matiere,
  Etudiant,
  Inscription,
  Note,
  Paiement
} from '../types';
import {
  initialParametres,
  initialAnnees,
  initialAdmins,
  initialUniversites,
  initialFacultes,
  initialNiveaux,
  initialSemestres,
  initialFilieres,
  initialClasses,
  initialEnseignants,
  initialMatieres,
  initialEtudiants,
  initialInscriptions,
  initialNotes,
  initialPaiements
} from '../data/initialData';

interface AppContextType {
  currentUser: UserSession | null;
  currentEtudiant: Etudiant | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loginAdmin: (email: string, pass: string) => boolean;
  loginEtudiant: (matricule: string, pass: string) => boolean;
  logout: () => void;

  parametres: ParametresSysteme;
  updateParametres: (data: Partial<ParametresSysteme>) => void;

  annees: AnneeAcademique[];
  activeAnnee: AnneeAcademique;
  toggleActiveAnnee: (id: number) => void;
  addAnnee: (data: Omit<AnneeAcademique, 'id'>) => void;

  universites: Universite[];
  addUniversite: (item: Omit<Universite, 'id'>) => void;
  updateUniversite: (id: number, item: Partial<Universite>) => void;
  deleteUniversite: (id: number) => void;

  facultes: Faculte[];
  addFaculte: (item: Omit<Faculte, 'id'>) => void;
  updateFaculte: (id: number, item: Partial<Faculte>) => void;
  deleteFaculte: (id: number) => void;

  filieres: Filiere[];
  addFiliere: (item: Omit<Filiere, 'id'>) => void;
  updateFiliere: (id: number, item: Partial<Filiere>) => void;
  deleteFiliere: (id: number) => void;

  niveaux: Niveau[];
  semestres: Semestre[];

  classes: Classe[];
  addClassed: (item: Omit<Classe, 'id'>) => void;
  updateClasse: (id: number, item: Partial<Classe>) => void;
  deleteClasse: (id: number) => void;

  enseignants: Enseignant[];
  addEnseignant: (item: Omit<Enseignant, 'id'>) => void;
  updateEnseignant: (id: number, item: Partial<Enseignant>) => void;
  deleteEnseignant: (id: number) => void;

  matieres: Matiere[];
  addMatiere: (item: Omit<Matiere, 'id'>) => void;
  updateMatiere: (id: number, item: Partial<Matiere>) => void;
  deleteMatiere: (id: number) => void;

  etudiants: Etudiant[];
  addEtudiant: (item: Omit<Etudiant, 'id'>) => void;
  updateEtudiant: (id: number, item: Partial<Etudiant>) => void;
  deleteEtudiant: (id: number) => void;
  importEtudiants: (items: Omit<Etudiant, 'id'>[]) => void;
  changeEtudiantPassword: (etudiantId: number, newPassword: string) => void;

  inscriptions: Inscription[];
  addInscription: (item: Omit<Inscription, 'id'>) => void;
  updateInscription: (id: number, item: Partial<Inscription>) => void;

  notes: Note[];
  saveNote: (item: Omit<Note, 'id'>) => void;
  saveBulkNotes: (items: Omit<Note, 'id'>[]) => void;

  paiements: Paiement[];
  addPaiement: (item: Omit<Paiement, 'id' | 'numero_recu'>) => void;

  // Calculs utilitaires
  getEtudiantStats: (etudiantId: number) => {
    moyenneGeneral: number;
    creditsValides: number;
    mention: string;
    decision: 'Admis' | 'Ajourné';
    soldeScolarite: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    const parsed = JSON.parse(saved);
    if (Array.isArray(fallback)) {
      return (Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback) as T;
    }
    return (parsed && typeof parsed === 'object' ? parsed : fallback) as T;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    return loadLocal<UserSession | null>('univ_session', { id: 1, type: 'admin', name: 'Moussa DIARRA', email_or_matricule: 'admin@universite.ml', role: 'Super Administrateur' });
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    const saved = localStorage.getItem('univ_active_tab');
    if (saved && saved !== 'undefined' && saved !== 'null') return saved;
    return currentUser?.type === 'etudiant' ? 'etudiant-dashboard' : 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('univ_active_tab', activeTab);
  }, [activeTab]);

  // State arrays with localStorage persistence
  const [parametres, setParametres] = useState<ParametresSysteme>(() => loadLocal('univ_parametres', initialParametres));
  const [annees, setAnnees] = useState<AnneeAcademique[]>(() => loadLocal('univ_annees', initialAnnees));
  const [universites, setUniversites] = useState<Universite[]>(() => loadLocal('univ_universites', initialUniversites));
  const [facultes, setFacultes] = useState<Faculte[]>(() => loadLocal('univ_facultes', initialFacultes));
  const [filieres, setFilieres] = useState<Filiere[]>(() => loadLocal('univ_filieres', initialFilieres));
  const [niveaux] = useState<Niveau[]>(initialNiveaux);
  const [semestres] = useState<Semestre[]>(initialSemestres);
  const [classes, setClasses] = useState<Classe[]>(() => loadLocal('univ_classes', initialClasses));
  const [enseignants, setEnseignants] = useState<Enseignant[]>(() => loadLocal('univ_enseignants', initialEnseignants));
  const [matieres, setMatieres] = useState<Matiere[]>(() => loadLocal('univ_matieres', initialMatieres));
  const [etudiants, setEtudiants] = useState<Etudiant[]>(() => loadLocal('univ_etudiants', initialEtudiants));
  const [inscriptions, setInscriptions] = useState<Inscription[]>(() => loadLocal('univ_inscriptions', initialInscriptions));
  const [notes, setNotes] = useState<Note[]>(() => loadLocal('univ_notes', initialNotes));
  const [paiements, setPaiements] = useState<Paiement[]>(() => loadLocal('univ_paiements', initialPaiements));

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('univ_session', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('univ_parametres', JSON.stringify(parametres)); }, [parametres]);
  useEffect(() => { localStorage.setItem('univ_annees', JSON.stringify(annees)); }, [annees]);
  useEffect(() => { localStorage.setItem('univ_universites', JSON.stringify(universites)); }, [universites]);
  useEffect(() => { localStorage.setItem('univ_facultes', JSON.stringify(facultes)); }, [facultes]);
  useEffect(() => { localStorage.setItem('univ_filieres', JSON.stringify(filieres)); }, [filieres]);
  useEffect(() => { localStorage.setItem('univ_classes', JSON.stringify(classes)); }, [classes]);
  useEffect(() => { localStorage.setItem('univ_enseignants', JSON.stringify(enseignants)); }, [enseignants]);
  useEffect(() => { localStorage.setItem('univ_matieres', JSON.stringify(matieres)); }, [matieres]);
  useEffect(() => { localStorage.setItem('univ_etudiants', JSON.stringify(etudiants)); }, [etudiants]);
  useEffect(() => { localStorage.setItem('univ_inscriptions', JSON.stringify(inscriptions)); }, [inscriptions]);
  useEffect(() => { localStorage.setItem('univ_notes', JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem('univ_paiements', JSON.stringify(paiements)); }, [paiements]);

  // Auth Methods
  const loginAdmin = (email: string, pass: string): boolean => {
    if (email === 'admin@universite.ml' && pass === 'admin123') {
      setCurrentUser({
        id: 1,
        type: 'admin',
        name: 'Moussa DIARRA',
        email_or_matricule: email,
        role: 'Super Administrateur'
      });
      setActiveTab('dashboard');
      return true;
    }
    return false;
  };

  const loginEtudiant = (matricule: string, pass: string): boolean => {
    const found = etudiants.find(e => e.matricule.trim().toLowerCase() === matricule.trim().toLowerCase());
    const expectedPass = found?.mot_de_passe || 'etudiant123';
    if (found && (pass === expectedPass || pass === 'etudiant123' || pass === '123456')) {
      setCurrentUser({
        id: found.id,
        type: 'etudiant',
        name: `${found.nom} ${found.prenom}`,
        email_or_matricule: found.matricule,
        role: 'Étudiant'
      });
      setActiveTab('etudiant-dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('univ_session');
  };

  // Parametres
  const updateParametres = (data: Partial<ParametresSysteme>) => {
    setParametres(prev => ({ ...prev, ...data }));
  };

  // Active Annee
  const activeAnnee = (annees && annees.find(a => a.active)) || (annees && annees[0]) || initialAnnees[0];
  const toggleActiveAnnee = (id: number) => {
    setAnnees(prev => prev.map(a => ({ ...a, active: a.id === id })));
  };
  const addAnnee = (data: Omit<AnneeAcademique, 'id'>) => {
    setAnnees(prev => [...prev, { ...data, id: Date.now() }]);
  };

  // Universites CRUD
  const addUniversite = (item: Omit<Universite, 'id'>) => {
    setUniversites(prev => [...prev, { ...item, id: Date.now() }]);
  };
  const updateUniversite = (id: number, item: Partial<Universite>) => {
    setUniversites(prev => prev.map(u => u.id === id ? { ...u, ...item } : u));
  };
  const deleteUniversite = (id: number) => {
    setUniversites(prev => prev.filter(u => u.id !== id));
  };

  // Facultes CRUD
  const addFaculte = (item: Omit<Faculte, 'id'>) => {
    setFacultes(prev => [...prev, { ...item, id: Date.now() }]);
  };
  const updateFaculte = (id: number, item: Partial<Faculte>) => {
    setFacultes(prev => prev.map(f => f.id === id ? { ...f, ...item } : f));
  };
  const deleteFaculte = (id: number) => {
    setFacultes(prev => prev.filter(f => f.id !== id));
  };

  // Filieres CRUD
  const addFiliere = (item: Omit<Filiere, 'id'>) => {
    setFilieres(prev => [...prev, { ...item, id: Date.now() }]);
  };
  const updateFiliere = (id: number, item: Partial<Filiere>) => {
    setFilieres(prev => prev.map(f => f.id === id ? { ...f, ...item } : f));
  };
  const deleteFiliere = (id: number) => {
    setFilieres(prev => prev.filter(f => f.id !== id));
  };

  // Classes CRUD
  const addClassed = (item: Omit<Classe, 'id'>) => {
    setClasses(prev => [...prev, { ...item, id: Date.now() }]);
  };
  const updateClasse = (id: number, item: Partial<Classe>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...item } : c));
  };
  const deleteClasse = (id: number) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  // Enseignants CRUD
  const addEnseignant = (item: Omit<Enseignant, 'id'>) => {
    setEnseignants(prev => [...prev, { ...item, id: Date.now() }]);
  };
  const updateEnseignant = (id: number, item: Partial<Enseignant>) => {
    setEnseignants(prev => prev.map(e => e.id === id ? { ...e, ...item } : e));
  };
  const deleteEnseignant = (id: number) => {
    setEnseignants(prev => prev.filter(e => e.id !== id));
  };

  // Matieres CRUD
  const addMatiere = (item: Omit<Matiere, 'id'>) => {
    setMatieres(prev => [...prev, { ...item, id: Date.now() }]);
  };
  const updateMatiere = (id: number, item: Partial<Matiere>) => {
    setMatieres(prev => prev.map(m => m.id === id ? { ...m, ...item } : m));
  };
  const deleteMatiere = (id: number) => {
    setMatieres(prev => prev.filter(m => m.id !== id));
  };

  // Etudiants CRUD & Import
  const addEtudiant = (item: Omit<Etudiant, 'id'>) => {
    const newStudent = { ...item, id: Date.now() };
    setEtudiants(prev => [...prev, newStudent]);
  };
  const updateEtudiant = (id: number, item: Partial<Etudiant>) => {
    setEtudiants(prev => prev.map(e => e.id === id ? { ...e, ...item } : e));
  };
  const deleteEtudiant = (id: number) => {
    setEtudiants(prev => prev.filter(e => e.id !== id));
  };
  const importEtudiants = (items: Omit<Etudiant, 'id'>[]) => {
    const formatted = items.map((item, idx) => ({
      ...item,
      id: Date.now() + idx,
      mot_de_passe: item.mot_de_passe || 'etudiant123'
    }));
    setEtudiants(prev => [...prev, ...formatted]);
  };
  const changeEtudiantPassword = (etudiantId: number, newPassword: string) => {
    setEtudiants(prev => prev.map(e => e.id === etudiantId ? { ...e, mot_de_passe: newPassword } : e));
  };

  // Inscriptions
  const addInscription = (item: Omit<Inscription, 'id'>) => {
    setInscriptions(prev => [...prev, { ...item, id: Date.now() }]);
  };
  const updateInscription = (id: number, item: Partial<Inscription>) => {
    setInscriptions(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
  };

  // Notes
  const saveNote = (item: Omit<Note, 'id'>) => {
    setNotes(prev => {
      const idx = prev.findIndex(n => n.id_etudiant === item.id_etudiant && n.id_matiere === item.id_matiere && n.id_annee_academique === item.id_annee_academique);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...item };
        return updated;
      } else {
        return [...prev, { ...item, id: Date.now() }];
      }
    });
  };

  const saveBulkNotes = (items: Omit<Note, 'id'>[]) => {
    setNotes(prev => {
      const updated = [...prev];
      let timestamp = Date.now();
      items.forEach(item => {
        const idx = updated.findIndex(n => n.id_etudiant === item.id_etudiant && n.id_matiere === item.id_matiere && n.id_annee_academique === item.id_annee_academique);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], ...item };
        } else {
          updated.push({ ...item, id: timestamp++ });
        }
      });
      return updated;
    });
  };

  // Paiements
  const addPaiement = (item: Omit<Paiement, 'id' | 'numero_recu'>) => {
    const recuNum = `REC-${activeAnnee.libelle}-${Math.floor(100 + Math.random() * 900)}`;
    const newPay: Paiement = {
      ...item,
      id: Date.now(),
      numero_recu: recuNum
    };
    setPaiements(prev => [...prev, newPay]);

    // Update inscription paid amount
    setInscriptions(prev => prev.map(ins => {
      if (ins.id === item.id_inscription) {
        return { ...ins, montant_paye: ins.montant_paye + item.montant };
      }
      return ins;
    }));
  };

  // Stats
  const getEtudiantStats = (etudiantId: number) => {
    const activeAnneeId = activeAnnee?.id || 1;
    const studentNotes = (notes || []).filter(n => n.id_etudiant === etudiantId && n.id_annee_academique === activeAnneeId);
    let totalScore = 0;
    let totalCoef = 0;
    let creditsValides = 0;

    studentNotes.forEach(n => {
      const mat = (matieres || []).find(m => m.id === n.id_matiere);
      if (mat) {
        totalScore += n.note_finale * mat.coefficient;
        totalCoef += mat.coefficient;
        if (n.note_finale >= 10.0) {
          creditsValides += mat.credits;
        }
      }
    });

    const moyenneGeneral = totalCoef > 0 ? parseFloat((totalScore / totalCoef).toFixed(2)) : 0;
    
    let mention = 'Ajourné';
    if (moyenneGeneral >= 16) mention = 'Très Bien';
    else if (moyenneGeneral >= 14) mention = 'Bien';
    else if (moyenneGeneral >= 12) mention = 'Assez Bien';
    else if (moyenneGeneral >= 10) mention = 'Passable';

    const decision: 'Admis' | 'Ajourné' = moyenneGeneral >= 10.0 ? 'Admis' : 'Ajourné';

    // Solde scolarite
    const ins = (inscriptions || []).find(i => i.id_etudiant === etudiantId && i.id_annee_academique === activeAnneeId);
    const soldeScolarite = ins ? ins.montant_total - ins.montant_paye : 0;

    return {
      moyenneGeneral,
      creditsValides,
      mention,
      decision,
      soldeScolarite
    };
  };

  // Derived state
  const currentEtudiant = currentUser?.type === 'etudiant' 
    ? (etudiants.find(e => e.id === currentUser.id) || etudiants[0] || null)
    : null;

  return (
    <AppContext.Provider value={{
      currentUser,
      currentEtudiant,
      activeTab,
      setActiveTab,
      loginAdmin,
      loginEtudiant,
      logout,
      parametres,
      updateParametres,
      annees,
      activeAnnee,
      toggleActiveAnnee,
      addAnnee,
      universites,
      addUniversite,
      updateUniversite,
      deleteUniversite,
      facultes,
      addFaculte,
      updateFaculte,
      deleteFaculte,
      filieres,
      addFiliere,
      updateFiliere,
      deleteFiliere,
      niveaux,
      semestres,
      classes,
      addClassed,
      updateClasse,
      deleteClasse,
      enseignants,
      addEnseignant,
      updateEnseignant,
      deleteEnseignant,
      matieres,
      addMatiere,
      updateMatiere,
      deleteMatiere,
      etudiants,
      addEtudiant,
      updateEtudiant,
      deleteEtudiant,
      importEtudiants,
      changeEtudiantPassword,
      inscriptions,
      addInscription,
      updateInscription,
      notes,
      saveNote,
      saveBulkNotes,
      paiements,
      addPaiement,
      getEtudiantStats
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
