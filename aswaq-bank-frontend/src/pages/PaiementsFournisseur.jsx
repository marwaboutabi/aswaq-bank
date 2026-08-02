import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, ShoppingCart, CreditCard, Truck, Layers, User, Settings,
  HelpCircle, LogOut, Search, Bell, ChevronDown, Building2, Wallet,
  BadgeDollarSign, Clock3, TrendingUp, FileDown, MoreVertical, Bot,
  Download, X, CheckCircle2,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './PaiementsFournisseur.css';

const STATS = [
  { key: 'total', icon: Wallet, tone: 'green', label: 'Montant total reçu', value: '248 750,00 MAD', sub: '+ 9% vs mois dernier', trendUp: true },
  { key: 'recus', icon: BadgeDollarSign, tone: 'blue', label: 'Paiements reçus', value: '186', sub: '+ 14 cette semaine', trendUp: true },
  { key: 'attente', icon: Clock3, tone: 'orange', label: 'Paiements en attente', value: '12', sub: 'À suivre' },
  { key: 'mois', icon: TrendingUp, tone: 'purple', label: 'Revenus du mois', value: '58 900,00 MAD', sub: '+ 6% vs mois dernier', trendUp: true },
];

const PAYMENTS = [
  { ref: 'PAY-1025', cmd: 'CMD-1025', client: 'Épicerie Atlas', phone: '06 12 34 56 78', ville: 'Casablanca', date: '27 Juil 2026', montant: 2500, mode: 'Wallet Aswaq', statut: 'Reçu', tone: 'green' },
  { ref: 'PAY-1024', cmd: 'CMD-1024', client: 'Market Plus', phone: '06 22 45 67 89', ville: 'Rabat', date: '27 Juil 2026', montant: 1850, mode: 'Virement', statut: 'En attente', tone: 'orange' },
  { ref: 'PAY-1023', cmd: 'CMD-1023', client: 'Mini Market', phone: '06 33 56 78 90', ville: 'Fès', date: '26 Juil 2026', montant: 950, mode: 'Carte bancaire', statut: 'Reçu', tone: 'green' },
  { ref: 'PAY-1022', cmd: 'CMD-1022', client: 'Alimentation Nour', phone: '06 44 67 89 01', ville: 'Marrakech', date: '26 Juil 2026', montant: 3600, mode: 'Wallet Aswaq', statut: 'Reçu', tone: 'green' },
  { ref: 'PAY-1021', cmd: 'CMD-1021', client: 'Super Marché Al Amal', phone: '06 55 78 90 12', ville: 'Tanger', date: '25 Juil 2026', montant: 1750, mode: 'QR Code', statut: 'Reçu', tone: 'green' },
  { ref: 'PAY-1020', cmd: 'CMD-1020', client: 'Bio Shop', phone: '06 66 89 01 23', ville: 'Agadir', date: '25 Juil 2026', montant: 1120, mode: 'Virement', statut: 'Annulé', tone: 'red' },
  { ref: 'PAY-1019', cmd: 'CMD-1019', client: 'Épicerie Chaabi', phone: '06 77 90 12 34', ville: 'Casablanca', date: '24 Juil 2026', montant: 2980, mode: 'Carte bancaire', statut: 'Reçu', tone: 'green' },
  { ref: 'PAY-1018', cmd: 'CMD-1018', client: 'Marjane Express', phone: '06 88 01 23 45', ville: 'Salé', date: '24 Juil 2026', montant: 4200, mode: 'Wallet Aswaq', statut: 'Reçu', tone: 'green' },
  { ref: 'PAY-1017', cmd: 'CMD-1017', client: 'Alimentation Salam', phone: '06 99 12 34 56', ville: 'Meknès', date: '23 Juil 2026', montant: 860, mode: 'QR Code', statut: 'En attente', tone: 'orange' },
  { ref: 'PAY-1016', cmd: 'CMD-1016', client: 'Épicerie Al Baraka', phone: '06 10 23 45 67', ville: 'Oujda', date: '23 Juil 2026', montant: 1990, mode: 'Virement', statut: 'Reçu', tone: 'green' },
  { ref: 'PAY-1015', cmd: 'CMD-1015', client: 'Market Fresh', phone: '06 21 34 56 78', ville: 'Kénitra', date: '22 Juil 2026', montant: 1340, mode: 'Carte bancaire', statut: 'Reçu', tone: 'green' },
  { ref: 'PAY-1014', cmd: 'CMD-1014', client: 'Épicerie Ennasr', phone: '06 32 45 67 89', ville: 'Casablanca', date: '21 Juil 2026', montant: 700, mode: 'Wallet Aswaq', statut: 'Annulé', tone: 'red' },
];

