import React from 'react';
import { Link, useLocation , useNavigate } from 'react-router-dom';
import {
  Home, ArrowLeftRight, ShoppingBag, Receipt, Star, PiggyBank, PieChart,
  Bell, Bot, User, LogOut, Search, TrendingUp, TrendingDown,
  Wallet, Sparkles, AlertTriangle, Target, Award, ArrowRight,
  ShoppingCart, Car, UtensilsCrossed, Shirt, Lightbulb, Gamepad2,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './Depenses.css';
import './DashboardClient.css';
import UserHeader from '../components/UserHeader/UserHeader';
import NotificationBell from '../components/NotificationBell/NotificationBell';
const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/dashboard-client' },
  { icon: ArrowLeftRight, label: 'Gestion du compte', to: '/mon-compte' },
  { icon: ArrowLeftRight, label: 'Historique des transactions', to: '/transactions-client' },
  { icon: Receipt, label: 'Tickets numériques', to: '/tickets-client' },
  { icon: Star, label: 'Points de fidélité', to: '/fidelite' },
  { icon: PiggyBank, label: "Objectifs d'épargne", to: '/epargne' },
  { icon: PieChart, label: 'Suivi des dépenses', to: '/depenses' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant' },
  { icon: User, label: 'Profil et paramètres', to: '/parametres' },
];

// ===== Données simulées =====
const SPENDING_CATEGORIES = [
  { label: 'Alimentation', percent: 35, amount: 1137.50, color: '#1d4fd8', icon: ShoppingCart },
  { label: 'Transport', percent: 20, amount: 650, color: '#38bdf8', icon: Car },
  { label: 'Restaurants', percent: 15, amount: 487.50, color: '#f97316', icon: UtensilsCrossed },
  { label: 'Shopping', percent: 12, amount: 390, color: '#a78bfa', icon: Shirt },
  { label: 'Factures', percent: 10, amount: 325, color: '#10b981', icon: Lightbulb },
  { label: 'Loisirs', percent: 8, amount: 260, color: '#f43f5e', icon: Gamepad2 },
];

const MONTHLY_EVOLUTION = [
  { month: 'Fév', amount: 2800 },
  { month: 'Mars', amount: 3100 },
  { month: 'Avr', amount: 2950 },
  { month: 'Mai', amount: 3400 },
  { month: 'Juin', amount: 3050 },
  { month: 'Juil', amount: 3250 },
];

const AI_ADVICE = [
  {
    id: 1,
    icon: '💡',
    title: 'Dépenses week-end',
    text: 'Vous dépensez davantage le week-end. Essayez de fixer un budget de 500 MAD pour vos sorties.',
    type: 'tip',
  },
  {
    id: 2,
    icon: '✅',
    title: 'Budget alimentation',
    text: 'Votre budget alimentation est stable. Continuez ainsi, c\'est une excellente habitude.',
    type: 'good',
  },
  {
    id: 3,
    icon: '',
    title: 'Objectif d\'épargne',
    text: 'Vous êtes proche de votre objectif. Encore 350 MAD à économiser ce mois-ci.',
    type: 'goal',
  },
];

const ALERTS = [
  {
    id: 1,
    type: 'warning',
    icon: AlertTriangle,
    title: 'Budget Shopping',
    text: 'Vous avez utilisé 92% de votre budget Shopping ce mois-ci.',
    percent: 92,
  },
  {
    id: 2,
    type: 'info',
    icon: TrendingUp,
    title: 'Dépense inhabituelle',
    text: 'Vous avez effectué une dépense plus importante que d\'habitude chez Marjane.',
  },
];

const LAST_SPENDING = [
  { id: 1, merchant: 'Carrefour', date: 'Aujourd\'hui', amount: -250, color: '#1d4fd8' },
  { id: 2, merchant: 'Marjane', date: 'Hier', amount: -120, color: '#38bdf8' },
  { id: 3, merchant: 'Shell', date: '20 juillet', amount: -450, color: '#f97316' },
  { id: 4, merchant: 'Café Central', date: '19 juillet', amount: -85, color: '#a78bfa' },
  { id: 5, merchant: 'Pharmacie', date: '18 juillet', amount: -180, color: '#10b981' },
];

// ===== Composant Donut Chart =====
function DonutChart({ data }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <div className="dep-donut-container">
      <svg viewBox="0 0 200 200" className="dep-donut-svg">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="28" />
        {data.map((slice) => {
          const dash = (slice.percent / 100) * circumference;
          const circle = (
            <circle
              key={slice.label}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth="28"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offsetAcc}
              transform="rotate(-90 100 100)"
              className="dep-donut-segment"
            />
          );
          offsetAcc += dash;
          return circle;
        })}
        <text x="100" y="95" textAnchor="middle" className="dep-donut-total">
          3 250
        </text>
        <text x="100" y="115" textAnchor="middle" className="dep-donut-currency">
          MAD
        </text>
      </svg>
    </div>
  );
}

