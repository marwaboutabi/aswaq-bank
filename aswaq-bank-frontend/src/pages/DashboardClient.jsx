import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, CreditCard, ArrowLeftRight, QrCode, Star, Bot, LogOut,
  Search, Bell, Eye, EyeOff, Send, Download, ShoppingCart,
  TrendingUp, Sparkles, Fuel, ShoppingBag, Receipt, PiggyBank, PieChart, User,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './DashboardClient.css';
import UserHeader from '../components/UserHeader/UserHeader';
import NotificationBell from '../components/NotificationBell/NotificationBell';
const TRANSACTIONS = [
  { id: 1, name: 'Carrefour Market', type: 'Achat', amount: -250, date: '15 Juil 2026 · 14:30', icon: ShoppingCart },
  { id: 2, name: 'Virement de Sara Ali', type: 'Virement reçu', amount: 2000, date: '15 Juil 2026 · 11:20', icon: Download },
  { id: 3, name: 'Paiement QR - Café Milano', type: 'Paiement', amount: -85, date: '14 Juil 2026 · 18:45', icon: QrCode },
  { id: 4, name: 'Station Total', type: 'Carburant', amount: -300, date: '14 Juil 2026 · 09:15', icon: Fuel },
  { id: 5, name: 'Virement vers Ahmad', type: 'Virement envoyé', amount: -1500, date: '13 Juil 2026 · 16:05', icon: Send },
];

const SPENDING = [
  { label: 'Alimentation', percent: 40, amount: 1300, color: '#1d4fd8' },
  { label: 'Transport', percent: 20, amount: 650, color: '#38bdf8' },
  { label: 'Shopping', percent: 15, amount: 488, color: '#f59e0b' },
  { label: 'Factures', percent: 15, amount: 488, color: '#ef4444' },
  { label: 'Autres', percent: 10, amount: 325, color: '#a1a1aa' },
];

