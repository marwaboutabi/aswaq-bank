import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, Bell, ChevronDown, Send,
  Copy, Download, Share2, Info, CheckCircle2,
  Clock, Building2, Mail, Wallet, Calendar,
  User, FileText, Check,
  // Icônes du menu client
  Home, CreditCard, ArrowLeftRight, Receipt, Star, PiggyBank, PieChart, Bot
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './ReceiveMoney.css';

// Données simulées
const USER_DATA = {
  name: 'Marwa Boutabi',
  iban: 'MA64 0112 3456 7890 1234 5678',
  account: '•••• •••• •••• 4589',
};

const TRANSACTIONS_RECEIVED = [
  { id: 1, date: '23/07/2026', time: '14:32', sender: 'Ahmed B.', initials: 'AB', reference: 'TRX845621', amount: 450, status: 'Reçu' },
  { id: 2, date: '21/07/2026', time: '11:18', sender: 'Fatima Z.', initials: 'FZ', reference: 'TRX845112', amount: 1200, status: 'Reçu' },
  { id: 3, date: '19/07/2026', time: '09:45', sender: 'Salaire', initials: '💼', reference: 'VIR45874', amount: 8000, status: 'Reçu', type: 'Virement salaire' },
  { id: 4, date: '17/07/2026', time: '16:20', sender: 'Youssef M.', initials: 'YM', reference: 'TRX842221', amount: 300, status: 'Reçu' },
];

// ===== MENU ESPACE CLIENT =====
const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/dashboard-client' },
  { icon: CreditCard, label: 'Gestion du compte', to: '/mon-compte' },
  { icon: ArrowLeftRight, label: 'Historique des transactions', to: '/transactions-client' },
  { icon: Receipt, label: 'Tickets numériques', to: '/tickets-client' },
  { icon: Star, label: 'Points de fidélité', to: '/fidelite' },
  { icon: PiggyBank, label: "Objectifs d'épargne", to: '/epargne' },
  { icon: PieChart, label: 'Suivi des dépenses', to: '/depenses' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant' },
  { icon: User, label: 'Profil et paramètres', to: '/parametres' },
];

