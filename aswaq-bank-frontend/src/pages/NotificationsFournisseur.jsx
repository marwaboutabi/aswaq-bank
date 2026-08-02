import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, ArrowLeftRight, Receipt, Star, Bell, Bot, User, LogOut, Search, ChevronDown,
  CheckCheck, ArrowRight, X, CreditCard, Download, Shield, Bot as BotIcon, 
  TrendingUp, Calendar, AlertCircle, Package, Boxes, Users, ShoppingCart, Truck,
  CheckCircle, XCircle, AlertTriangle, Ticket, UserPlus, Wallet, MapPin,
  Eye, Clock, Tag, FileText, BarChart3, Sparkles,Edit,Layers,Building2
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './NotificationsFournisseur.css';

const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', to: '/accueil-fournisseur' },
    { icon: Package, label: 'Produits', to: '/produits-fournisseur' },
    { icon: ShoppingCart, label: 'Commandes reçues', to: '/commandes-fournisseur' },
    { icon: CreditCard, label: 'Paiements', to: '/paiements-fournisseur' },
    { icon: Truck, label: 'Livraisons', to: '/livraisons-fournisseur' },
    { icon: Layers, label: 'Catalogue', to: '/catalogue-fournisseur' },
   { icon: Bell, label: 'Notifications', to: '/notifications-fournisseur' , active: true },
    { icon: Bot, label: 'Assistant IA', to: '/assistant-fournisseur'},
    { icon: User, label: 'Profil & Paramètres', to: '/profil-fournisseur' },

  ];

const FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'orders', label: 'Commandes' },
  { key: 'payments', label: 'Paiements' },
  { key: 'deliveries', label: 'Livraisons' },
  { key: 'catalog', label: 'Catalogue' },
  { key: 'stock', label: 'Stock' },
  { key: 'security', label: 'Sécurité' },
  { key: 'ai', label: 'Assistant IA' },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'orders',
    icon: ShoppingCart,
    badge: 'Nouveau',
    badgeColor: 'blue',
    title: 'Nouvelle commande reçue',
    description: 'Le commerçant "Épicerie Atlas" vient de passer une commande de 54 articles.',
    date: "Aujourd'hui",
    time: '14:35',
    read: false,
  },
  {
    id: 2,
    type: 'orders',
    icon: ShoppingCart,
    badge: 'Urgent',
    badgeColor: 'red',
    title: 'Commande en attente de préparation',
    description: 'La commande CMD-2026-102 doit être préparée avant 17h00.',
    date: "Aujourd'hui",
    time: '13:20',
    read: false,
  },
  {
    id: 3,
    type: 'payments',
    icon: Wallet,
    badge: 'Payé',
    badgeColor: 'green',
    title: 'Paiement reçu',
    description: 'Vous avez reçu un paiement de 12 480 MAD pour la commande CMD-2026-105.',
    date: "Aujourd'hui",
    time: '12:45',
    read: false,
  },
  {
    id: 4,
    type: 'payments',
    icon: Wallet,
    badge: 'Payé',
    badgeColor: 'green',
    title: 'Virement bancaire confirmé',
    description: 'Un virement de 8 750 MAD a été crédité sur votre compte.',
    date: "Aujourd'hui",
    time: '11:30',
    read: true,
  },
  {
    id: 5,
    type: 'deliveries',
    icon: Truck,
    badge: 'En attente',
    badgeColor: 'orange',
    title: 'Livraison remise au transporteur',
    description: 'La livraison LIV-00218 a été remise au transporteur. Date prévue : demain à 15h30.',
    date: "Aujourd'hui",
    time: '10:15',
    read: false,
  },
  {
    id: 6,
    type: 'deliveries',
    icon: Truck,
    badge: 'Livré',
    badgeColor: 'green',
    title: 'Livraison effectuée',
    description: 'La livraison LIV-00215 a été livrée avec succès à Marrakech.',
    date: 'Hier',
    time: '16:40',
    read: true,
  },
  {
    id: 7,
    type: 'stock',
    icon: AlertTriangle,
    badge: 'Urgent',
    badgeColor: 'red',
    title: 'Stock faible',
    description: 'Le produit "Huile d\'olive Premium 1L" atteint le seuil minimum de stock. Stock restant : 12 unités.',
    date: 'Hier',
    time: '14:20',
    read: true,
    link: { label: 'Réapprovisionner', to: '/stock-fournisseur/123' },
  },
  {
    id: 8,
    type: 'catalog',
    icon: Package,
    badge: 'Nouveau',
    badgeColor: 'blue',
    title: 'Produit publié avec succès',
    description: 'Votre nouveau produit "Farine Bio Premium" a été publié avec succès dans le catalogue.',
    date: 'Hier',
    time: '09:45',
    read: true,
    link: { label: 'Voir le produit', to: '/catalogue-fournisseur/456' },
  },
  {
    id: 9,
    type: 'catalog',
    icon: Package,
    title: 'Catalogue mis à jour',
    description: '5 produits ont été mis à jour dans votre catalogue suite à la modification des prix.',
    date: '26 juillet',
    time: '15:30',
    read: true,
  },
  {
    id: 10,
    type: 'orders',
    icon: ShoppingCart,
    title: 'Commande annulée',
    description: 'La commande CMD-2026-098 a été annulée par le commerçant "Superette Youssef".',
    date: '25 juillet',
    time: '17:10',
    read: true,
  },
  {
    id: 11,
    type: 'deliveries',
    icon: Truck,
    badge: 'Livré',
    badgeColor: 'green',
    title: 'Livraison en retard',
    description: 'La livraison LIV-00212 accuse un retard de 2 heures en raison des conditions météo.',
    date: '24 juillet',
    time: '13:25',
    read: true,
  },
  {
    id: 12,
    type: 'ai',
    icon: BotIcon,
    badge: 'IA',
    badgeColor: 'purple',
    title: "Recommandation de l'Assistant IA",
    description: 'L\'assistant IA recommande de réapprovisionner le Café Moulu Premium. La demande prévue augmentera de 32% la semaine prochaine.',
    date: '23 juillet',
    time: '08:30',
    read: true,
    link: { label: "Voir l'analyse", to: '/analyse-ventes-fournisseur' },
  },
  {
    id: 13,
    type: 'ai',
    icon: TrendingUp,
    badge: 'IA',
    badgeColor: 'purple',
    title: 'Analyse des ventes',
    description: 'Vos ventes ont augmenté de 18% ce mois-ci. Les produits bio représentent 45% de votre chiffre d\'affaires.',
    date: '22 juillet',
    time: '09:15',
    read: true,
    link: { label: 'Voir les statistiques', to: '/statistiques-fournisseur' },
  },
  {
    id: 14,
    type: 'security',
    icon: Shield,
    badge: 'Sécurité',
    badgeColor: 'red',
    title: 'Nouvelle connexion détectée',
    description: 'Nouvelle connexion sur votre compte depuis Casablanca. Chrome Windows. Aujourd\'hui à 08:35.',
    date: '21 juillet',
    time: '08:35',
    read: true,
  },
];

