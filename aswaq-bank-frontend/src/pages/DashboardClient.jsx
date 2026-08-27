import React, { useEffect, useState } from 'react';
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

// Seuils alignés avec LoyaltyService.updateLevel (backend)
const LEVEL_THRESHOLDS = [
  { level: 'Bronze', min: 0, next: 500 },
  { level: 'Argent', min: 500, next: 1500 },
  { level: 'Or', min: 1500, next: 3000 },
  { level: 'Platine', min: 3000, next: null },
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

  // States dynamiques
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loyaltyAccount, setLoyaltyAccount] = useState(null);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const [userRes, accountRes, transactionsRes, loyaltyRes, savingsRes] = await Promise.all([
          fetch('http://localhost:8080/api/users/me', { headers }),
          fetch('http://localhost:8080/api/accounts/me', { headers }),
          fetch('http://localhost:8080/api/transactions/my', { headers }),
          fetch('http://localhost:8080/api/loyalty/my-points', { headers }),
          fetch('http://localhost:8080/api/savings-goals', { headers }),
        ]);

        if (userRes.ok) setUser(await userRes.json());
        
        // MODIFICATION ICI : Ajout du console.log pour vérifier la structure des données
        if (accountRes.ok) {
          const accountData = await accountRes.json();
          console.log("COMPTE CONNECTÉ :", accountData);
          setAccount(accountData);
        }

        if (transactionsRes.ok) {
          const data = await transactionsRes.json();
          setTransactions(Array.isArray(data) ? data : []);
        }

        if (loyaltyRes.ok) setLoyaltyAccount(await loyaltyRes.json());

        if (savingsRes.ok) {
          const data = await savingsRes.json();
          setSavingsGoals(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Erreur récupération données dashboard client:', error);
      } finally {
        setLoadingDashboard(false);
      }
    };

    loadDashboardData();
  }, []);

  // Calculs dynamiques
  const balance = Number(account?.balance ?? account?.solde ?? 0);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const transactionsThisMonth = transactions.filter(tx => {
    if (!tx.transactionDate) return false;
    const d = new Date(tx.transactionDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const revenusThisMonth = transactionsThisMonth
    .filter(tx => tx.incoming)
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const depensesThisMonth = transactionsThisMonth
    .filter(tx => !tx.incoming)
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const loyaltyPoints = loyaltyAccount?.points ?? 0;
  const loyaltyLevel = loyaltyAccount?.level ?? 'Bronze';
  const levelInfo = LEVEL_THRESHOLDS.find(l => l.level === loyaltyLevel) || LEVEL_THRESHOLDS[0];
  const loyaltyProgressPercent = levelInfo.next
    ? Math.min(100, Math.round(((loyaltyPoints - levelInfo.min) / (levelInfo.next - levelInfo.min)) * 100))
    : 100;

  // Premier objectif d'épargne actif (le plus récent)
  const mainSavingsGoal = savingsGoals.length > 0 ? savingsGoals[0] : null;
  const savingsCurrent = Number(mainSavingsGoal?.currentAmount ?? 0);
  const savingsTarget = Number(mainSavingsGoal?.targetAmount ?? 0);
  const savingsPercent = savingsTarget > 0 ? Math.min(100, Math.round((savingsCurrent / savingsTarget) * 100)) : 0;

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

  if (loadingDashboard) {
    return (
      <div className="dash-layout">
        <main className="dash-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <p>Chargement du tableau de bord...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-logo">
          <Logo size={100} className="mb-6 logo-white" />
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
            <h1 className="dash-greeting">Bonjour, {user?.prenom || 'Client'} 👋</h1>
            <p className="dash-greeting-sub">Voici un aperçu de votre activité financière.</p>
          </div>

          <div className="dash-topbar-actions">
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
              {showBalance
                ? balance.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '••• •••'} <span>MAD</span>
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
              <span className="dash-card-number">{account?.accountNumber || '•••• •••• •••• ••••'}</span>
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
            <p className="dash-stat-value dash-stat-positive">
              + {revenusThisMonth.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD
            </p>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon dash-stat-icon-orange"><CreditCard size={18} /></div>
            <p className="dash-stat-label">Dépenses ce mois</p>
            <p className="dash-stat-value dash-stat-negative">
              - {depensesThisMonth.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD
            </p>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon dash-stat-icon-purple"><Star size={18} /></div>
            <p className="dash-stat-label">Points de fidélité</p>
            <p className="dash-stat-value">{loyaltyPoints.toLocaleString('fr-FR')} pts</p>
            <div className="dash-loyalty-bar">
              <div className="dash-loyalty-fill" style={{ width: `${loyaltyProgressPercent}%` }} />
            </div>
            <p className="dash-stat-trend">
              Niveau {loyaltyLevel}
              {levelInfo.next ? ` · Prochain : ${levelInfo.next.toLocaleString('fr-FR')} pts` : ' · Niveau maximum'}
            </p>
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
              {transactions.length === 0 && (
                <li className="dash-transaction-row">
                  <span className="dash-transaction-info">Aucune transaction</span>
                </li>
              )}
              {transactions.slice(0, 5).map((tx) => (
                <li key={tx.id} className="dash-transaction-row">
                  <div className="dash-transaction-icon">
                    {tx.incoming ? <Download size={18} /> : <Send size={18} />}
                  </div>
                  <div className="dash-transaction-info">
                    <p className="dash-transaction-name">{tx.otherUserName || tx.description || tx.type}</p>
                    <p className="dash-transaction-type">{tx.incoming ? 'Reçu' : 'Envoyé'}</p>
                  </div>
                  <div className="dash-transaction-amount-block">
                    <p className={`dash-transaction-amount ${tx.incoming ? 'dash-stat-positive' : ''}`}>
                      {tx.incoming ? '+' : '-'}{Number(tx.amount || 0).toLocaleString('fr-FR')} MAD
                    </p>
                    <p className="dash-transaction-date">
                      {tx.transactionDate ? new Date(tx.transactionDate).toLocaleString('fr-FR') : '-'}
                    </p>
                  </div>
                </li>
              ))}
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
                <button type="button" className="dash-link-button" onClick={() => navigate('/epargne')}>
                  {mainSavingsGoal ? 'Modifier' : 'Créer'}
                </button>
              </div>
              {mainSavingsGoal ? (
                <>
                  <p className="dash-savings-name">{mainSavingsGoal.name}</p>
                  <p className="dash-savings-amount">
                    {savingsCurrent.toLocaleString('fr-FR')} <span>/ {savingsTarget.toLocaleString('fr-FR')} MAD</span>
                  </p>
                  <div className="dash-savings-track">
                    <div className="dash-savings-fill" style={{ width: `${savingsPercent}%` }} />
                  </div>
                  <p className="dash-savings-percent">{savingsPercent}% de l'objectif atteint</p>
                </>
              ) : (
                <p className="dash-savings-percent">Aucun objectif d'épargne pour le moment</p>
              )}
            </div>
          </div>
        </section>

        {/* Tip banner */}
        <section className="dash-tip-banner">
          <Sparkles size={20} className="dash-tip-icon" />
          <div>
            <p className="dash-tip-title">Conseil du jour</p>
            <p className="dash-tip-text">
              Pensez à suivre régulièrement vos dépenses pour mieux gérer votre budget.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}