export default function ReceiveMoney() {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [requestForm, setRequestForm] = useState({
    recipient: '',
    amount: '',
    reason: '',
  });

  const handleCopyIBAN = () => {
    navigator.clipboard.writeText(USER_DATA.iban.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    alert('Téléchargement du QR Code...');
  };

  const handleShareQR = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mon IBAN Aswaq Bank',
        text: `Voici mon IBAN pour recevoir un virement : ${USER_DATA.iban}`,
      });
    } else {
      handleCopyIBAN();
    }
  };

  const handleSendRequest = () => {
    if (!requestForm.recipient || !requestForm.amount) {
      alert('Veuillez remplir le destinataire et le montant.');
      return;
    }
    alert(`Demande de paiement envoyée à ${requestForm.recipient} pour ${requestForm.amount} MAD`);
    setRequestForm({ recipient: '', amount: '', reason: '' });
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-logo">
          <Logo size={100} className="mb-6" className="mb-6 logo-white"/>
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
        <a href="/" className="dash-logout">
          <span>Déconnexion</span>
        </a>
      </aside>

      {/* Main */}
      <main className="dash-main receive-money-main">
        {/* Topbar */}
        <header className="rm-topbar">
          <div>
            <h1 className="rm-greeting">Bonjour, Marwa 👋</h1>
            <p className="rm-greeting-sub">Voici les informations pour recevoir de l'argent.</p>
          </div>
          <div className="rm-topbar-actions">
            <div className="dash-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <button type="button" className="dash-icon-button">
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

        {/* Page header */}
        <div className="rm-page-header">
          <button type="button" className="rm-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="rm-page-title">Recevoir de l'argent</h1>
            <p className="rm-page-subtitle">Partagez vos informations pour recevoir des paiements facilement.</p>
          </div>
        </div>

        {/* 3 cartes du haut */}
        <div className="rm-top-cards">
          {/* Carte IBAN */}
          <div className="rm-card rm-iban-card">
            <div className="rm-card-header">
              <h3 className="rm-card-title">Mon IBAN</h3>
              <Info size={16} className="rm-info-icon" />
            </div>
            <p className="rm-card-desc">Partagez votre IBAN pour recevoir des virements depuis d'autres comptes.</p>
            
            <div className="rm-iban-display">
              <span className="rm-iban-text">{USER_DATA.iban}</span>
              <button type="button" className="rm-copy-iban-btn" onClick={handleCopyIBAN}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <button type="button" className="rm-action-btn rm-action-btn-outline" onClick={handleCopyIBAN}>
              {copied ? <><Check size={16} /> IBAN copié !</> : <><Copy size={16} /> Copier l'IBAN</>}
            </button>
          </div>

          {/* Carte QR Code */}
          <div className="rm-card rm-qr-card">
            <div className="rm-card-header">
              <h3 className="rm-card-title">Mon QR Code</h3>
              <Info size={16} className="rm-info-icon" />
            </div>
            <p className="rm-card-desc">Montrez ce QR Code à la personne qui souhaite vous envoyer de l'argent.</p>

            <div className="rm-qr-display">
              <div className="rm-qr-code">
                <svg viewBox="0 0 100 100" className="rm-qr-svg">
                  <rect width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="25" height="25" fill="#0b1f4b" />
                  <rect x="10" y="10" width="15" height="15" fill="white" />
                  <rect x="13" y="13" width="9" height="9" fill="#0b1f4b" />
                  
                  <rect x="70" y="5" width="25" height="25" fill="#0b1f4b" />
                  <rect x="75" y="10" width="15" height="15" fill="white" />
                  <rect x="78" y="13" width="9" height="9" fill="#0b1f4b" />
                  
                  <rect x="5" y="70" width="25" height="25" fill="#0b1f4b" />
                  <rect x="10" y="75" width="15" height="15" fill="white" />
                  <rect x="13" y="78" width="9" height="9" fill="#0b1f4b" />
                  
                  {[35, 45, 55, 65].map((x) =>
                    [35, 45, 55, 65].map((y) => (
                      <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" fill="#0b1f4b" />
                    ))
                  )}
                  {[35, 45, 55, 65].map((x) =>
                    [5, 15, 25, 75, 85, 95].map((y) => (
                      <rect key={`${x}-${y}-v`} x={x} y={y} width="6" height="6" fill="#0b1f4b" />
                    ))
                  )}
                  {[5, 15, 25, 75, 85, 95].map((x) =>
                    [35, 45, 55, 65].map((y) => (
                      <rect key={`${x}-${y}-h`} x={x} y={y} width="6" height="6" fill="#0b1f4b" />
                    ))
                  )}
                  
                  <circle cx="50" cy="50" r="12" fill="white" />
                  <circle cx="50" cy="50" r="10" fill="#1d4fd8" />
                  <text x="50" y="54" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">A</text>
                </svg>
              </div>
            </div>

            <div className="rm-qr-actions">
              <button type="button" className="rm-action-btn rm-action-btn-outline" onClick={handleDownloadQR}>
                <Download size={16} /> Télécharger
              </button>
              <button type="button" className="rm-action-btn rm-action-btn-outline" onClick={handleShareQR}>
                <Share2 size={16} /> Partager
              </button>
            </div>
          </div>

          {/* Carte Info */}
          <div className="rm-card rm-info-card">
            <div className="rm-info-card-icon">
              <CheckCircle2 size={24} />
            </div>
            <p className="rm-info-card-text">
              Les virements entre comptes Aswaq Bank sont généralement <strong>instantanés</strong>.
            </p>
            <p className="rm-info-card-text">
              Les virements provenant d'autres banques peuvent prendre jusqu'à <strong>24 heures ouvrables</strong>.
            </p>
            <div className="rm-info-card-illustration">
              <Building2 size={48} className="rm-bank-icon" />
              <Clock size={24} className="rm-clock-icon" />
            </div>
          </div>
        </div>

        {/* 2 cartes du bas */}
        <div className="rm-bottom-cards">
          {/* Demander un paiement */}
          <div className="rm-card rm-request-card">
            <h3 className="rm-card-title">Demander un paiement</h3>
            <p className="rm-card-desc">Envoyez une demande de paiement à un contact.</p>

            <div className="rm-form-group">
              <label className="rm-form-label">Destinataire (email ou IBAN)</label>
              <input
                type="text"
                placeholder="ex : exemple@mail.com ou MA64 0112 3456 7890 1234 5678"
                value={requestForm.recipient}
                onChange={(e) => setRequestForm({...requestForm, recipient: e.target.value})}
                className="rm-form-input"
              />
            </div>

            <div className="rm-form-group">
              <label className="rm-form-label">Montant</label>
              <div className="rm-amount-input-wrapper">
                <input
                  type="text"
                  placeholder="0,00"
                  value={requestForm.amount}
                  onChange={(e) => setRequestForm({...requestForm, amount: e.target.value.replace(/[^0-9.,]/g, '')})}
                  className="rm-form-input rm-amount-input"
                />
                <span className="rm-amount-currency">MAD</span>
              </div>
            </div>

            <div className="rm-form-group">
              <label className="rm-form-label">Motif (optionnel)</label>
              <input
                type="text"
                placeholder="Ex : remboursement, facture, etc."
                value={requestForm.reason}
                onChange={(e) => setRequestForm({...requestForm, reason: e.target.value})}
                className="rm-form-input"
              />
            </div>

            <button type="button" className="rm-send-request-btn" onClick={handleSendRequest}>
              <Send size={16} /> Envoyer la demande
            </button>
          </div>

          {/* Historique des fonds reçus */}
          <div className="rm-card rm-history-card">
            <div className="rm-history-header">
              <h3 className="rm-card-title">Historique des fonds reçus</h3>
              <button type="button" className="rm-view-all-btn">Voir tout</button>
            </div>

            <div className="rm-history-table-wrapper">
              <table className="rm-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Expéditeur</th>
                    <th>Référence</th>
                    <th>Montant</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {TRANSACTIONS_RECEIVED.map((tx) => (
                    <tr key={tx.id}>
                      <td className="rm-history-date">
                        {tx.date} - {tx.time}
                      </td>
                      <td>
                        <div className="rm-sender-info">
                          <div className="rm-sender-avatar">
                            {tx.initials}
                          </div>
                          <div className="rm-sender-details">
                            <span className="rm-sender-name">{tx.sender}</span>
                            {tx.type && <span className="rm-sender-type">{tx.type}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="rm-history-ref">{tx.reference}</td>
                      <td className="rm-history-amount">+ {formatAmount(tx.amount)} MAD</td>
                      <td>
                        <span className="rm-status-badge rm-status-received">
                          <Check size={12} /> Reçu
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}