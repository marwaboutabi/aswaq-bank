import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, ArrowLeftRight, Receipt, Star, Bell, Bot, User, LogOut, Search, ChevronDown,
  CheckCheck, ArrowRight, X, CreditCard, Download, Shield, Bot as BotIcon, 
  TrendingUp, Calendar, AlertCircle, Package, Boxes, Users, ShoppingCart, Truck,
  CheckCircle, XCircle, AlertTriangle, Ticket, UserPlus, 
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
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

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'orders',
    icon: ShoppingCart,
    title: 'Nouvelle commande reçue',
    description: 'Commande #CMD-2026-0847 de Karim Benjelloun - 1 250 MAD.',
    date: "Aujourd'hui",
    time: '14:35',
    read: false,
  },
  {
    id: 2,
    type: 'payment',
    icon: CreditCard,
    title: 'Paiement client confirmé',
    description: 'Paiement de 890 MAD reçu de Fatima Zahra via carte bancaire.',
    date: "Aujourd'hui",
    time: '14:20',
    read: false,
  },
  {
    id: 3,
    type: 'payment',
    icon: XCircle,
    title: 'Paiement échoué',
    description: 'Le paiement de 450 MAD de la commande #CMD-2026-0845 a été refusé.',
    date: "Aujourd'hui",
    time: '13:45',
    read: false,
  },
  {
    id: 4,
    type: 'stock',
    icon: AlertTriangle,
    title: 'Stock faible',
    description: 'Le produit "Huile d\'olive extra vierge 1L" a un stock critique (3 unités).',
    date: "Aujourd'hui",
    time: '12:30',
    read: true,
    link: { label: 'Voir le produit', to: '/produits/123' },
  },
  {
    id: 5,
    type: 'stock',
    icon: AlertCircle,
    title: 'Produit en rupture de stock',
    description: 'Le produit "Café arabica 500g" est maintenant en rupture de stock.',
    date: 'Hier',
    time: '18:15',
    read: true,
    link: { label: 'Réapprovisionner', to: '/produits/456' },
  },
  {
    id: 6,
    type: 'supplier',
    icon: Truck,
    title: 'Nouvelle commande fournisseur',
    description: 'Commande #Fourn-2026-156 passée chez DistribMaroc - 15 800 MAD.',
    date: 'Hier',
    time: '16:40',
    read: true,
  },
  {
    id: 7,
    type: 'supplier',
    icon: Truck,
    title: 'Commande fournisseur expédiée',
    description: 'La commande #Fourn-2026-154 a été expédiée par AtlasSupply.',
    date: '19 juillet',
    time: '11:20',
    read: true,
  },
  {
    id: 8,
    type: 'supplier',
    icon: CheckCircle,
    title: 'Commande fournisseur livrée',
    description: 'La commande #Fourn-2026-152 a été livrée et vérifiée.',
    date: '18 juillet',
    time: '09:30',
    read: true,
  },
  {
    id: 9,
    type: 'loyalty',
    icon: UserPlus,
    title: 'Nouveau client fidèle',
    description: 'Youssef Amrani a atteint le niveau Gold du programme de fidélité.',
    date: '17 juillet',
    time: '15:20',
    read: true,
  },
  {
    id: 10,
    type: 'loyalty',
    icon: Star,
    title: 'Points de fidélité distribués',
    description: '150 points de fidélité distribués à 12 clients aujourd\'hui.',
    date: '17 juillet',
    time: '14:00',
    read: true,
  },
  {
    id: 11,
    type: 'loyalty',
    icon: Ticket,
    title: 'Nouveau ticket généré',
    description: 'Ticket #TKT-2026-089 généré pour une réduction de 50 MAD.',
    date: '16 juillet',
    time: '10:45',
    read: true,
  },
  {
    id: 12,
    type: 'ai',
    icon: BotIcon,
    title: "Recommandation de l'Assistant IA",
    description: 'Vos ventes de produits bio ont augmenté de 23% ce mois-ci.',
    date: '16 juillet',
    time: '08:30',
    read: true,
    link: { label: "Voir l'analyse", to: '/analyse-ventes' },
  },
  {
    id: 13,
    type: 'ai',
    icon: TrendingUp,
    title: 'Analyse intelligente',
    description: 'Vous pourriez augmenter votre marge de 8% sur 5 produits.',
    date: '15 juillet',
    time: '09:15',
    read: true,
    link: { label: "Voir les recommandations", to: '/recommandations-ia' },
  },
  {
    id: 14,
    type: 'security',
    icon: Shield,
    title: 'Nouvelle connexion détectée',
    description: 'Nouvelle connexion sur votre compte depuis Rabat.',
    date: '14 juillet',
    time: '17:30',
    read: true,
  },
];

