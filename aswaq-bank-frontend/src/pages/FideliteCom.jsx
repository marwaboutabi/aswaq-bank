import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, Boxes, ArrowLeftRight, Users, Star, Bot, User, LogOut,
  Bell, ChevronDown, Calendar, Download, Eye, ArrowRight, Info, RefreshCw, Store, FileText, X
} from 'lucide-react';

import Logo from '../components/Logo/Logo';
import api from '../services/api';
import './FideliteCom.css';

// Styles conservés pour l'affichage conditionnel des badges
const TYPE_STYLES = {
  'Gagnés': { bg: '#dcfce7', color: '#16a34a' },
  'Utilisés': { bg: '#fee2e2', color: '#dc2626' },
};

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/acceuil-com' },
  { icon: Package, label: 'Produits', to: '/produits' },
  { icon: ArrowLeftRight, label: 'Paiements & Transactions', to: '/transactions-commerce' },
  { icon: Users, label: 'Fournisseurs', to: '/fournisseurs' },
  { icon: Star, label: 'Fidélité & Tickets', to: '/fidelite-commerce', active: true },
  { icon: Bell, label: 'Notifications', to: '/notifications-com' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant-commerce' },
  { icon: User, label: 'Profil & Paramètres', to: '/parametres-commerce' },
];

const TABS = [
  { key: 'historique', label: 'Historique des points' },
  { key: 'tickets', label: 'Tickets récents' },
  { key: 'compensation', label: 'Compensation entre commerçants' },
];

