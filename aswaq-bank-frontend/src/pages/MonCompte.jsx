import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, ArrowLeftRight, Receipt, Star, PiggyBank, PieChart,
  Bell, Bot, User, LogOut, Search, Eye, EyeOff, Send, Download,
  PlusCircle, FileText, Copy, Shield, Settings, Lock, Unlock, RefreshCw,
  Wifi, Globe, Banknote, MapPin, CheckCircle2, Building2, X,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './MonCompte.css';
import './DashboardClient.css';
import UserHeader from '../components/UserHeader/UserHeader';
import NotificationBell from '../components/NotificationBell/NotificationBell';

const OFFER_CONFIG = {
  personnel: {
    label: 'Compte personnel',
    defaultLimits: {
      ma: { payment: 5000, withdrawal: 2000, transfer: 10000 },
      intl: { payment: 1000, withdrawal: 500, transfer: 2000 },
    },
    maxLimits: {
      ma: { payment: 20000, withdrawal: 10000, transfer: 30000 },
      intl: { payment: 10000, withdrawal: 5000, transfer: 15000 },
    },
  },
  commercant: {
    label: 'Compte commerçant',
    defaultLimits: {
      ma: { payment: 15000, withdrawal: 5000, transfer: 30000 },
      intl: { payment: 5000, withdrawal: 1500, transfer: 8000 },
    },
    maxLimits: {
      ma: { payment: 60000, withdrawal: 20000, transfer: 100000 },
      intl: { payment: 25000, withdrawal: 10000, transfer: 40000 },
    },
  },
  fournisseur: {
    label: 'Compte fournisseur',
    defaultLimits: {
      ma: { payment: 10000, withdrawal: 4000, transfer: 25000 },
      intl: { payment: 4000, withdrawal: 1200, transfer: 6000 },
    },
    maxLimits: {
      ma: { payment: 50000, withdrawal: 15000, transfer: 80000 },
      intl: { payment: 20000, withdrawal: 8000, transfer: 30000 },
    },
  },
};

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/dashboard-client' },
  { icon: ArrowLeftRight, label: 'Historique des transactions', to: '/transactions-client' },
  { icon: Receipt, label: 'Tickets numériques', to: '/tickets-client' },
  { icon: Star, label: 'Points de fidélité', to: '/fidelite' },
  { icon: PiggyBank, label: "Objectifs d'épargne", to: '/epargne' },
  { icon: PieChart, label: 'Suivi des dépenses', to: '/depenses' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant' },
  { icon: User, label: 'Profil et paramètres', to: '/parametres' },
];

function Toggle({ checked, onChange }) {
  return (
    <button type="button" className={`compte-toggle ${checked ? 'compte-toggle-on' : ''}`} onClick={() => onChange(!checked)}>
      <span className="compte-toggle-knob" />
    </button>
  );
}

function LimitSlider({ label, value, max, unit, onChange }) {
  const percent = (value / max) * 100;
  return (
    <div className="compte-limit-row">
      <div className="compte-limit-header">
        <span className="compte-limit-label">{label}</span>
        <span className="compte-limit-value">{value.toLocaleString('fr-FR')} {unit}</span>
      </div>
      <input
        type="range" min="0" max={max} step="100" value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="compte-slider" style={{ '--fill': `${percent}%` }}
      />
    </div>
  );
}

