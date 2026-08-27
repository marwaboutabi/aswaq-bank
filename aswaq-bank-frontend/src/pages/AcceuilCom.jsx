import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, Boxes, ArrowLeftRight, Users, Star, Bot, LogOut,
  Search, Bell, ChevronDown, Eye, Wallet, ShoppingCart, TrendingUp,
  QrCode, Send, Download, User, X, ShoppingBag,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './AcceuilCom.css';
import UserHeader from '../components/UserHeader/UserHeader';
import NotificationBell from '../components/NotificationBell/NotificationBell';

const LOW_STOCK_THRESHOLD = 5; // aligné avec le seuil backend (TransactionServiceImpl)

const NOTIFICATIONS = [
  {
    title: 'Nouvelle commande fournisseur',
    detail: 'Commande #CMD-1256 reçue',
    time: 'Il y a 1 heure',
    icon: ShoppingBag,
    tone: 'green',
  },
  {
    title: 'Stock faible',
    detail: '4 produits sont en stock faible',
    time: 'Il y a 1 heure',
    icon: Boxes,
    tone: 'orange',
  },
  {
    title: 'Paiement reçu',
    detail: '+250,00 MAD via QR Code',
    time: 'Il y a 2 heures',
    icon: QrCode,
    tone: 'purple',
  },
  {
    title: 'Points de fidélité',
    detail: '120 pts distribués ce jour',
    time: 'Il y a 3 heures',
    icon: Star,
    tone: 'gold',
  },
];

const CATEGORY_SALES = [
  { label: 'Boissons', percent: 35, amount: 16023, color: '#1d4fd8' },
  { label: 'Épicerie', percent: 25, amount: 11445, color: '#f59e0b' },
  { label: 'Produits frais', percent: 20, amount: 9156, color: '#0ea5e9' },
  { label: 'Hygiène', percent: 10, amount: 4578, color: '#8b5cf6' },
  { label: 'Autres', percent: 10, amount: 4578, color: '#64748b' },
];

const SALES_TREND = [
  { label: '18 Juin', value: 3200 },
  { label: '23 Juin', value: 3600 },
  { label: '28 Juin', value: 4800 },
  { label: '03 Juil.', value: 5400 },
  { label: '08 Juil.', value: 5900 },
  { label: '12 Juil.', value: 7250, peak: true },
  { label: '13 Juil.', value: 6300 },
  { label: '18 Juil.', value: 7800 },
];

function DonutChart({ data, total }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <svg viewBox="0 0 160 160" className="acc-donut-svg">
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
      <text x="80" y="76" textAnchor="middle" className="acc-donut-total">
        {total.toLocaleString('fr-FR')}
      </text>
      <text x="80" y="94" textAnchor="middle" className="acc-donut-currency">MAD</text>
    </svg>
  );
}