export default function FideliteCom() {
  const location = useLocation();
  const navigate = useNavigate();

  // États UI
  const [activeTab, setActiveTab] = useState('historique');
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // États Données Réelles
  const [pointsHistory, setPointsHistory] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [payableCompensations, setPayableCompensations] = useState([]);
  const [receivableCompensations, setReceivableCompensations] = useState([]);
  
  // États de chargement
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [loadingCompensations, setLoadingCompensations] = useState(false);
  const [error, setError] = useState('');

  // Chargement initial de l'historique
  useEffect(() => {
    loadPointsHistory();
  }, []);

  // Chargement dynamique des tickets et compensations quand on change d'onglet
  useEffect(() => {
    if (activeTab === 'tickets') {
      loadTickets();
    }

    if (activeTab === 'compensation') {
      loadCompensations();
    }
  }, [activeTab]);

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm('Voulez-vous vous déconnecter ?')) {
      navigate('/');
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const closeModal = () => {
    setSelectedTicket(null);
  };

  // --- APPELS API ---

  const loadPointsHistory = async () => {
    try {
      setLoadingHistory(true);
      setError('');
      // Endpoint backend à créer : GET /api/loyalty/merchant/history
      const response = await api.get('/loyalty/merchant/history');
      setPointsHistory(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Erreur historique fidélité:', err);
      setError("Impossible de charger l'historique.");
      setPointsHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadTickets = async () => {
    try {
      setLoadingTickets(true);
      // Récupération des ventes du commerçant
      const response = await api.get('/sales/merchant');
      const sales = Array.isArray(response.data) ? response.data : [];

      // Mapping des ventes PAID vers le format attendu par le tableau
      const formattedTickets = sales
        .filter(sale => sale.status === 'PAID')
        .map(sale => ({
          id: sale.id ? `TK-${String(sale.id).padStart(6, '0')}` : 'TK-000000',
          saleId: sale.id,
          client: sale.client 
            ? `${sale.client.firstName || ''} ${sale.client.lastName || ''}`.trim() || sale.client.email || 'Client'
            : 'Client anonyme',
          montant: `${Number(sale.totalAmount || 0).toFixed(2)} MAD`,
          points: `+${Math.floor(Number(sale.totalAmount || 0) / 10)} pts`,
          date: sale.createdAt ? new Date(sale.createdAt).toLocaleString('fr-FR') : '-',
          articles: Array.isArray(sale.items) 
            ? sale.items.map(item => ({
                nom: item.product?.name || item.productName || 'Produit',
                qte: item.quantity || 0,
                prix: `${Number(item.unitPrice || item.price || 0).toFixed(2)} MAD`,
              }))
            : [],
        }));

      setTickets(formattedTickets);
    } catch (err) {
      console.error('Erreur chargement tickets:', err);
      setTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  };

  const loadCompensations = async () => {
    try {
      setLoadingCompensations(true);
      setError('');

      const [payableResponse, receivableResponse] = await Promise.all([
        api.get('/merchant-compensations/payable'),
        api.get('/merchant-compensations/receivable')
      ]);

      console.log('========== COMPENSATIONS ==========');
      console.log('STATUS PAYABLE:', payableResponse.status);
      console.log('DATA PAYABLE:', payableResponse.data);
      console.log('STATUS RECEIVABLE:', receivableResponse.status);
      console.log('DATA RECEIVABLE:', receivableResponse.data);
      console.log('===================================');

      const payable = Array.isArray(payableResponse.data)
        ? payableResponse.data
        : [];

      const receivable = Array.isArray(receivableResponse.data)
        ? receivableResponse.data
        : [];

      setPayableCompensations(payable);
      setReceivableCompensations(receivable);

    } catch (err) {
      console.error('Erreur chargement compensations:', err);
      console.error('Response:', err.response?.data);
      console.error('Status:', err.response?.status);

      setPayableCompensations([]);
      setReceivableCompensations([]);
      setError("Impossible de charger les compensations.");
    } finally {
      setLoadingCompensations(false);
    }
  };

  return (
    <div className="fid-layout">
      <aside className="fid-sidebar">
        <div className="fid-sidebar-logo">
          <Logo size={100} className="mb-6 logo-white"/>
        </div>

        <nav className="fid-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                state={location.state}
                className={`fid-nav-item ${item.active ? 'fid-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a href="/" onClick={handleLogout} className="fid-logout">
          <LogOut size={18} />
          Déconnexion
        </a>
      </aside>

      <main className="fid-main">
        <header className="fid-topbar">
          <div className="fid-topbar-title">
            <div className="fid-title-icon">
              <Star size={20} />
            </div>
            <div>
              <h1 className="fid-title">Fidélité & Tickets</h1>
              <p className="fid-subtitle">Gérez vos points de fidélité, vos tickets et suivez les compensations.</p>
            </div>
          </div>

          <div className="fid-topbar-actions">
            <button type="button" className="fid-icon-button" onClick={() => setShowNotif(!showNotif)} aria-label="Notifications">
              <Bell size={18} />
              <span className="fid-badge">3</span>
            </button>

            <div className="fid-user-chip" onClick={() => setShowUserMenu(!showUserMenu)} style={{ position: 'relative' }}>
              <div className="fid-user-avatar">MB</div>
              <div className="fid-user-info">
                <span className="fid-user-name">Marwa Boutabi</span>
                <span className="fid-user-role">Commerçant</span>
              </div>
              <ChevronDown size={16} />
              {showUserMenu && (
                <div className="fid-user-menu">
                  <Link to="/parametres-commerce" className="fid-menu-item">Mon profil</Link>
                  <Link to="/" onClick={handleLogout} className="fid-menu-item fid-menu-logout">Déconnexion</Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <nav className="fid-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`fid-tab ${activeTab === tab.key ? 'fid-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* ================= HISTORIQUE DES POINTS ================= */}
        {activeTab === 'historique' && (
          <section className="fid-panel">
            <div className="fid-panel-header">
              <div>
                <h2 className="fid-panel-title">Historique des points</h2>
                <p className="fid-panel-subtitle">Suivez les points gagnés et utilisés par vos clients.</p>
              </div>
              <div className="fid-panel-actions">
                <button className="fid-date-range"><Calendar size={16} /> 01/07/2025 - 31/07/2025</button>
                <div className="fid-select-wrapper">
                  <select className="fid-select">
                    <option>Tous les types</option>
                    <option>Gagnés</option>
                    <option>Utilisés</option>
                  </select>
                  <ChevronDown size={14} className="fid-select-icon" />
                </div>
                <button className="fid-export-btn"><Download size={16} /> Exporter</button>
              </div>
            </div>

            <div className="fid-table-wrapper">
              <table className="fid-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Montant</th>
                    <th>Points</th>
                    <th>Solde client</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingHistory ? (
                    <tr><td colSpan="7" className="fid-cell-text">Chargement...</td></tr>
                  ) : error ? (
                    <tr><td colSpan="7" className="fid-cell-text" style={{color:'red'}}>{error}</td></tr>
                  ) : pointsHistory.length === 0 ? (
                    <tr><td colSpan="7" className="fid-cell-text">Aucun mouvement de fidélité.</td></tr>
                  ) : (
                    pointsHistory.map((row) => {
                      const isPositive = Number(row.points || 0) > 0;
                      const type = isPositive ? 'Gagnés' : 'Utilisés';
                      const typeStyle = TYPE_STYLES[type];
                      
                      const client = row.client;
                      const clientName = client 
                        ? `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Client' 
                        : 'Client';
                      const initials = clientName.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();

                      return (
                        <tr key={row.id}>
                          <td className="fid-cell-text">{row.createdAt ? new Date(row.createdAt).toLocaleString('fr-FR') : '-'}</td>
                          <td>
                            <div className="fid-client-cell">
                              <div className="fid-avatar">{initials || 'CL'}</div>
                              <span className="fid-client-name">{clientName}</span>
                            </div>
                          </td>
                          <td className="fid-cell-text">{row.description || 'Mouvement de fidélité'}</td>
                          <td>
                            <span className="fid-type-pill" style={{ background: typeStyle.bg, color: typeStyle.color }}>{type}</span>
                          </td>
                          <td className="fid-cell-text">{row.amount != null ? `${Number(row.amount).toFixed(2)} MAD` : '-'}</td>
                          <td className={`fid-points ${isPositive ? 'fid-points-positive' : 'fid-points-negative'}`}>
                            {isPositive ? '+' : ''}{row.points || 0} pts
                          </td>
                          <td className="fid-cell-text fid-solde">{row.remainingPoints != null ? `${row.remainingPoints} pts` : '-'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="fid-view-more">
              <button className="fid-link-btn">Voir plus <ChevronDown size={14} /></button>
            </div>
          </section>
        )}

        {/* ================= TICKETS RÉCENTS ================= */}
        {activeTab === 'tickets' && (
          <section className="fid-panel">
            <div className="fid-panel-header">
              <div>
                <h2 className="fid-panel-title">Tickets récents</h2>
                <p className="fid-panel-subtitle">Les derniers tickets générés dans votre commerce.</p>
              </div>
              <button className="fid-link-btn">Voir tous <ArrowRight size={14} /></button>
            </div>

            <div className="fid-table-wrapper">
              <table className="fid-table">
                <thead>
                  <tr>
                    <th>N° Ticket</th>
                    <th>Client</th>
                    <th>Montant</th>
                    <th>Points</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingTickets ? (
                    <tr><td colSpan="6" className="fid-cell-text">Chargement...</td></tr>
                  ) : tickets.length === 0 ? (
                    <tr><td colSpan="6" className="fid-cell-text">Aucun ticket récent.</td></tr>
                  ) : (
                    tickets.map((t) => {
                      const isPositive = t.points.startsWith('+');
                      return (
                        <tr key={t.id}>
                          <td className="fid-cell-text fid-ticket-id">
                            <FileText size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            {t.id}
                          </td>
                          <td className="fid-cell-text">{t.client}</td>
                          <td className="fid-cell-text">{t.montant}</td>
                          <td className={`fid-points ${isPositive ? 'fid-points-positive' : 'fid-points-negative'}`}>{t.points}</td>
                          <td className="fid-cell-text">{t.date}</td>
                          <td>
                            <button className="fid-action-btn" aria-label="Voir" onClick={() => handleViewTicket(t)}>
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="fid-view-more">
              <button className="fid-link-btn">Voir tous les tickets <ArrowRight size={14} /></button>
            </div>
          </section>
        )}

        {/* ================= COMPENSATION ENTRE COMMERÇANTS ================= */}
        {activeTab === 'compensation' && (
          <section className="fid-panel">
            <div className="fid-panel-header">
              <div className="fid-panel-title-with-icon">
                <h2 className="fid-panel-title">Compensation entre commerçants</h2>
                <Info size={15} className="fid-info-icon" />
              </div>
              <div className="fid-select-wrapper">
                <select className="fid-select">
                  <option>Juillet 2025</option>
                  <option>Juin 2025</option>
                </select>
                <ChevronDown size={14} className="fid-select-icon" />
              </div>
            </div>
            <p className="fid-panel-subtitle fid-panel-subtitle-standalone">
              Solde des échanges de points avec les autres commerçants.
            </p>

            <div className="fid-compensation-row">

              <div className="fid-compensation-box">
                <p className="fid-compensation-label">À recevoir</p>

                <p className="fid-compensation-amount fid-amount-positive">
                  + {receivableCompensations
                    .reduce((total, c) => total + Number(c.amount || 0), 0)
                    .toFixed(2)
                    .replace('.', ',')} MAD
                </p>

                <p className="fid-compensation-sub">
                  Vous allez recevoir
                </p>
              </div>

              <div className="fid-compensation-icon">
                <RefreshCw size={18} />
              </div>

              <div className="fid-compensation-box">
                <p className="fid-compensation-label">À payer</p>

                <p className="fid-compensation-amount fid-amount-negative">
                  - {payableCompensations
                    .reduce((total, c) => total + Number(c.amount || 0), 0)
                    .toFixed(2)
                    .replace('.', ',')} MAD
                </p>

                <p className="fid-compensation-sub">
                  Vous allez payer
                </p>
              </div>

            </div>

            <div className="fid-details">
              <h3 className="fid-details-title">Détails</h3>

              <div className="fid-details-list">

                {loadingCompensations ? (

                  <div className="fid-cell-text">
                    Chargement des compensations...
                  </div>

                ) : (
                  <>
                    {/* ================= À RECEVOIR ================= */}

                    {receivableCompensations.map((compensation) => {

                      const merchant = compensation.fromMerchant;
                      const merchantName = merchant?.companyName || merchant?.name || 'Commerçant';

                      return (
                        <div
                          key={`receivable-${compensation.id}`}
                          className="fid-detail-item"
                        >

                          <div
                            className="fid-detail-icon"
                            style={{
                              background: '#dcfce7',
                              color: '#16a34a'
                            }}
                          >
                            <Store size={18} />
                          </div>

                          <div className="fid-detail-body">

                            <p className="fid-detail-name">
                              {merchantName}
                            </p>

                            <p className="fid-detail-desc">
                              Compensation à recevoir
                            </p>

                            <p className="fid-detail-desc">
                              {compensation.points || 0} points
                            </p>

                          </div>

                          <p className="fid-detail-amount fid-amount-positive">
                            + {Number(compensation.amount || 0)
                              .toFixed(2)
                              .replace('.', ',')} MAD
                          </p>

                        </div>
                      );
                    })}


                    {/* ================= À PAYER ================= */}

                    {payableCompensations.map((compensation) => {

                      const merchant = compensation.toMerchant;
                      const merchantName = merchant?.companyName || merchant?.name || 'Commerçant';

                      return (
                        <div
                          key={`payable-${compensation.id}`}
                          className="fid-detail-item"
                        >

                          <div
                            className="fid-detail-icon"
                            style={{
                              background: '#fee2e2',
                              color: '#dc2626'
                            }}
                          >
                            <Store size={18} />
                          </div>

                          <div className="fid-detail-body">

                            <p className="fid-detail-name">
                              {merchantName}
                            </p>

                            <p className="fid-detail-desc">
                              Compensation à payer
                            </p>

                            <p className="fid-detail-desc">
                              {compensation.points || 0} points
                            </p>

                          </div>

                          <p className="fid-detail-amount fid-amount-negative">
                            - {Number(compensation.amount || 0)
                              .toFixed(2)
                              .replace('.', ',')} MAD
                          </p>

                        </div>
                      );
                    })}


                    {/* ================= AUCUNE COMPENSATION ================= */}

                    {payableCompensations.length === 0 &&
                     receivableCompensations.length === 0 && (

                      <div className="fid-cell-text">
                        Aucune compensation pour le moment.
                      </div>

                    )}

                  </>
                )}

              </div>
            </div>

            <div className="fid-view-more">
              <button className="fid-link-btn">Voir le détail des compensations <ArrowRight size={14} /></button>
            </div>
          </section>
        )}
      </main>

      {/* ================= MODAL TICKET ================= */}
      {selectedTicket && (
        <div className="fid-modal-overlay" onClick={closeModal}>
          <div className="fid-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fid-modal-header">
              <div>
                <h2 className="fid-modal-title">Détails du ticket</h2>
                <p className="fid-modal-subtitle">{selectedTicket.id}</p>
              </div>
              <button className="fid-modal-close" onClick={closeModal}><X size={20} /></button>
            </div>

            <div className="fid-modal-body">
              <div className="fid-ticket-details">
                <div className="fid-ticket-info-row">
                  <span className="fid-ticket-label">Client :</span>
                  <span className="fid-ticket-value">{selectedTicket.client}</span>
                </div>
                <div className="fid-ticket-info-row">
                  <span className="fid-ticket-label">Date :</span>
                  <span className="fid-ticket-value">{selectedTicket.date}</span>
                </div>
                <div className="fid-ticket-divider" />
                
                <h3 className="fid-ticket-section-title">Articles</h3>
                <div className="fid-ticket-articles">
                  {selectedTicket.articles && selectedTicket.articles.map((article, index) => (
                    <div key={index} className="fid-ticket-article">
                      <div className="fid-article-info">
                        <span className="fid-article-name">{article.nom}</span>
                        <span className="fid-article-qte">x{article.qte}</span>
                      </div>
                      <span className="fid-article-price">{article.prix}</span>
                    </div>
                  ))}
                </div>

                <div className="fid-ticket-divider" />
                
                <div className="fid-ticket-total">
                  <span className="fid-total-label">Total</span>
                  <span className="fid-total-amount">{selectedTicket.montant}</span>
                </div>

                <div className="fid-ticket-points">
                  <span className="fid-points-label">Points {selectedTicket.points.startsWith('+') ? 'gagnés' : 'utilisés'}</span>
                  <span className={`fid-points-value ${selectedTicket.points.startsWith('+') ? 'fid-points-positive' : 'fid-points-negative'}`}>
                    {selectedTicket.points}
                  </span>
                </div>
              </div>
            </div>

            <div className="fid-modal-footer">
              <button className="fid-btn-secondary" onClick={closeModal}><X size={16} /> Fermer</button>
              <button className="fid-btn-primary"><Download size={16} /> Télécharger</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}