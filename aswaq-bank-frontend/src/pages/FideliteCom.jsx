import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, Boxes, ArrowLeftRight, Users, Star, Bot, User, LogOut,
  Bell, ChevronDown, Calendar, Download, Eye, ArrowRight, Info, RefreshCw, Store, FileText, X
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './FideliteCom.css';

const POINTS_HISTORY = [
  { id: 1, date: '22/07/2025 10:45', client: 'Yassine El Amrani', initials: 'YE', color: '#1d4fd8', desc: 'Achat en magasin', type: 'Gagnés', montant: '250,00 MAD', points: '+250 pts', solde: '1 850 pts' },
  { id: 2, date: '22/07/2025 09:32', client: 'Salma Benali', initials: 'SB', color: '#059669', desc: 'Achat en magasin', type: 'Gagnés', montant: '180,00 MAD', points: '+180 pts', solde: '1 600 pts' },
  { id: 3, date: '21/07/2025 16:18', client: 'Ahmed Bouzid', initials: 'AB', color: '#7c3aed', desc: 'Utilisation de points', type: 'Utilisés', montant: '-50,00 MAD', points: '-50 pts', solde: '1 420 pts' },
  { id: 4, date: '21/07/2025 14:05', client: 'Khadija Doukkali', initials: 'KD', color: '#ea580c', desc: 'Achat en magasin', type: 'Gagnés', montant: '120,00 MAD', points: '+120 pts', solde: '1 470 pts' },
  { id: 5, date: '20/07/2025 11:22', client: 'Mariam Zahra', initials: 'MZ', color: '#0ea5e9', desc: 'Utilisation de points', type: 'Utilisés', montant: '-30,00 MAD', points: '-30 pts', solde: '1 350 pts' },
];

const TICKETS = [
  { id: 'TK-000125', client: 'Yassine El Amrani', montant: '250,00 MAD', points: '+250 pts', date: '22/07/2025 10:45', articles: [
    { nom: 'Huile d\'olive 1L', qte: 2, prix: '45,00 MAD' },
    { nom: 'Riz basmati 5kg', qte: 1, prix: '120,00 MAD' },
    { nom: 'Lait 1L', qte: 5, prix: '8,50 MAD' },
  ] },
  { id: 'TK-000124', client: 'Salma Benali', montant: '180,00 MAD', points: '+180 pts', date: '22/07/2025 09:32', articles: [
    { nom: 'Pain complet', qte: 10, prix: '3,00 MAD' },
    { nom: 'Eau minérale 1.5L', qte: 8, prix: '18,00 MAD' },
  ] },
  { id: 'TK-000123', client: 'Ahmed Bouzid', montant: '340,00 MAD', points: '-50 pts', date: '21/07/2025 16:18', articles: [
    { nom: 'Café moulu 250g', qte: 3, prix: '35,00 MAD' },
    { nom: 'Sucre 1kg', qte: 4, prix: '11,00 MAD' },
  ] },
  { id: 'TK-000122', client: 'Khadija Doukkali', montant: '120,00 MAD', points: '+120 pts', date: '21/07/2025 14:05', articles: [
    { nom: 'Fromage frais', qte: 6, prix: '12,00 MAD' },
    { nom: 'Jus d\'orange 1L', qte: 4, prix: '15,00 MAD' },
  ] },
  { id: 'TK-000121', client: 'Mariam Zahra', montant: '95,00 MAD', points: '-30 pts', date: '20/07/2025 11:22', articles: [
    { nom: 'Thé vert', qte: 2, prix: '25,00 MAD' },
    { nom: 'Miel 500g', qte: 1, prix: '45,00 MAD' },
  ] },
];

const COMPENSATION_DETAILS = [
  { id: 1, name: 'Café Al Baraka', desc: 'Utilisation de vos points chez eux', montant: '+ 1 240,00 MAD', positive: true },
  { id: 2, name: 'Boulangerie du Coin', desc: 'Utilisation de leurs points chez vous', montant: '- 320,00 MAD', positive: false },
];

