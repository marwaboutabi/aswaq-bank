import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  CreditCard,
  ArrowLeftRight,
  Receipt,
  Star,
  PiggyBank,
  PieChart,
  Bell,
  Bot,
  User,
  LogOut,
  Search,
  Filter,
  Calendar,
  Package,
  Store,
  DollarSign,
  ChevronRight,
  CheckCircle2,
  X,
  Download,
  Printer,
  Clock,
  Hash,
} from 'lucide-react';

import Logo from '../components/Logo/Logo';
import api from '../services/api';

import './TicketsNumeriquesClient.css';
import './DashboardClient.css';

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/dashboard-client' },
  { icon: CreditCard, label: 'Gestion du compte', to: '/mon-compte' },
  {
    icon: ArrowLeftRight,
    label: 'Historique des transactions',
    to: '/transactions-client',
  },
  {
    icon: Receipt,
    label: 'Tickets numériques',
    to: '/tickets-client',
    active: true,
  },
  { icon: Star, label: 'Points de fidélité', to: '/fidelite' },
  { icon: PiggyBank, label: "Objectifs d'épargne", to: '/epargne' },
  { icon: PieChart, label: 'Suivi des dépenses', to: '/depenses' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant' },
  { icon: User, label: 'Profil et paramètres', to: '/parametres' },
];

// Filtres disponibles : type, libellé affiché, icône et placeholder de l'input.
// Un seul filtre actif par "type" à la fois, mais plusieurs types peuvent
// être combinés en même temps (ex : Commerce + Montant min.)
const FILTER_TYPES = [
  { value: 'merchant', label: 'Commerce', icon: Store, placeholder: 'Ex: Carrefour' },
  { value: 'product', label: 'Produit', icon: Package, placeholder: 'Ex: Lait' },
  { value: 'date', label: 'Date', icon: Calendar, placeholder: 'Ex: 20 juil' },
  { value: 'amount', label: 'Montant min.', icon: DollarSign, placeholder: 'Ex: 100' },
];

const FILTER_LABEL_BY_TYPE = FILTER_TYPES.reduce((acc, f) => {
  acc[f.value] = f.label;
  return acc;
}, {});

/**
 * Transforme une vente backend en objet utilisable
 * directement par l'interface des tickets.
 */
const mapSaleToTicket = (sale) => {
  const items = Array.isArray(sale.items) ? sale.items : [];

  const totalAmount = Number(sale.totalAmount || 0);
  const voucherAmount = Number(sale.voucherAmount || 0);
  const paidAmount = Number(sale.paidAmount || 0);

  const createdAt = sale.createdAt
    ? new Date(sale.createdAt)
    : null;

  const validDate =
    createdAt && !Number.isNaN(createdAt.getTime())
      ? createdAt
      : null;

  const date = validDate
    ? validDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '-';

  const dateShort = validDate
    ? validDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '-';

  const time = validDate
    ? validDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';

  const articles = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const mappedItems = items.map((item) => ({
    name: item.product?.name || 'Produit',
    qty: Number(item.quantity || 0),
    price: Number(item.unitPrice || 0),
  }));

  return {
    id: sale.id,
    merchant:
      sale.merchant?.companyName ||
      sale.merchant?.name ||
      'Commerce',

    merchantLogo:
      sale.merchant?.companyName?.charAt(0)?.toUpperCase() || '🛍️',

    date,
    dateShort,
    time,

    articles,
    amount: totalAmount,

    points: 0,

    verified: sale.status === 'PAID',

    location:
      sale.merchant?.address ||
      sale.merchant?.city ||
      'Commerce',

    items: mappedItems,

    subtotal: totalAmount - voucherAmount,
    tax: 0,
    total: totalAmount,

    payment:
      paidAmount > 0
        ? 'Paiement'
        : voucherAmount > 0
          ? 'Bon d’achat'
          : 'Non payé',

    reference: `TKT-${String(sale.id).padStart(6, '0')}`,

    voucherAmount,
    voucherCode: sale.voucherCode || null,
    paidAmount,

    status: sale.status || 'PENDING',
  };
};

