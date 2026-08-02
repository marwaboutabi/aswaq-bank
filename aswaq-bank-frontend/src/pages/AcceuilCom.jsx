import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, Boxes, ArrowLeftRight, Users, Star, Bot, LogOut,
  Search, Bell, ChevronDown, Eye, Wallet, ShoppingCart, TrendingUp,
  QrCode, Send, Download, User, X, ShoppingBag,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './AcceuilCom.css';

const STATS = [
  {
    key: 'solde',
    icon: Wallet,
    tone: 'green',
    label: 'Solde disponible',
    value: '28 450,00 MAD',
    sub: 'Compte principal •••• 4589',
    withEye: true,
  },
  {
    key: 'produits',
    icon: Package,
    tone: 'blue',
    label: 'Produits',
    value: '156',
    sub: '+ 12 ce mois',
    trendUp: true,
  },
  {
    key: 'ventes',
    icon: ShoppingCart,
    tone: 'orange',
    label: 'Ventes ce mois',
    value: '324',
    sub: '+ 18% vs mois dernier',
    trendUp: true,
  },
  {
    key: 'points',
    icon: Star,
    tone: 'purple',
    label: 'Points distribués',
    value: '2 150 pts',
    sub: '+ 210 pts ce mois',
    trendUp: true,
  },
  {
    key: 'ca',
    icon: TrendingUp,
    tone: 'teal',
    label: "Chiffre d'affaires",
    value: '45 780,00 MAD',
    sub: '+ 15% vs mois dernier',
    trendUp: true,
  },
];

const LOW_STOCK = [
  { name: 'Café Moulu 250g', current: 5, min: 10, icon: '☕' },
  { name: 'Sucre Blanc 1kg', current: 7, min: 15, icon: '🍚' },
  { name: "Huile d'Olive 1L", current: 3, min: 8, icon: '🫒' },
  { name: 'Thé Vert 100g', current: 4, min: 10, icon: '🍵' },
];

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

const TRANSACTIONS = [
  { id: 1, name: 'Paiement QR - Client', type: 'Reçu', amount: 250, date: '18 Juil 2026 - 14:30', icon: QrCode, tone: 'green' },
  { id: 2, name: 'Virement vers compte', type: 'Envoyé', amount: -1500, date: '18 Juil 2026 - 11:20', icon: Send, tone: 'blue' },
  { id: 3, name: 'Achat fournisseur', type: 'Dépense', amount: -850, date: '17 Juil 2026 - 16:45', icon: ShoppingCart, tone: 'orange' },
  { id: 4, name: 'Paiement QR - Client', type: 'Reçu', amount: 450, date: '17 Juil 2026 - 15:10', icon: QrCode, tone: 'green' },
  { id: 5, name: 'Virement reçu', type: 'Reçu', amount: 2000, date: '17 Juil 2026 - 10:05', icon: Download, tone: 'blue' },
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
    { from: 'ia', text: "Bonjour Ahmed 👋 Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?" },
  ]);
  const [input, setInput] = useState('');

  const totalCategorySales = CATEGORY_SALES.reduce((sum, c) => sum + c.amount, 0);

  const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', active: true, to: '/acceuil-com' },
    { icon: Package, label: 'Produits', to: '/produits' },
    { icon: Boxes, label: 'Stock', to: '/stock' },
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
            <h1 className="acc-greeting">Bonjour, Ahmed 👋</h1>
            <p className="acc-greeting-sub">Voici un aperçu de votre activité commerciale.</p>
          </div>

          <div className="acc-topbar-actions">
            <div className="acc-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <button
  type="button"
  className="acc-icon-button"
  onClick={() => navigate('/notifications-com')}
>
              <Bell size={18} />
              <span className="acc-badge">3</span>
            </button>
  <div className="acc-user-chip">
  <div className="acc-user-avatar">MB</div>
  <div className="acc-user-info">
    <span className="acc-user-name">Marwa Boutabi</span>
    <span className="acc-user-role">Commerçant</span>
  </div>
  <ChevronDown size={16} />
</div>
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
              {LOW_STOCK.map((p) => (
                <li className="acc-stock-row" key={p.name}>
                  <span className="acc-stock-emoji">{p.icon}</span>
                  <div className="acc-stock-info">
                    <span className="acc-stock-name">{p.name}</span>
                    <span className="acc-stock-current">Stock actuel : {p.current}</span>
                  </div>
                  <span className="acc-stock-min">Minimum : {p.min}</span>
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
              {TRANSACTIONS.map((tx) => {
                const Icon = tx.icon;
                return (
                  <li key={tx.id} className="acc-transaction-row">
                    <span className={`acc-transaction-icon acc-transaction-icon-${tx.tone}`}>
                      <Icon size={16} />
                    </span>
                    <div className="acc-transaction-info">
                      <p className="acc-transaction-name">{tx.name}</p>
                      <p className={`acc-transaction-status status-${tx.amount > 0 ? 'in' : 'out'}`}>{tx.type}</p>
                    </div>
                    <div className="acc-transaction-amount-block">
                      <p className={`acc-transaction-amount ${tx.amount > 0 ? 'amount-positive' : 'amount-negative'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('fr-FR')},00 MAD
                      </p>
                      <p className="acc-transaction-date">{tx.date}</p>
                    </div>
                  </li>
                );
              })}
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