function SalesTrendChart({ data }) {
  const width = 640;
  const height = 220;
  const padding = 20;
  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const step = (width - padding * 2) / (data.length - 1);

  const points = data.map((d, i) => {
    const x = padding + i * step;
    const y = height - padding - ((d.value - min) / (max - min || 1)) * (height - padding * 2);
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  const peak = points.find((p) => p.peak) || points[points.length - 1];

  return (
    <div className="acc-trend-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} className="acc-trend-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="accSalesTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d4fd8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1d4fd8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#accSalesTrendFill)" stroke="none" />
        <path d={linePath} fill="none" stroke="#1d4fd8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1={peak.x} y1={peak.y} x2={peak.x} y2={height - padding} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx={peak.x} cy={peak.y} r="5" fill="#1d4fd8" stroke="white" strokeWidth="2" />
      </svg>

      <div
        className="acc-trend-tooltip"
        style={{ left: `${(peak.x / width) * 100}%`, top: `${(peak.y / height) * 100}%` }}
      >
        <span className="acc-trend-tooltip-value">{peak.value.toLocaleString('fr-FR')} MAD</span>
        <span className="acc-trend-tooltip-date">{peak.label} 2026</span>
      </div>

      <div className="acc-trend-labels">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

export default function AcceuilCom() {
  const location = useLocation();
  const navigate = useNavigate();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'ia', text: "Bonjour 👋 Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?" },
  ]);
  const [input, setInput] = useState('');

  // States dynamiques
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [sales, setSales] = useState([]);
  const [loyaltyHistory, setLoyaltyHistory] = useState([]);
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

        const [userRes, accountRes, productsRes, transactionsRes, salesRes, loyaltyRes] = await Promise.all([
          fetch('http://localhost:8080/api/users/me', { headers }),
          fetch('http://localhost:8080/api/accounts/me', { headers }),
          fetch('http://localhost:8080/api/products', { headers }),
          fetch('http://localhost:8080/api/transactions/my', { headers }),
          fetch('http://localhost:8080/api/sales/merchant', { headers }),
          fetch('http://localhost:8080/api/loyalty/merchant/history', { headers }),
        ]);

        if (userRes.ok) setUser(await userRes.json());
        if (accountRes.ok) setAccount(await accountRes.json());

        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(Array.isArray(data) ? data : []);
        }

        if (transactionsRes.ok) {
          const data = await transactionsRes.json();
          setTransactions(Array.isArray(data) ? data : []);
        }

        if (salesRes.ok) {
          const data = await salesRes.json();
          setSales(Array.isArray(data) ? data : []);
        }

        if (loyaltyRes.ok) {
          const data = await loyaltyRes.json();
          setLoyaltyHistory(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Erreur récupération données dashboard commerçant:', error);
      } finally {
        setLoadingDashboard(false);
      }
    };

    loadDashboardData();
  }, []);

  // Calculs dynamiques
  const supplierBalanceRaw = Number(
    account?.balance ?? account?.solde ?? account?.availableBalance ?? 0
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const paidSales = sales.filter(s => String(s.status || '').toUpperCase() === 'PAID');

  const salesThisMonth = paidSales.filter(s => {
    if (!s.paidAt && !s.createdAt) return false;
    const d = new Date(s.paidAt || s.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalRevenue = paidSales.reduce((sum, s) => sum + Number(s.totalAmount || 0), 0);

  const pointsDistributed = loyaltyHistory
    .filter(t => String(t.type || '').toUpperCase() === 'EARNED')
    .reduce((sum, t) => sum + Number(t.points || 0), 0);

  const lowStockProducts = [...products]
    .filter(p => Number(p.stock ?? 0) <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => Number(a.stock ?? 0) - Number(b.stock ?? 0))
    .slice(0, 5);

  const STATS = [
    {
      key: 'solde',
      icon: Wallet,
      tone: 'green',
      label: 'Solde disponible',
      value: `${supplierBalanceRaw.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`,
      sub: 'Compte principal',
      withEye: true,
    },
    {
      key: 'produits',
      icon: Package,
      tone: 'blue',
      label: 'Produits',
      value: products.length.toLocaleString('fr-FR'),
      sub: 'Produits actifs',
    },
    {
      key: 'ventes',
      icon: ShoppingCart,
      tone: 'orange',
      label: 'Ventes ce mois',
      value: salesThisMonth.length.toLocaleString('fr-FR'),
      sub: 'Ce mois-ci',
      trendUp: salesThisMonth.length > 0,
    },
    {
      key: 'points',
      icon: Star,
      tone: 'purple',
      label: 'Points distribués',
      value: `${pointsDistributed.toLocaleString('fr-FR')} pts`,
      sub: 'Total distribué',
      trendUp: pointsDistributed > 0,
    },
    {
      key: 'ca',
      icon: TrendingUp,
      tone: 'teal',
      label: "Chiffre d'affaires",
      value: `${totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`,
      sub: 'Ventes payées',
      trendUp: totalRevenue > 0,
    },
  ];

  const totalCategorySales = CATEGORY_SALES.reduce((sum, c) => sum + c.amount, 0);

  const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', active: true, to: '/acceuil-com' },
    { icon: Package, label: 'Produits', to: '/produits' },
    { icon: ArrowLeftRight, label: 'Paiements & Transactions', to: '/transactions-commerce' },
    { icon: Users, label: 'Fournisseurs', to: '/fournisseurs' },
    { icon: Star, label: 'Fidélité & Tickets', to: '/fidelite-commerce' },
    { icon: Bell, label: 'Notifications', to: '/notifications-com' },
    { icon: Bot, label: 'Assistant IA', to: '/assistant-commerce' },
    { icon: User, label: 'Profil & Paramètres', to: '/parametres-commerce' },
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: 'ia', text: 'Je traite votre demande et je reviens vers vous avec une réponse détaillée.' },
      ]);
    }, 600);
  };

  if (loadingDashboard) {
    return (
      <div className="acc-layout">
        <main className="acc-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <p>Chargement du tableau de bord...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="acc-layout">
      {/* Sidebar */}
      <aside className="acc-sidebar">
        <div className="acc-sidebar-logo">
          <Logo size={100} className="mb-6" />
        </div>

        <nav className="acc-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to || '#'}
                state={location.state}
                className={`acc-nav-item ${item.active ? 'acc-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="acc-help-card">
          <div className="acc-help-icon">
            <Bot size={20} />
          </div>
          <p className="acc-help-title">Besoin d'aide ?</p>
          <p className="acc-help-text">Notre assistant IA est là pour vous aider</p>
          <button type="button" className="acc-help-button" onClick={() => setAssistantOpen(true)}>
            Discuter avec l'IA →
          </button>
        </div>

        <Link to="/" className="acc-logout">
          <LogOut size={18} />
          Déconnexion
        </Link>
      </aside>

      {/* Main content */}
      <main className="acc-main">
        <header className="acc-topbar">
          <div>
            <h1 className="acc-greeting">Bonjour, {user?.prenom || user?.firstName || 'Commerçant'} 👋</h1>
            <p className="acc-greeting-sub">Voici un aperçu de votre activité commerciale.</p>
          </div>

          <div className="acc-topbar-actions">
            
            <NotificationBell />
            <UserHeader />
          </div>
        </header>

        {/* Row 1 — 5 stat cards */}
        <section className="acc-stats-row">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div className="acc-stat-card" key={s.key}>
                <div className={`acc-stat-icon acc-stat-icon-${s.tone}`}>
                  <Icon size={18} />
                </div>
                <div className="acc-stat-label">
                  {s.label}
                  {s.withEye && <Eye size={13} className="acc-stat-eye" />}
                </div>
                <p className="acc-stat-value">{s.value}</p>
                <p className={`acc-stat-sub ${s.trendUp ? 'acc-stat-sub-up' : ''}`}>
                  {s.sub}
                  {s.trendUp && ' ↗'}
                </p>
              </div>
            );
          })}
        </section>

        {/* Row 2 — chart / stock / notifications */}
        <section className="acc-middle-row">
          <div className="acc-panel acc-chart-panel">
            <div className="acc-panel-header">
              <h3>Évolution des ventes</h3>
              <select className="acc-range-select" defaultValue="30">
                <option value="7">7 derniers jours</option>
                <option value="30">30 derniers jours</option>
                <option value="90">90 derniers jours</option>
              </select>
            </div>
            <SalesTrendChart data={SALES_TREND} />
          </div>

          <div className="acc-panel">
            <div className="acc-panel-header">
              <h3>Produits en stock faible</h3>
              <button type="button" className="acc-link-button">Voir tout</button>
            </div>
            <ul className="acc-stock-list">
              {lowStockProducts.length === 0 && (
                <li className="acc-stock-row">
                  <span className="acc-stock-info">Aucun produit en stock faible</span>
                </li>
              )}
              {lowStockProducts.map((p) => (
                <li className="acc-stock-row" key={p.id}>
                  <span className="acc-stock-emoji">📦</span>
                  <div className="acc-stock-info">
                    <span className="acc-stock-name">{p.name}</span>
                    <span className="acc-stock-current">Stock actuel : {p.stock ?? 0}</span>
                  </div>
                  <span className="acc-stock-min">Seuil : {LOW_STOCK_THRESHOLD}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="acc-panel">
            <div className="acc-panel-header">
              <h3>Notifications</h3>
              <button type="button" className="acc-link-button">Voir tout</button>
            </div>
            <ul className="acc-notif-list">
              {NOTIFICATIONS.map((n) => {
                const Icon = n.icon;
                return (
                  <li className="acc-notif-row" key={n.title}>
                    <span className={`acc-notif-icon acc-notif-icon-${n.tone}`}>
                      <Icon size={16} />
                    </span>
                    <div className="acc-notif-info">
                      <p className="acc-notif-title">{n.title}</p>
                      <p className="acc-notif-detail">{n.detail}</p>
                      <p className="acc-notif-time">{n.time}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Row 3 — transactions / category donut */}
        <section className="acc-bottom-row">
          <div className="acc-panel">
            <div className="acc-panel-header">
              <h3>Dernières transactions</h3>
              <button type="button" className="acc-link-button">Voir tout</button>
            </div>
            <ul className="acc-transaction-list">
              {transactions.length === 0 && (
                <li className="acc-transaction-row">
                  <span className="acc-transaction-info">Aucune transaction</span>
                </li>
              )}
              {transactions.slice(0, 5).map((tx) => (
                <li key={tx.id} className="acc-transaction-row">
                  <span className={`acc-transaction-icon acc-transaction-icon-${tx.incoming ? 'green' : 'orange'}`}>
                    {tx.incoming ? <Download size={16} /> : <Send size={16} />}
                  </span>
                  <div className="acc-transaction-info">
                    <p className="acc-transaction-name">{tx.otherUserName || tx.description || tx.type}</p>
                    <p className={`acc-transaction-status status-${tx.incoming ? 'in' : 'out'}`}>
                      {tx.incoming ? 'Reçu' : 'Envoyé'}
                    </p>
                  </div>
                  <div className="acc-transaction-amount-block">
                    <p className={`acc-transaction-amount ${tx.incoming ? 'amount-positive' : 'amount-negative'}`}>
                      {tx.incoming ? '+' : '-'}{Number(tx.amount || 0).toLocaleString('fr-FR')} MAD
                    </p>
                    <p className="acc-transaction-date">
                      {tx.transactionDate ? new Date(tx.transactionDate).toLocaleString('fr-FR') : '-'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="acc-panel">
            <div className="acc-panel-header">
              <h3>Répartition des ventes par catégorie</h3>
            </div>
            <div className="acc-donut-wrapper">
              <DonutChart data={CATEGORY_SALES} total={totalCategorySales} />
              <ul className="acc-legend">
                {CATEGORY_SALES.map((c) => (
                  <li key={c.label} className="acc-legend-row">
                    <span className="acc-legend-dot" style={{ background: c.color }} />
                    <span className="acc-legend-label">{c.label}</span>
                    <span className="acc-legend-percent">{c.percent}%</span>
                    <span className="acc-legend-amount">{c.amount.toLocaleString('fr-FR')} MAD</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Floating AI assistant launcher */}
      <button
        type="button"
        className="acc-assistant-fab"
        onClick={() => setAssistantOpen(true)}
        aria-label="Ouvrir l'assistant IA"
      >
        <Bot size={22} />
      </button>

      {assistantOpen && (
        <div className="acc-assistant-overlay" onClick={() => setAssistantOpen(false)}>
          <div className="acc-assistant-panel" onClick={(e) => e.stopPropagation()}>
            <div className="acc-assistant-header">
              <div className="acc-assistant-header-left">
                <div className="acc-assistant-avatar"><Bot size={18} /></div>
                <div>
                  <p className="acc-assistant-title">Assistant IA</p>
                  <p className="acc-assistant-subtitle">En ligne</p>
                </div>
              </div>
              <button type="button" className="acc-assistant-close" onClick={() => setAssistantOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="acc-assistant-body">
              {messages.map((m, i) => (
                <div key={i} className={`acc-assistant-bubble ${m.from === 'ia' ? 'bubble-ia' : 'bubble-user'}`}>
                  {m.text}
                </div>
              ))}
            </div>

            <div className="acc-assistant-input-row">
              <input
                className="acc-assistant-input"
                placeholder="Écrivez votre message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button type="button" className="acc-assistant-send" onClick={handleSend}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}