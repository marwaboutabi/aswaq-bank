import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, ShoppingCart, CreditCard, Truck,  User, Settings,
   LogOut, Search, Bell, ChevronDown, ShoppingBag, AlertTriangle,
  CheckCircle, Wallet, Plus, Building2,Bot,Layers
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './AccueilFournisseur.css';

const STATS = [
  {
    key: 'ca',
    icon: Wallet,
    tone: 'green',
    label: "Chiffre d'affaires",
    value: '245 800,00 MAD',
    sub: '+ 12% vs mois dernier',
    trendUp: true,
  },
  {
    key: 'commandes',
    icon: ShoppingBag,
    tone: 'blue',
    label: 'Commandes reçues',
    value: '152',
    sub: '+ 18 aujourd\u2019hui',
    trendUp: true,
  },
  {
    key: 'catalogue',
    icon: Package,
    tone: 'orange',
    label: 'Produits en catalogue',
    value: '87',
    sub: '+ 3 nouveaux produits',
    trendUp: true,
  },
  {
    key: 'rupture',
    icon: AlertTriangle,
    tone: 'purple',
    label: 'Produits en rupture',
    value: '5',
    sub: '- 2 vs hier',
    trendDown: true,
  },
  {
    key: 'preparer',
    icon: Truck,
    tone: 'cyan',
    label: 'Commandes à préparer',
    value: '12',
    sub: 'En attente',
  },
  {
    key: 'livrees',
    icon: CheckCircle,
    tone: 'green',
    label: 'Livraisons terminées',
    value: '128',
    sub: '+ 16 vs hier',
    trendUp: true,
  },
];

const ORDERS = [
  { id: 'CMD-1025', client: 'Épicerie Atlas', total: 2500, date: 'Aujourd\u2019hui', status: 'En attente', tone: 'orange' },
  { id: 'CMD-1024', client: 'Market Plus', total: 1300, date: 'Aujourd\u2019hui', status: 'En préparation', tone: 'blue' },
  { id: 'CMD-1023', client: 'Bio Shop', total: 950, date: 'Hier', status: 'Expédiée', tone: 'purple' },
  { id: 'CMD-1022', client: 'Alimentation Nour', total: 3600, date: 'Hier', status: 'Livrée', tone: 'green' },
  { id: 'CMD-1021', client: 'Super Marché Al Amal', total: 1750, date: '25 Juil 2026', status: 'Livrée', tone: 'green' },
];



const RECENT_ACTIVITY = [
  { title: 'Commande CMD-1024 acceptée', time: 'Il y a 15 min', icon: CheckCircle, tone: 'green' },
  { title: 'Commande CMD-1021 expédiée', time: 'Il y a 45 min', icon: Truck, tone: 'blue' },
  { title: 'Paiement reçu de la commande CMD-1019', time: 'Il y a 1 heure', icon: CreditCard, tone: 'purple' },
  { title: 'Nouveau produit ajouté : Riz Basmati 1kg', time: 'Il y a 2 heures', icon: Package, tone: 'orange' },
  { title: 'Commande CMD-1020 livrée', time: 'Il y a 3 heures', icon: Truck, tone: 'green' },
];

const CATEGORY_SALES = [
  { label: 'Épicerie', percent: 40, amount: 98320, color: '#1d4fd8' },
  { label: 'Boissons', percent: 25, amount: 61450, color: '#0ea5e9' },
  { label: 'Produits frais', percent: 15, amount: 36870, color: '#f59e0b' },
  { label: 'Hygiène & Entretien', percent: 10, amount: 24580, color: '#8b5cf6' },
  { label: 'Autres', percent: 10, amount: 24580, color: '#64748b' },
];

const REVENUE_TREND = [
  { label: '21 Juil.', value: 20000 },
  { label: '22 Juil.', value: 35000 },
  { label: '23 Juil.', value: 30000 },
  { label: '24 Juil.', value: 42000 },
  { label: '25 Juil.', value: 38000 },
  { label: '26 Juil.', value: 52000 },
  { label: '27 Juil.', value: 70000, peak: true },
];

const QUICK_ACTIONS = [
  { label: 'Ajouter un produit', icon: Plus, tone: 'green', to: '/produits-fournisseur?mode=add' },
  { label: 'Voir les commandes', icon: ShoppingBag, tone: 'blue', to: '/commandes-fournisseur' },
  { label: 'Paiements reçus', icon: CreditCard, tone: 'purple', to: '/paiements-fournisseur' },
  { label: 'Gérer les livraisons', icon: Truck, tone: 'orange', to: '/livraisons-fournisseur' },
];