const NOTIFICATION_DETAILS = {
  1: {
    fullDescription: 'Une nouvelle commande a été passée par Karim Benjelloun pour un montant total de 1 250,00 MAD.',
    customer: 'Karim Benjelloun',
    items: '3 articles',
    total: '1 250,00 MAD',
    paymentMethod: 'Carte bancaire',
    deliveryAddress: '12 Rue Hassan II, Casablanca',
    orderDate: '23 juillet 2026 à 14:35',
  },
  2: {
    fullDescription: 'Un paiement de 890,00 MAD a été confirmé pour la commande #CMD-2026-0846.',
    customer: 'Fatima Zahra',
    amount: '890,00 MAD',
    paymentMethod: 'Carte bancaire •••• 4589',
    transactionId: 'TXN-2026-0723-002',
    status: 'Confirmé',
    receivedAt: '23 juillet 2026 à 14:20',
  },
  3: {
    fullDescription: 'Le paiement de 450,00 MAD pour la commande #CMD-2026-0845 a été refusé par la banque.',
    customer: 'Ahmed Tazi',
    amount: '450,00 MAD',
    paymentMethod: 'Carte bancaire •••• 7823',
    reason: 'Fonds insuffisants',
    transactionId: 'TXN-2026-0723-001',
    failedAt: '23 juillet 2026 à 13:45',
  },
  4: {
    fullDescription: 'Le stock du produit "Huile d\'olive extra vierge 1L" est critique.',
    productName: 'Huile d\'olive extra vierge 1L',
    currentStock: '3 unités',
    minimumStock: '10 unités',
    category: 'Alimentation',
    supplier: 'DistribMaroc',
    lastRestocked: '15 juillet 2026',
  },
  5: {
    fullDescription: 'Le produit "Café arabica 500g" est en rupture de stock.',
    productName: 'Café arabica 500g',
    currentStock: '0 unités',
    pendingOrders: '2 commandes en attente',
    category: 'Boissons',
    supplier: 'AtlasSupply',
    suggestedOrder: 'Commander 50 unités',
  },
  6: {
    fullDescription: 'Une nouvelle commande a été passée chez DistribMaroc.',
    supplier: 'DistribMaroc',
    orderNumber: 'Fourn-2026-156',
    totalAmount: '15 800,00 MAD',
    items: '25 articles',
    expectedDelivery: '26 juillet 2026',
    status: 'En attente de confirmation',
    orderDate: '22 juillet 2026 à 16:40',
  },
  7: {
    fullDescription: 'La commande #Fourn-2026-154 a été expédiée par AtlasSupply.',
    supplier: 'AtlasSupply',
    orderNumber: 'Fourn-2026-154',
    totalAmount: '8 450,00 MAD',
    trackingNumber: 'TRK-2026-0719-001',
    estimatedDelivery: '24 juillet 2026',
    status: 'En transit',
    shippedAt: '19 juillet 2026 à 11:20',
  },
  8: {
    fullDescription: 'La commande #Fourn-2026-152 a été livrée et vérifiée avec succès.',
    supplier: 'DistribMaroc',
    orderNumber: 'Fourn-2026-152',
    totalAmount: '12 300,00 MAD',
    itemsReceived: '18 articles',
    qualityCheck: 'Validé',
    status: 'Livrée et vérifiée',
    deliveredAt: '18 juillet 2026 à 09:30',
  },
  9: {
    fullDescription: 'Youssef Amrani a atteint le niveau Gold du programme de fidélité.',
    customer: 'Youssef Amrani',
    level: 'Gold',
    totalPoints: '5 250 points',
    totalPurchases: '12 450 MAD',
    memberSince: '15 janvier 2026',
    benefits: 'Réductions de 15%, accès prioritaire aux promotions',
  },
  10: {
    fullDescription: '150 points de fidélité ont été distribués à 12 clients aujourd\'hui.',
    totalPoints: '150 points',
    customersCount: '12 clients',
    averagePoints: '12,5 points par client',
    topCustomer: 'Fatima Zahra - 35 points',
    date: '17 juillet 2026',
    totalDistributed: '1 847 points ce mois',
  },
  11: {
    fullDescription: 'Un nouveau ticket de réduction a été généré.',
    ticketNumber: 'TKT-2026-089',
    discount: '50 MAD',
    minPurchase: '200 MAD',
    validUntil: '31 août 2026',
    customer: 'Sara El Fassi',
    generatedAt: '16 juillet 2026 à 10:45',
    status: 'Actif',
  },
  12: {
    fullDescription: 'Notre analyse montre que vos ventes de produits bio ont augmenté de 23% ce mois-ci.',
    category: 'Produits bio',
    lastMonth: 'Ventes le mois dernier : 8 450 MAD',
    thisMonth: 'Ventes ce mois-ci : 10 394 MAD',
    growth: '+1 944 MAD (+23%)',
    topProduct: 'Huile d\'olive bio - 127 unités vendues',
    advice: 'Conseil : Augmentez votre stock de produits bio de 30% pour répondre à la demande.',
  },
  13: {
    fullDescription: 'Selon notre analyse, vous pourriez augmenter votre marge de 8% sur 5 produits.',
    products: '5 produits identifiés',
    currentMargin: 'Marge actuelle moyenne : 22%',
    potentialMargin: 'Marge potentielle : 30%',
    estimatedGain: 'Gain estimé : +2 340 MAD/mois',
    topProduct: 'Café arabica 500g - Marge actuelle 18%',
    advice: 'Conseil : Ajustez les prix de ces 5 produits sans impact sur les ventes.',
  },
  14: {
    fullDescription: 'Une nouvelle connexion a été détectée sur votre compte.',
    device: 'Chrome sur Windows',
    location: 'Rabat, Maroc',
    ip: 'IP : 105.159.xx.xx',
    time: '14 juillet 2026 à 17:30',
    status: 'Connexion réussie',
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
        <div className="dash-sidebar-logo">
          <Logo size={100} className="mb-6" className="mb-6 logo-white" />
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
                {selectedNotif.type === 'payment' && selectedNotif.id !== 3 && (
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
                {selectedNotif.type === 'payment' && selectedNotif.id === 3 && (
                  <>
                    <button type="button" className="notif-action-btn notif-action-danger">
                      <XCircle size={16} />
                      Contacter le client
                    </button>
                    <button type="button" className="notif-action-btn">
                      <Receipt size={16} />
                      Voir les détails
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
                  <>
                    <button type="button" className="notif-action-btn">
                      <Truck size={16} />
                      Voir la commande fournisseur
                    </button>
                    {selectedNotif.id === 7 && (
                      <button type="button" className="notif-action-btn">
                        <ArrowRight size={16} />
                        Suivre la livraison
                      </button>
                    )}
                  </>
                )}
                {selectedNotif.type === 'loyalty' && (
                  <>
                    <button type="button" className="notif-action-btn">
                      <Star size={16} />
                      Voir le programme de fidélité
                    </button>
                    {selectedNotif.id === 9 && (
                      <button type="button" className="notif-action-btn">
                        <User size={16} />
                        Voir le profil client
                      </button>
                    )}
                  </>
                )}
                {selectedNotif.type === 'ai' && (
                  <Link to="/recommandations-ia" className="notif-action-btn notif-action-primary">
                    <TrendingUp size={16} />
                    Voir les recommandations
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