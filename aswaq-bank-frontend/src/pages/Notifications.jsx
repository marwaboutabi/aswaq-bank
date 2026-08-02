import React, { useState } from 'react';
import { Link, useLocation , useNavigate } from 'react-router-dom';
import {
  Home, ArrowLeftRight, Receipt, Star, PiggyBank, PieChart,
  Bell, Bot, User, LogOut, Search, ChevronDown, CheckCheck, ArrowRight, X,
  CreditCard, Download, Send, Shield, Bot as BotIcon, Target, TrendingUp,
  Calendar, AlertCircle,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './Notifications.css';
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

const FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'payment', label: 'Paiements' },
  { key: 'security', label: 'Sécurité' },
  { key: 'loyalty', label: 'Fidélité' },
  { key: 'ai', label: 'Assistant IA' },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'payment',
    icon: CreditCard,
    title: 'Paiement effectué',
    description: 'Paiement de 250 MAD chez Carrefour.',
    date: "Aujourd'hui",
    time: '14:35',
    read: false,
  },
  {
    id: 2,
    type: 'loyalty',
    icon: Star,
    title: 'Points de fidélité',
    description: 'Vous avez gagné 25 points suite à votre dernier achat.',
    date: "Aujourd'hui",
    time: '14:36',
    read: false,
  },
  {
    id: 3,
    type: 'security',
    icon: Shield,
    title: 'Nouvelle connexion',
    description: 'Nouvelle connexion détectée sur votre compte depuis Casablanca.',
    date: 'Hier',
    time: '09:12',
    read: true,
  },
  {
    id: 4,
    type: 'ai',
    icon: BotIcon,
    title: "Conseil de l'Assistant IA",
    description: 'Vos dépenses en restauration ont augmenté de 15 % ce mois-ci.',
    date: 'Hier',
    time: '18:20',
    read: false,
    link: { label: "Voir l'analyse", to: '/depenses' },
  },
  {
    id: 5,
    type: 'payment',
    icon: Download,
    title: 'Argent reçu',
    description: 'Vous avez reçu 2 000 MAD de Ahmed Benali.',
    date: '19 juillet',
    time: '11:20',
    read: true,
  },
  {
    id: 6,
    type: 'payment',
    icon: Send,
    title: 'Argent envoyé',
    description: 'Virement de 500 MAD envoyé vers Sara El Fassi.',
    date: '18 juillet',
    time: '16:05',
    read: true,
  },
  {
    id: 7,
    type: 'loyalty',
    icon: Target,
    title: "Objectif d'épargne",
    description: 'Bravo ! Vous avez atteint 80 % de votre objectif Vacances.',
    date: '17 juillet',
    time: '10:00',
    read: true,
  },
  {
    id: 8,
    type: 'ai',
    icon: TrendingUp,
    title: 'Analyse intelligente',
    description: 'Vous pouvez économiser environ 400 MAD ce mois-ci.',
    date: '16 juillet',
    time: '08:30',
    read: true,
    link: { label: "Voir l'analyse", to: '/depenses' },
  },
];

const NOTIFICATION_DETAILS = {
  1: {
    fullDescription: 'Un paiement de 250,00 MAD a été effectué chez Carrefour Market - Casablanca.',
    location: 'Carrefour Market, Bd Zerktouni, Casablanca',
    cardUsed: 'Carte •••• 4589',
    category: 'Alimentation',
    balance: 'Solde après opération : 12 450,00 MAD',
  },
  2: {
    fullDescription: 'Félicitations ! Vous avez gagné 25 points de fidélité suite à votre achat.',
    totalPoints: '1 275 points',
    nextReward: 'Prochaine récompense : 1 500 points',
    progress: "85% vers le niveau Silver",
  },
  3: {
    fullDescription: 'Une nouvelle connexion a été détectée sur votre compte.',
    device: 'Chrome sur Windows',
    location: 'Casablanca, Maroc',
    ip: 'IP : 105.159.xx.xx',
    time: '19 juillet 2026 à 09:12',
  },
  4: {
    fullDescription: 'Notre analyse montre que vos dépenses en restauration ont augmenté de 15% ce mois-ci.',
    lastMonth: 'Dépenses le mois dernier : 320 MAD',
    thisMonth: 'Dépenses ce mois-ci : 487 MAD',
    difference: '+167 MAD (+15%)',
    advice: 'Conseil : Essayez de préparer vos repas à la maison 2 fois par semaine.',
  },
  5: {
    fullDescription: 'Vous avez reçu un virement de 2 000,00 MAD de Ahmed Benali.',
    sender: 'Ahmed Benali - CIH Bank',
    reference: 'Virement instantané',
    receivedAt: '19 juillet 2026 à 11:20',
    balance: 'Solde après réception : 12 700,00 MAD',
  },
  6: {
    fullDescription: 'Vous avez envoyé un virement de 500,00 MAD vers Sara El Fassi.',
    recipient: 'Sara El Fassi - Attijariwafa Bank',
    reference: 'TXN-2026-0718-001',
    sentAt: '18 juillet 2026 à 16:05',
    balance: 'Solde après envoi : 11 085,00 MAD',
  },
  7: {
    fullDescription: "Bravo ! Vous avez atteint 80% de votre objectif d'épargne \"Vacances d'été\".",
    saved: '4 000 MAD',
    target: '5 000 MAD',
    remaining: '1 000 MAD restants',
    deadline: 'Date cible : 30 juin 2027',
  },
  8: {
    fullDescription: 'Selon notre analyse, vous pouvez économiser environ 400 MAD supplémentaires ce mois-ci.',
    currentSpending: 'Dépenses actuelles : 3 250 MAD',
    potentialSavings: 'Économies potentielles : 400 MAD',
    tips: 'Conseils : Réduisez les sorties restaurants de 10% et optimisez vos abonnements.',
  },
};

