import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, ShoppingCart, CreditCard, Truck, Layers, User, Settings,
  HelpCircle, LogOut, Search, Bell, ChevronDown, ChevronLeft, ChevronRight,
  Building2, Download, Check, X, MoreVertical, Clock, ClipboardList,
  CheckCircle2, Phone, MapPin, Hash, Bot
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './CommandesRecuesFournisseur.css';

const STATUS_FLOW = ['En attente', 'Acceptée', 'En préparation', 'Expédiée', 'Livrée'];
const TIMELINE_LABELS = ['Commande reçue', 'Commande acceptée', 'Préparation', 'Expédition', 'Livraison'];
const STATUS_TONE = {
  'En attente': 'orange',
  'Acceptée': 'blue',
  'En préparation': 'purple',
  'Expédiée': 'cyan',
  'Livrée': 'green',
  'Refusée': 'red',
};

const STATS_META = [
  { key: 'total', icon: Package, tone: 'blue', label: 'Commandes reçues' },
  { key: 'attente', icon: Clock, tone: 'orange', label: 'En attente' },
  { key: 'preparation', icon: ClipboardList, tone: 'purple', label: 'En préparation' },
  { key: 'livrees', icon: CheckCircle2, tone: 'green', label: 'Livrées' },
];

const INITIAL_ORDERS = [
  {
    id: 'CMD-1025', commercant: 'Épicerie Atlas', date: '28/07/2026', phone: '06 61 23 45 67',
    address: '12 Rue Ibn Battouta, Casablanca', statut: 'En attente',
    items: [
      { product: "Huile d'olive 1L", qty: 4, price: 75 },
      { product: 'Sucre Blanc 1kg', qty: 10, price: 14 },
      { product: 'Farine 1kg', qty: 10, price: 9 },
      { product: 'Riz Basmati 1kg', qty: 10, price: 28 },
      { product: 'Thé Vert 100g', qty: 6, price: 32 },
    ],
  },
  {
    id: 'CMD-1024', commercant: 'Market Plus', date: '27/07/2026', phone: '06 12 34 56 78',
    address: '45 Boulevard Zerktouni, Casablanca', statut: 'En préparation',
    items: [
      { product: 'Café Moulu 250g', qty: 8, price: 48 },
      { product: 'Lait UHT 1L', qty: 20, price: 7 },
      { product: "Jus d'Orange 1L", qty: 12, price: 18 },
    ],
  },
  {
    id: 'CMD-1023', commercant: 'Bio Shop', date: '26/07/2026', phone: '06 98 76 54 32',
    address: '7 Avenue Hassan II, Rabat', statut: 'Expédiée',
    items: [
      { product: "Huile d'olive 1L", qty: 6, price: 75 },
      { product: 'Dentifrice 75ml', qty: 15, price: 16 },
    ],
  },
  {
    id: 'CMD-1022', commercant: 'Alimentation Nour', date: '25/07/2026', phone: '06 45 67 89 01',
    address: '23 Rue Allal Ben Abdellah, Fès', statut: 'Livrée',
    items: [
      { product: 'Farine 1kg', qty: 20, price: 9 },
      { product: 'Sucre Blanc 1kg', qty: 20, price: 14 },
      { product: 'Thé Vert 100g', qty: 10, price: 32 },
      { product: 'Savon Liquide 500ml', qty: 8, price: 22 },
    ],
  },
  {
    id: 'CMD-1021', commercant: 'Super Marché Al Amal', date: '25/07/2026', phone: '06 23 45 67 89',
    address: '3 Rue Moulay Youssef, Marrakech', statut: 'Livrée',
    items: [
      { product: 'Riz Basmati 1kg', qty: 15, price: 28 },
      { product: 'Café Moulu 250g', qty: 10, price: 48 },
    ],
  },
  {
    id: 'CMD-1020', commercant: 'Épicerie Chaabi', date: '24/07/2026', phone: '06 78 90 12 34',
    address: '18 Rue Tarik Ibn Ziad, Tanger', statut: 'Refusée',
    items: [
      { product: 'Lait UHT 1L', qty: 30, price: 7 },
      { product: "Jus d'Orange 1L", qty: 15, price: 18 },
    ],
  },
  {
    id: 'CMD-1019', commercant: 'Proxi Market', date: '23/07/2026', phone: '06 33 44 55 66',
    address: '9 Avenue Mohammed V, Casablanca', statut: 'Acceptée',
    items: [
      { product: "Huile d'olive 1L", qty: 8, price: 75 },
      { product: 'Farine 1kg', qty: 12, price: 9 },
      { product: 'Dentifrice 75ml', qty: 10, price: 16 },
    ],
  },
  {
    id: 'CMD-1018', commercant: 'Alimentation Salam', date: '22/07/2026', phone: '06 55 66 77 88',
    address: '31 Rue de Fès, Meknès', statut: 'En attente',
    items: [
      { product: 'Thé Vert 100g', qty: 12, price: 32 },
      { product: 'Sucre Blanc 1kg', qty: 15, price: 14 },
    ],
  },
  {
    id: 'CMD-1017', commercant: 'Mini Marché Zineb', date: '21/07/2026', phone: '06 11 22 33 44',
    address: '5 Rue Ibn Khaldoun, Agadir', statut: 'En préparation',
    items: [
      { product: 'Savon Liquide 500ml', qty: 10, price: 22 },
      { product: 'Dentifrice 75ml', qty: 20, price: 16 },
      { product: "Jus d'Orange 1L", qty: 10, price: 18 },
    ],
  },
  {
    id: 'CMD-1016', commercant: 'Épicerie Al Baraka', date: '20/07/2026', phone: '06 22 33 44 55',
    address: '14 Rue Ibnou Sina, Oujda', statut: 'Livrée',
    items: [
      { product: "Huile d'olive 1L", qty: 10, price: 75 },
      { product: 'Riz Basmati 1kg', qty: 10, price: 28 },
    ],
  },
  {
    id: 'CMD-1015', commercant: 'Superette Anfa', date: '19/07/2026', phone: '06 66 77 88 99',
    address: '27 Boulevard Anfa, Casablanca', statut: 'Expédiée',
    items: [
      { product: 'Café Moulu 250g', qty: 6, price: 48 },
      { product: 'Lait UHT 1L', qty: 25, price: 7 },
    ],
  },
  {
    id: 'CMD-1014', commercant: 'Épicerie Nouvelle', date: '18/07/2026', phone: '06 88 99 00 11',
    address: '2 Rue Al Massira, Kénitra', statut: 'Refusée',
    items: [
      { product: 'Farine 1kg', qty: 25, price: 9 },
      { product: 'Sucre Blanc 1kg', qty: 25, price: 14 },
    ],
  },
];

