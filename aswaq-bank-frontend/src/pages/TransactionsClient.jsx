import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, ArrowLeftRight, Receipt, Star, PiggyBank, PieChart,
  Bell, Bot, User, LogOut, Search, ChevronDown, CreditCard,
  Download, Filter, X, FileText,  Loader2, 
  Calendar, Tag,  ShoppingCart, QrCode, Send, Banknote, PlusCircle
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './TransactionsClient.css';
import './DashboardClient.css';
import api from '../services/api';


const TRANSACTION_TYPES = [
  'Toutes',
  'Paiement',
  'Paiement QR',
  'Virement reçu',
  'Virement envoyé',
  'Retrait',
  'Dépôt',
];

const TYPE_ICONS = {
  'Paiement': ShoppingCart,
  'Paiement QR': QrCode,
  'Virement reçu': Send,
  'Virement envoyé': Send,
  'Retrait': Banknote,
  'Dépôt': PlusCircle,
};

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/dashboard-client' },
  { icon: CreditCard, label: 'Gestion du compte', to: '/mon-compte' },
  { icon: ArrowLeftRight, label: 'Historique des transactions', to: '/transactions-client', active: true },
  { icon: Receipt, label: 'Tickets numériques', to: '/tickets-client' },
  { icon: Star, label: 'Points de fidélité', to: '/fidelite' },
  { icon: PiggyBank, label: "Objectifs d'épargne", to: '/epargne' },
  { icon: PieChart, label: 'Suivi des dépenses', to: '/depenses' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant' },
  { icon: User, label: 'Profil et paramètres', to: '/parametres' },
];

export default function TransactionsClient() {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
const [loading, setLoading] = useState(true);

const loadTransactions = async () => {
  try {

    setLoading(true);

    const { data } = await api.get("/transactions/my");

    console.log(data);

    const mapped = data.map((tx) => ({

      id: tx.id,

      name:
        tx.otherAccountNumber ||
        tx.description ||
        "Transaction",

      type:
        tx.type === "TRANSFER"
          ? (tx.incoming ? "Virement reçu" : "Virement envoyé")
          : tx.type === "DEPOSIT"
          ? "Dépôt"
          : tx.type === "WITHDRAWAL"
          ? "Retrait"
          : tx.type,

      category: tx.type,

      amount: tx.incoming
        ? Number(tx.amount)
        : -Number(tx.amount),

      date: tx.transactionDate?.split("T")[0],

      time: tx.transactionDate?.split("T")[1]?.substring(0,5),

      reference: tx.transactionReference,

      status: tx.status

    }));

    setTransactions(mapped);

  } catch (e) {

    console.error(e);

  } finally {

    setLoading(false);

  }

};

useEffect(() => {
  loadTransactions();
}, []);

  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [typeFilter, setTypeFilter] = useState('Toutes');

  // États pour la modale de reçu
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [setDownloadComplete] = useState(false);

  // Filtrage des transactions
const filteredTransactions = useMemo(() => {
  return transactions.filter((tx) => {
    const matchesSearch =
      searchQuery === "" ||
      tx.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "Toutes" ||
      tx.type === typeFilter;

    const matchesDateFrom =
      !dateFrom || tx.date >= dateFrom;

    const matchesDateTo =
      !dateTo || tx.date <= dateTo;

    return (
      matchesSearch &&
      matchesType &&
      matchesDateFrom &&
      matchesDateTo
    );
  });
}, [
  transactions,
  searchQuery,
  dateFrom,
  dateTo,
  typeFilter
]);
  

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return Math.abs(amount).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
    setTypeFilter('Toutes');
  };

  const handleReceiptDownload = () => {
    if (!selectedTransaction) return;
    
    setIsDownloading(true);
    setDownloadComplete(false);

    // Simulation de téléchargement (2 secondes)
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadComplete(true);

      // Génération du contenu du reçu
      const content = 
        `REÇU DE TRANSACTION - ASWAQ BANK\n\n` +
        `Date : ${formatDate(selectedTransaction.date)}\n` +
        `Heure : ${selectedTransaction.time}\n` +
        `Opération : ${selectedTransaction.name}\n` +
        `Type : ${selectedTransaction.type}\n` +
        `Catégorie : ${selectedTransaction.category}\n` +
        `Référence : ${selectedTransaction.reference}\n` +
        `Montant : ${selectedTransaction.amount > 0 ? '+' : '-'} ${formatAmount(Math.abs(selectedTransaction.amount))} MAD\n` +
        `Statut : ${selectedTransaction.status}\n\n` +
        `[CONTENU PDF SIMULÉ POUR LA TRANSACTION ${selectedTransaction.reference}]`;

      const blob = new Blob([content], { 
        type: 'application/pdf' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Recu_Transaction_${selectedTransaction.reference}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      // Fermer la modale après 2 secondes
      setTimeout(() => {
        setSelectedTransaction(null);
        setDownloadComplete(false);
      }, 2000);
    }, 2000);
  };
