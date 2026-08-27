import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, ShoppingCart, CreditCard, Truck, User,
  LogOut, Search, Bell, ChevronDown, ChevronLeft, ChevronRight,
  Building2, Download, Check, X, MoreVertical, Clock, ClipboardList,
  CheckCircle2, Phone, Hash, Bot, MapPin
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import axiosClient from '../services/api';
import './CommandesRecuesFournisseur.css';

// Statuts backend -> présentation
const STATUS_FLOW = ['EN_ATTENTE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'];
const TIMELINE_LABELS = ['Commande reçue', 'Préparation', 'Expédition', 'Livraison'];
const STATUS_LABELS = {
  EN_ATTENTE: 'En attente',
  EN_PREPARATION: 'En préparation',
  EXPEDIEE: 'Expédiée',
  LIVREE: 'Livrée',
  ANNULEE: 'Annulée',
};
const STATUS_TONE = {
  EN_ATTENTE: 'orange',
  EN_PREPARATION: 'purple',
  EXPEDIEE: 'cyan',
  LIVREE: 'green',
  ANNULEE: 'red',
};

const PAYMENT_LABELS = {
  UNPAID: 'Non payée',
  PAID: 'Payée',
};

const STATS_META = [
  { key: 'total', icon: Package, tone: 'blue', label: 'Commandes reçues' },
  { key: 'attente', icon: Clock, tone: 'orange', label: 'En attente' },
  { key: 'preparation', icon: ClipboardList, tone: 'purple', label: 'En préparation' },
  { key: 'livrees', icon: CheckCircle2, tone: 'green', label: 'Livrées' },
];

const PAGE_SIZE = 10;

function fmt(n) {
  return (n ?? 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR');
}

function StatusBadge({ status }) {
  return <span className={`cmd-four-badge-pill cmd-four-badge-pill-${STATUS_TONE[status] || 'orange'}`}>{STATUS_LABELS[status] || status}</span>;
}

function PaymentBadge({ paymentStatus }) {
  return (
    <span className={`cmd-four-badge-pill cmd-four-badge-pill-${paymentStatus === 'PAID' ? 'green' : 'red'}`}>
      {PAYMENT_LABELS[paymentStatus] || paymentStatus}
    </span>
  );
}

function OrderTimeline({ status }) {
  const isRefused = status === 'ANNULEE';
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
      {isRefused && <span className="cmd-four-timeline-refused">Commande annulée</span>}
    </div>
  );
}