const RECENT_ACTIVITY = [
  { title: 'Paiement PAY-1025 reçu', time: 'Il y a 15 min', icon: BadgeDollarSign, tone: 'green' },
  { title: 'Versement effectué vers votre compte', time: 'Il y a 40 min', icon: Wallet, tone: 'blue' },
  { title: 'Commande CMD-1024 réglée', time: 'Il y a 1 heure', icon: CreditCard, tone: 'purple' },
  { title: 'Reçu PAY-1022 téléchargé', time: 'Il y a 2 heures', icon: FileDown, tone: 'orange' },
  { title: 'Export de la liste des paiements réalisé', time: 'Il y a 3 heures', icon: Download, tone: 'green' },
];

const FILTERS = ['Tous', 'Reçu', 'En attente', 'Annulé'];
const PAGE_SIZE = 10;

// ====== GÉNÉRATION D'UN REÇU INDIVIDUEL ======
function generateReceiptHTML(payment) {
  const sousTotal = payment.montant;
  const tva = Math.round(sousTotal * 0.2);
  const commission = Math.round(sousTotal * 0.05);
  const net = sousTotal + tva - commission;

  return `
  <div class="receipt">
    <div class="header">
      <h1>ASWAQ BANK</h1>
      <p>Reçu de paiement officiel</p>
    </div>
    <div class="section">
      <h3>Informations du paiement</h3>
      <div class="row"><span class="label">Référence</span><span class="value">${payment.ref}</span></div>
      <div class="row"><span class="label">Commande associée</span><span class="value">${payment.cmd}</span></div>
      <div class="row"><span class="label">Date</span><span class="value">${payment.date}</span></div>
      <div class="row"><span class="label">Statut</span><span class="value"><span class="status status-${payment.tone}">${payment.statut}</span></span></div>
      <div class="row"><span class="label">Mode de paiement</span><span class="value">${payment.mode}</span></div>
    </div>
    <div class="section">
      <h3>Commerçant</h3>
      <div class="row"><span class="label">Nom</span><span class="value">${payment.client}</span></div>
      <div class="row"><span class="label">Téléphone</span><span class="value">${payment.phone}</span></div>
      <div class="row"><span class="label">Ville</span><span class="value">${payment.ville}</span></div>
    </div>
    <div class="section">
      <h3>Résumé financier</h3>
      <div class="total">
        <div class="row"><span class="label">Sous-total</span><span class="value">${sousTotal.toLocaleString('fr-FR')} MAD</span></div>
        <div class="row"><span class="label">TVA (20%)</span><span class="value">${tva.toLocaleString('fr-FR')} MAD</span></div>
        <div class="row"><span class="label">Commission Aswaq Bank (5%)</span><span class="value">- ${commission.toLocaleString('fr-FR')} MAD</span></div>
        <div class="row final"><span class="label">Montant net reçu</span><span class="value">${net.toLocaleString('fr-FR')} MAD</span></div>
      </div>
    </div>
    <div class="footer">
      <p>Ce reçu a été généré automatiquement par la plateforme Aswaq Bank.</p>
    </div>
  </div>`;
}