const NOTIFICATION_DETAILS = {
  1: {
    fullDescription: 'Le commerçant "Épicerie Atlas" vient de passer une nouvelle commande. Il est recommandé de préparer cette commande avant aujourd\'hui 17h00.',
    orderNumber: 'CMD-2026-105',
    merchant: 'Épicerie Atlas',
    items: '54 articles',
    totalAmount: '12 480,00 MAD',
    orderDate: '28 juillet 2026 à 14:35',
    status: 'En attente de préparation',
    deliveryAddress: '12 Rue Hassan II, Casablanca',
  },
  2: {
    fullDescription: 'La commande CMD-2026-102 doit être préparée et expédiée rapidement pour respecter le délai de livraison convenu.',
    orderNumber: 'CMD-2026-102',
    merchant: 'Superette El Baraka',
    items: '38 articles',
    totalAmount: '8 950,00 MAD',
    deadline: 'Aujourd\'hui 17h00',
    status: 'À préparer',
    priority: 'Urgente',
  },
  3: {
    fullDescription: 'Un paiement de 12 480,00 MAD a été confirmé et crédité sur votre compte pour la commande CMD-2026-105.',
    amount: '12 480,00 MAD',
    paymentMethod: 'Virement bancaire',
    reference: 'PAY-20458',
    transactionId: 'TXN-2026-0728-003',
    receivedAt: '28 juillet 2026 à 12:45',
    status: 'Confirmé',
  },
  4: {
    fullDescription: 'Un virement bancaire de 8 750,00 MAD a été crédité sur votre compte Aswaq Bank.',
    amount: '8 750,00 MAD',
    paymentMethod: 'Virement bancaire',
    reference: 'PAY-20457',
    transactionId: 'TXN-2026-0728-002',
    receivedAt: '28 juillet 2026 à 11:30',
    status: 'Confirmé',
  },
  5: {
    fullDescription: 'La livraison LIV-00218 a été remise au transporteur Aswaq Logistics et sera livrée demain.',
    deliveryNumber: 'LIV-00218',
    carrier: 'Aswaq Logistics',
    packages: '8 colis',
    totalWeight: '245 kg',
    scheduledDate: '29 juillet 2026 à 15h30',
    destination: 'Casablanca',
    status: 'En transit',
    trackingNumber: 'TRK-2026-0728-001',
  },
  6: {
    fullDescription: 'La livraison LIV-00215 a été livrée avec succès et signée par le destinataire.',
    deliveryNumber: 'LIV-00215',
    carrier: 'Atlas Transport',
    packages: '5 colis',
    totalWeight: '180 kg',
    deliveredAt: '27 juillet 2026 à 16:40',
    destination: 'Marrakech',
    status: 'Livrée',
    signedBy: 'Mohammed Alami',
  },
  7: {
    fullDescription: 'Le stock du produit "Huile d\'olive Premium 1L" est critique et nécessite un réapprovisionnement rapide.',
    productName: 'Huile d\'olive Premium 1L',
    currentStock: '12 unités',
    minimumStock: '20 unités',
    category: 'Alimentation',
    lastOrder: '15 juillet 2026',
    supplierLeadTime: '3 jours',
    suggestedOrder: 'Commander 50 unités',
  },
  8: {
    fullDescription: 'Votre nouveau produit "Farine Bio Premium" a été publié avec succès et est maintenant visible dans le catalogue.',
    productName: 'Farine Bio Premium',
    sku: 'SKU-2026-0892',
    category: 'Alimentation',
    price: '45,00 MAD',
    stock: '100 unités',
    publishedAt: '27 juillet 2026 à 09:45',
    status: 'Actif',
  },
  9: {
    fullDescription: '5 produits de votre catalogue ont été mis à jour avec les nouveaux prix.',
    productsUpdated: '5 produits',
    category: 'Alimentation',
    updatedBy: 'Vous',
    updatedAt: '26 juillet 2026 à 15:30',
    status: 'Publié',
  },
  10: {
    fullDescription: 'La commande CMD-2026-098 a été annulée par le commerçant. Les articles sont de nouveau disponibles en stock.',
    orderNumber: 'CMD-2026-098',
    merchant: 'Superette Youssef',
    items: '22 articles',
    totalAmount: '5 340,00 MAD',
    cancelledAt: '25 juillet 2026 à 17:10',
    reason: 'Demande du client',
    status: 'Annulée',
  },
  11: {
    fullDescription: 'La livraison LIV-00212 accuse un retard en raison des conditions météorologiques défavorables.',
    deliveryNumber: 'LIV-00212',
    carrier: 'Aswaq Logistics',
    packages: '6 colis',
    totalWeight: '210 kg',
    originalDate: '24 juillet 2026 à 11h00',
    newEstimatedDate: '24 juillet 2026 à 13h00',
    destination: 'Fès',
    status: 'En retard',
    delayReason: 'Conditions météo',
  },
  12: {
    fullDescription: 'Notre analyse prédit une augmentation de 32% de la demande pour le Café Moulu Premium la semaine prochaine.',
    productName: 'Café Moulu Premium',
    currentStock: '45 unités',
    predictedDemand: '78 unités',
    growth: '+32%',
    period: 'Semaine prochaine',
    advice: 'Conseil : Réapprovisionnez dès maintenant pour éviter la rupture de stock.',
  },
  13: {
    fullDescription: 'Vos ventes ont augmenté de 18% ce mois-ci. Les produits bio représentent 45% de votre chiffre d\'affaires total.',
    totalSales: '125 480 MAD',
    growth: '+18%',
    topCategory: 'Produits bio',
    topCategoryShare: '45%',
    topProduct: 'Huile d\'olive Premium - 234 unités',
    period: 'Juillet 2026',
  },
  14: {
    fullDescription: 'Une nouvelle connexion a été détectée sur votre compte fournisseur.',
    device: 'Chrome sur Windows',
    location: 'Casablanca, Maroc',
    ip: 'IP : 105.159.xx.xx',
    time: '21 juillet 2026 à 08:35',
    status: 'Connexion réussie',
  },
};