// ===== Composant Line Chart =====
function LineChart({ data }) {
  const width = 100;
  const height = 40;
  const maxAmount = Math.max(...data.map((d) => d.amount)) * 1.1;
  const minAmount = Math.min(...data.map((d) => d.amount)) * 0.9;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.amount - minAmount) / (maxAmount - minAmount)) * height;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <div className="dep-line-container">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="dep-line-svg">
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d4fd8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1d4fd8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#lineGradient)" />
        <path d={pathD} fill="none" stroke="#1d4fd8" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * width;
          const y = height - ((d.amount - minAmount) / (maxAmount - minAmount)) * height;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.2"
              fill="white"
              stroke="#1d4fd8"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      <div className="dep-line-labels">
        {data.map((d, i) => (
          <span key={i} className="dep-line-label">
            {d.month}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Depenses() {
  const location = useLocation();
  const navigate = useNavigate();

  const totalSpending = 3250;
  const totalIncome = 8500;
  const budget = 5000;
  const budgetRemaining = budget - totalSpending;
  const savings = 650;

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="acc-sidebar-logo">
          <Logo size={100} className="mb-6" logo-white/>
        </div>
        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.to === '/depenses';
            return (
              <Link
                key={item.label}
                to={item.to}
                state={location.state}
                className={`dash-nav-item ${isActive ? 'dash-nav-item-active' : ''}`}
              >
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="dash-help-card">
          <div className="dash-help-icon"><Bot size={20} /></div>
          <p className="dash-help-title">Besoin d'aide ?</p>
          <p className="dash-help-text">Notre assistant IA est là pour vous aider</p>
          <button type="button" className="dash-help-button">Discuter avec l'IA →</button>
        </div>
        <Link to="/" className="dash-logout">
          <LogOut size={18} /> Déconnexion
        </Link>
      </aside>

      {/* Main */}
      <main className="dash-main">
        {/* Header */}
        <header className="dash-topbar">
          <div>
            <h1 className="dash-greeting">Analyse intelligente des dépenses</h1>
            <p className="dash-greeting-sub">
              L'IA analyse automatiquement vos habitudes et vous aide à mieux gérer votre budget.
            </p>
          </div>
          <div className="dash-topbar-actions">
          
           <NotificationBell />
            <UserHeader />
          </div>
        </header>

        {/* ===== Cartes de résumé ===== */}
        <section className="dep-summary-grid">
          <div className="dep-summary-card">
            <div className="dep-summary-icon dep-summary-icon-red">
              <TrendingDown size={20} />
            </div>
            <div className="dep-summary-content">
              <p className="dep-summary-label">Dépenses du mois</p>
              <p className="dep-summary-value">{totalSpending.toLocaleString('fr-FR')} <span>MAD</span></p>
            </div>
          </div>
          <div className="dep-summary-card">
            <div className="dep-summary-icon dep-summary-icon-blue">
              <TrendingUp size={20} />
            </div>
            <div className="dep-summary-content">
              <p className="dep-summary-label">Revenus</p>
              <p className="dep-summary-value">{totalIncome.toLocaleString('fr-FR')} <span>MAD</span></p>
            </div>
          </div>
          <div className="dep-summary-card">
            <div className="dep-summary-icon dep-summary-icon-green">
              <Wallet size={20} />
            </div>
            <div className="dep-summary-content">
              <p className="dep-summary-label">Budget restant</p>
              <p className="dep-summary-value">{budgetRemaining.toLocaleString('fr-FR')} <span>MAD</span></p>
            </div>
          </div>
          <div className="dep-summary-card">
            <div className="dep-summary-icon dep-summary-icon-purple">
              <PiggyBank size={20} />
            </div>
            <div className="dep-summary-content">
              <p className="dep-summary-label">Épargne réalisée</p>
              <p className="dep-summary-value dep-positive">+{savings.toLocaleString('fr-FR')} <span>MAD</span></p>
            </div>
          </div>
        </section>

        {/* ===== Analyse IA (carte principale) ===== */}
        <section className="dep-ai-card">
          <div className="dep-ai-shine" />
          <div className="dep-ai-content">
            <div className="dep-ai-header">
              <div className="dep-ai-badge">
                <Sparkles size={16} />
                <span>Analyse IA</span>
              </div>
            </div>
            <div className="dep-ai-body">
              <p className="dep-ai-greeting">Bonjour👋</p>
              <p className="dep-ai-text">
                Ce mois-ci vos dépenses en <strong>restauration</strong> ont augmenté de{' '}
                <strong>18%</strong>.
              </p>
              <p className="dep-ai-text">
                Vous avez également réduit vos dépenses en <strong>transport</strong> de{' '}
                <strong>12%</strong>.
              </p>
              <p className="dep-ai-highlight">
                💰 Au rythme actuel, vous pouvez économiser environ{' '}
                <strong>400 MAD</strong> supplémentaires ce mois-ci.
              </p>
            </div>
            <button type="button" className="dep-ai-button">
              Voir l'analyse complète
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* ===== Répartition + Évolution ===== */}
        <section className="dep-charts-grid">
          {/* Donut */}
          <div className="dep-panel">
            <div className="dep-panel-header">
              <h2 className="dep-panel-title">Répartition des dépenses</h2>
              <PieChart size={18} className="dep-panel-icon" />
            </div>
            <div className="dep-donut-layout">
              <DonutChart data={SPENDING_CATEGORIES} />
              <div className="dep-legend">
                {SPENDING_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.label} className="dep-legend-row">
                      <div className="dep-legend-dot" style={{ background: cat.color }}>
                        <Icon size={12} />
                      </div>
                      <div className="dep-legend-info">
                        <span className="dep-legend-label">{cat.label}</span>
                        <span className="dep-legend-amount">{cat.amount.toLocaleString('fr-FR')} MAD</span>
                      </div>
                      <span className="dep-legend-percent">{cat.percent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Line chart */}
          <div className="dep-panel">
            <div className="dep-panel-header">
              <h2 className="dep-panel-title">Évolution des dépenses</h2>
              <TrendingUp size={18} className="dep-panel-icon" />
            </div>
            <LineChart data={MONTHLY_EVOLUTION} />
            <div className="dep-line-summary">
              <div className="dep-line-stat">
                <span className="dep-line-stat-label">Moyenne</span>
                <span className="dep-line-stat-value">3 091 MAD</span>
              </div>
              <div className="dep-line-stat">
                <span className="dep-line-stat-label">Tendance</span>
                <span className="dep-line-stat-value dep-positive">+5.2%</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Conseils IA ===== */}
        <section className="dep-section">
          <h2 className="dep-section-title">
            <Sparkles size={18} /> Conseils intelligents
          </h2>
          <div className="dep-advice-grid">
            {AI_ADVICE.map((advice) => (
              <div key={advice.id} className={`dep-advice-card dep-advice-${advice.type}`}>
                <div className="dep-advice-icon">{advice.icon}</div>
                <div className="dep-advice-content">
                  <p className="dep-advice-title">{advice.title}</p>
                  <p className="dep-advice-text">{advice.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Alertes + Défi + Score ===== */}
        <section className="dep-triple-grid">
          {/* Alertes */}
          <div className="dep-panel dep-alerts-panel">
            <div className="dep-panel-header">
              <h2 className="dep-panel-title">
                <AlertTriangle size={18} /> Alertes intelligentes
              </h2>
            </div>
            <div className="dep-alerts-list">
              {ALERTS.map((alert) => {
                const Icon = alert.icon;
                return (
                  <div key={alert.id} className={`dep-alert dep-alert-${alert.type}`}>
                    <div className="dep-alert-icon">
                      <Icon size={16} />
                    </div>
                    <div className="dep-alert-content">
                      <p className="dep-alert-title">{alert.title}</p>
                      <p className="dep-alert-text">{alert.text}</p>
                      {alert.percent && (
                        <div className="dep-alert-bar">
                          <div
                            className="dep-alert-bar-fill"
                            style={{ width: `${alert.percent}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Défi du mois */}
          <div className="dep-panel dep-challenge-panel">
            <div className="dep-panel-header">
              <h2 className="dep-panel-title">
                <Target size={18} /> Défi du mois
              </h2>
            </div>
            <div className="dep-challenge-content">
              <p className="dep-challenge-text">
                Réduisez vos dépenses en <strong>restauration</strong> de <strong>10%</strong>
              </p>
              <div className="dep-challenge-reward">
                <Award size={16} />
                <span>Récompense : <strong>+50 points fidélité</strong></span>
              </div>
              <button type="button" className="dep-challenge-btn">
                Accepter le défi
              </button>
            </div>
          </div>

          {/* Score financier */}
          <div className="dep-panel dep-score-panel">
            <div className="dep-panel-header">
              <h2 className="dep-panel-title">
                <Award size={18} /> Score financier
              </h2>
            </div>
            <div className="dep-score-content">
              <div className="dep-score-circle">
                <svg viewBox="0 0 100 100" className="dep-score-svg">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(87 / 100) * 264} 264`}
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#1d4fd8" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="dep-score-value">
                  <span>87</span>
                  <small>/100</small>
                </div>
              </div>
              <p className="dep-score-label">Excellent</p>
              <p className="dep-score-text">Vous gérez très bien vos finances.</p>
            </div>
          </div>
        </section>

        {/* ===== Dernières dépenses ===== */}
        <section className="dep-section">
          <div className="dep-section-header">
            <h2 className="dep-section-title">
              <ShoppingBag size={18} /> Dernières dépenses
            </h2>
            <Link to="/transactions-client" className="dep-link-btn">
              Voir toutes les transactions
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="dep-spending-list">
            {LAST_SPENDING.map((item) => (
              <div key={item.id} className="dep-spending-row">
                <div className="dep-spending-icon" style={{ background: item.color + '15', color: item.color }}>
                  <ShoppingBag size={16} />
                </div>
                <div className="dep-spending-info">
                  <p className="dep-spending-merchant">{item.merchant}</p>
                  <p className="dep-spending-date">{item.date}</p>
                </div>
                <span className="dep-spending-amount">{item.amount.toLocaleString('fr-FR')} MAD</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}