// ====== FONCTION 1 : EXPORT CSV (liste des paiements) ======
function exportPaymentsToCSV(payments) {
  const headers = ['Référence', 'Commande', 'Commerçant', 'Téléphone', 'Ville', 'Date', 'Montant (MAD)', 'Mode de paiement', 'Statut'];
  const rows = payments.map((p) => [
    p.ref,
    p.cmd,
    p.client,
    p.phone,
    p.ville,
    p.date,
    p.montant,
    p.mode,
    p.statut,
  ]);

  const csvContent = [
    headers.join(';'),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(';')),
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Paiements_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ====== FONCTION 2 : TÉLÉCHARGEMENT DES REÇUS (documents HTML) ======
function downloadAllReceipts(payments) {
  const receiptsHTML = payments.map((p) => generateReceiptHTML(p)).join('\n<hr style="page-break-after: always; border: none; border-top: 2px dashed #cbd5e1; margin: 40px 0;">\n');

  const fullHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Reçus de paiement - ${new Date().toLocaleDateString('fr-FR')}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 30px; color: #333; }
  .receipt { margin-bottom: 40px; }
  .header { text-align: center; border-bottom: 2px solid #1d4fd8; padding-bottom: 20px; margin-bottom: 25px; }
  .header h1 { color: #0b1f4b; margin: 0 0 5px; font-size: 24px; }
  .header p { color: #6b7280; margin: 0; font-size: 13px; }
  .section { margin-bottom: 20px; }
  .section h3 { color: #0b1f4b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
  .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
  .row .label { color: #6b7280; }
  .row .value { font-weight: 600; color: #0b1f4b; }
  .total { background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 15px; }
  .total .row { font-size: 15px; }
  .total .row.final { border-top: 1px dashed #cbd5e1; padding-top: 12px; margin-top: 8px; font-size: 17px; font-weight: 700; }
  .status { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; }
  .status-green { background: #dcfce7; color: #16a34a; }
  .status-orange { background: #fef3c7; color: #b45309; }
  .status-red { background: #fee2e2; color: #dc2626; }
  .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; }
  @media print { body { margin: 0; padding: 20px; } .receipt { page-break-after: always; } }
</style>
</head>
<body>
  ${receiptsHTML}
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Recus_paiements_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ====== TÉLÉCHARGEMENT D'UN SEUL REÇU ======
function downloadSingleReceipt(payment) {
  const receiptHTML = generateReceiptHTML(payment);
  const fullHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Reçu ${payment.ref}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 30px; color: #333; }
  .header { text-align: center; border-bottom: 2px solid #1d4fd8; padding-bottom: 20px; margin-bottom: 25px; }
  .header h1 { color: #0b1f4b; margin: 0 0 5px; font-size: 24px; }
  .header p { color: #6b7280; margin: 0; font-size: 13px; }
  .section { margin-bottom: 20px; }
  .section h3 { color: #0b1f4b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
  .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
  .row .label { color: #6b7280; }
  .row .value { font-weight: 600; color: #0b1f4b; }
  .total { background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 15px; }
  .total .row { font-size: 15px; }
  .total .row.final { border-top: 1px dashed #cbd5e1; padding-top: 12px; margin-top: 8px; font-size: 17px; font-weight: 700; }
  .status { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; }
  .status-green { background: #dcfce7; color: #16a34a; }
  .status-orange { background: #fef3c7; color: #b45309; }
  .status-red { background: #fee2e2; color: #dc2626; }
  .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; }
  @media print { body { margin: 0; padding: 20px; } }
</style>
</head>
<body>
  ${receiptHTML}
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Recu_${payment.ref}_${payment.client.replace(/\s+/g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function PaymentDetailsModal({ payment, onClose }) {
  if (!payment) return null;

  const sousTotal = payment.montant;
  const tva = Math.round(sousTotal * 0.2);
  const commission = Math.round(sousTotal * 0.05);
  const net = sousTotal + tva - commission;

  return (
    <div className="pay-four-modal-overlay" onClick={onClose}>
      <div className="pay-four-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pay-four-modal-header">
          <h3>Détails du paiement {payment.ref}</h3>
          <button type="button" className="pay-four-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="pay-four-modal-body">
          <div>
            <p className="pay-four-modal-section-title">Informations générales</p>
            <div className="pay-four-modal-grid">
              <div className="pay-four-modal-field">
                <span className="pay-four-modal-field-label">Référence du paiement</span>
                <span className="pay-four-modal-field-value">{payment.ref}</span>
              </div>
              <div className="pay-four-modal-field">
                <span className="pay-four-modal-field-label">Numéro de commande</span>
                <span className="pay-four-modal-field-value">{payment.cmd}</span>
              </div>
              <div className="pay-four-modal-field">
                <span className="pay-four-modal-field-label">Date</span>
                <span className="pay-four-modal-field-value">{payment.date}</span>
              </div>
              <div className="pay-four-modal-field">
                <span className="pay-four-modal-field-label">Statut</span>
                <span className={`pay-four-badge-pill pay-four-badge-pill-${payment.tone}`}>{payment.statut}</span>
              </div>
              <div className="pay-four-modal-field">
                <span className="pay-four-modal-field-label">Moyen de paiement</span>
                <span className="pay-four-modal-field-value">{payment.mode}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="pay-four-modal-section-title">Informations du commerçant</p>
            <div className="pay-four-modal-grid">
              <div className="pay-four-modal-field">
                <span className="pay-four-modal-field-label">Nom</span>
                <span className="pay-four-modal-field-value">{payment.client}</span>
              </div>
              <div className="pay-four-modal-field">
                <span className="pay-four-modal-field-label">Téléphone</span>
                <span className="pay-four-modal-field-value">{payment.phone}</span>
              </div>
              <div className="pay-four-modal-field">
                <span className="pay-four-modal-field-label">Ville</span>
                <span className="pay-four-modal-field-value">{payment.ville}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="pay-four-modal-section-title">Résumé financier</p>
            <div className="pay-four-modal-summary">
              <div className="pay-four-modal-summary-row">
                <span>Sous-total</span>
                <span>{sousTotal.toLocaleString('fr-FR')} MAD</span>
              </div>
              <div className="pay-four-modal-summary-row">
                <span>TVA (20%)</span>
                <span>{tva.toLocaleString('fr-FR')} MAD</span>
              </div>
              <div className="pay-four-modal-summary-row">
                <span>Commission Aswaq Bank (5%)</span>
                <span>- {commission.toLocaleString('fr-FR')} MAD</span>
              </div>
              <div className="pay-four-modal-summary-row pay-four-modal-summary-row-total">
                <span>Montant net reçu</span>
                <span>{net.toLocaleString('fr-FR')} MAD</span>
              </div>
              <div className="pay-four-modal-summary-row">
                <span>Date du versement</span>
                <span>{payment.date}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pay-four-modal-footer">
          <button type="button" className="pay-four-btn pay-four-btn-outline" onClick={() => downloadSingleReceipt(payment)}>
            <FileDown size={15} />
            Télécharger le reçu
          </button>
          <button type="button" className="pay-four-btn pay-four-btn-solid" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaiementsFournisseur() {
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [range, setRange] = useState('mois');
  const [page, setPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [toast, setToast] = useState(null);

  const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', to: '/accueil-fournisseur' },
    { icon: Package, label: 'Produits', to: '/produits-fournisseur' },
    { icon: ShoppingCart, label: 'Commandes reçues', to: '/commandes-fournisseur' },
    { icon: CreditCard, label: 'Paiements', to: '/paiements-fournisseur', active: true },
    { icon: Truck, label: 'Livraisons', to: '/livraisons-fournisseur' },
    { icon: Layers, label: 'Catalogue', to: '/catalogue-fournisseur' },
    { icon: Bell, label: 'Notifications', to: '/notifications-fournisseur' },
    { icon: Bot, label: 'Assistant IA', to: '/assistant-fournisseur' },
    { icon: User, label: 'Profil & Paramètres', to: '/profil-fournisseur' },
  ];

  const filteredPayments = useMemo(() => {
    return PAYMENTS.filter((p) => {
      const matchesFilter = activeFilter === 'Tous' || p.statut === activeFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        p.ref.toLowerCase().includes(q) ||
        p.cmd.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [search, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagePayments = filteredPayments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleDownloadFromMenu = (payment) => {
    downloadSingleReceipt(payment);
    setOpenMenuId(null);
    setToast(`Reçu ${payment.ref} téléchargé`);
    setTimeout(() => setToast(null), 2500);
  };

  const handleExport = () => {
    exportPaymentsToCSV(filteredPayments);
    setToast(`${filteredPayments.length} paiement(s) exporté(s) en CSV`);
    setTimeout(() => setToast(null), 2500);
  };

  const handleDownloadAll = () => {
    downloadAllReceipts(filteredPayments);
    setToast(`${filteredPayments.length} reçu(s) téléchargé(s)`);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="pay-four-layout" onClick={() => setOpenMenuId(null)}>
      {/* Toast notification */}
      {toast && (
        <div className="pay-four-toast">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      {/* Sidebar */}
      <aside className="pay-four-sidebar">
        <div className="acc-sidebar-logo">
          <Logo size={100} className="mb-6" logo-white />
        </div>

        <p className="pay-four-sidebar-section">
          <Building2 size={13} />
          FOURNISSEUR
        </p>

        <nav className="pay-four-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to || '#'}
                state={location.state}
                className={`pay-four-nav-item ${item.active ? 'pay-four-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link to="/" className="pay-four-logout">
          <LogOut size={18} />
          Se déconnecter
        </Link>
      </aside>

      {/* Main content */}
      <main className="pay-four-main">
        <header className="pay-four-topbar">
          <div>
            <h1 className="pay-four-greeting">Paiements</h1>
            <p className="pay-four-greeting-sub">Consultez tous les paiements reçus pour vos commandes.</p>
          </div>

          <div className="pay-four-topbar-actions">
            <div className="pay-four-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <button
              type="button"
              className="pay-four-icon-button"
              onClick={() => navigate('/notifications-fournisseur')}
            >
              <Bell size={18} />
              <span className="pay-four-badge">3</span>
            </button>
            <div className="pay-four-user-chip">
              <div className="pay-four-user-avatar">MB</div>
              <div className="pay-four-user-info">
                <span className="pay-four-user-name">Marwa Boutabi</span>
                <span className="pay-four-user-role">Fournisseur</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Stat cards */}
        <section className="pay-four-stats-row">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div className="pay-four-stat-card" key={s.key}>
                <div className={`pay-four-stat-icon pay-four-stat-icon-${s.tone}`}>
                  <Icon size={18} />
                </div>
                <div className="pay-four-stat-label">{s.label}</div>
                <p className="pay-four-stat-value">{s.value}</p>
                <p className={`pay-four-stat-sub ${s.trendUp ? 'pay-four-stat-sub-up' : ''}`}>
                  {s.sub}
                  {s.trendUp && ' ↗'}
                </p>
              </div>
            );
          })}
        </section>

        {/* Action bar */}
        <section className="pay-four-action-bar">
          <div className="pay-four-action-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher un paiement..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="pay-four-filter-chips">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`pay-four-filter-chip ${activeFilter === filter ? 'pay-four-filter-chip-active' : ''}`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <select
            className="pay-four-range-select"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="jour">Aujourd&apos;hui</option>
            <option value="semaine">Cette semaine</option>
            <option value="mois">Ce mois</option>
            <option value="annee">Cette année</option>
          </select>

          <div className="pay-four-action-buttons">
            <button type="button" className="pay-four-btn pay-four-btn-outline" onClick={handleExport}>
              <Download size={15} />
              Exporter (CSV)
            </button>
            <button type="button" className="pay-four-btn pay-four-btn-solid" onClick={handleDownloadAll}>
              <FileDown size={15} />
              Télécharger les reçus
            </button>
          </div>
        </section>

        {/* Table */}
        <section className="pay-four-panel pay-four-table-panel">
          <div className="pay-four-panel-header">
            <h3>Liste des paiements</h3>
          </div>

          <div className="pay-four-table-wrapper">
            <table className="pay-four-table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Commande</th>
                  <th>Commerçant</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Mode de paiement</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagePayments.map((p) => (
                  <tr key={p.ref}>
                    <td className="pay-four-ref">{p.ref}</td>
                    <td>{p.cmd}</td>
                    <td className="pay-four-client">{p.client}</td>
                    <td>{p.date}</td>
                    <td className="pay-four-amount">{p.montant.toLocaleString('fr-FR')} MAD</td>
                    <td>{p.mode}</td>
                    <td>
                      <span className={`pay-four-badge-pill pay-four-badge-pill-${p.tone}`}>{p.statut}</span>
                    </td>
                    <td>
                      <div className="pay-four-row-actions" onClick={(e) => e.stopPropagation()}>
                        <div className="pay-four-menu-wrap">
                          <button
                            type="button"
                            className="pay-four-row-action-btn"
                            title="Plus d'actions"
                            onClick={() => setOpenMenuId(openMenuId === p.ref ? null : p.ref)}
                          >
                            <MoreVertical size={15} />
                          </button>
                          {openMenuId === p.ref && (
                            <div className="pay-four-menu">
                              <button type="button" onClick={() => { setSelectedPayment(p); setOpenMenuId(null); }}>
                                Voir les détails
                              </button>
                              <button type="button" onClick={() => handleDownloadFromMenu(p)}>
                                Télécharger le reçu
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {pagePayments.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af' }}>
                      Aucun paiement ne correspond à votre recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pay-four-pagination">
            <span className="pay-four-pagination-info">
              Page {currentPage} sur {totalPages} · {filteredPayments.length} paiement(s)
            </span>
            <div className="pay-four-pagination-controls">
              <button
                type="button"
                className="pay-four-page-btn"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`pay-four-page-btn ${currentPage === n ? 'pay-four-page-btn-active' : ''}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                className="pay-four-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                ›
              </button>
            </div>
          </div>
        </section>

        {/* Recent activity */}
        <section className="pay-four-bottom-row">
          <div className="pay-four-panel">
            <div className="pay-four-panel-header">
              <h3>Activité récente</h3>
              <button type="button" className="pay-four-link-button">Voir tout</button>
            </div>
            <ul className="pay-four-timeline-list">
              {RECENT_ACTIVITY.map((a, i) => {
                const Icon = a.icon;
                return (
                  <li className="pay-four-timeline-row" key={a.title}>
                    <span className={`pay-four-timeline-icon pay-four-timeline-icon-${a.tone}`}>
                      <Icon size={15} />
                    </span>
                    <div className="pay-four-timeline-info">
                      <p className="pay-four-timeline-title">{a.title}</p>
                      <p className="pay-four-timeline-time">{a.time}</p>
                    </div>
                    {i !== RECENT_ACTIVITY.length - 1 && <span className="pay-four-timeline-connector" />}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>

      <PaymentDetailsModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
    </div>
  );
}