const PAGE_SIZE = 10;

function computeTotals(items) {
  const subtotal = items.reduce((sum, it) => sum + it.qty * it.price, 0);
  const tva = subtotal * 0.2;
  const total = subtotal + tva;
  return { subtotal, tva, total };
}

function fmt(n) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function StatusBadge({ status }) {
  return <span className={`cmd-four-badge-pill cmd-four-badge-pill-${STATUS_TONE[status]}`}>{status}</span>;
}

function OrderTimeline({ status }) {
  const isRefused = status === 'Refusée';
  const currentIndex = STATUS_FLOW.indexOf(status);

  return (
    <div className="cmd-four-timeline">
      {TIMELINE_LABELS.map((label, i) => {
        let state = 'pending';
        if (isRefused) {
          state = i === 0 ? 'done' : 'skipped';
        } else if (i < currentIndex) {
          state = 'done';
        } else if (i === currentIndex) {
          state = 'current';
        }
        return (
          <div className={`cmd-four-timeline-step cmd-four-timeline-step-${state}`} key={label}>
            <span className="cmd-four-timeline-dot" />
            <span className="cmd-four-timeline-label">{label}</span>
          </div>
        );
      })}
      {isRefused && <span className="cmd-four-timeline-refused">Commande refusée</span>}
    </div>
  );
}

