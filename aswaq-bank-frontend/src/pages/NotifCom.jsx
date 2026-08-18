import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, ArrowLeftRight, Receipt, Star, Bell, Bot, User, LogOut, Search, ChevronDown,
  CheckCheck, ArrowRight, X, CreditCard, Download, Shield, Bot as BotIcon,
  TrendingUp, Calendar, AlertCircle, Package, Boxes, Users, ShoppingCart, Truck,
  CheckCircle, XCircle, AlertTriangle, Ticket, UserPlus,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import api from '../services/api'; 
import './NotifCom.css';
import './DashboardClient.css';

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/acceuil-com' },
  { icon: Package, label: 'Produits', to: '/produits' },
  { icon: Boxes, label: 'Stock', to: '/stock' },
  { icon: ArrowLeftRight, label: 'Paiements & Transactions', to: '/transactions-commerce' },
  { icon: Users, label: 'Fournisseurs', to: '/fournisseurs' },
  { icon: Star, label: 'Fidélité & Tickets', to: '/fidelite-commerce' },
  { icon: Bell, label: 'Notifications', to: '/notifications-com', active: true },
  { icon: Bot, label: 'Assistant IA', to: '/assistant-commerce' },
  { icon: User, label: 'Profil & Paramètres', to: '/parametres-commerce' },
];

const FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'orders', label: 'Commandes' },
  { key: 'payment', label: 'Paiements' },
  { key: 'stock', label: 'Stock' },
  { key: 'supplier', label: 'Fournisseurs' },
  { key: 'loyalty', label: 'Fidélité' },
  { key: 'ai', label: 'Assistant IA' },
  { key: 'security', label: 'Sécurité' },
];

// Icône par défaut selon le type (le backend renvoie un type, pas un composant React)
const TYPE_ICONS = {
  orders: ShoppingCart,
  payment: CreditCard,
  stock: AlertTriangle,
  supplier: Truck,
  loyalty: Star,
  ai: BotIcon,
  security: Shield,
};

function getIcon(type) {
  return TYPE_ICONS[type] || Bell;
}

// ---- Helpers d'affichage date/heure -----------------------------------------------
function splitDateTime(isoString) {
  if (!isoString) return { date: '', time: '' };
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return { date: isoString, time: '' };

  const now = new Date();
  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  let dateLabel;
  if (isSameDay(d, now)) {
    dateLabel = "Aujourd'hui";
  } else if (isSameDay(d, yesterday)) {
    dateLabel = 'Hier';
  } else {
    dateLabel = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  }

  const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return { date: dateLabel, time };
}

function humanizeKey(key) {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
}

export default function Notifications() {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get('/notifications');
        setNotifications(res.data);
      } catch (err) {
        setErrorMsg('Impossible de charger les notifications.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      setErrorMsg('Impossible de marquer les notifications comme lues.');
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? res.data : n)));
      return res.data;
    } catch (err) {
      setErrorMsg('Impossible de marquer la notification comme lue.');
      return null;
    }
  };

  const openNotification = async (notif) => {
    setSelectedNotif(notif);
    if (!notif.read) {
      const updated = await markAsRead(notif.id);
      if (updated) setSelectedNotif(updated);
    }
  };

  const closeNotification = () => {
    setSelectedNotif(null);
  };

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
            const isActive = location.pathname === item.to;
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
            <p className="dash-greeting-sub">Restez informé de toutes les activités de votre commerce.</p>
          </div>
          <div className="dash-topbar-actions">
            <div className="dash-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <button
              type="button"
              className="dash-icon-button"
              onClick={() => navigate('/notifications-com')}
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="dash-badge">{unreadCount}</span>}
            </button>
            <div className="fourn-user-chip" onClick={() => navigate('/parametres-commerce')}>
              <div className="fourn-user-avatar">MB</div>
              <div className="fourn-user-info">
                <span className="fourn-user-name">Marwa Boutabi</span>
                <span className="fourn-user-role">Commerçant</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {errorMsg && <div className="epa-error-banner">{errorMsg}</div>}

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
        {loading ? (
          <p>Chargement des notifications...</p>
        ) : (
          <div className="notif-list">
            {filteredNotifications.length === 0 ? (
              <div className="notif-empty">
                <Bell size={40} />
                <p>Aucune notification pour ce filtre.</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const Icon = getIcon(notif.type);
                const { date, time } = splitDateTime(notif.createdAt);
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
                          {date} • {time}
                        </span>
                        {notif.linkTo && (
                          <Link to={notif.linkTo} className="notif-link" onClick={(e) => e.stopPropagation()}>
                            {notif.linkLabel}
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
        )}

        {/* Voir les anciennes */}
        <div className="notif-footer-link">
          <Link to="/notifications-com" className="notif-see-all">
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
                  const Icon = getIcon(selectedNotif.type);
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
                {(() => {
                  const { date, time } = splitDateTime(selectedNotif.createdAt);
                  return `${date} à ${time}`;
                })()}
              </p>

              <div className="notif-drawer-divider" />

              <p className="notif-drawer-description">{selectedNotif.description}</p>

              {/* Détails spécifiques selon le type */}
              {selectedNotif.details && Object.keys(selectedNotif.details).length > 0 && (
                <div className="notif-drawer-details">
                  {Object.entries(selectedNotif.details).map(([key, value]) => (
                    <div key={key} className="notif-detail-row">
                      <span className="notif-detail-label">{humanizeKey(key)}</span>
                      <span className="notif-detail-value">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions selon le type */}
              <div className="notif-drawer-actions">
                {selectedNotif.type === 'orders' && (
                  <>
                    <button type="button" className="notif-action-btn">
                      <ShoppingCart size={16} />
                      Voir la commande
                    </button>
                    <button type="button" className="notif-action-btn notif-action-primary">
                      <CheckCircle size={16} />
                      Préparer la commande
                    </button>
                  </>
                )}
                {selectedNotif.type === 'payment' && (
                  <>
                    <button type="button" className="notif-action-btn">
                      <Receipt size={16} />
                      Voir la transaction
                    </button>
                    <button type="button" className="notif-action-btn">
                      <Download size={16} />
                      Télécharger le reçu
                    </button>
                  </>
                )}
                {selectedNotif.type === 'stock' && (
                  <>
                    <button type="button" className="notif-action-btn">
                      <Package size={16} />
                      Voir le produit
                    </button>
                    <button type="button" className="notif-action-btn notif-action-primary">
                      <Truck size={16} />
                      Réapprovisionner
                    </button>
                  </>
                )}
                {selectedNotif.type === 'supplier' && (
                  <button type="button" className="notif-action-btn">
                    <Truck size={16} />
                    Voir la commande fournisseur
                  </button>
                )}
                {selectedNotif.type === 'loyalty' && (
                  <button type="button" className="notif-action-btn">
                    <Star size={16} />
                    Voir le programme de fidélité
                  </button>
                )}
                {selectedNotif.type === 'ai' && selectedNotif.linkTo && (
                  <Link to={selectedNotif.linkTo} className="notif-action-btn notif-action-primary">
                    <TrendingUp size={16} />
                    {selectedNotif.linkLabel || 'Voir les recommandations'}
                  </Link>
                )}
                {selectedNotif.type === 'security' && (
                  <>
                    <button type="button" className="notif-action-btn">
                      <Shield size={16} />
                      Consulter les détails
                    </button>
                    <button type="button" className="notif-action-btn notif-action-danger">
                      <AlertCircle size={16} />
                      Sécuriser le compte
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}