function DonutChart({ data, total }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    
    <svg viewBox="0 0 160 160" className="four-donut-svg">
        
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
      <text x="80" y="76" textAnchor="middle" className="four-donut-total">
        {total.toLocaleString('fr-FR')}
      </text>
      <text x="80" y="94" textAnchor="middle" className="four-donut-currency">MAD</text>
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
    <div className="four-trend-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} className="four-trend-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fourRevenueTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d4fd8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1d4fd8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#fourRevenueTrendFill)" stroke="none" />
        <path d={linePath} fill="none" stroke="#1d4fd8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1={peak.x} y1={peak.y} x2={peak.x} y2={height - padding} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx={peak.x} cy={peak.y} r="5" fill="#1d4fd8" stroke="white" strokeWidth="2" />
      </svg>

      <div
        className="four-trend-tooltip"
        style={{ left: `${(peak.x / width) * 100}%`, top: `${(peak.y / height) * 100}%` }}
      >
        <span className="four-trend-tooltip-value">{peak.value.toLocaleString('fr-FR')} MAD</span>
        <span className="four-trend-tooltip-date">{peak.label} 2026</span>
      </div>

      <div className="four-trend-labels">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

export default function AccueilFournisseur() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State pour stocker les informations de l'utilisateur connecté
  const [user, setUser] = useState(null);

  // Chargement du profil utilisateur au montage du composant
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
            // Si pas de token, on pourrait rediriger vers le login, mais ici on reste silencieux
            return;
        }

        const response = await fetch('http://localhost:8080/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Impossible de récupérer le profil');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Erreur récupération utilisateur:', error);
      }
    };

    loadUser();
  }, []);

  const totalCategorySales = CATEGORY_SALES.reduce((sum, c) => sum + c.amount, 0);

  // Helper pour générer les initiales si l'utilisateur est chargé
  const getInitials = () => {
    if (!user) return 'MB'; // Fallback par défaut
    const prenom = user.prenom || user.firstName || '';
    const nom = user.nom || user.lastName || '';
    const firstLetter = prenom.charAt(0).toUpperCase();
    const lastLetter = nom.charAt(0).toUpperCase();
    return `${firstLetter}${lastLetter}` || 'U';
  };

  const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', to: '/accueil-fournisseur' , active: true},
    { icon: Package, label: 'Produits', to: '/produits-fournisseur' },
    { icon: ShoppingCart, label: 'Commandes reçues', to: '/commandes-fournisseur' },
    { icon: CreditCard, label: 'Paiements', to: '/paiements-fournisseur' },
    { icon: Truck, label: 'Livraisons', to: '/livraisons-fournisseur' },
   { icon: Bell, label: 'Notifications', to: '/notifications-fournisseur' },
    { icon: Bot, label: 'Assistant IA', to: '/assistant-fournisseur' },
    { icon: User, label: 'Profil & Paramètres', to: '/profil-fournisseur' },

  ];

  return (
    <div className="four-layout">
      {/* Sidebar */}
      <aside className="four-sidebar">
        <div className="acc-sidebar-logo">
          <Logo size={100} className="mb-6" logo-white />
        </div>

        <p className="four-sidebar-section">
          <Building2 size={13} />
          FOURNISSEUR
        </p>

        <nav className="four-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to || '#'}
                state={location.state}
                className={`four-nav-item ${item.active ? 'four-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        

        <Link to="/" className="four-logout">
          <LogOut size={18} />
          Se déconnecter
        </Link>
      </aside>

      {/* Main content */}
      <main className="four-main">
        <header className="four-topbar">
          <div>
            {/* Affichage dynamique du prénom */}
            <h1 className="four-greeting">
              Bonjour, {user?.prenom || user?.firstName || 'Fournisseur'} 👋
            </h1>
            <p className="four-greeting-sub">Voici un aperçu de votre activité fournisseur.</p>
          </div>

          <div className="four-topbar-actions">
            <div className="four-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <button
              type="button"
              className="four-icon-button"
              onClick={() => navigate('/notifications-fournisseur')}
            >
              <Bell size={18} />
              <span className="four-badge">3</span>
            </button>
            <div className="four-user-chip">
              {/* Avatar avec initiales dynamiques */}
              <div className="four-user-avatar">{getInitials()}</div>
              <div className="four-user-info">
                {/* Affichage dynamique Nom Prénom */}
                <span className="four-user-name">
                  {user
                    ? `${user.prenom || user.firstName || ''} ${user.nom || user.lastName || ''}`.trim()
                    : 'Fournisseur'}
                </span>
                <span className="four-user-role">Fournisseur</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Row 1 — 6 stat cards */}
        <section className="four-stats-row">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div className="four-stat-card" key={s.key}>
                <div className={`four-stat-icon four-stat-icon-${s.tone}`}>
                  <Icon size={18} />
                </div>
                <div className="four-stat-label">{s.label}</div>
                <p className="four-stat-value">{s.value}</p>
                <p className={`four-stat-sub ${s.trendUp ? 'four-stat-sub-up' : ''} ${s.trendDown ? 'four-stat-sub-down' : ''}`}>
                  {s.sub}
                  {s.trendUp && ' ↗'}
                  {s.trendDown && ' ↘'}
                </p>
              </div>
            );
          })}
        </section>
{/* Actions rapides - Section visible */}
<section className="four-quick-actions-section">
  <div className="four-panel">
    <div className="four-panel-header">
      <h3>Actions rapides</h3>
    </div>
    <div className="four-quick-actions-grid">
      {QUICK_ACTIONS.map((a) => {
        const Icon = a.icon;
        return (
          <Link 
            to={a.to}
            className={`four-quick-action-card four-quick-action-card-${a.tone}`} 
            key={a.label}
          >
            <span className="four-quick-action-card-icon">
              <Icon size={20} />
            </span>
            <span className="four-quick-action-card-label">{a.label}</span>
          </Link>
        );
      })}
    </div>
  </div>
</section>
        {/* Row 2 — chart / orders / low stock */}
        <section className="four-middle-row">
          <div className="four-panel four-chart-panel">
            <div className="four-panel-header">
              <h3>Évolution du chiffre d'affaires</h3>
              <select className="four-range-select" defaultValue="7">
                <option value="7">7 derniers jours</option>
                <option value="30">30 derniers jours</option>
                <option value="90">90 derniers jours</option>
              </select>
            </div>
            <SalesTrendChart data={REVENUE_TREND} />
          </div>

          <div className="four-panel">
            <div className="four-panel-header">
              <h3>Dernières commandes reçues</h3>
              <button type="button" className="four-link-button">Voir tout</button>
            </div>
            <div className="four-orders-table">
              <div className="four-orders-head">
                <span>Commande</span>
                <span>Commerçant</span>
                <span>Total</span>
                <span>Date</span>
                <span>Statut</span>
              </div>
              <ul className="four-orders-body">
                {ORDERS.map((o) => (
                  <li className="four-orders-row" key={o.id}>
                    <span className="four-orders-id">{o.id}</span>
                    <span className="four-orders-client">{o.client}</span>
                    <span className="four-orders-total">{o.total.toLocaleString('fr-FR')},00 MAD</span>
                    <span className="four-orders-date">{o.date}</span>
                    <span className={`four-badge-pill four-badge-pill-${o.tone}`}>{o.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

  
        </section>

        {/* Row 3 — activity / donut / quick actions */}
  <section className="four-bottom-row">
  <div className="four-panel">
    <div className="four-panel-header">
      <h3>Activité récente</h3>
      <button type="button" className="four-link-button">Voir tout</button>
    </div>
    <ul className="four-timeline-list">
      {RECENT_ACTIVITY.map((a, i) => {
        const Icon = a.icon;
        return (
          <li className="four-timeline-row" key={a.title}>
            <span className={`four-timeline-icon four-timeline-icon-${a.tone}`}>
              <Icon size={15} />
            </span>
            <div className="four-timeline-info">
              <p className="four-timeline-title">{a.title}</p>
              <p className="four-timeline-time">{a.time}</p>
            </div>
            {i !== RECENT_ACTIVITY.length - 1 && <span className="four-timeline-connector" />}
          </li>
        );
      })}
    </ul>
  </div>

  <div className="four-panel">
    <div className="four-panel-header">
      <h3>Répartition des ventes par catégorie</h3>
      <button type="button" className="four-link-button">Voir tout</button>
    </div>
    <div className="four-donut-wrapper">
      <DonutChart data={CATEGORY_SALES} total={totalCategorySales} />
      <ul className="four-legend">
        {CATEGORY_SALES.map((c) => (
          <li key={c.label} className="four-legend-row">
            <span className="four-legend-dot" style={{ background: c.color }} />
            <span className="four-legend-label">{c.label}</span>
            <span className="four-legend-percent">{c.percent}%</span>
            <span className="four-legend-amount">{c.amount.toLocaleString('fr-FR')} MAD</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</section>
      </main>
      
    </div>
  );
}