console.log("transactions =", transactions);
console.log("filteredTransactions =", filteredTransactions);
console.log("typeFilter =", typeFilter);
  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-logo">
          <Logo size={100}  className="mb-6 logo-white"/>
        </div>

        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                state={location.state}
                className={`dash-nav-item ${item.active ? 'dash-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="dash-help-card">
          <div className="dash-help-icon">
            <Bot size={20} />
          </div>
          <p className="dash-help-title">Besoin d'aide ?</p>
          <p className="dash-help-text">Notre assistant IA est là pour vous aider</p>
          <button type="button" className="dash-help-button">
            Discuter avec l'IA →
          </button>
        </div>

        <Link to="/" className="dash-logout">
          <LogOut size={18} />
          Déconnexion
        </Link>
      </aside>

      {/* Main content */}
      <main className="dash-main transactions-main">
        <header className="dash-topbar">
          <div>
            <h1 className="dash-greeting">Historique des transactions</h1>
            <p className="dash-greeting-sub">Consultez et gérez toutes vos opérations bancaires.</p>
          </div>

          <div className="dash-topbar-actions">
            <div className="dash-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <button type="button" className="dash-icon-button" onClick={() => navigate('/notifications')}>
              <Bell size={18} />
              <span className="dash-badge">3</span>
            </button>
            <div className="dash-user-chip">
              <div className="dash-user-avatar">MB</div>
              <span>Marwa Boutabi</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Barre de filtres */}
        <div className="transactions-filters-card">
          <div className="transactions-filters-grid">
            <div className="transactions-filter-group transactions-filter-search">
              <Search size={16} className="transactions-filter-icon" />
              <input
                type="text"
                placeholder="Rechercher par commerçant, bénéficiaire ou référence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="transactions-filter-input"
              />
            </div>

            <div className="transactions-filter-group">
              <Calendar size={16} className="transactions-filter-icon" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="transactions-filter-input"
                placeholder="Date de début"
              />
            </div>

            <div className="transactions-filter-group">
              <Calendar size={16} className="transactions-filter-icon" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="transactions-filter-input"
                placeholder="Date de fin"
              />
            </div>

            <div className="transactions-filter-group">
              <Tag size={16} className="transactions-filter-icon" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="transactions-filter-input transactions-filter-select"
              >
                {TRANSACTION_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="transactions-filter-actions">
              <button type="button" className="transactions-filter-btn-primary">
                <Search size={14} />
                Rechercher
              </button>
              <button type="button" className="transactions-filter-btn-secondary" onClick={resetFilters}>
                <X size={14} />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Tableau des transactions */}
        <div className="transactions-table-card">
          <div className="transactions-table-header">
            <h2 className="transactions-table-title">
              Transactions ({filteredTransactions.length})
            </h2>
            <span className="transactions-table-period">
              {dateFrom || dateTo ? `Période : ${dateFrom ? formatDate(dateFrom) : '...'} → ${dateTo ? formatDate(dateTo) : '...'}` : 'Toutes les dates'}
            </span>
          </div>

          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Opération</th>
                  <th>Type</th>
                  <th>Référence</th>
                  <th className="transactions-th-amount">Montant</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="transactions-empty">
                      <Filter size={32} />
                      <p>Aucune transaction ne correspond à vos filtres.</p>
                      <button type="button" className="transactions-reset-link" onClick={resetFilters}>
                        Réinitialiser les filtres
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const Icon = TYPE_ICONS[tx.type] || FileText;
                    const isIncome = tx.amount > 0;
                    return (
                      <tr 
                        key={tx.id} 
                        className="transactions-table-row"
                        onClick={() => setSelectedTransaction(tx)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td className="transactions-date-cell">
                          <p className="transactions-date">{formatDate(tx.date)}</p>
                          <p className="transactions-time">{tx.time}</p>
                        </td>
                        <td>
                          <div className="transactions-op-info">
                            <div className="transactions-op-icon">
                              <Icon size={16} />
                            </div>
                            <div>
                              <p className="transactions-op-name">{tx.name}</p>
                              <p className="transactions-op-category">{tx.category}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`transactions-type-badge transactions-type-${tx.type.replace(/\s+/g, '-').toLowerCase()}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="transactions-reference">{tx.reference}</td>
                        <td className={`transactions-amount-cell ${isIncome ? 'transactions-amount-income' : 'transactions-amount-expense'}`}>
                          {isIncome ? '+' : '-'} {formatAmount(tx.amount)} MAD
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ===== MODALE REÇU DE TRANSACTION ===== */}
      {selectedTransaction && (
        <div className="transactions-modal-overlay" onClick={() => setSelectedTransaction(null)}>
          <div className="transactions-modal" onClick={(e) => e.stopPropagation()}>
            <div className="transactions-modal-header">
              <h2 className="transactions-modal-title">Détails de la transaction</h2>
              <button type="button" className="transactions-modal-close" onClick={() => setSelectedTransaction(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="transactions-modal-body">
              <div className="transactions-modal-details">
                <div className="transactions-modal-detail-row">
                  <span className="transactions-modal-detail-label">Commerçant / Bénéficiaire</span>
                  <span className="transactions-modal-detail-value">{selectedTransaction.name}</span>
                </div>
                <div className="transactions-modal-detail-row">
                  <span className="transactions-modal-detail-label">Date</span>
                  <span className="transactions-modal-detail-value">{formatDate(selectedTransaction.date)}</span>
                </div>
                <div className="transactions-modal-detail-row">
                  <span className="transactions-modal-detail-label">Heure</span>
                  <span className="transactions-modal-detail-value">{selectedTransaction.time}</span>
                </div>
                <div className="transactions-modal-detail-row">
                  <span className="transactions-modal-detail-label">Type d'opération</span>
                  <span className="transactions-modal-detail-value">{selectedTransaction.type}</span>
                </div>
                <div className="transactions-modal-detail-row">
                  <span className="transactions-modal-detail-label">Catégorie</span>
                  <span className="transactions-modal-detail-value">{selectedTransaction.category}</span>
                </div>
                <div className="transactions-modal-detail-row">
                  <span className="transactions-modal-detail-label">Référence</span>
                  <span className="transactions-modal-detail-value transactions-modal-detail-value-highlight">
                    {selectedTransaction.reference}
                  </span>
                </div>
                <div className="transactions-modal-detail-row">
                  <span className="transactions-modal-detail-label">Montant</span>
                  <span className={`transactions-modal-detail-value transactions-modal-detail-value-amount ${selectedTransaction.amount > 0 ? 'income' : 'expense'}`}>
                    {selectedTransaction.amount > 0 ? '+' : '-'} {formatAmount(Math.abs(selectedTransaction.amount))} MAD
                  </span>
                </div>
                <div className="transactions-modal-detail-row">
                  <span className="transactions-modal-detail-label">Statut</span>
                  <span className="transactions-modal-detail-value transactions-modal-detail-value-status">
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>

              {isDownloading ? (
                <div className="transactions-modal-loading">
                  <div className="transactions-loading-spinner">
                    <Loader2 size={48} className="transactions-loading-icon" />
                  </div>
                  <h3 className="transactions-loading-title">Génération du reçu en cours...</h3>
                  <p className="transactions-loading-text">
                    Préparation de votre reçu pour la transaction {selectedTransaction.reference}.
                  </p>
                  <div className="transactions-loading-progress">
                    <div className="transactions-loading-progress-bar" />
                  </div>
                </div>
              ) : (
                <div className="transactions-modal-footer">
                  <button type="button" className="transactions-modal-btn-secondary" onClick={() => setSelectedTransaction(null)}>
                    Fermer
                  </button>
                  <button type="button" className="transactions-modal-btn-primary" onClick={handleReceiptDownload}>
                    <Download size={16} />
                    Télécharger le reçu
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}