function OrderDetailModal({ order, onClose, onAccept, onRefuse, onAdvance }) {
  const { subtotal, tva, total } = computeTotals(order.items);
  const nextIndex = STATUS_FLOW.indexOf(order.statut) + 1;
  const nextLabel = STATUS_FLOW[nextIndex];
  const canAdvance = order.statut !== 'En attente' && order.statut !== 'Livrée' && order.statut !== 'Refusée' && nextLabel;

  return (
    <div className="cmd-four-modal-overlay" onClick={onClose}>
      <div className="cmd-four-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-four-modal-header">
          <h3>Commande {order.id}</h3>
          <button type="button" className="cmd-four-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="cmd-four-modal-body">
          <OrderTimeline status={order.statut} />

          <div className="cmd-four-detail-grid">
            <div className="cmd-four-detail-item">
              <Hash size={14} />
              <div>
                <span className="cmd-four-detail-label">Numéro de commande</span>
                <span className="cmd-four-detail-value">{order.id}</span>
              </div>
            </div>
            <div className="cmd-four-detail-item">
              <Clock size={14} />
              <div>
                <span className="cmd-four-detail-label">Date</span>
                <span className="cmd-four-detail-value">{order.date}</span>
              </div>
            </div>
            <div className="cmd-four-detail-item">
              <ClipboardList size={14} />
              <div>
                <span className="cmd-four-detail-label">Statut</span>
                <StatusBadge status={order.statut} />
              </div>
            </div>
            <div className="cmd-four-detail-item">
              <Building2 size={14} />
              <div>
                <span className="cmd-four-detail-label">Commerçant</span>
                <span className="cmd-four-detail-value">{order.commercant}</span>
              </div>
            </div>
            <div className="cmd-four-detail-item">
              <Phone size={14} />
              <div>
                <span className="cmd-four-detail-label">Téléphone</span>
                <span className="cmd-four-detail-value">{order.phone}</span>
              </div>
            </div>
            <div className="cmd-four-detail-item">
              <MapPin size={14} />
              <div>
                <span className="cmd-four-detail-label">Adresse de livraison</span>
                <span className="cmd-four-detail-value">{order.address}</span>
              </div>
            </div>
          </div>

          <h4 className="cmd-four-modal-subtitle">Produits commandés</h4>
          <div className="cmd-four-items-table">
            <div className="cmd-four-items-head">
              <span>Produit</span>
              <span>Quantité</span>
              <span>Prix unitaire</span>
              <span>Sous-total</span>
            </div>
            {order.items.map((it) => (
              <div className="cmd-four-items-row" key={it.product}>
                <span>{it.product}</span>
                <span>{it.qty}</span>
                <span>{fmt(it.price)} MAD</span>
                <span>{fmt(it.qty * it.price)} MAD</span>
              </div>
            ))}
          </div>

          <div className="cmd-four-summary">
            <div className="cmd-four-summary-row">
              <span>Sous-total</span>
              <span>{fmt(subtotal)} MAD</span>
            </div>
            <div className="cmd-four-summary-row">
              <span>TVA (20%)</span>
              <span>{fmt(tva)} MAD</span>
            </div>
            <div className="cmd-four-summary-row cmd-four-summary-total">
              <span>Total TTC</span>
              <span>{fmt(total)} MAD</span>
            </div>
          </div>
        </div>

        <div className="cmd-four-modal-actions">
          {order.statut === 'En attente' && (
            <>
              <button type="button" className="cmd-four-btn cmd-four-btn-danger" onClick={() => onRefuse(order.id)}>
                <X size={15} /> Refuser
              </button>
              <button type="button" className="cmd-four-btn cmd-four-btn-primary" onClick={() => onAccept(order.id)}>
                <Check size={15} /> Accepter
              </button>
            </>
          )}
          {canAdvance && (
            <button type="button" className="cmd-four-btn cmd-four-btn-primary" onClick={() => onAdvance(order.id)}>
              Marquer « {nextLabel} »
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommandesRecuesFournisseur() {
  const location = useLocation();
  const navigate = useNavigate();

  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', to: '/accueil-fournisseur' },
    { icon: Package, label: 'Produits', to: '/produits-fournisseur' },
    { icon: ShoppingCart, label: 'Commandes reçues', to: '/commandes-fournisseur', active: true },
    { icon: CreditCard, label: 'Paiements', to: '/paiements-fournisseur' },
    { icon: Truck, label: 'Livraisons', to: '/livraisons-fournisseur' },
    { icon: Layers, label: 'Catalogue', to: '/catalogue-fournisseur' },
    { icon: Bell, label: 'Notifications', to: '/notifications-fournisseur' },
    { icon: Bot, label: 'Assistant IA', to: '/assistant-fournisseur' },
    { icon: User, label: 'Profil & Paramètres', to: '/profil-fournisseur' },
  ];

  const stats = useMemo(() => ({
    total: orders.length,
    attente: orders.filter((o) => o.statut === 'En attente').length,
    preparation: orders.filter((o) => o.statut === 'En préparation').length,
    livrees: orders.filter((o) => o.statut === 'Livrée').length,
  }), [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(search.trim().toLowerCase())
        || o.commercant.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = statusFilter === 'all' || o.statut === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageOrders = filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  const updateStatus = (id, statut) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, statut } : o)));
    setSelectedOrder((prev) => (prev && prev.id === id ? { ...prev, statut } : prev));
  };

  const handleAccept = (id) => updateStatus(id, 'Acceptée');
  const handleRefuse = (id) => updateStatus(id, 'Refusée');
  const handleAdvance = (id) => {
    const order = orders.find((o) => o.id === id);
    const nextIndex = STATUS_FLOW.indexOf(order.statut) + 1;
    if (STATUS_FLOW[nextIndex]) updateStatus(id, STATUS_FLOW[nextIndex]);
  };

  return (
    <div className="cmd-four-layout">
      {/* Sidebar */}
      <aside className="cmd-four-sidebar">
        <div className="acc-sidebar-logo">
          <Logo size={100} className="mb-6" logo-white />
        </div>

        <p className="cmd-four-sidebar-section">
          <Building2 size={13} />
          FOURNISSEUR
        </p>

        <nav className="cmd-four-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to || '#'}
                state={location.state}
                className={`cmd-four-nav-item ${item.active ? 'cmd-four-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link to="/" className="cmd-four-logout">
          <LogOut size={18} />
          Se déconnecter
        </Link>
      </aside>

      {/* Main content */}
      <main className="cmd-four-main" onClick={() => setOpenMenuId(null)}>
        <header className="cmd-four-topbar">
          <div>
            <h1 className="cmd-four-greeting">Commandes reçues</h1>
            <p className="cmd-four-greeting-sub">Consultez et gérez les commandes envoyées par les commerçants.</p>
          </div>

          <div className="cmd-four-topbar-actions">
            <div className="cmd-four-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <button type="button" className="cmd-four-icon-button" onClick={() => navigate('/notifications-fournisseur')}>
              <Bell size={18} />
              <span className="cmd-four-badge">3</span>
            </button>
            <div className="cmd-four-user-chip">
              <div className="cmd-four-user-avatar">MB</div>
              <div className="cmd-four-user-info">
                <span className="cmd-four-user-name">Marwa Boutabi</span>
                <span className="cmd-four-user-role">Fournisseur</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="cmd-four-stats-row">
          {STATS_META.map((s) => {
            const Icon = s.icon;
            return (
              <div className="cmd-four-stat-card" key={s.key}>
                <div className={`cmd-four-stat-icon cmd-four-stat-icon-${s.tone}`}>
                  <Icon size={18} />
                </div>
                <div className="cmd-four-stat-label">{s.label}</div>
                <p className="cmd-four-stat-value">{stats[s.key]}</p>
              </div>
            );
          })}
        </section>

        {/* Toolbar */}
        <section className="cmd-four-toolbar">
          <div className="cmd-four-toolbar-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            />
          </div>

          <div className="cmd-four-select-wrap">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); resetPage(); }}
            >
              <option value="all">Toutes</option>
              <option value="En attente">En attente</option>
              <option value="Acceptée">Acceptée</option>
              <option value="En préparation">En préparation</option>
              <option value="Expédiée">Expédiée</option>
              <option value="Livrée">Livrée</option>
              <option value="Refusée">Refusée</option>
            </select>
          </div>

          <button type="button" className="cmd-four-btn cmd-four-btn-ghost cmd-four-export-btn">
            <Download size={16} />
            Exporter
          </button>
        </section>

        {/* Table */}
        <section className="cmd-four-panel cmd-four-table-panel">
          <div className="cmd-four-table-scroll">
            <table className="cmd-four-table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Commerçant</th>
                  <th>Date</th>
                  <th>Articles</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageOrders.map((o) => {
                  const { total } = computeTotals(o.items);
                  return (
                    <tr key={o.id}>
                      <td className="cmd-four-ref">{o.id}</td>
                      <td className="cmd-four-commercant">{o.commercant}</td>
                      <td className="cmd-four-date">{o.date}</td>
                      <td className="cmd-four-articles">{o.items.length}</td>
                      <td className="cmd-four-total">{fmt(total)} MAD</td>
                      <td><StatusBadge status={o.statut} /></td>
                      <td>
                        <div className="cmd-four-row-actions" onClick={(e) => e.stopPropagation()}>
                          {/* ✅ Bouton œil SUPPRIMÉ */}
                          {o.statut === 'En attente' && (
                            <>
                              <button type="button" className="cmd-four-action-btn cmd-four-action-btn-accept" title="Accepter" onClick={() => handleAccept(o.id)}>
                                <Check size={15} />
                              </button>
                              <button type="button" className="cmd-four-action-btn cmd-four-action-btn-danger" title="Refuser" onClick={() => handleRefuse(o.id)}>
                                <X size={15} />
                              </button>
                            </>
                          )}
                          <div className="cmd-four-menu-wrap">
                            <button
                              type="button"
                              className="cmd-four-action-btn"
                              title="Plus d'actions"
                              onClick={() => setOpenMenuId(openMenuId === o.id ? null : o.id)}
                            >
                              <MoreVertical size={15} />
                            </button>
                            {openMenuId === o.id && (
                              <div className="cmd-four-menu">
                                <button type="button" onClick={() => { setSelectedOrder(o); setOpenMenuId(null); }}>
                                  Voir les détails
                                </button>
                                {STATUS_FLOW.indexOf(o.statut) >= 0 && STATUS_FLOW.indexOf(o.statut) < STATUS_FLOW.length - 1 && o.statut !== 'En attente' && (
                                  <button type="button" onClick={() => { handleAdvance(o.id); setOpenMenuId(null); }}>
                                    Marquer « {STATUS_FLOW[STATUS_FLOW.indexOf(o.statut) + 1]} »
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {pageOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="cmd-four-empty-row">Aucune commande ne correspond à votre recherche.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="cmd-four-pagination">
            <span className="cmd-four-pagination-info">
              {filteredOrders.length === 0
                ? '0 commande'
                : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filteredOrders.length)} sur ${filteredOrders.length} commandes`}
            </span>
            <div className="cmd-four-pagination-controls">
              <button type="button" className="cmd-four-page-btn" disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`cmd-four-page-btn ${n === currentPage ? 'cmd-four-page-btn-active' : ''}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button type="button" className="cmd-four-page-btn" disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAccept={handleAccept}
          onRefuse={handleRefuse}
          onAdvance={handleAdvance}
        />
      )}
    </div>
  );
}