const TYPE_STYLES = {
  'Gagnés': { bg: '#dcfce7', color: '#16a34a' },
  'Utilisés': { bg: '#fee2e2', color: '#dc2626' },
};

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/acceuil-com' },
  { icon: Package, label: 'Produits', to: '/produits' },
  { icon: Boxes, label: 'Stock', to: '/stock' },
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

  const [activeTab, setActiveTab] = useState('historique');
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null); // ✅ State pour le ticket sélectionné

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm('Voulez-vous vous déconnecter ?')) {
      navigate('/');
    }
  };

  // ✅ Fonction pour voir les détails d'un ticket
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  // ✅ Fonction pour fermer le modal
  const closeModal = () => {
    setSelectedTicket(null);
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
            <button
              type="button"
              className="fid-icon-button"
              onClick={() => setShowNotif(!showNotif)}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="fid-badge">3</span>
            </button>

            <div
              className="fid-user-chip"
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{ position: 'relative' }}
            >
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

        {/* Tabs de navigation */}
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

        {/* AFFICHAGE CONDITIONNEL : Historique des points */}
        {activeTab === 'historique' && (
          <section className="fid-panel">
            <div className="fid-panel-header">
              <div>
                <h2 className="fid-panel-title">Historique des points</h2>
                <p className="fid-panel-subtitle">Suivez les points gagnés et utilisés par vos clients.</p>
              </div>
              <div className="fid-panel-actions">
                <button className="fid-date-range">
                  <Calendar size={16} />
                  01/07/2025 - 31/07/2025
                </button>
                <div className="fid-select-wrapper">
                  <select className="fid-select">
                    <option>Tous les types</option>
                    <option>Gagnés</option>
                    <option>Utilisés</option>
                  </select>
                  <ChevronDown size={14} className="fid-select-icon" />
                </div>
                <button className="fid-export-btn">
                  <Download size={16} />
                  Exporter
                </button>
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
                  {POINTS_HISTORY.map((row) => {
                    const typeStyle = TYPE_STYLES[row.type];
                    const isPositive = row.points.startsWith('+');
                    return (
                      <tr key={row.id}>
                        <td className="fid-cell-text">{row.date}</td>
                        <td>
                          <div className="fid-client-cell">
                            <div className="fid-avatar" style={{ background: row.color }}>
                              {row.initials}
                            </div>
                            <span className="fid-client-name">{row.client}</span>
                          </div>
                        </td>
                        <td className="fid-cell-text">{row.desc}</td>
                        <td>
                          <span className="fid-type-pill" style={{ background: typeStyle.bg, color: typeStyle.color }}>
                            {row.type}
                          </span>
                        </td>
                        <td className="fid-cell-text">{row.montant}</td>
                        <td className={`fid-points ${isPositive ? 'fid-points-positive' : 'fid-points-negative'}`}>
                          {row.points}
                        </td>
                        <td className="fid-cell-text fid-solde">{row.solde}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="fid-view-more">
              <button className="fid-link-btn">
                Voir plus <ChevronDown size={14} />
              </button>
            </div>
          </section>
        )}

        {/* AFFICHAGE CONDITIONNEL : Tickets récents */}
        {activeTab === 'tickets' && (
          <section className="fid-panel">
            <div className="fid-panel-header">
              <div>
                <h2 className="fid-panel-title">Tickets récents</h2>
                <p className="fid-panel-subtitle">Les derniers tickets générés dans votre commerce.</p>
              </div>
              <button className="fid-link-btn">
                Voir tous <ArrowRight size={14} />
              </button>
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
                  {TICKETS.map((t) => {
                    const isPositive = t.points.startsWith('+');
                    return (
                      <tr key={t.id}>
                        <td className="fid-cell-text fid-ticket-id">
                          <FileText size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                          {t.id}
                        </td>
                        <td className="fid-cell-text">{t.client}</td>
                        <td className="fid-cell-text">{t.montant}</td>
                        <td className={`fid-points ${isPositive ? 'fid-points-positive' : 'fid-points-negative'}`}>
                          {t.points}
                        </td>
                        <td className="fid-cell-text">{t.date}</td>
                        <td>
                          <button 
                            className="fid-action-btn" 
                            aria-label="Voir"
                            onClick={() => handleViewTicket(t)} // ✅ Ajout du onClick
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="fid-view-more">
              <button className="fid-link-btn">
                Voir tous les tickets <ArrowRight size={14} />
              </button>
            </div>
          </section>
        )}

        {/* AFFICHAGE CONDITIONNEL : Compensation entre commerçants */}
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
                <p className="fid-compensation-amount fid-amount-positive">+ 1 240,00 MAD</p>
                <p className="fid-compensation-sub">Vous allez recevoir</p>
              </div>
              <div className="fid-compensation-icon">
                <RefreshCw size={18} />
              </div>
              <div className="fid-compensation-box">
                <p className="fid-compensation-label">À payer</p>
                <p className="fid-compensation-amount fid-amount-negative">- 320,00 MAD</p>
                <p className="fid-compensation-sub">Vous allez payer</p>
              </div>
            </div>

            <div className="fid-details">
              <h3 className="fid-details-title">Détails</h3>
              <div className="fid-details-list">
                {COMPENSATION_DETAILS.map((d) => (
                  <div key={d.id} className="fid-detail-item">
                    <div
                      className="fid-detail-icon"
                      style={{
                        background: d.positive ? '#dcfce7' : '#fee2e2',
                        color: d.positive ? '#16a34a' : '#dc2626',
                      }}
                    >
                      <Store size={18} />
                    </div>
                    <div className="fid-detail-body">
                      <p className="fid-detail-name">{d.name}</p>
                      <p className="fid-detail-desc">{d.desc}</p>
                    </div>
                    <p className={`fid-detail-amount ${d.positive ? 'fid-amount-positive' : 'fid-amount-negative'}`}>
                      {d.montant}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="fid-view-more">
              <button className="fid-link-btn">
                Voir le détail des compensations <ArrowRight size={14} />
              </button>
            </div>
          </section>
        )}
      </main>

      {/* ✅ MODAL POUR AFFICHER LES DÉTAILS DU TICKET */}
      {selectedTicket && (
        <div className="fid-modal-overlay" onClick={closeModal}>
          <div className="fid-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fid-modal-header">
              <div>
                <h2 className="fid-modal-title">Détails du ticket</h2>
                <p className="fid-modal-subtitle">{selectedTicket.id}</p>
              </div>
              <button className="fid-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
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
              <button className="fid-btn-secondary" onClick={closeModal}>
                <X size={16} /> Fermer
              </button>
              <button className="fid-btn-primary">
                <Download size={16} /> Télécharger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}