import React, { useState } from 'react';
import { Link, useLocation, useNavigate  } from 'react-router-dom';
import {
  Home, ArrowLeftRight, ShoppingBag, Receipt, Star, PiggyBank, PieChart,
  Bell, Bot, User, LogOut, ChevronDown, Gift, Clock, Store,
  ShoppingCart, QrCode, RotateCcw, Coffee, Truck, Percent, Gem, Sparkles,
  Smartphone, PartyPopper, Calculator,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './Fidelite.css';
import './DashboardClient.css';

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

const LEVELS = [
  { name: 'Bronze', threshold: 0 },
  { name: 'Argent', threshold: 500 },
  { name: 'Or', threshold: 1500 },
  { name: 'Platine', threshold: 3000 },
];

const ACTIVITIES = [
  { id: 1, icon: ShoppingCart, name: 'Achat chez Aswaq Market', date: '20 juillet 2026 · 14:35', points: 45, type: 'earned' },
  { id: 2, icon: QrCode, name: 'Paiement QR Code', date: '19 juillet 2026 · 11:20', points: 20, type: 'earned' },
  { id: 3, icon: RotateCcw, name: 'Utilisation de points', date: '18 juillet 2026 · 16:10', points: 100, type: 'spent' },
  { id: 4, icon: Coffee, name: 'Achat chez Café Central', date: '15 juillet 2026 · 09:45', points: 35, type: 'earned' },
];

const REWARDS = [
  { id: 1, icon: Gift, title: '50 MAD de réduction', cost: 500, tone: 'green' },
  { id: 2, icon: Truck, title: 'Livraison gratuite', cost: 1000, tone: 'orange' },
  { id: 3, icon: Percent, title: '10% de réduction', cost: 1500, tone: 'red' },
];

const PARTNERS = [
  { id: 1, icon: ShoppingCart, name: 'Aswaq Market', category: 'Supermarché', pointsInfo: '1 pt / 10 MAD' },
  { id: 2, icon: Coffee, name: 'Café Central', category: 'Café & restauration', pointsInfo: '1 pt / 5 MAD' },
  { id: 3, icon: Store, name: 'Boutique Amal', category: 'Commerce local', pointsInfo: '1 pt / 10 MAD' },
];

export default function Fidelite() {
  const location = useLocation();
  const navigate = useNavigate();
  const [points] = useState(1250);
  const [activeTab, setActiveTab] = useState(null);

  const currentLevelIndex = [...LEVELS].reverse().findIndex((l) => points >= l.threshold);
  const currentLevel = LEVELS[LEVELS.length - 1 - currentLevelIndex];
  const nextLevel = LEVELS[LEVELS.length - currentLevelIndex];
  const pointsRemaining = nextLevel ? nextLevel.threshold - points : 0;
  const progressPercent = nextLevel
    ? Math.min(100, ((points - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100)
    : 100;

  const estimatedValue = Math.round(points * 0.1);

  const ACTIONS = [
    { key: 'gagner', icon: Star, title: 'Gagner des points', desc: 'Découvrez comment' },
    { key: 'echanger', icon: Gift, title: 'Échanger mes points', desc: 'Voir les récompenses' },
    { key: 'historique', icon: Clock, title: 'Historique', desc: 'Voir mes mouvements' },
    { key: 'partenaires', icon: Store, title: 'Partenaires', desc: 'Où gagner des points' },
  ];

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
            const isActive = item.to === '/fidelite';
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
        <header className="dash-topbar">
          <div>
            <h1 className="dash-greeting"><Star size={22} className="fid-title-star" /> Points de fidélité</h1>
            <p className="dash-greeting-sub">Gagnez des points, progressez et profitez de récompenses exclusives.</p>
          </div>
          <div className="dash-topbar-actions">
           <button 
  type="button" 
  className="dash-icon-button"
  onClick={() => navigate('/notifications')}
>
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

        {/* ===== Carte principale : points + niveau ===== */}
        <div className="fid-hero-card">
          <div className="fid-hero-left">
            <span className="fid-hero-label">Mes points actuels</span>
            <span className="fid-hero-amount">{points.toLocaleString('fr-FR')} <small>pts</small></span>
            <span className="fid-hero-value">≈ {estimatedValue} MAD de réductions</span>
          </div>

          <div className="fid-hero-center">
            <span className="fid-hero-label">Niveau actuel</span>
            <div className="fid-level-badge">
              <Gem size={15} /> {currentLevel.name}
            </div>
          </div>

          <div className="fid-hero-right">
            <Sparkles size={14} className="fid-hero-sparkle" style={{ top: '15%', right: '22%' }} />
            <Sparkles size={10} className="fid-hero-sparkle" style={{ top: '55%', right: '30%' }} />
            <Sparkles size={12} className="fid-hero-sparkle" style={{ top: '75%', right: '15%' }} />
            <div className="fid-hero-illustration">
              <Gift size={60} strokeWidth={1.3} />
            </div>
          </div>
        </div>

        {/* ===== Barre de progression ===== */}
        {nextLevel && (
          <div className="fid-progress-card">
            <div className="fid-progress-header">
              <span className="fid-progress-title">Vous êtes proche du niveau {nextLevel.name} !</span>
              <span className="fid-progress-target">{nextLevel.threshold.toLocaleString('fr-FR')} pts</span>
            </div>
            <div className="fid-progress-track">
              <div className="fid-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="fid-progress-footer">
              <span className="fid-progress-remaining">
                Il vous reste <strong>{pointsRemaining.toLocaleString('fr-FR')} points</strong> pour atteindre le niveau {nextLevel.name}.
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
          </div>
        )}

        {/* ===== 4 cartes d'action ===== */}
        <div className="fid-actions-grid">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.key}
                type="button"
                className={`fid-action-card ${activeTab === action.key ? 'fid-action-card-active' : ''}`}
                onClick={() => setActiveTab(activeTab === action.key ? null : action.key)}
              >
                <div className="fid-action-icon"><Icon size={18} /></div>
                <div className="fid-action-text">
                  <p className="fid-action-title">{action.title}</p>
                  <p className="fid-action-desc">{action.desc}</p>
                </div>
                <span className="fid-action-arrow">→</span>
              </button>
            );
          })}
        </div>

        {/* ===== Panneau : Comment gagner des points ? ===== */}
        {activeTab === 'gagner' && (
          <div className="fid-info-panel">
            <h3>Comment gagner des points ?</h3>
            <p className="fid-info-intro">
              Vous cumulez automatiquement des points lorsque vous effectuez des achats chez les
              commerçants partenaires Aswaq. Les points sont calculés selon le montant de vos achats
              et les offres promotionnelles en cours.
            </p>

            <div className="fid-rule-list">
              <div className="fid-rule-row">
                <div className="fid-rule-icon"><ShoppingBag size={18} /></div>
                <span>Achats chez les commerçants partenaires Aswaq</span>
              </div>
              <div className="fid-rule-row">
                <div className="fid-rule-icon"><Smartphone size={18} /></div>
                <span>Paiements via QR Code Aswaq</span>
              </div>
              <div className="fid-rule-row">
                <div className="fid-rule-icon"><PartyPopper size={18} /></div>
                <span>Offres promotionnelles avec points bonus</span>
              </div>
            </div>

            <div className="fid-calc-highlight">
              <Calculator size={18} />
              <span><strong>Règle de calcul :</strong> 1 point est gagné pour chaque tranche de 10 MAD dépensés.</span>
            </div>
          </div>
        )}

        {/* ===== Panneau : Partenaires ===== */}
        {activeTab === 'partenaires' && (
          <div className="fid-info-panel">
            <h3>Commerçants partenaires</h3>
            <div className="fid-partners-list">
              {PARTNERS.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.id} className="fid-partner-row">
                    <div className="fid-partner-icon"><Icon size={18} /></div>
                    <div className="fid-partner-info">
                      <p className="fid-partner-name">{p.name}</p>
                      <p className="fid-partner-category">{p.category}</p>
                    </div>
                    <span className="fid-partner-points">{p.pointsInfo}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== Deux colonnes : Activités + Récompenses populaires ===== */}
        <div className="fid-bottom-grid">
          <div className="fid-panel">
            <div className="fid-panel-header">
              <h2 className="fid-panel-title">Dernières activités</h2>
            </div>
            <div className="fid-activity-list">
              {ACTIVITIES.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.id} className="fid-activity-row">
                    <div className="fid-activity-icon"><Icon size={18} /></div>
                    <div className="fid-activity-info">
                      <p className="fid-activity-name">{a.name}</p>
                      <p className="fid-activity-date">{a.date}</p>
                    </div>
                    <span className={`fid-activity-points ${a.type === 'earned' ? 'fid-points-earned' : 'fid-points-spent'}`}>
                      {a.type === 'earned' ? '+' : '-'}{a.points} pts
                    </span>
                  </div>
                );
              })}
            </div>
            <Link to="/fidelite" className="fid-see-all">
              Voir tout l'historique →
            </Link>
          </div>

          <div className="fid-panel">
            <div className="fid-panel-header fid-panel-header-row">
              <h2 className="fid-panel-title">Récompenses populaires</h2>
              <button type="button" className="fid-header-action-btn">
                Échanger mes points
              </button>
            </div>
            <div className="fid-popular-list">
              {REWARDS.map((r) => {
                const Icon = r.icon;
                const canRedeem = points >= r.cost;
                const missing = r.cost - points;
                return (
                  <div key={r.id} className="fid-popular-row">
                    <div className={`fid-popular-icon fid-tone-${r.tone}`}><Icon size={18} /></div>
                    <div className="fid-popular-info">
                      <p className="fid-popular-name">{r.title}</p>
                      <p className="fid-popular-desc">Coût : {r.cost.toLocaleString('fr-FR')} pts</p>
                    </div>
                    {canRedeem ? (
                      <button type="button" className="fid-redeem-btn">Échanger</button>
                    ) : (
                      <span className="fid-missing-points">
                        Il vous manque {missing.toLocaleString('fr-FR')} pts
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <Link to="/fidelite" className="fid-see-all">
              Voir toutes les récompenses →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}