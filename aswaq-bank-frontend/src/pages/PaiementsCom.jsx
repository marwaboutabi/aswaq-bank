import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, Boxes, ArrowLeftRight, Users, Star, Bot, LogOut,
  Bell, ChevronDown, ChevronLeft, ChevronRight, User,
  Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Download,
  QrCode, Send, Link2, Search, Filter,
  CheckCircle2, Clock, XCircle, X, Info, Check, Loader2,
  FileText, FileSpreadsheet, FileDigit
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './PaiementsCom.css';
import api from "../services/api";

const TYPE_OPTIONS = ['Tous les types', 'Paiement reçu', 'Paiement envoyé', 'Virement reçu', 'Virement envoyé', 'Remboursement'];
const PERIOD_OPTIONS = [
  { value: 'today', label: "Aujourd'hui" },
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois' },
  { value: 'custom', label: 'Personnalisée' },
];
const FORMAT_OPTIONS = [
  { value: 'pdf', label: 'PDF', icon: FileText },
  { value: 'xlsx', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
  { value: 'csv', label: 'CSV', icon: FileDigit },
];

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/acceuil-com' },
  { icon: Package, label: 'Produits', to: '/produits' },
  { icon: ArrowLeftRight, label: 'Paiements & Transactions', to: '/transactions-commerce', active: true },
  { icon: Users, label: 'Fournisseurs', to: '/fournisseurs' },
  { icon: Star, label: 'Fidélité & Tickets', to: '/fidelite-commerce' },
  { icon: Bell, label: 'Notifications', to: '/notifications-com' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant-commerce' },
  { icon: User, label: 'Profil & Paramètres', to: '/parametres-commerce' },
];

const PAGE_SIZE = 10;

// Fonctions utilitaires pour les dates dynamiques
const getMonthStart = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
};

const getToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export default function PaiementsCom() {
  const location = useLocation();
  const navigate = useNavigate();

  // States principaux
  const [transactions, setTransactions] = useState([]);
  const [account, setAccount] = useState(null);
  const [user, setUser] = useState(null);
  
  // States filtres
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tous les types');
  const [dateFrom, setDateFrom] = useState(getMonthStart());
  const [dateTo, setDateTo] = useState(getToday());
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page 1 quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, dateFrom, dateTo]);

  // Export Modal States
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStep, setExportStep] = useState(1);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  const [exportParams, setExportParams] = useState({
    period: 'month',
    format: 'pdf',
    includeSummary: true,
    includeClient: true,
    includeRef: true,
    exportMode: 'filtered',
  });

  // Transaction Selection State
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  // Chargement initial des données
  useEffect(() => {
    loadTransactions();
    loadAccount();
    loadUser();
  }, []);

  const loadAccount = async () => {
    try {
      const res = await api.get("/accounts/me");
      console.log("COMPTE API :", res.data);
      setAccount(res.data);
    } catch (error) {
      console.error("Erreur récupération compte :", error);
    }
  };

  const loadUser = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (error) {
      console.error("Erreur récupération utilisateur :", error);
    }
  };

  const loadTransactions = async () => {
    try {
      const res = await api.get("/transactions/my");
      console.log("TRANSACTIONS API :", res.data);

      const rawData = Array.isArray(res.data) ? res.data : [];

      const data = rawData.map(tx => {
        const dateValue = tx.transactionDate || "";
        const [datePart, timePart] = dateValue.split("T");

        return {
          id: tx.id,
          date: datePart || "",
          time: timePart ? timePart.substring(0, 5) : "",
          transactionDate: tx.transactionDate,
          type: tx.incoming ? "Paiement reçu" : "Paiement envoyé",
          typeTone: tx.incoming ? "green" : "red",
          partner: tx.otherUserName || tx.otherAccountNumber || "Compte inconnu",
          email: "",
          method: tx.type === "QR_PAYMENT" ? "QR Code" : "Virement bancaire",
          amount: Number(tx.amount || 0),
          incoming: Boolean(tx.incoming),
          originalType: tx.type,
          status: tx.status === "SUCCESS" ? "Réussi" : tx.status === "PENDING" ? "En attente" : "Échec",
          statusTone: tx.status === "SUCCESS" ? "green" : tx.status === "PENDING" ? "orange" : "red",
          reference: tx.transactionReference || "-"
        };
      });

      setTransactions(data);
      console.log("DATA MAPPÉE :", data);

    } catch (error) {
      console.error("Erreur historique :", error);
      setTransactions([]);
    }
  };

  // Filtrage dynamique incluant les dates
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // FILTRE DATE
      let matchDate = true;
      if (t.transactionDate && dateFrom && dateTo) {
        const transactionDate = new Date(t.transactionDate);
        const from = new Date(`${dateFrom}T00:00:00`);
        const to = new Date(`${dateTo}T23:59:59`);
        matchDate = transactionDate >= from && transactionDate <= to;
      }

      // RECHERCHE
      const searchValue = search.toLowerCase().trim();
      const matchSearch = !searchValue ||
        t.partner.toLowerCase().includes(searchValue) ||
        t.email.toLowerCase().includes(searchValue) ||
        t.method.toLowerCase().includes(searchValue) ||
        t.reference.toLowerCase().includes(searchValue);

      // FILTRE TYPE
      const matchType = typeFilter === 'Tous les types' || t.type === typeFilter;

      return matchDate && matchSearch && matchType;
    });
  }, [transactions, search, typeFilter, dateFrom, dateTo]);

  // Statistiques dynamiques basées sur filteredTransactions
  const stats = useMemo(() => {
    const totalEncaisse = filteredTransactions
      .filter(tx => tx.incoming)
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const totalDepenses = filteredTransactions
      .filter(tx => !tx.incoming)
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const virementsEffectues = filteredTransactions
      .filter(tx => {
        if (tx.incoming) return false;
        const type = String(tx.originalType || "").toUpperCase();
        return type === "TRANSFER" || type === "VIREMENT" || type === "BANK_TRANSFER";
      })
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const nombreEncaissements = filteredTransactions.filter(tx => tx.incoming).length;
    const nombreDepenses = filteredTransactions.filter(tx => !tx.incoming).length;
    const nombreVirements = filteredTransactions.filter(tx => {
      if (tx.incoming) return false;
      const type = String(tx.originalType || "").toUpperCase();
      return type === "TRANSFER" || type === "VIREMENT" || type === "BANK_TRANSFER";
    }).length;

    const solde = Number(account?.balance ?? account?.solde ?? 0);

    return [
      {
        key: "encaisse",
        icon: Wallet,
        label: "Total encaissé",
        value: `${totalEncaisse.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`,
        sub: `${nombreEncaissements} opération${nombreEncaissements > 1 ? "s" : ""}`,
        subTone: "green",
        iconBg: "#dbeafe",
        iconColor: "#1d4fd8"
      },
      {
        key: "depenses",
        icon: TrendingUp,
        label: "Total des dépenses",
        value: `${totalDepenses.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`,
        sub: `${nombreDepenses} opération${nombreDepenses > 1 ? "s" : ""}`,
        subTone: "red",
        iconBg: "#d1fae5",
        iconColor: "#059669"
      },
      {
        key: "virements",
        icon: ArrowUpRight,
        label: "Virements effectués",
        value: `${virementsEffectues.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`,
        sub: `${nombreVirements} opération${nombreVirements > 1 ? "s" : ""}`,
        subTone: "blue",
        iconBg: "#ede9fe",
        iconColor: "#7c3aed"
      },
      {
        key: "solde",
        icon: Wallet,
        label: "Solde du compte",
        value: `${solde.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`,
        sub: "Compte professionnel",
        subTone: "blue",
        iconBg: "#fef3c7",
        iconColor: "#d97706"
      }
    ];
  }, [filteredTransactions, account]);

  const quickActions = [
    { icon: QrCode, label: 'Recevoir un paiement', sub: 'QR Code', bg: '#1d4fd8', to: '/recevoir-paiement' },
    { icon: Send, label: 'Effectuer un virement', sub: 'Vers un compte', bg: '#1d4fd8', to: '/virement' },
    { icon: Download, label: 'Exporter les transactions', sub: 'PDF / Excel', bg: '#1d4fd8', action: () => setShowExportModal(true) },
  ];

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm('Voulez-vous vous déconnecter ?')) {
      navigate('/');
    }
  };

  const getTypeIcon = (type) => {
    if (type.includes('reçu')) return <QrCode size={14} />;
    if (type.includes('envoyé')) return <ArrowUpRight size={14} />;
    if (type.includes('Remboursement')) return <ArrowDownLeft size={14} />;
    return <Wallet size={14} />;
  };

  const getStatusIcon = (status) => {
    if (status === 'Réussi') return <CheckCircle2 size={14} />;
    if (status === 'En attente') return <Clock size={14} />;
    return <XCircle size={14} />;
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === paginatedTransactions.length) {
      setSelectedTransactions(prev => 
        prev.filter(id => !paginatedTransactions.find(t => t.id === id))
      );
    } else {
      const newIds = paginatedTransactions.map(t => t.id);
      setSelectedTransactions(prev => [...new Set([...prev, ...newIds])]);
    }
  };

  const handleSelectTransaction = (id) => {
    setSelectedTransactions(prev => 
      prev.includes(id) 
        ? prev.filter(tid => tid !== id)
        : [...prev, id]
    );
  };

  const isAllSelectedOnPage = paginatedTransactions.length > 0 && 
    paginatedTransactions.every(t => selectedTransactions.includes(t.id));

  const startExport = () => {
    if (exportParams.exportMode === 'selected' && selectedTransactions.length === 0) {
      alert('Veuillez sélectionner au moins une transaction dans le tableau avant d\'exporter.');
      return;
    }

    setExportStep(2);
    setExportProgress(0);
    setExportStatus('');
    const steps = [
      { progress: 20, status: 'Analyse des transactions...' },
      { progress: 45, status: 'Filtrage des opérations...' },
      { progress: 70, status: 'Création du document...' },
      { progress: 90, status: 'Compression des données...' },
      { progress: 100, status: 'Export terminé !' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setExportProgress(steps[currentStep].progress);
        setExportStatus(steps[currentStep].status);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => setExportStep(3), 600);
      }
    }, 400);
  };

  const handleDownload = () => {
    const mode = exportParams.exportMode === 'selected' ? 'selection' : 'filtres';
    alert(`Téléchargement de Transactions_${exportParams.period}_${mode}.${exportParams.format}...`);
  };

  const resetExport = () => {
    setExportStep(1);
    setExportProgress(0);
    setExportStatus('');
  };

  const getExportCount = () => {
    if (exportParams.exportMode === 'selected') {
      return selectedTransactions.length;
    }
    return filteredTransactions.length;
  };

  const currentFormat = FORMAT_OPTIONS.find(f => f.value === exportParams.format) || FORMAT_OPTIONS[0];
  const FormatIcon = currentFormat.icon;

  return (
    <div className="pay-layout">
      <aside className="pay-sidebar">
        <div className="pay-sidebar-logo">
          <Logo size={100} className="mb-6 logo-white" />
        </div>
        <nav className="pay-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.to} state={location.state} className={`pay-nav-item ${item.active ? 'pay-nav-item-active' : ''}`}>
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <a href="/" onClick={handleLogout} className="pay-logout">
          <LogOut size={18} />
          Déconnexion
        </a>
      </aside>

      <main className="pay-main">
        <header className="pay-topbar">
          <div>
            <h1 className="pay-title">Paiements & Transactions</h1>
            <p className="pay-subtitle">Gérez vos paiements, virements et toutes vos transactions.</p>
          </div>
          <div className="pay-topbar-actions">
            <button type="button" className="pay-icon-button" onClick={() => navigate('/notifications-com')} aria-label="Notifications">
              <Bell size={18} />
              <span className="pay-badge">3</span>
            </button>
            <div className="pay-user-chip" onClick={() => navigate('/parametres-commerce')}>
              <div className="pay-user-avatar">
                {(user?.prenom?.[0] || user?.firstName?.[0] || '')}
                {(user?.nom?.[0] || user?.lastName?.[0] || '')}
              </div>
              <div className="pay-user-info">
                <span className="pay-user-name">
                  {user
                    ? `${user.prenom || user.firstName || ''} ${
                        user.nom || user.lastName || ''
                      }`.trim() || 'Commerçant'
                    : 'Commerçant'}
                </span>
                <span className="pay-user-role">Commerçant</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <section className="pay-filters-bar">
          <div className="pay-date-range">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="pay-date-input" />
            <span className="pay-date-separator">→</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="pay-date-input" />
          </div>
          <select className="pay-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            {TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <button className="pay-btn-export" onClick={() => setShowExportModal(true)}>
            <Download size={18} />
            Exporter
          </button>
        </section>

        <section className="pay-stats-row">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div className="pay-stat-card" key={s.key}>
                <div className="pay-stat-icon" style={{ background: s.iconBg, color: s.iconColor }}>
                  <Icon size={22} />
                </div>
                <div className="pay-stat-body">
                  <p className="pay-stat-label">{s.label}</p>
                  <p className="pay-stat-value">{s.value}</p>
                  <p className={`pay-stat-sub pay-stat-sub-${s.subTone}`}>{s.sub}</p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="pay-panel">
          <h2 className="pay-panel-title">Actions rapides</h2>
          <div className="pay-actions-grid">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.label} className="pay-action-card" onClick={() => action.to ? navigate(action.to) : action.action && action.action()}>
                  <div className="pay-action-icon" style={{ background: action.bg }}>
                    <Icon size={20} color="white" />
                  </div>
                  <div className="pay-action-info">
                    <p className="pay-action-label">{action.label}</p>
                    <p className="pay-action-sub">{action.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="pay-panel">
          <div className="pay-table-header">
            <h2 className="pay-panel-title">Historique des opérations</h2>
            <div className="pay-table-filters">
              <div className="pay-search">
                <Search size={16} />
                <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button className="pay-filter-btn"><Filter size={16} /> Filtres</button>
            </div>
          </div>

          {selectedTransactions.length > 0 && (
            <div className="pay-selection-info">
              <CheckCircle2 size={18} />
              <span>{selectedTransactions.length} transaction(s) sélectionnée(s)</span>
              <button onClick={() => setSelectedTransactions([])} className="pay-clear-selection">
                <X size={16} />
              </button>
            </div>
          )}

          <div className="pay-table-wrapper">
            <table className="pay-table">
              <thead>
                <tr>
                  <th className="pay-select-header">
                    <input 
                      type="checkbox" 
                      checked={isAllSelectedOnPage}
                      onChange={handleSelectAll}
                      className="pay-checkbox-header"
                    />
                  </th>
                  <th>Date & heure</th>
                  <th>Type</th>
                  <th>Provenance / Destinataire</th>
                  <th>Méthode</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((t) => (
                  <tr key={t.id} className={selectedTransactions.includes(t.id) ? 'pay-row-selected' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedTransactions.includes(t.id)}
                        onChange={() => handleSelectTransaction(t.id)}
                        className="pay-row-checkbox"
                      />
                    </td>
                    <td>
                      <div className="pay-date-cell">
                        <div className="pay-date-icon-circle" style={{ 
                          background: t.typeTone === 'green' ? '#d1fae5' : t.typeTone === 'blue' ? '#dbeafe' : t.typeTone === 'orange' ? '#fef3c7' : '#ede9fe',
                          color: t.typeTone === 'green' ? '#059669' : t.typeTone === 'blue' ? '#1d4fd8' : t.typeTone === 'orange' ? '#d97706' : '#7c3aed'
                        }}>
                          {getTypeIcon(t.type)}
                        </div>
                        <div>
                          <p className="pay-date-text">{t.date}</p>
                          <p className="pay-time-text">{t.time}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className={`pay-type-pill pay-type-${t.typeTone}`}>{t.type}</span></td>
                    <td>
                      <p className="pay-partner-name">{t.partner}</p>
                      <p className="pay-partner-email">{t.email}</p>
                    </td>
                    <td className="pay-method">{t.method}</td>
                    <td className={`pay-amount ${t.amount >= 0 ? 'pay-amount-positive' : 'pay-amount-negative'}`}>
                      {t.amount >= 0 ? '+' : ''}
                      {Number(t.amount).toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} MAD
                    </td>
                    <td>
                      <span className={`pay-status-pill pay-status-${t.statusTone}`}>
                        {getStatusIcon(t.status)} {t.status}
                      </span>
                    </td>
                    <td><button className="pay-row-action"><ChevronRight size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pay-pagination">
            <p className="pay-result-info">
              {filteredTransactions.length === 0
                ? "Aucune transaction"
                : `Affichage de ${(currentPage - 1) * PAGE_SIZE + 1} à ${Math.min(currentPage * PAGE_SIZE, filteredTransactions.length)} sur ${filteredTransactions.length} résultats`
              }
            </p>
            <div className="pay-pagination-controls">
              <select className="pay-per-page"><option>10 par page</option><option>20 par page</option></select>
              <div className="pay-page-buttons">
                <button className="pay-page-btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft size={16} /></button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((n) => (
                  <button
                    key={n}
                    className={`pay-page-btn ${currentPage === n ? 'pay-page-btn-active' : ''}`}
                    onClick={() => setCurrentPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button className="pay-page-btn" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= EXPORT MODAL ================= */}
      {showExportModal && (
        <div className="pay-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowExportModal(false)}>
          <div className="pay-modal">
            <div className="pay-modal-header">
              <div>
                <h2 className="pay-modal-title">Exporter les transactions</h2>
                <p className="pay-modal-subtitle">
                  {exportStep === 1 && "Choisissez les paramètres de votre export"}
                  {exportStep === 2 && "Préparation de votre export en cours..."}
                  {exportStep === 3 && "Votre export a été généré avec succès."}
                </p>
              </div>
              <button className="pay-modal-close" onClick={() => { setShowExportModal(false); resetExport(); }}>
                <X size={20} />
              </button>
            </div>

            <div className="pay-modal-stepper">
              <div className={`pay-modal-step ${exportStep >= 1 ? 'active' : ''} ${exportStep > 1 ? 'completed' : ''}`}>
                <div className="pay-modal-step-circle">{exportStep > 1 ? <Check size={16} /> : '1'}</div>
                <span className="pay-modal-step-label">Paramètres</span>
              </div>
              <div className={`pay-modal-step-line ${exportStep >= 2 ? 'active' : ''}`} />
              <div className={`pay-modal-step ${exportStep >= 2 ? 'active' : ''} ${exportStep > 2 ? 'completed' : ''}`}>
                <div className="pay-modal-step-circle">{exportStep > 2 ? <Check size={16} /> : '2'}</div>
                <span className="pay-modal-step-label">Génération</span>
              </div>
              <div className={`pay-modal-step-line ${exportStep >= 3 ? 'active' : ''}`} />
              <div className={`pay-modal-step ${exportStep >= 3 ? 'active' : ''}`}>
                <div className="pay-modal-step-circle">3</div>
                <span className="pay-modal-step-label">Terminé</span>
              </div>
            </div>

            <div className="pay-modal-content">
              {exportStep === 1 && (
                <div className="pay-modal-grid">
                  <div className="pay-modal-form">
                    <div className="pay-form-group">
                      <label className="pay-form-label">Mode d'export</label>
                      <div className="pay-export-mode">
                        <button 
                          type="button" 
                          className={`pay-mode-btn ${exportParams.exportMode === 'filtered' ? 'active' : ''}`}
                          onClick={() => setExportParams({...exportParams, exportMode: 'filtered'})}
                        >
                          <Filter size={18} />
                          <div>
                            <span>Toutes les transactions filtrées</span>
                            <small>{filteredTransactions.length} transactions</small>
                          </div>
                        </button>
                        <button 
                          type="button" 
                          className={`pay-mode-btn ${exportParams.exportMode === 'selected' ? 'active' : ''} ${selectedTransactions.length === 0 ? 'empty-selection' : ''}`}
                          onClick={() => setExportParams({...exportParams, exportMode: 'selected'})}
                        >
                          <CheckCircle2 size={18} />
                          <div>
                            <span>Transactions sélectionnées</span>
                            <small>{selectedTransactions.length} sélectionnée(s)</small>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="pay-form-group">
                      <label className="pay-form-label">Période</label>
                      <div className="pay-period-buttons">
                        {PERIOD_OPTIONS.map((opt) => (
                          <button key={opt.value} type="button" className={`pay-period-btn ${exportParams.period === opt.value ? 'active' : ''}`} onClick={() => setExportParams({...exportParams, period: opt.value})}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="pay-form-group">
                      <label className="pay-form-label">Format du fichier</label>
                      <div className="pay-format-buttons">
                        {FORMAT_OPTIONS.map((fmt) => {
                          const Icon = fmt.icon;
                          return (
                            <button key={fmt.value} type="button" className={`pay-format-btn ${exportParams.format === fmt.value ? 'active' : ''}`} onClick={() => setExportParams({...exportParams, format: fmt.value})}>
                              <Icon size={18} /> {fmt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="pay-form-group">
                      <label className="pay-form-label">Options d'inclusion</label>
                      <div className="pay-checkboxes">
                        {['includeSummary', 'includeClient', 'includeRef'].map((key, idx) => (
                          <label key={key} className="pay-checkbox">
                            <input type="checkbox" checked={exportParams[key]} onChange={(e) => setExportParams({...exportParams, [key]: e.target.checked})} />
                            <span className="pay-checkmark"></span>
                            {['Inclure le résumé financier', 'Inclure les informations clients', 'Inclure les références'][idx]}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pay-preview-card">
                    <h3 className="pay-preview-title">Aperçu de l'export</h3>
                    <div className="pay-preview-row">
                      <span className="pay-preview-label">Transactions à exporter</span>
                      <span className="pay-preview-value">{getExportCount()}</span>
                    </div>
                    <div className="pay-preview-row"><span className="pay-preview-label">Période</span><span className="pay-preview-value">{dateFrom} → {dateTo}</span></div>
                    <div className="pay-preview-row">
                      <span className="pay-preview-label">Format</span>
                      <span className="pay-preview-value pay-format-badge">
                        <FormatIcon size={14} /> {exportParams.format.toUpperCase()}
                      </span>
                    </div>
                    <div className="pay-preview-row"><span className="pay-preview-label">Taille estimée</span><span className="pay-preview-value">~1,2 MB</span></div>
                    <div className="pay-info-box">
                      <Info size={16} />
                      <p>Les données seront exportées selon les filtres sélectionnés.</p>
                    </div>
                  </div>
                </div>
              )}

              {exportStep === 2 && (
                <div className="pay-generation-content">
                  <div className="pay-generation-icon"><Loader2 size={48} className="pay-spinning" /></div>
                  <h3 className="pay-generation-title">{exportStatus || 'Préparation de votre export...'}</h3>
                  <div className="pay-progress-wrapper">
                    <div className="pay-progress-bar"><div className="pay-progress-fill" style={{ width: `${exportProgress}%` }} /></div>
                    <span className="pay-progress-text">{exportProgress}%</span>
                  </div>
                  <div className="pay-generation-steps">
                    {['Analyse des transactions...', 'Création du document...', 'Compression des données...', 'Préparation du téléchargement...'].map((step, idx) => (
                      <div key={idx} className={`pay-gen-step ${exportProgress >= (idx + 1) * 25 ? 'active' : ''}`}>
                        <Check size={16} /> <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pay-info-box">
                    <Info size={16} />
                    <p>Veuillez ne pas fermer cette fenêtre. Cela peut prendre quelques secondes.</p>
                  </div>
                </div>
              )}

              {exportStep === 3 && (
                <div className="pay-complete-content">
                  <div className="pay-complete-icon"><CheckCircle2 size={64} /></div>
                  <h3 className="pay-complete-title">Export terminé</h3>
                  <p className="pay-complete-subtitle">Votre document est prêt.</p>
                  <div className="pay-complete-details">
                    <div className="pay-complete-row"><span className="pay-complete-label">Nom du fichier</span><span className="pay-complete-value">Transactions_{exportParams.period}_{exportParams.exportMode === 'selected' ? 'selection' : 'filtres'}.{exportParams.format}</span></div>
                    <div className="pay-complete-row"><span className="pay-complete-label">Nombre d'opérations</span><span className="pay-complete-value">{getExportCount()}</span></div>
                    <div className="pay-complete-row">
                      <span className="pay-complete-label">Format</span>
                      <span className="pay-complete-value pay-format-badge">
                        <FormatIcon size={14} /> {exportParams.format.toUpperCase()}
                      </span>
                    </div>
                    <div className="pay-complete-row"><span className="pay-complete-label">Taille</span><span className="pay-complete-value">~1,2 MB</span></div>
                  </div>
                  <div className="pay-modal-actions">
                    <button className="pay-btn-secondary" onClick={resetExport}><Loader2 size={18} /> Nouvel export</button>
                    <button className="pay-btn-primary" onClick={handleDownload}><Download size={18} /> Télécharger</button>
                  </div>
                </div>
              )}

              {exportStep === 1 && (
                <div className="pay-modal-actions">
                  <button className="pay-btn-secondary" onClick={() => setShowExportModal(false)}>Annuler</button>
                  <button className="pay-btn-primary" onClick={startExport}>Continuer <ChevronRight size={18} /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}