export default function TicketsNumeriquesClient() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedTicket, setSelectedTicket] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  // Filtres combinables : liste de { type, value }
  const [activeFilters, setActiveFilters] = useState([]);
  const [pendingFilterType, setPendingFilterType] = useState('merchant');
  const [pendingFilterValue, setPendingFilterValue] = useState('');

  const carouselRef = useRef(null);

  // =========================================================
  // CHARGER LES VENTES DU CLIENT
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const loadSales = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/sales/client');

        if (!mounted) return;

        const data = Array.isArray(response.data)
          ? response.data
          : [];

        setSales(data);
      } catch (err) {
        console.error(
          'Erreur lors du chargement des tickets :',
          err
        );

        if (!mounted) return;

        setError(
          err.response?.data?.message ||
            'Impossible de charger vos tickets.'
        );

        setSales([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSales();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // TRANSFORMATION DES VENTES
  // =========================================================

  const tickets = useMemo(() => {
    return sales
      .map(mapSaleToTicket)
      .sort((a, b) => {
        const dateA = new Date(
          a.date
        ).getTime();

        const dateB = new Date(
          b.date
        ).getTime();

        return dateB - dateA;
      });
  }, [sales]);

  // =========================================================
  // FILTRES
  // =========================================================

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const query = searchQuery
        .trim()
        .toLowerCase();

      const matchesSearch =
        query === '' ||
        ticket.merchant
          .toLowerCase()
          .includes(query) ||
        ticket.items.some((item) =>
          item.name
            .toLowerCase()
            .includes(query)
        ) ||
        ticket.location
          .toLowerCase()
          .includes(query) ||
        ticket.reference
          .toLowerCase()
          .includes(query);

      // Tous les filtres actifs doivent correspondre (combinaison en ET)
      const matchesAdvancedFilters = activeFilters.every((filter) => {
        if (filter.type === 'merchant') {
          return ticket.merchant
            .toLowerCase()
            .includes(filter.value.toLowerCase());
        }

        if (filter.type === 'product') {
          return ticket.items.some((item) =>
            item.name
              .toLowerCase()
              .includes(filter.value.toLowerCase())
          );
        }

        if (filter.type === 'date') {
          return ticket.dateShort
            .toLowerCase()
            .includes(filter.value.toLowerCase());
        }

        if (filter.type === 'amount') {
          const amount = parseFloat(filter.value);
          return Number.isNaN(amount)
            ? true
            : ticket.amount >= amount;
        }

        return true;
      });

      return matchesSearch && matchesAdvancedFilters;
    });
  }, [
    tickets,
    searchQuery,
    activeFilters,
  ]);

  // =========================================================
  // GROUPER PAR DATE
  // =========================================================

  const ticketsByDate = useMemo(() => {
    return filteredTickets.reduce(
      (acc, ticket) => {
        if (!acc[ticket.dateShort]) {
          acc[ticket.dateShort] = [];
        }

        acc[ticket.dateShort].push(ticket);

        return acc;
      },
      {}
    );
  }, [filteredTickets]);

  const dateKeys = Object.keys(
    ticketsByDate
  );

  const todayDateKey =
    dateKeys.length > 0
      ? dateKeys[0]
      : null;

  const todayTickets = todayDateKey
    ? ticketsByDate[todayDateKey] || []
    : [];

  const otherDates = dateKeys.filter(
    (date) => date !== todayDateKey
  );

  // =========================================================
  // STATISTIQUES
  // =========================================================

  const totalTickets =
    filteredTickets.length;

  const totalAmount =
    filteredTickets.reduce(
      (sum, ticket) =>
        sum + ticket.amount,
      0
    );

  const lastPurchase =
    filteredTickets.length > 0
      ? filteredTickets[0].date
      : '-';

  // =========================================================
  // CAROUSEL
  // =========================================================

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) {
      return;
    }

    const scrollAmount = 320;

    carouselRef.current.scrollBy({
      left:
        direction === 'left'
          ? -scrollAmount
          : scrollAmount,
      behavior: 'smooth',
    });
  };

  // =========================================================
  // FILTRES — ajout / suppression
  // =========================================================

  const addFilter = () => {
    if (!pendingFilterValue.trim()) {
      return;
    }

    setActiveFilters((prev) => [
      // un seul filtre par type : on remplace celui du même type s'il existe
      ...prev.filter((f) => f.type !== pendingFilterType),
      { type: pendingFilterType, value: pendingFilterValue.trim() },
    ]);

    setPendingFilterValue('');
  };

  const removeFilter = (type) => {
    setActiveFilters((prev) =>
      prev.filter((f) => f.type !== type)
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveFilters([]);
    setPendingFilterValue('');
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="dash-layout">
        <aside className="dash-sidebar">
          <div className="dash-sidebar-logo">
            <Logo />
          </div>

          <nav className="dash-nav">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  state={location.state}
                  className={`dash-nav-item ${
                    item.active
                      ? 'dash-nav-item-active'
                      : ''
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="dash-main">
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
            }}
          >
            Chargement de vos tickets...
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // AFFICHAGE
  // =========================================================

  return (
    <div className="dash-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="dash-sidebar">

        <div className="dash-sidebar-logo">
          <Logo />
        </div>

        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.to}
                state={location.state}
                className={`dash-nav-item ${
                  item.active
                    ? 'dash-nav-item-active'
                    : ''
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="dash-sidebar-help">
          <p>Besoin d'aide ?</p>
          <span>
            Notre assistant IA est là pour vous aider
          </span>

          <Link to="/assistant">
            Discuter avec l'IA →
          </Link>
        </div>

        <button
          type="button"
          className="dash-logout"
          onClick={() => navigate('/')}
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="dash-main">

        {/* HEADER */}

        <header className="dash-topbar">

          <div>
            <h1 className="dash-greeting">
              Mes tickets
            </h1>

            <p className="dash-greeting-sub">
              Retrouvez tous vos tickets d'achat
              au même endroit.
            </p>
          </div>

          <div className="dash-topbar-actions">

            <div className="dash-search">
              <Search size={16} />

              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
              />
            </div>

            <button
              type="button"
              className="dash-icon-button"
              onClick={() =>
                navigate('/notifications')
              }
            >
              <Bell size={18} />
            </button>

          </div>
        </header>

        {/* ERREUR */}

        {error && (
          <div
            style={{
              margin: '20px 0',
              padding: '14px 18px',
              borderRadius: '10px',
              background: '#fee2e2',
              color: '#b91c1c',
            }}
          >
            {error}
          </div>
        )}

        {/* SUMMARY */}

        <section className="tickets-summary-grid">

          <div className="tickets-summary-card">
            <p className="tickets-summary-label">
              Total des tickets
            </p>

            <p className="tickets-summary-value">
              {totalTickets}
            </p>
          </div>

          <div className="tickets-summary-card">
            <p className="tickets-summary-label">
              Achats ce mois-ci
            </p>

            <p className="tickets-summary-value">
              {totalAmount.toLocaleString(
                'fr-FR',
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}{' '}
              MAD
            </p>
          </div>

          <div className="tickets-summary-card">

            <p className="tickets-summary-label">
              Dernier achat
            </p>

            <p className="tickets-summary-value tickets-summary-highlight">
              {lastPurchase}
            </p>

          </div>

        </section>

        {/* SEARCH */}

        <section className="tickets-search-section">

          <div className="tickets-search-bar">

            <Search
              size={18}
              className="tickets-search-icon"
            />

            <input
              type="text"
              placeholder="Rechercher un ticket, un produit ou un commerce"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="tickets-search-input"
            />

            {searchQuery && (
              <button
                type="button"
                className="tickets-search-clear"
                onClick={() =>
                  setSearchQuery('')
                }
              >
                <X size={16} />
              </button>
            )}

          </div>

        </section>

        {/* =====================================================
            FILTRES — un seul bloc cohérent :
            1) on choisit le TYPE de filtre dans le menu déroulant
            2) on saisit la valeur juste à côté et on valide
            3) chaque filtre actif apparaît en "puce" et peut être
               retiré individuellement — plusieurs types peuvent
               être combinés en même temps (ex: Commerce + Montant)
        ===================================================== */}

        <section className="tickets-filters">

          <div className="tickets-filter-builder">

            <div className="tickets-filter-type">
              <select
                value={pendingFilterType}
                onChange={(e) => {
                  setPendingFilterType(e.target.value);
                  setPendingFilterValue('');
                }}
              >
                {FILTER_TYPES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <input
              type={
                pendingFilterType === 'amount'
                  ? 'number'
                  : 'text'
              }
              placeholder={
                FILTER_TYPES.find(
                  (f) => f.value === pendingFilterType
                )?.placeholder
              }
              value={pendingFilterValue}
              onChange={(e) =>
                setPendingFilterValue(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === 'Enter' && addFilter()
              }
              className="tickets-filter-builder-input"
            />

            <button
              type="button"
              className="tickets-filter-add-btn"
              onClick={addFilter}
              disabled={!pendingFilterValue.trim()}
            >
              <Filter size={14} />
              Filtrer
            </button>

          </div>

          {activeFilters.length > 0 && (
            <div className="tickets-filter-chips">

              {activeFilters.map((f) => (
                <span key={f.type} className="tickets-filter-chip">
                  {FILTER_LABEL_BY_TYPE[f.type]} : {f.value}
                  <button
                    type="button"
                    onClick={() => removeFilter(f.type)}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

            </div>
          )}

          {(searchQuery || activeFilters.length > 0) && (
            <div className="tickets-results-count">

              <span>
                {totalTickets} résultat
                {totalTickets > 1 ? 's' : ''}
              </span>

              <button
                type="button"
                className="tickets-clear-all"
                onClick={clearFilters}
              >
                Effacer les filtres
              </button>

            </div>
          )}

        </section>

        {/* NO RESULTS */}

        {filteredTickets.length === 0 && (
          <div className="tickets-no-results">

            <Search size={48} />

            <h3>
              {error
                ? 'Impossible de charger les tickets'
                : 'Aucun ticket trouvé'}
            </h3>

            <p>
              {error
                ? 'Vérifiez votre connexion ou réessayez.'
                : 'Essayez de modifier vos critères de recherche'}
            </p>

            {!error && (
              <button
                type="button"
                className="tickets-reset-btn"
                onClick={clearFilters}
              >
                Réinitialiser les filtres
              </button>
            )}

          </div>
        )}

        {/* =====================================================
            DERNIERS TICKETS
        ===================================================== */}

        {todayTickets.length > 0 && (
          <section className="tickets-section">

            <h2 className="tickets-section-title">
              {todayDateKey?.toUpperCase()}
            </h2>

            <div className="tickets-carousel-container">

              <div
                className="tickets-carousel"
                ref={carouselRef}
              >

                {todayTickets.map(
                  (ticket) => (
                    <div
                      key={ticket.id}
                      className="tickets-carousel-card"
                    >

                      <div className="ticket-topbar" />

                      <div className="tickets-card-header">

                        <div className="tickets-merchant-logo">
                          {ticket.merchantLogo}
                        </div>

                        <div className="tickets-merchant-info">

                          <p className="tickets-merchant-name">
                            {ticket.merchant}
                          </p>

                          <p className="tickets-merchant-date">
                            {ticket.date} •{' '}
                            {ticket.time}
                          </p>

                        </div>

                      </div>

                      <div className="ticket-perforation" />

                      <div className="tickets-card-body">

                        <div className="tickets-card-stats">

                          <span className="tickets-articles">
                            {ticket.articles}{' '}
                            article
                            {ticket.articles >
                            1
                              ? 's'
                              : ''}
                          </span>

                          <span className="tickets-amount">
                            {ticket.amount.toLocaleString(
                              'fr-FR',
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}{' '}
                            MAD
                          </span>

                        </div>

                        <div className="tickets-card-badges">

                          {ticket.verified && (
                            <span className="tickets-badge tickets-badge-verified">
                              <CheckCircle2
                                size={12}
                              />
                              Achat vérifié
                            </span>
                          )}

                          {ticket.voucherAmount >
                            0 && (
                            <span className="tickets-badge tickets-badge-points">
                              Bon : -
                              {ticket.voucherAmount.toLocaleString(
                                'fr-FR'
                              )}{' '}
                              MAD
                            </span>
                          )}

                        </div>

                      </div>

                      <button
                        type="button"
                        className="tickets-open-btn"
                        onClick={() =>
                          setSelectedTicket(
                            ticket
                          )
                        }
                      >
                        Ouvrir le ticket
                      </button>

                    </div>
                  )
                )}

              </div>

              <button
                type="button"
                className="tickets-carousel-btn tickets-carousel-btn-right"
                onClick={() =>
                  scrollCarousel('right')
                }
              >
                <ChevronRight size={20} />
              </button>

            </div>
          </section>
        )}

        {/* =====================================================
            AUTRES DATES
        ===================================================== */}

        {otherDates.map(
          (dateShort) => {

            const dateTickets =
              ticketsByDate[
                dateShort
              ];

            if (
              dateTickets.length === 0
            ) {
              return null;
            }

            return (
              <section
                key={dateShort}
                className="tickets-section"
              >

                <div className="tickets-section-header">

                  <h2 className="tickets-section-title">
                    {dateShort.toUpperCase()}
                  </h2>

                  <button
                    type="button"
                    className="tickets-view-all"
                  >
                    Voir tout
                  </button>

                </div>

                <div className="tickets-grid">

                  {dateTickets.map(
                    (ticket) => (
                      <div
                        key={ticket.id}
                        className="tickets-grid-card"
                      >

                        <div className="ticket-topbar" />

                        <div className="tickets-card-header">

                          <div className="tickets-merchant-logo">
                            {ticket.merchantLogo}
                          </div>

                          <div className="tickets-merchant-info">

                            <p className="tickets-merchant-name">
                              {ticket.merchant}
                            </p>

                            <p className="tickets-merchant-date">
                              {ticket.date} •{' '}
                              {ticket.time}
                            </p>

                          </div>

                        </div>

                        <div className="ticket-perforation" />

                        <div className="tickets-card-body">

                          <div className="tickets-card-stats">

                            <span className="tickets-articles">
                              {ticket.articles}{' '}
                              article
                              {ticket.articles >
                              1
                                ? 's'
                                : ''}
                            </span>

                            <span className="tickets-amount">
                              {ticket.amount.toLocaleString(
                                'fr-FR',
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}{' '}
                              MAD
                            </span>

                          </div>

                          <div className="tickets-card-badges">

                            {ticket.verified && (
                              <span className="tickets-badge tickets-badge-verified">
                                <CheckCircle2
                                  size={12}
                                />
                                Achat vérifié
                              </span>
                            )}

                            {ticket.voucherAmount >
                              0 && (
                              <span className="tickets-badge tickets-badge-points">
                                Bon : -
                                {ticket.voucherAmount.toLocaleString(
                                  'fr-FR'
                                )}{' '}
                                MAD
                              </span>
                            )}

                          </div>

                        </div>

                        <button
                          type="button"
                          className="tickets-open-btn"
                          onClick={() =>
                            setSelectedTicket(
                              ticket
                            )
                          }
                        >
                          Ouvrir le ticket
                        </button>

                      </div>
                    )
                  )}

                </div>
              </section>
            );
          }
        )}

      </main>

      {/* =====================================================
          TICKET DETAILS
      ===================================================== */}

      {selectedTicket && (
        <div
          className="tickets-overlay"
          onClick={() =>
            setSelectedTicket(null)
          }
        >

          <div
            className="tickets-drawer"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="tickets-drawer-header">

              <h2>
                Détails du ticket
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSelectedTicket(null)
                }
              >
                <X size={20} />
              </button>

            </div>

            <div className="tickets-drawer-body">

              <div className="receipt-container">

                <div className="receipt">

                  {/* HEADER */}

                  <div className="receipt-header">

                    <div className="receipt-logo">
                      {
                        selectedTicket.merchantLogo
                      }
                    </div>

                    <h3 className="receipt-merchant">
                      {
                        selectedTicket.merchant
                      }
                    </h3>

                    <p className="receipt-location">
                      {
                        selectedTicket.location
                      }
                    </p>

                  </div>

                  <div className="receipt-divider receipt-divider-dashed" />

                  {/* INFOS */}

                  <div className="receipt-info-row">

                    <span>
                      <Clock size={12} />
                      {' '}
                      {selectedTicket.date}{' '}
                      à{' '}
                      {
                        selectedTicket.time
                      }
                    </span>

                    <span>
                      <Hash size={12} />
                      {' '}
                      {
                        selectedTicket.reference
                      }
                    </span>

                  </div>

                  <div className="receipt-divider receipt-divider-dashed" />

                  {/* ARTICLES */}

                  <div className="receipt-items">

                    <div className="receipt-items-header">

                      <span>
                        Article
                      </span>

                      <span>
                        Qté
                      </span>

                      <span>
                        Prix
                      </span>

                    </div>

                    {selectedTicket.items.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="receipt-item-row"
                        >

                          <span className="receipt-item-name">
                            {item.name}
                          </span>

                          <span className="receipt-item-qty">
                            x{item.qty}
                          </span>

                          <span className="receipt-item-price">
                            {(
                              item.price *
                              item.qty
                            ).toLocaleString(
                              'fr-FR',
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}{' '}
                            MAD
                          </span>

                        </div>
                      )
                    )}

                  </div>

                  <div className="receipt-divider receipt-divider-dashed" />

                  {/* TOTALS */}

                  <div className="receipt-totals">

                    <div className="receipt-total-row">

                      <span>
                        Sous-total
                      </span>

                      <span>
                        {selectedTicket.subtotal.toLocaleString(
                          'fr-FR',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{' '}
                        MAD
                      </span>

                    </div>

                    {selectedTicket.voucherAmount >
                      0 && (
                      <div className="receipt-total-row">

                        <span>
                          Bon utilisé
                        </span>

                        <span>
                          -
                          {selectedTicket.voucherAmount.toLocaleString(
                            'fr-FR',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{' '}
                          MAD
                        </span>

                      </div>
                    )}

                    <div className="receipt-total-row receipt-total-final">

                      <span>
                        TOTAL À PAYER
                      </span>

                      <span>
                        {selectedTicket.paidAmount.toLocaleString(
                          'fr-FR',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{' '}
                        MAD
                      </span>

                    </div>

                  </div>

                  <div className="receipt-divider receipt-divider-dashed" />

                  {/* PAIEMENT */}

                  <div className="receipt-payment">

                    <p>
                      <strong>
                        Statut :
                      </strong>{' '}
                      {selectedTicket.status ===
                      'PAID'
                        ? 'Payé'
                        : selectedTicket.status ===
                          'PENDING'
                        ? 'En attente'
                        : selectedTicket.status ===
                          'CANCELLED'
                        ? 'Annulé'
                        : selectedTicket.status}
                    </p>

                    {selectedTicket.voucherCode && (
                      <p>
                        <strong>
                          Bon utilisé :
                        </strong>{' '}
                        {
                          selectedTicket.voucherCode
                        }
                      </p>
                    )}

                  </div>

                  <div className="receipt-divider receipt-divider-dashed" />

                  {/* BARCODE */}

                  <div className="receipt-barcode">

                    <div className="receipt-barcode-lines">

                      {Array.from({
                        length: 40,
                      }).map(
                        (_, i) => (
                          <div
                            key={i}
                            className="receipt-barcode-line"
                            style={{
                              width:
                                i % 3 ===
                                0
                                  ? '2px'
                                  : '1px',
                            }}
                          />
                        )
                      )}

                    </div>

                    <p className="receipt-barcode-number">
                      {
                        selectedTicket.reference
                      }
                    </p>

                  </div>

                  <div className="receipt-footer">

                    <p>
                      Merci de votre visite !
                    </p>

                    <p>
                      Conservez ce ticket pour
                      tout échange ou retour.
                    </p>

                  </div>

                </div>

              </div>

              <div className="receipt-actions">

                <button
                  type="button"
                  className="receipt-action-btn"
                  onClick={() =>
                    window.print()
                  }
                >
                  <Download size={18} />
                  Télécharger le PDF
                </button>

                <button
                  type="button"
                  className="receipt-action-btn"
                  onClick={() =>
                    window.print()
                  }
                >
                  <Printer size={18} />
                  Imprimer
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}