export default function Notifications() {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedNotif, setSelectedNotif] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const openNotification = (notif) => {
    setSelectedNotif(notif);
    markAsRead(notif.id);
  };

  const closeNotification = () => {
    setSelectedNotif(null);
  };

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="acc-sidebar-logo">
          <Logo size={100} className="mb-6"  />
        </div>
        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.to === '/notifications';
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
            <h1 className="dash-greeting">Notifications</h1>
            <p className="dash-greeting-sub">Restez informé de toutes les activités de votre compte.</p>
          </div>
          <div className="dash-topbar-actions">
            <div className="dash-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
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

        {/* Actions bar */}
        <div className="notif-actions-bar">
          <div className="notif-filters">
            {FILTERS.map((filter) => (
              <button
                key={filter.key}
                type="button"
                className={`notif-filter-btn ${activeFilter === filter.key ? 'notif-filter-active' : ''}`}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button type="button" className="notif-mark-all" onClick={markAllAsRead}>
              <CheckCheck size={16} />
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="notif-list">
          {filteredNotifications.length === 0 ? (
            <div className="notif-empty">
              <Bell size={40} />
              <p>Aucune notification pour ce filtre.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  className={`notif-card ${!notif.read ? 'notif-unread' : ''}`}
                  onClick={() => openNotification(notif)}
                >
                  <div className={`notif-icon notif-icon-${notif.type}`}>
                    <Icon size={18} />
                  </div>
                  <div className="notif-content">
                    <div className="notif-header">
                      <p className="notif-title">{notif.title}</p>
                      {!notif.read && <span className="notif-dot" />}
                    </div>
                    <p className="notif-description">{notif.description}</p>
                    <div className="notif-footer">
                      <span className="notif-date">
                        {notif.date} • {notif.time}
                      </span>
                      {notif.link && (
                        <Link to={notif.link.to} className="notif-link" onClick={(e) => e.stopPropagation()}>
                          {notif.link.label}
                          <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Voir les anciennes */}
        <div className="notif-footer-link">
          <Link to="/notifications" className="notif-see-all">
            Voir les anciennes notifications
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      {/* ===== Drawer : Détails de la notification ===== */}
      {selectedNotif && (
        <div className="notif-overlay" onClick={closeNotification}>
          <div className="notif-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="notif-drawer-header">
              <div className={`notif-drawer-icon notif-icon-${selectedNotif.type}`}>
                {(() => {
                  const Icon = selectedNotif.icon;
                  return <Icon size={24} />;
                })()}
              </div>
              <button type="button" className="notif-drawer-close" onClick={closeNotification}>
                <X size={20} />
              </button>
            </div>

            <div className="notif-drawer-body">
              <h2 className="notif-drawer-title">{selectedNotif.title}</h2>
              <p className="notif-drawer-date">
                <Calendar size={14} />
                {selectedNotif.date} à {selectedNotif.time}
              </p>

              <div className="notif-drawer-divider" />

              <p className="notif-drawer-description">
                {NOTIFICATION_DETAILS[selectedNotif.id]?.fullDescription || selectedNotif.description}
              </p>

              {/* Détails spécifiques selon le type */}
              {NOTIFICATION_DETAILS[selectedNotif.id] && (
                <div className="notif-drawer-details">
                  {Object.entries(NOTIFICATION_DETAILS[selectedNotif.id])
                    .filter(([key]) => key !== 'fullDescription')
                    .map(([key, value]) => (
                      <div key={key} className="notif-detail-row">
                        <span className="notif-detail-label">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className="notif-detail-value">{value}</span>
                      </div>
                    ))}
                </div>
              )}

              {/* Actions selon le type */}
              <div className="notif-drawer-actions">
                {selectedNotif.type === 'security' && (
                  <button type="button" className="notif-action-btn notif-action-danger">
                    <AlertCircle size={16} />
                    Ce n'était pas moi
                  </button>
                )}
                {selectedNotif.type === 'payment' && (
                  <>
                    <button type="button" className="notif-action-btn">
                      <Receipt size={16} />
                      Voir le ticket
                    </button>
                    <button type="button" className="notif-action-btn">
                      <Download size={16} />
                      Télécharger le justificatif
                    </button>
                  </>
                )}
                {selectedNotif.type === 'ai' && (
                  <Link to="/depenses" className="notif-action-btn notif-action-primary">
                    <TrendingUp size={16} />
                    Voir l'analyse complète
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}