import React, { useState, useRef } from 'react';
import { Link, useLocation , useNavigate } from 'react-router-dom';
import {
  Home, CreditCard, ArrowLeftRight, Receipt, Star,
  PiggyBank, PieChart, Bell, Bot, User, LogOut, Search, ChevronDown,
  Calendar, Package, Store, DollarSign,  ChevronRight,
  CheckCircle2, X, Download, Printer,Clock, Hash, 
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './TicketsNumeriquesClient.css';
import './DashboardClient.css';

const TICKETS = [
  {
    id: 1,
    merchant: 'Carrefour',
    merchantLogo: '',
    date: '20 juillet 2026',
    dateShort: '20 Juil. 2026',
    time: '14:32',
    articles: 3,
    amount: 250.00,
    points: 25,
    verified: true,
    location: 'Carrefour Market - Casablanca',
    items: [
      { name: 'Lait entier 1L', qty: 2, price: 12.50 },
      { name: 'Pain complet', qty: 1, price: 8.00 },
      { name: 'Fromage emmental 200g', qty: 1, price: 45.00 },
    ],
    subtotal: 78.00,
    tax: 12.00,
    total: 250.00,
    payment: 'Carte •••• 4589',
    reference: 'TKT-2026-0720-001',
  },
  {
    id: 2,
    merchant: 'Café Central',
    merchantLogo: '☕',
    date: '20 juillet 2026',
    dateShort: '20 Juil. 2026',
    time: '12:18',
    articles: 2,
    amount: 85.00,
    points: 8,
    verified: true,
    location: 'Café Central - Maarif',
    items: [
      { name: 'Cappuccino', qty: 2, price: 25.00 },
      { name: 'Croissant', qty: 2, price: 17.50 },
    ],
    subtotal: 85.00,
    tax: 0,
    total: 85.00,
    payment: 'QR Code',
    reference: 'TKT-2026-0720-002',
  },
  {
    id: 3,
    merchant: 'Marjane',
    merchantLogo: '',
    date: '20 juillet 2026',
    dateShort: '20 Juil. 2026',
    time: '10:45',
    articles: 6,
    amount: 430.00,
    points: 43,
    verified: true,
    location: 'Marjane Hyper - Ain Sebaa',
    items: [
      { name: 'Riz basmati 1kg', qty: 2, price: 35.00 },
      { name: 'Huile d\'olive 1L', qty: 1, price: 65.00 },
      { name: 'Poulet entier', qty: 2, price: 45.00 },
      { name: 'Tomates 1kg', qty: 3, price: 15.00 },
    ],
    subtotal: 400.00,
    tax: 30.00,
    total: 430.00,
    payment: 'Carte •••• 4589',
    reference: 'TKT-2026-0720-003',
  },
  {
    id: 4,
    merchant: 'Carrefour',
    merchantLogo: '🛒',
    date: '19 juillet 2026',
    dateShort: '19 Juil. 2026',
    time: '14:32',
    articles: 3,
    amount: 250.00,
    points: 25,
    verified: true,
    location: 'Carrefour Market - Casablanca',
    items: [
      { name: 'Yaourt nature x4', qty: 2, price: 18.00 },
      { name: 'Jus d\'orange 1L', qty: 3, price: 22.00 },
      { name: 'Biscuits chocolat', qty: 1, price: 28.00 },
    ],
    subtotal: 230.00,
    tax: 20.00,
    total: 250.00,
    payment: 'Carte •••• 4589',
    reference: 'TKT-2026-0719-001',
  },
  {
    id: 5,
    merchant: 'Café Central',
    merchantLogo: '☕',
    date: '18 juillet 2026',
    dateShort: '18 Juil. 2026',
    time: '12:18',
    articles: 2,
    amount: 85.00,
    points: 8,
    verified: true,
    location: 'Café Central - Maarif',
    items: [
      { name: 'Espresso', qty: 2, price: 15.00 },
      { name: 'Muffin myrtille', qty: 2, price: 27.50 },
    ],
    subtotal: 85.00,
    tax: 0,
    total: 85.00,
    payment: 'QR Code',
    reference: 'TKT-2026-0718-001',
  },
];

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/dashboard-client' },
  { icon: CreditCard, label: 'Gestion du compte', to: '/mon-compte' },
  { icon: ArrowLeftRight, label: 'Historique des transactions', to: '/transactions-client' },
  { icon: Receipt, label: 'Tickets numériques', to: '/tickets-client', active: true },
  { icon: Star, label: 'Points de fidélité', to: '/fidelite' },
  { icon: PiggyBank, label: "Objectifs d'épargne", to: '/epargne' },
  { icon: PieChart, label: 'Suivi des dépenses', to: '/depenses' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant' },
  { icon: User, label: 'Profil et paramètres', to: '/parametres' },
];

export default function TicketsNumeriques() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const carouselRef = useRef(null);

  const filteredTickets = TICKETS.filter((ticket) => {
    const matchesSearch = searchQuery === '' || 
      ticket.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ticket.location.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesAdvancedFilter = true;
    
    if (selectedFilter === 'merchant' && filterValue) {
      matchesAdvancedFilter = ticket.merchant.toLowerCase().includes(filterValue.toLowerCase());
    } else if (selectedFilter === 'product' && filterValue) {
      matchesAdvancedFilter = ticket.items.some(item => 
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    } else if (selectedFilter === 'date' && filterValue) {
      matchesAdvancedFilter = ticket.dateShort.includes(filterValue);
    } else if (selectedFilter === 'amount' && filterValue) {
      const amount = parseFloat(filterValue);
      if (!isNaN(amount)) {
        matchesAdvancedFilter = ticket.amount >= amount;
      }
    }

    return matchesSearch && matchesAdvancedFilter;
  });

  const ticketsByDate = filteredTickets.reduce((acc, ticket) => {
    if (!acc[ticket.dateShort]) {
      acc[ticket.dateShort] = [];
    }
    acc[ticket.dateShort].push(ticket);
    return acc;
  }, {});

  const todayTickets = ticketsByDate['20 Juil. 2026'] || [];
  const otherDates = Object.keys(ticketsByDate)
    .filter(date => date !== '20 Juil. 2026')
    .sort((a, b) => {
      const dateA = new Date(a.split(' ')[2] + '-' + a.split(' ')[1] + '-' + a.split(' ')[0]);
      const dateB = new Date(b.split(' ')[2] + '-' + b.split(' ')[1] + '-' + b.split(' ')[0]);
      return dateB - dateA;
    });

  const totalTickets = filteredTickets.length;
  const totalAmount = filteredTickets.reduce((sum, t) => sum + t.amount, 0);
  const lastPurchase = filteredTickets.length > 0 ? 'Aujourd\'hui' : '-';

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedFilter(null);
    setFilterValue('');
  };

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
            return (
              <Link
                key={item.label}
                to={item.to}
                state={location.state}
                className={`dash-nav-item ${item.active ? 'dash-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
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
            <h1 className="dash-greeting">Mes tickets</h1>
            <p className="dash-greeting-sub">Retrouvez tous vos tickets d'achat au même endroit.</p>
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

        {/* Summary cards */}
        <section className="tickets-summary-grid">
          <div className="tickets-summary-card">
            <p className="tickets-summary-label">Total des tickets</p>
            <p className="tickets-summary-value">{totalTickets}</p>
          </div>
          <div className="tickets-summary-card">
            <p className="tickets-summary-label">Achats ce mois-ci</p>
            <p className="tickets-summary-value">{totalAmount.toLocaleString('fr-FR')} MAD</p>
          </div>
          <div className="tickets-summary-card">
            <p className="tickets-summary-label">Dernier achat</p>
            <p className="tickets-summary-value tickets-summary-highlight">{lastPurchase}</p>
          </div>
        </section>

        {/* Search */}
        <section className="tickets-search-section">
          <div className="tickets-search-bar">
            <Search size={18} className="tickets-search-icon" />
            <input
              type="text"
              placeholder="Rechercher un ticket, un produit ou un commerce"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tickets-search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="tickets-search-clear"
                onClick={() => setSearchQuery('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </section>

        {/* Filters */}
        <section className="tickets-filters">
          <button 
            type="button" 
            className={`tickets-filter-btn ${selectedFilter === 'date' ? 'active' : ''}`}
            onClick={() => {
              setSelectedFilter(selectedFilter === 'date' ? null : 'date');
              setFilterValue('');
            }}
          >
            <Calendar size={14} /> Date <ChevronDown size={14} />
          </button>
          <button 
            type="button" 
            className={`tickets-filter-btn ${selectedFilter === 'product' ? 'active' : ''}`}
            onClick={() => {
              setSelectedFilter(selectedFilter === 'product' ? null : 'product');
              setFilterValue('');
            }}
          >
            <Package size={14} /> Produit <ChevronDown size={14} />
          </button>
          <button 
            type="button" 
            className={`tickets-filter-btn ${selectedFilter === 'merchant' ? 'active' : ''}`}
            onClick={() => {
              setSelectedFilter(selectedFilter === 'merchant' ? null : 'merchant');
              setFilterValue('');
            }}
          >
            <Store size={14} /> Commerce <ChevronDown size={14} />
          </button>
          <button 
            type="button" 
            className={`tickets-filter-btn ${selectedFilter === 'amount' ? 'active' : ''}`}
            onClick={() => {
              setSelectedFilter(selectedFilter === 'amount' ? null : 'amount');
              setFilterValue('');
            }}
          >
            <DollarSign size={14} /> Montant <ChevronDown size={14} />
          </button>

          {(selectedFilter || filterValue) && (
            <div className="tickets-filter-input-wrapper">
              <input
                type={selectedFilter === 'amount' ? 'number' : 'text'}
                placeholder={
                  selectedFilter === 'date' ? 'Ex: 20 Juil' :
                  selectedFilter === 'product' ? 'Ex: Lait' :
                  selectedFilter === 'merchant' ? 'Ex: Carrefour' :
                  selectedFilter === 'amount' ? 'Ex: 100' :
                  'Filtrer...'
                }
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="tickets-filter-input"
                autoFocus
              />
              <button 
                type="button" 
                className="tickets-filter-clear"
                onClick={() => {
                  setSelectedFilter(null);
                  setFilterValue('');
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {(searchQuery || selectedFilter) && (
            <div className="tickets-results-count">
              {totalTickets} résultat{totalTickets > 1 ? 's' : ''}
              <button type="button" className="tickets-clear-all" onClick={clearFilters}>
                Effacer les filtres
              </button>
            </div>
          )}
        </section>

        {filteredTickets.length === 0 && (
          <div className="tickets-no-results">
            <Search size={48} />
            <h3>Aucun ticket trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
            <button type="button" className="tickets-reset-btn" onClick={clearFilters}>
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Today's tickets carousel - SANS FLÈCHE GAUCHE */}
        {todayTickets.length > 0 && (
          <section className="tickets-section">
            <h2 className="tickets-section-title">AUJOURD'HUI — 20 JUILLET 2026</h2>
            <div className="tickets-carousel-container">
              <div className="tickets-carousel" ref={carouselRef}>
                {todayTickets.map((ticket) => (
                  <div key={ticket.id} className="tickets-carousel-card">
                    <div className="tickets-card-header">
                      <div className="tickets-merchant-logo">{ticket.merchantLogo}</div>
                      <div className="tickets-merchant-info">
                        <p className="tickets-merchant-name">{ticket.merchant}</p>
                        <p className="tickets-merchant-date">{ticket.date} • {ticket.time}</p>
                      </div>
                    </div>
                    <div className="tickets-card-body">
                      <div className="tickets-card-stats">
                        <span className="tickets-articles">{ticket.articles} articles</span>
                        <span className="tickets-amount">{ticket.amount.toLocaleString('fr-FR')} MAD</span>
                      </div>
                      <div className="tickets-card-badges">
                        {ticket.verified && (
                          <span className="tickets-badge tickets-badge-verified">
                            <CheckCircle2 size={12} /> Achat vérifié
                          </span>
                        )}
                        <span className="tickets-badge tickets-badge-points">
                          <Star size={12} /> +{ticket.points} points
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="tickets-open-btn"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      Ouvrir le ticket
                    </button>
                  </div>
                ))}
              </div>
              {/* FLÈCHE DE DROITE UNIQUEMENT */}
              <button type="button" className="tickets-carousel-btn tickets-carousel-btn-right" onClick={() => scrollCarousel('right')}>
                <ChevronRight size={20} />
              </button>
            </div>
          </section>
        )}

        {/* Other dates - CARDS IDENTIQUES AU CAROUSEL */}
        {otherDates.map((dateShort) => {
          const dateTickets = ticketsByDate[dateShort];
          if (dateTickets.length === 0) return null;

          const dateLabel = dateShort.toUpperCase();

          return (
            <section key={dateShort} className="tickets-section">
              <div className="tickets-section-header">
                <h2 className="tickets-section-title">{dateLabel}</h2>
                <button type="button" className="tickets-view-all">Voir tout</button>
              </div>
              <div className="tickets-grid">
                {dateTickets.map((ticket) => (
                  <div key={ticket.id} className="tickets-grid-card">
                    <div className="tickets-card-header">
                      <div className="tickets-merchant-logo">{ticket.merchantLogo}</div>
                      <div className="tickets-merchant-info">
                        <p className="tickets-merchant-name">{ticket.merchant}</p>
                        <p className="tickets-merchant-date">{ticket.date} • {ticket.time}</p>
                      </div>
                    </div>
                    <div className="tickets-card-body">
                      <div className="tickets-card-stats">
                        <span className="tickets-articles">{ticket.articles} articles</span>
                        <span className="tickets-amount">{ticket.amount.toLocaleString('fr-FR')} MAD</span>
                      </div>
                      <div className="tickets-card-badges">
                        {ticket.verified && (
                          <span className="tickets-badge tickets-badge-verified">
                            <CheckCircle2 size={12} /> Achat vérifié
                          </span>
                        )}
                        <span className="tickets-badge tickets-badge-points">
                          <Star size={12} /> +{ticket.points} points
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="tickets-open-btn"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      Ouvrir le ticket
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Ticket details drawer */}
      {selectedTicket && (
        <div className="tickets-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="tickets-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="tickets-drawer-header">
              <h2>Détails du ticket</h2>
              <button type="button" onClick={() => setSelectedTicket(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="tickets-drawer-body">
              <div className="receipt-container">
                <div className="receipt">
                  <div className="receipt-header">
                    <div className="receipt-logo">{selectedTicket.merchantLogo}</div>
                    <h3 className="receipt-merchant">{selectedTicket.merchant}</h3>
                    <p className="receipt-location">{selectedTicket.location}</p>
                  </div>

                  <div className="receipt-divider receipt-divider-dashed" />

                  <div className="receipt-info-row">
                    <span><Clock size={12} /> {selectedTicket.date} à {selectedTicket.time}</span>
                    <span><Hash size={12} /> {selectedTicket.reference}</span>
                  </div>

                  <div className="receipt-divider receipt-divider-dashed" />

                  <div className="receipt-items">
                    <div className="receipt-items-header">
                      <span>Article</span>
                      <span>Qté</span>
                      <span>Prix</span>
                    </div>
                    {selectedTicket.items.map((item, idx) => (
                      <div key={idx} className="receipt-item-row">
                        <span className="receipt-item-name">{item.name}</span>
                        <span className="receipt-item-qty">x{item.qty}</span>
                        <span className="receipt-item-price">{(item.price * item.qty).toFixed(2)} MAD</span>
                      </div>
                    ))}
                  </div>

                  <div className="receipt-divider receipt-divider-dashed" />

                  <div className="receipt-totals">
                    <div className="receipt-total-row">
                      <span>Sous-total</span>
                      <span>{selectedTicket.subtotal.toFixed(2)} MAD</span>
                    </div>
                    {selectedTicket.tax > 0 && (
                      <div className="receipt-total-row">
                        <span>TVA</span>
                        <span>{selectedTicket.tax.toFixed(2)} MAD</span>
                      </div>
                    )}
                    <div className="receipt-total-row receipt-total-final">
                      <span>TOTAL</span>
                      <span>{selectedTicket.total.toFixed(2)} MAD</span>
                    </div>
                  </div>

                  <div className="receipt-divider receipt-divider-dashed" />

                  <div className="receipt-payment">
                    <p><strong>Mode de paiement :</strong> {selectedTicket.payment}</p>
                  </div>

                  <div className="receipt-divider receipt-divider-dashed" />

                  <div className="receipt-barcode">
                    <div className="receipt-barcode-lines">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div
                          key={i}
                          className="receipt-barcode-line"
                          style={{ width: Math.random() > 0.5 ? '2px' : '1px' }}
                        />
                      ))}
                    </div>
                    <p className="receipt-barcode-number">{selectedTicket.reference}</p>
                  </div>

                  <div className="receipt-footer">
                    <p>Merci de votre visite !</p>
                    <p>Conservez ce ticket pour tout échange ou retour.</p>
                  </div>
                </div>
              </div>

              <div className="receipt-actions">
                <button type="button" className="receipt-action-btn">
                  <Download size={18} />
                  Télécharger le PDF
                </button>
                <button type="button" className="receipt-action-btn">
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