function DonutChart({ data, total }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <svg viewBox="0 0 160 160" className="dash-donut-svg">
      <circle cx="80" cy="80" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="20" />
      {data.map((slice) => {
        const dash = (slice.percent / 100) * circumference;
        const circle = (
          <circle
            key={slice.label}
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={slice.color}
            strokeWidth="20"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offsetAcc}
            transform="rotate(-90 80 80)"
          />
        );
        offsetAcc += dash;
        return circle;
      })}
      <text x="80" y="76" textAnchor="middle" className="dash-donut-total">
        {total.toLocaleString('fr-FR')}
      </text>
      <text x="80" y="94" textAnchor="middle" className="dash-donut-currency">MAD</text>
    </svg>
  );
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const totalSpending = SPENDING.reduce((sum, s) => sum + s.amount, 0);

  const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', active: true, to: '/dashboard-client' },
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

 const QUICK_ACTIONS = [
  { icon: Send, title: "Envoyer de l'argent", subtitle: 'Virement vers un contact', to: '/envoyer-argent' },
  { icon: Download, title: "Recevoir de l'argent", subtitle: 'Partager vos coordonnées', to: '/recevoir-argent' },
  { icon: QrCode, title: 'Payer / Scanner un QR', subtitle: 'Paiement instantané', to: '/payer-qr' },
  { icon: ShoppingBag, title: 'Historique des achats', subtitle: 'Vos achats passés', to: '/transactions-client' },
  { icon: Receipt, title: 'Tickets numériques', subtitle: 'Vos reçus dématérialisés', to: '/tickets-client' },
];

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
                to={item.to || '#'}
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
      <main className="dash-main">
        <header className="dash-topbar">
          <div>
            <h1 className="dash-greeting">Bonjour, Marwa 👋</h1>
            <p className="dash-greeting-sub">Voici un aperçu de votre activité financière.</p>
          </div>

          <div className="dash-topbar-actions">
            <div className="dash-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <NotificationBell />
            <UserHeader />
          </div>
        </header>

        {/* Balance + stats row */}
        <section className="dash-grid-top">
          <div className="dash-balance-card">
            <div className="dash-card-shine" />

            <div className="dash-balance-header">
              <span>Solde disponible</span>
              <button type="button" onClick={() => setShowBalance((v) => !v)} className="dash-eye-button">
                {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            <div className="dash-balance-amount">
              {showBalance ? '12 450,00' : '••• •••'} <span>MAD</span>
            </div>

            <div className="dash-card-chip">
              <svg viewBox="0 0 48 36" width="40" height="30">
                <rect x="1" y="1" width="46" height="34" rx="6" fill="#e8c874" stroke="#c9a545" strokeWidth="1" />
                <line x1="1" y1="12" x2="47" y2="12" stroke="#c9a545" strokeWidth="1" />
                <line x1="1" y1="24" x2="47" y2="24" stroke="#c9a545" strokeWidth="1" />
                <line x1="16" y1="1" x2="16" y2="35" stroke="#c9a545" strokeWidth="1" />
                <line x1="32" y1="1" x2="32" y2="35" stroke="#c9a545" strokeWidth="1" />
                <rect x="10" y="7" width="12" height="8" rx="2" fill="none" stroke="#c9a545" strokeWidth="1" />
              </svg>
            </div>

            <div className="dash-balance-meta">
              <span>Compte principal</span>
              <span className="dash-card-number">•••• •••• •••• 4589</span>
            </div>

            <div className="dash-balance-actions">
              <button type="button" onClick={() => navigate('/envoyer-argent')}>
                <Send size={16} /> Envoyer
              </button>
              <button type="button"><Download size={16} /> Recevoir</button>
              <button type="button"><CreditCard size={16} /> Payer</button>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon dash-stat-icon-blue"><TrendingUp size={18} /></div>
            <p className="dash-stat-label">Revenus ce mois</p>
            <p className="dash-stat-value dash-stat-positive">+ 8 500,00 MAD</p>
            <p className="dash-stat-trend dash-stat-trend-up">↗ 12.5% vs mois dernier</p>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon dash-stat-icon-orange"><CreditCard size={18} /></div>
            <p className="dash-stat-label">Dépenses ce mois</p>
            <p className="dash-stat-value dash-stat-negative">- 3 250,00 MAD</p>
            <p className="dash-stat-trend dash-stat-trend-down">↘ 8.2% vs mois dernier</p>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon dash-stat-icon-purple"><Star size={18} /></div>
            <p className="dash-stat-label">Points de fidélité</p>
            <p className="dash-stat-value">1 250 pts</p>
            <div className="dash-loyalty-bar">
              <div className="dash-loyalty-fill" style={{ width: '62%' }} />
            </div>
            <p className="dash-stat-trend">Niveau Bronze · Prochain : 2 000 pts</p>
          </div>
        </section>

        {/* Quick actions */}
        <section className="dash-section">
          <h2 className="dash-section-title">Actions rapides</h2>
          <div className="dash-quick-actions">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  type="button"
                  className="dash-quick-action"
                  onClick={() => action.to && navigate(action.to)}
                >
                  <div className="dash-quick-action-icon"><Icon size={18} /></div>
                  <div>
                    <p className="dash-quick-action-title">{action.title}</p>
                    <p className="dash-quick-action-subtitle">{action.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Transactions + spending */}
        <section className="dash-grid-bottom">
          <div className="dash-panel">
            <div className="dash-panel-header">
              <h2 className="dash-section-title">Historique des transactions</h2>
              <button type="button" className="dash-link-button">Voir tout</button>
            </div>
            <ul className="dash-transaction-list">
              {TRANSACTIONS.map((tx) => {
                const Icon = tx.icon;
                return (
                  <li key={tx.id} className="dash-transaction-row">
                    <div className="dash-transaction-icon"><Icon size={18} /></div>
                    <div className="dash-transaction-info">
                      <p className="dash-transaction-name">{tx.name}</p>
                      <p className="dash-transaction-type">{tx.type}</p>
                    </div>
                    <div className="dash-transaction-amount-block">
                      <p className={`dash-transaction-amount ${tx.amount > 0 ? 'dash-stat-positive' : ''}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('fr-FR')},00 MAD
                      </p>
                      <p className="dash-transaction-date">{tx.date}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="dash-panel-column">
            <div className="dash-panel">
              <div className="dash-panel-header">
                <h2 className="dash-section-title">Suivi des dépenses</h2>
                <span className="dash-link-button">Ce mois</span>
              </div>
              <div className="dash-donut-wrapper">
                <DonutChart data={SPENDING} total={totalSpending} />
                <ul className="dash-legend">
                  {SPENDING.map((s) => (
                    <li key={s.label} className="dash-legend-row">
                      <span className="dash-legend-dot" style={{ background: s.color }} />
                      <span className="dash-legend-label">{s.label}</span>
                      <span className="dash-legend-percent">{s.percent}%</span>
                      <span className="dash-legend-amount">{s.amount} MAD</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="dash-panel dash-savings-card">
              <div className="dash-panel-header">
                <h2 className="dash-section-title">Objectif d'épargne</h2>
                <button type="button" className="dash-link-button">Modifier</button>
              </div>
              <p className="dash-savings-name">Voyage à Dubaï ✈️</p>
              <p className="dash-savings-amount">4 560 <span>/ 10 000 MAD</span></p>
              <div className="dash-savings-track">
                <div className="dash-savings-fill" style={{ width: '45%' }} />
              </div>
              <p className="dash-savings-percent">45% de l'objectif atteint</p>
            </div>
          </div>
        </section>

        {/* Tip banner */}
        <section className="dash-tip-banner">
          <Sparkles size={20} className="dash-tip-icon" />
          <div>
            <p className="dash-tip-title">Conseil du jour</p>
            <p className="dash-tip-text">
              Vos dépenses en alimentation ont augmenté de 12% ce mois-ci.{' '}
              <button type="button" className="dash-link-button">Voir mes astuces d'économie →</button>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}