export default function MonCompte() {
  const location = useLocation();
  const navigate = useNavigate();
  const offreId = location.state?.offre || 'personnel';
  const config = OFFER_CONFIG[offreId] || OFFER_CONFIG.personnel;
  const isBusiness = offreId === 'commercant' || offreId === 'fournisseur';

  const [showBalance, setShowBalance] = useState(true);
  const [activePanel, setActivePanel] = useState(null); // 'carte' | 'paiements' | 'plafonds' | null

  const [cardActive] = useState(true);
  const [cardBlocked, setCardBlocked] = useState(false);

  const [payments, setPayments] = useState({
    online: true, contactless: true, withdrawals: true, international: false,
  });
  const togglePayment = (key) => setPayments((p) => ({ ...p, [key]: !p[key] }));

  const [limitsMA, setLimitsMA] = useState(config.defaultLimits.ma);
  const [limitsIntl, setLimitsIntl] = useState(config.defaultLimits.intl);

  const SERVICES = [
    { key: 'carte', icon: Lock, title: 'Ma carte', desc: 'Activer, bloquer, PIN, nouvelle carte' },
    { key: 'paiements', icon: Wifi, title: 'Paramètres de paiement', desc: 'En ligne, sans contact, international' },
    { key: 'plafonds', icon: Shield, title: 'Plafonds', desc: 'Maroc et international' },
    { key: 'infos', icon: Settings, title: 'Informations du compte', desc: 'Type, statut, devise' },
  ];

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-logo">
          <Logo size={100} className="mb-6 logo-white" />
        </div>
        <nav className="dash-nav">
          <Link to="/dashboard-client" state={location.state} className="dash-nav-item">
            <Home size={18} /> Accueil
          </Link>
          <Link to="/mon-compte" state={location.state} className="dash-nav-item dash-nav-item-active">
            <ArrowLeftRight size={18} /> Gestion du compte
          </Link>
          {NAV_ITEMS.slice(1).map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.to} state={location.state} className="dash-nav-item">
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="dash-help-card">
          <div className="dash-help-icon">
            <Bot size={20} />
          </div>
          <p className="dash-help-title">Besoin d'aide ?</p>
          <p className="dash-help-text">Notre assistant IA est là pour vous aider</p>
          <button type="button" className="dash-help-button">
            Discuter avec l'IA →
          </button>
        </div>
        <Link to="/" className="dash-logout">
          <LogOut size={18} /> Déconnexion
        </Link>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <header className="dash-topbar">
          <div>
            <h1 className="dash-greeting">Solde du compte</h1>
            <p className="dash-greeting-sub">Gérez votre compte et consultez vos informations financières.</p>
          </div>
          <div className="dash-topbar-actions">
            <div className="dash-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <NotificationBell />
           <UserHeader />
          </div>
        </header>

        <div className="compte-offer-badge-row">
          <span className={`compte-offer-badge ${isBusiness ? 'compte-offer-badge-business' : ''}`}>
            {isBusiness && <Building2 size={13} />}
            {config.label}
          </span>
        </div>

        <div className="compte-top-grid">
          {/* Colonne gauche : carte + infos */}
          <div className="compte-col-left">
            <div className={`compte-account-card ${cardBlocked ? 'compte-card-blocked' : ''}`}>
              <div className="compte-card-shine" />
              <div className="compte-account-card-top">
                <div>
                  <span className="compte-account-name">Compte principal</span>
                  <span className="compte-account-tag">{isBusiness ? 'Compte business' : 'Compte courant'}</span>
                </div>
                <button type="button" className="compte-eye-btn" onClick={() => setShowBalance((v) => !v)}>
                  {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>

              <div className="compte-account-body">
                <div className="compte-balance-block">
                  <span className="compte-balance-label">Solde disponible</span>
                  <span className="compte-balance-amount">{showBalance ? '12 450,00' : '••• •••'} <small>MAD</small></span>
                  <span className="compte-balance-label" style={{ marginTop: '0.6rem' }}>Solde comptable</span>
                  <span className="compte-balance-amount-sm">{showBalance ? '12 450,00' : '••• •••'} <small>MAD</small></span>
                </div>

                <div className="compte-mini-card">
                  <div className="compte-mini-card-chip">
                    <svg viewBox="0 0 48 36" width="26" height="20">
                      <rect x="1" y="1" width="46" height="34" rx="6" fill="#e8c874" stroke="#c9a545" strokeWidth="1" />
                      <line x1="1" y1="12" x2="47" y2="12" stroke="#c9a545" strokeWidth="1" />
                      <line x1="1" y1="24" x2="47" y2="24" stroke="#c9a545" strokeWidth="1" />
                    </svg>
                  </div>
                  <Wifi size={16} className="compte-mini-card-wifi" />
                  <span className="compte-mini-card-number">•••• 4589</span>
                  {cardBlocked && <span className="compte-mini-card-blocked"><Lock size={11} /> Bloquée</span>}
                </div>
              </div>

              <div className="compte-account-footer">
                <span>Numéro de compte</span>
                <div className="compte-account-number-row">
                  <span>•••• •••• •••• 4589</span>
                  <button type="button" className="compte-copy-btn"><Copy size={14} /></button>
                </div>

                <span style={{ marginTop: '0.75rem' }}>RIB</span>
                <div className="compte-account-number-row">
                  <span>230 780 0000123456789012 34</span>
                  <button type="button" className="compte-copy-btn"><Copy size={14} /></button>
                </div>
              </div>
            </div>

            <div className="compte-panel">
              <div className="compte-panel-header">
                <h2 className="compte-panel-title">Informations du compte</h2>
                <User size={18} className="compte-panel-header-icon" />
              </div>
              <div className="compte-info-list">
                <div className="compte-info-row"><span>Type de compte</span><strong>{config.label}</strong></div>
                <div className="compte-info-row">
                  <span>Statut</span>
                  <strong className="compte-info-active"><span className="compte-status-dot" /> Actif</strong>
                </div>
                <div className="compte-info-row"><span>Date d'ouverture</span><strong>20 juillet 2026</strong></div>
                <div className="compte-info-row"><span>Devise</span><strong>MAD</strong></div>
                <div className="compte-info-row"><span>Titulaire du compte</span><strong>Marwa Boutabi</strong></div>
                {isBusiness && (
                  <>
                    <div className="compte-info-row"><span>Registre de commerce</span><strong>Non renseigné</strong></div>
                    <div className="compte-info-row"><span>Identifiant fiscal</span><strong>Non renseigné</strong></div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Colonne droite : actions rapides + limites résumé */}
          <div className="compte-col-right">
            <div className="compte-panel">
              <h2 className="compte-panel-title">Actions rapides</h2>
              <div className="compte-quick-grid">
                
                <button 
                  type="button" 
                  className="compte-quick-btn"
                  onClick={() => navigate('/envoyer-argent')}
                >
                  <Send size={20} /> Envoyer<br />de l'argent
                </button>
                
                <button 
  type="button" 
  className="compte-quick-btn"
  onClick={() => navigate('/recevoir-argent')}
>
  <Download size={20} /> Recevoir<br />de l'argent
</button>
                <button type="button" className="compte-quick-btn" onClick={() => setCardBlocked((v) => !v)}>
                  {cardBlocked ? <Unlock size={20} /> : <Lock size={20} />}
                  {cardBlocked ? 'Débloquer' : 'Bloquer'}<br />la carte
                </button>
                <button 
  type="button" 
  className="compte-quick-btn"
  onClick={() => navigate('/transactions-client')}
>
  <FileText size={20} /> Télécharger<br />un relevé
</button>
              </div>
            </div>

            <div className="compte-panel">
              <div className="compte-panel-header">
                <h2 className="compte-panel-title">Limites et sécurité</h2>
                <Shield size={18} className="compte-panel-header-icon" />
              </div>
              <div className="compte-info-list">
                <div className="compte-info-row"><span>Virement quotidien (Maroc)</span><strong>{limitsMA.transfer.toLocaleString('fr-FR')} MAD</strong></div>
                <div className="compte-info-row"><span>Paiement quotidien (Maroc)</span><strong>{limitsMA.payment.toLocaleString('fr-FR')} MAD</strong></div>
                <div className="compte-info-row"><span>Retrait quotidien (Maroc)</span><strong>{limitsMA.withdrawal.toLocaleString('fr-FR')} MAD</strong></div>
                <div className="compte-info-row"><span>Plafond international</span><strong>{limitsIntl.payment.toLocaleString('fr-FR')} MAD</strong></div>
              </div>
              <button type="button" className="compte-manage-btn" onClick={() => setActivePanel('plafonds')}>
                <Settings size={16} /> Gérer mes limites
              </button>
            </div>
          </div>
        </div>

        {/* Services liés */}
        <section className="compte-services-section">
          <h2 className="compte-panel-title" style={{ marginBottom: '1rem' }}>Services liés à votre compte</h2>
          <div className="compte-services-grid">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.key} type="button" className="compte-service-card" onClick={() => setActivePanel(s.key)}>
                  <div className="compte-service-icon"><Icon size={18} /></div>
                  <div className="compte-service-text">
                    <p className="compte-service-title">{s.title}</p>
                    <p className="compte-service-desc">{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ===== Panneau détaillé (overlay simple) ===== */}
        {activePanel && (
          <div className="compte-overlay" onClick={() => setActivePanel(null)}>
            <div className="compte-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="compte-drawer-header">
                <h2>
                  {activePanel === 'carte' && 'Ma carte'}
                  {activePanel === 'paiements' && 'Paramètres de paiement'}
                  {activePanel === 'plafonds' && 'Gestion des plafonds'}
                  {activePanel === 'infos' && 'Informations du compte'}
                </h2>
                <button type="button" onClick={() => setActivePanel(null)}><X size={20} /></button>
              </div>

              {activePanel === 'carte' && (
                <div className="compte-drawer-body">
                  <div className="compte-card-status-row">
                    <div>
                      <p className="compte-row-label">Statut de la carte</p>
                      <p className="compte-row-desc">
                        {cardBlocked ? 'Carte temporairement bloquée.' : cardActive ? 'Carte active et fonctionnelle.' : 'Carte désactivée.'}
                      </p>
                    </div>
                    <span className={`compte-status-badge ${cardActive && !cardBlocked ? 'compte-status-active' : 'compte-status-inactive'}`}>
                      {cardBlocked ? 'Bloquée' : cardActive ? 'Active' : 'Désactivée'}
                    </span>
                  </div>
                  <div className="compte-action-grid">
                    <button type="button" className={`compte-action-btn ${cardBlocked ? 'compte-action-btn-warning-active' : 'compte-action-btn-warning'}`} onClick={() => setCardBlocked((v) => !v)}>
                      <Lock size={18} /> {cardBlocked ? 'Débloquer la carte' : 'Bloquer temporairement'}
                    </button>
                    <button type="button" className="compte-action-btn">
                      <RefreshCw size={18} /> Gérer le code PIN
                    </button>
                    <button type="button" className="compte-action-btn">
                      <PlusCircle size={18} /> {isBusiness ? 'Carte supplémentaire' : 'Nouvelle carte'}
                    </button>
                  </div>
                </div>
              )}

              {activePanel === 'paiements' && (
                <div className="compte-drawer-body compte-toggle-list">
                  <div className="compte-toggle-row">
                    <div className="compte-toggle-info"><Globe size={18} className="compte-toggle-icon" />
                      <div><p className="compte-row-label">Paiements en ligne</p><p className="compte-row-desc">Achats sur internet</p></div>
                    </div>
                    <Toggle checked={payments.online} onChange={() => togglePayment('online')} />
                  </div>
                  <div className="compte-toggle-row">
                    <div className="compte-toggle-info"><Wifi size={18} className="compte-toggle-icon" />
                      <div><p className="compte-row-label">Paiements sans contact</p><p className="compte-row-desc">Paiement rapide en magasin</p></div>
                    </div>
                    <Toggle checked={payments.contactless} onChange={() => togglePayment('contactless')} />
                  </div>
                  <div className="compte-toggle-row">
                    <div className="compte-toggle-info"><Banknote size={18} className="compte-toggle-icon" />
                      <div><p className="compte-row-label">Retraits d'espèces</p><p className="compte-row-desc">Retrait aux distributeurs</p></div>
                    </div>
                    <Toggle checked={payments.withdrawals} onChange={() => togglePayment('withdrawals')} />
                  </div>
                  <div className="compte-toggle-row">
                    <div className="compte-toggle-info"><MapPin size={18} className="compte-toggle-icon" />
                      <div><p className="compte-row-label">Paiements à l'international</p><p className="compte-row-desc">Achats et retraits hors Maroc</p></div>
                    </div>
                    <Toggle checked={payments.international} onChange={() => togglePayment('international')} />
                  </div>
                </div>
              )}

              {activePanel === 'plafonds' && (
                <div className="compte-drawer-body">
                  {isBusiness && (
                    <p className="compte-limits-note">
                      Plafonds relevés pour votre {config.label.toLowerCase()}.
                    </p>
                  )}
                  <div className="compte-limits-group">
                    <p className="compte-limits-group-title">🇲🇦 Maroc</p>
                    <LimitSlider label="Plafond de paiement" value={limitsMA.payment} max={config.maxLimits.ma.payment} unit="MAD/jour" onChange={(v) => setLimitsMA((p) => ({ ...p, payment: v }))} />
                    <LimitSlider label="Plafond de retrait" value={limitsMA.withdrawal} max={config.maxLimits.ma.withdrawal} unit="MAD/jour" onChange={(v) => setLimitsMA((p) => ({ ...p, withdrawal: v }))} />
                    <LimitSlider label="Plafond de virement" value={limitsMA.transfer} max={config.maxLimits.ma.transfer} unit="MAD/jour" onChange={(v) => setLimitsMA((p) => ({ ...p, transfer: v }))} />
                  </div>
                  <div className="compte-limits-group">
                    <p className="compte-limits-group-title">🌍 International</p>
                    <LimitSlider label="Plafond de paiement" value={limitsIntl.payment} max={config.maxLimits.intl.payment} unit="MAD/jour" onChange={(v) => setLimitsIntl((p) => ({ ...p, payment: v }))} />
                    <LimitSlider label="Plafond de retrait" value={limitsIntl.withdrawal} max={config.maxLimits.intl.withdrawal} unit="MAD/jour" onChange={(v) => setLimitsIntl((p) => ({ ...p, withdrawal: v }))} />
                    <LimitSlider label="Plafond de virement" value={limitsIntl.transfer} max={config.maxLimits.intl.transfer} unit="MAD/jour" onChange={(v) => setLimitsIntl((p) => ({ ...p, transfer: v }))} />
                  </div>
                </div>
              )}

              {activePanel === 'infos' && (
                <div className="compte-drawer-body compte-info-list">
                  <div className="compte-info-row"><span>Type de compte</span><strong>{config.label}</strong></div>
                  <div className="compte-info-row"><span>Date d'ouverture</span><strong>20 juillet 2026</strong></div>
                  <div className="compte-info-row"><span>Devise</span><strong>MAD (Dirham marocain)</strong></div>
                  <div className="compte-info-row"><span>Statut</span><strong className="compte-info-active"><CheckCircle2 size={14} /> Compte actif</strong></div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}