export default function NotificationsFournisseur() {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedNotif, setSelectedNotif] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const newOrdersCount = notifications.filter((n) => n.type === 'orders' && !n.read).length;
  const paymentsCount = notifications.filter((n) => n.type === 'payments' && !n.read).length;
  const deliveriesCount = notifications.filter((n) => n.type === 'deliveries' && !n.read).length;

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

  const getBadgeClass = (color) => {
    const colorMap = {
      blue: 'notif-badge-blue',
      green: 'notif-badge-green',
      orange: 'notif-badge-orange',
      red: 'notif-badge-red',
      purple: 'notif-badge-purple',
    };
    return colorMap[color] || 'notif-badge-blue';
  };

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="acc-sidebar-logo">
          <Logo size={100} className="mb-6" logo-white />
        </div>
        <p className="four-sidebar-section">
          <Building2 size={13} />
          FOURNISSEUR
        </p>
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
            <p className="dash-greeting-sub">Restez informé en temps réel des commandes, paiements, livraisons et activités de votre entreprise.</p>
          </div>
          <div className="dash-topbar-actions">
            <div className="dash-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <button
              type="button"
              className="dash-icon-button"
              onClick={() => navigate('/notifications-fournisseur')}
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="dash-badge">{unreadCount}</span>}
            </button>
            <div className="fourn-user-chip" onClick={() => navigate('/parametres-fournisseur')}>
              <div className="fourn-user-avatar">AS</div>
              <div className="fourn-user-info">
                <span className="fourn-user-name">Atlas Supply</span>
                <span className="fourn-user-role">Fournisseur</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="notif-stats-grid">
          <div className="notif-stat-card">
            <div className="notif-stat-icon notif-stat-icon-blue">
              <Bell size={20} />
            </div>
            <div className="notif-stat-content">
              <p className="notif-stat-value">{unreadCount}</p>
              <p className="notif-stat-label">Notifications non lues</p>
            </div>
          </div>
          <div className="notif-stat-card">
            <div className="notif-stat-icon notif-stat-icon-green">
              <ShoppingCart size={20} />
            </div>
            <div className="notif-stat-content">
              <p className="notif-stat-value">{newOrdersCount}</p>
              <p className="notif-stat-label">Nouvelles commandes</p>
            </div>
          </div>
          <div className="notif-stat-card">
            <div className="notif-stat-icon notif-stat-icon-purple">
              <Wallet size={20} />
            </div>
            <div className="notif-stat-content">
              <p className="notif-stat-value">{paymentsCount}</p>
              <p className="notif-stat-label">Paiements reçus</p>
            </div>
          </div>
          <div className="notif-stat-card">
            <div className="notif-stat-icon notif-stat-icon-orange">
              <Truck size={20} />
            </div>
            <div className="notif-stat-content">
              <p className="notif-stat-value">{deliveriesCount}</p>
              <p className="notif-stat-label">Livraisons en cours</p>
            </div>
          </div>
        </div>

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
                      {notif.badge && (
                        <span className={`notif-badge ${getBadgeClass(notif.badgeColor)}`}>
                          {notif.badge}
                        </span>
                      )}
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
          <Link to="/notifications-fournisseur" className="notif-see-all">
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
                      <Eye size={16} />
                      Voir la commande
                    </button>
                    <button type="button" className="notif-action-btn notif-action-primary">
                      <CheckCircle size={16} />
                      Préparer la commande
                    </button>
                  </>
                )}
                {selectedNotif.type === 'payments' && (
                  <>
                    <button type="button" className="notif-action-btn">
                      <Receipt size={16} />
                      Voir le paiement
                    </button>
                    <button type="button" className="notif-action-btn">
                      <Download size={16} />
                      Télécharger le reçu
                    </button>
                  </>
                )}
                {selectedNotif.type === 'deliveries' && (
                  <>
                    <button type="button" className="notif-action-btn">
                      <MapPin size={16} />
                      Suivre la livraison
                    </button>
                    <button type="button" className="notif-action-btn">
                      <Truck size={16} />
                      Voir les détails
                    </button>
                  </>
                )}
                {selectedNotif.type === 'catalog' && (
                  <>
                    <button type="button" className="notif-action-btn">
                      <Package size={16} />
                      Voir le produit
                    </button>
                    <button type="button" className="notif-action-btn">
                      <Edit size={16} />
                      Modifier le catalogue
                    </button>
                  </>
                )}
                {selectedNotif.type === 'stock' && (
                  <>
                    <button type="button" className="notif-action-btn">
                      <Boxes size={16} />
                      Voir le stock
                    </button>
                    <button type="button" className="notif-action-btn notif-action-primary">
                      <Truck size={16} />
                      Réapprovisionner
                    </button>
                  </>
                )}
                {selectedNotif.type === 'ai' && (
                  <Link to="/recommandations-fournisseur" className="notif-action-btn notif-action-primary">
                    <TrendingUp size={16} />
                    Voir l'analyse
                  </Link>
                )}
                {selectedNotif.type === 'security' && (
                  <>
                    <button type="button" className="notif-action-btn">
                      <Shield size={16} />
                      Voir les connexions
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