function OrderDetailModal({ order, onClose, onAccept, onRefuse, onAdvance }) {
  const nextIndex = STATUS_FLOW.indexOf(order.status) + 1;
  const nextStatus = STATUS_FLOW[nextIndex];
  const canAdvance = order.status !== 'EN_ATTENTE' && order.status !== 'LIVREE' && order.status !== 'ANNULEE' && nextStatus;

  return (
    <div className="cmd-four-modal-overlay" onClick={onClose}>
      <div className="cmd-four-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-four-modal-header">
          <h3>Commande {order.reference}</h3>
          <button type="button" className="cmd-four-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="cmd-four-modal-body">
          <OrderTimeline status={order.status} />

          <div className="cmd-four-detail-grid">
            <div className="cmd-four-detail-item">
              <Hash size={14} />
              <div>
                <span className="cmd-four-detail-label">Numéro de commande</span>
                <span className="cmd-four-detail-value">{order.reference}</span>
              </div>
            </div>
            <div className="cmd-four-detail-item">
              <Clock size={14} />
              <div>
                <span className="cmd-four-detail-label">Date</span>
                <span className="cmd-four-detail-value">{formatDate(order.orderDate)}</span>
              </div>
            </div>
            <div className="cmd-four-detail-item">
              <ClipboardList size={14} />
              <div>
                <span className="cmd-four-detail-label">Statut</span>
                <StatusBadge status={order.status} />
              </div>
            </div>
            <div className="cmd-four-detail-item">
              <CreditCard size={14} />
              <div>
                <span className="cmd-four-detail-label">Paiement</span>
                <span className="cmd-four-detail-value">
                  {PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus}
                  {order.paymentStatus === 'PAID' && order.paidAt ? ` — ${formatDate(order.paidAt)}` : ''}
                </span>
              </div>
            </div>
            <div className="cmd-four-detail-item">
              <Building2 size={14} />
              <div>
                <span className="cmd-four-detail-label">Commerçant</span>
                <span className="cmd-four-detail-value">{order.merchantName}</span>
              </div>
            </div>
            <div className="cmd-four-detail-item">
              <Phone size={14} />
              <div>
                <span className="cmd-four-detail-label">Téléphone</span>
                <span className="cmd-four-detail-value">{order.merchantPhone || '—'}</span>
              </div>
            </div>
            <div className="cmd-four-detail-item">
              <MapPin size={14} />
              <div>
                <span className="cmd-four-detail-label">Adresse</span>
                <span className="cmd-four-detail-value">{order.merchantAddress || '—'}</span>
              </div>
            </div>
            <div className="cmd-four-detail-item">
              <Clock size={14} />
              <div>
                <span className="cmd-four-detail-label">Livraison souhaitée</span>
                <span className="cmd-four-detail-value">{order.deliveryDate || 'À définir'}</span>
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
              <div className="cmd-four-items-row" key={it.id}>
                <span>{it.productName}</span>
                <span>{it.quantity}</span>
                <span>{fmt(it.unitPrice)} MAD</span>
                <span>{fmt(it.subtotal)} MAD</span>
              </div>
            ))}
          </div>

          <div className="cmd-four-summary">
            <div className="cmd-four-summary-row cmd-four-summary-total">
              <span>Total TTC</span>
              <span>{fmt(order.totalAmount)} MAD</span>
            </div>
          </div>
        </div>

        <div className="cmd-four-modal-actions">
          {order.status === 'EN_ATTENTE' && (
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
              Marquer « {STATUS_LABELS[nextStatus]} »
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

  // State pour stocker les informations de l'utilisateur connecté
  const [user, setUser] = useState(null);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Chargement du profil utilisateur au montage du composant
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
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

  const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', to: '/accueil-fournisseur' },
    { icon: Package, label: 'Produits', to: '/produits-fournisseur' },
    { icon: ShoppingCart, label: 'Commandes reçues', to: '/commandes-fournisseur', active: true },
    { icon: Truck, label: 'Livraisons', to: '/livraisons-fournisseur' },
    { icon: Bell, label: 'Notifications', to: '/notifications-fournisseur' },
    { icon: Bot, label: 'Assistant IA', to: '/assistant-fournisseur' },
    { icon: User, label: 'Profil & Paramètres', to: '/profil-fournisseur' },
  ];

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await axiosClient.get('/supplier/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = useMemo(() => ({
    total: orders.length,
    attente: orders.filter((o) => o.status === 'EN_ATTENTE').length,
    preparation: orders.filter((o) => o.status === 'EN_PREPARATION').length,
    livrees: orders.filter((o) => o.status === 'LIVREE').length,
  }), [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        (o.reference || '').toLowerCase().includes(search.trim().toLowerCase())
        || (o.merchantName || '').toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageOrders = filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  const updateStatus = async (id, status) => {
    try {
      const res = await axiosClient.patch(`/supplier/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o.id === id ? res.data : o)));
      setSelectedOrder((prev) => (prev && prev.id === id ? res.data : prev));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur lors de la mise à jour du statut.');
    }
  };

  // "Accepter" fait passer directement à EN_PREPARATION (déclenche la décrémentation du stock)
  const handleAccept = (id) => updateStatus(id, 'EN_PREPARATION');
  const handleRefuse = (id) => updateStatus(id, 'ANNULEE');
  const handleAdvance = (id) => {
    const order = orders.find((o) => o.id === id);
    const nextIndex = STATUS_FLOW.indexOf(order.status) + 1;
    if (STATUS_FLOW[nextIndex]) updateStatus(id, STATUS_FLOW[nextIndex]);
  };

  // Helper pour générer les initiales si l'utilisateur est chargé
  const getInitials = () => {
    if (!user) return 'MB'; // Fallback par défaut
    const prenom = user.prenom || user.firstName || '';
    const nom = user.nom || user.lastName || '';
    const firstLetter = prenom.charAt(0).toUpperCase();
    const lastLetter = nom.charAt(0).toUpperCase();
    return `${firstLetter}${lastLetter}` || 'U';
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
            <button type="button" className="cmd-four-icon-button" onClick={() => navigate('/notifications-fournisseur')}>
              <Bell size={18} />
              <span className="cmd-four-badge">3</span>
            </button>
            <div className="cmd-four-user-chip">
              {/* Avatar avec initiales dynamiques */}
              <div className="cmd-four-user-avatar">{getInitials()}</div>
              <div className="cmd-four-user-info">
                {/* Affichage dynamique Nom Prénom */}
                <span className="cmd-four-user-name">
                  {user
                    ? `${user.prenom || user.firstName || ''} ${user.nom || user.lastName || ''}`.trim()
                    : 'Fournisseur'}
                </span>
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
              <option value="EN_ATTENTE">En attente</option>
              <option value="EN_PREPARATION">En préparation</option>
              <option value="EXPEDIEE">Expédiée</option>
              <option value="LIVREE">Livrée</option>
              <option value="ANNULEE">Annulée</option>
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
                  <th>Paiement</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingOrders && (
                  <tr><td colSpan={8} className="cmd-four-empty-row">Chargement...</td></tr>
                )}
                {!loadingOrders && pageOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="cmd-four-ref">{o.reference}</td>
                    <td className="cmd-four-commercant">{o.merchantName}</td>
                    <td className="cmd-four-date">{formatDate(o.orderDate)}</td>
                    <td className="cmd-four-articles">{o.items.length}</td>
                    <td className="cmd-four-total">{fmt(o.totalAmount)} MAD</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td><PaymentBadge paymentStatus={o.paymentStatus} /></td>
                    <td>
                      <div className="cmd-four-row-actions" onClick={(e) => e.stopPropagation()}>
                        {o.status === 'EN_ATTENTE' && (
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
                              {STATUS_FLOW.indexOf(o.status) >= 0 && STATUS_FLOW.indexOf(o.status) < STATUS_FLOW.length - 1 && o.status !== 'EN_ATTENTE' && (
                                <button type="button" onClick={() => { handleAdvance(o.id); setOpenMenuId(null); }}>
                                  Marquer « {STATUS_LABELS[STATUS_FLOW[STATUS_FLOW.indexOf(o.status) + 1]]} »
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}

                {!loadingOrders && pageOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="cmd-four-empty-row">Aucune commande ne correspond à votre recherche.</td>
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