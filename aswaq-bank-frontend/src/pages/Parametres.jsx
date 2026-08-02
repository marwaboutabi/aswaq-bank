import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, ArrowLeftRight, Receipt, Star, PiggyBank, PieChart,
  Bell, Bot, User, LogOut, Search, ChevronDown, ChevronRight,
  Camera, Mail, Phone, Shield, Smartphone, History, Lock,
  Globe, DollarSign, Monitor, HelpCircle, FileText,
  MessageCircle, AlertTriangle, X, Check, Edit3,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './Parametres.css';
import './DashboardClient.css';

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/dashboard-client' },
  { icon: ArrowLeftRight, label: 'Gestion du compte', to: '/mon-compte' },
  { icon: ArrowLeftRight, label: 'Historique des transactions', to: '/transactions-client' },
  { icon: Receipt, label: 'Tickets numériques', to: '/tickets-client' },
  { icon: Star, label: 'Points de fidélité', to: '/fidelite' },
  { icon: PiggyBank, label: "Objectifs d'épargne", to: '/epargne' },
  { icon: PieChart, label: 'Suivi des dépenses', to: '/depenses' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant' },
  { icon: User, label: 'Profil et paramètres', to: '/parametres' },
];

const SECURITY_ITEMS = [
  { id: 'password', icon: Lock, label: 'Modifier le mot de passe', desc: 'Dernière modification il y a 3 mois' },
  { id: 'devices', icon: Smartphone, label: 'Appareils connectés', desc: '3 appareils' },
  { id: 'history', icon: History, label: 'Historique des connexions', desc: 'Voir les dernières connexions' },
];

const NOTIFICATION_PREFS = [
  { id: 'payments', label: 'Paiements', desc: 'Notifications pour chaque paiement', default: true },
  { id: 'security', label: 'Sécurité', desc: 'Alertes de sécurité importantes', default: true },
  { id: 'loyalty', label: 'Points de fidélité', desc: 'Gains et récompenses', default: true },
  { id: 'savings', label: "Objectifs d'épargne", desc: 'Progression et rappels', default: true },
  { id: 'ai', label: 'Assistant IA', desc: 'Conseils et analyses', default: false },
  { id: 'promo', label: 'Promotions', desc: 'Offres spéciales et nouveautés', default: false },
];

const PREFERENCE_ITEMS = [
  { id: 'language', icon: Globe, label: 'Langue', value: 'Français', options: ['Français', 'Arabe', 'English'] },
  { id: 'currency', icon: DollarSign, label: 'Devise', value: 'MAD', options: ['MAD', 'EUR', 'USD'] },
  { id: 'theme', icon: Monitor, label: 'Apparence', value: 'Clair', options: ['Clair', 'Sombre', 'Automatique'] },
];

const HELP_ITEMS = [
  { id: 'help', icon: HelpCircle, label: "Centre d'aide", desc: 'Guides et tutoriels' },
  { id: 'faq', icon: FileText, label: 'FAQ', desc: 'Questions fréquentes' },
  { id: 'terms', icon: FileText, label: "Conditions d'utilisation", desc: 'Règles et obligations' },
  { id: 'privacy', icon: Shield, label: 'Politique de confidentialité', desc: 'Protection de vos données' },
  { id: 'contact', icon: MessageCircle, label: 'Contacter le support', desc: 'Assistance 24/7' },
];

// Toggle component
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`profil-toggle ${checked ? 'profil-toggle-on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="profil-toggle-knob" />
    </button>
  );
}

export default function Profil() {
  const location = useLocation();
   const navigate = useNavigate();
  const [notifPrefs, setNotifPrefs] = useState(
    NOTIFICATION_PREFS.reduce((acc, p) => ({ ...acc, [p.id]: p.default }), {})
  );
  const [preferences, setPreferences] = useState({
    language: 'Français',
    currency: 'MAD',
    theme: 'Clair',
  });
  const [activeModal, setActiveModal] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleNotifChange = (id) => {
    setNotifPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePreferenceChange = (id, value) => {
    setPreferences((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="acc-sidebar-logo">
          <Logo size={100} className="mb-6" logo-white />
        </div>
        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.to === '/parametre';
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
            <h1 className="dash-greeting">Profil & Paramètres</h1>
            <p className="dash-greeting-sub">
              Gérez vos informations personnelles, vos préférences et la sécurité de votre compte.
            </p>
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

        <div className="profil-container">
          {/* Section 1 : Mon profil */}
          <section className="profil-section">
            <div className="profil-card profil-profile-card">
              <div className="profil-profile-header">
                <div className="profil-avatar-wrapper">
                  <div className="profil-avatar">MB</div>
                  <button type="button" className="profil-avatar-edit">
                    <Camera size={14} />
                  </button>
                </div>
                <div className="profil-profile-info">
                  <h2 className="profil-profile-name">Marwa Boutabi</h2>
                  <div className="profil-profile-details">
                    <div className="profil-detail-item">
                      <Mail size={14} />
                      <span>marwa.boutabi@gmail.ma</span>
                    </div>
                    <div className="profil-detail-item">
                      <Phone size={14} />
                      <span>+212 6 12 34 56 78</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="profil-edit-btn"
                onClick={() => setActiveModal('profile')}
              >
                <Edit3 size={16} />
                Modifier mon profil
              </button>
            </div>
          </section>

          {/* Section 2 : Sécurité */}
          {/* Section 2 : Sécurité */}
<section className="profil-section">
  <h3 className="profil-section-title">Sécurité</h3>
  <div className="profil-card">
    {SECURITY_ITEMS.map((item, idx) => {
      const Icon = item.icon;
      return (
        <button
          key={item.id}
          type="button"
          className={`profil-list-item ${idx < SECURITY_ITEMS.length - 1 ? '' : 'profil-list-item-last'}`}
          onClick={() => {
            if (item.id === 'password') {
              navigate('/reset-password'); // ← Redirection vers forgot password
            } else {
              setActiveModal(item.id);
            }
          }}
        >
          <div className="profil-list-icon">
            <Icon size={18} />
          </div>
          <div className="profil-list-content">
            <p className="profil-list-label">{item.label}</p>
            <p className="profil-list-desc">{item.desc}</p>
          </div>
          {item.badge && <span className="profil-badge profil-badge-success">{item.badge}</span>}
          <ChevronRight size={16} className="profil-list-arrow" />
        </button>
      );
    })}
  </div>
</section>
          {/* Section 3 : Notifications */}
          <section className="profil-section">
            <h3 className="profil-section-title">Notifications</h3>
            <div className="profil-card">
              {NOTIFICATION_PREFS.map((pref, idx) => (
                <div
                  key={pref.id}
                  className={`profil-list-item ${idx < NOTIFICATION_PREFS.length - 1 ? '' : 'profil-list-item-last'}`}
                >
                  <div className="profil-list-content">
                    <p className="profil-list-label">{pref.label}</p>
                    <p className="profil-list-desc">{pref.desc}</p>
                  </div>
                  <Toggle
                    checked={notifPrefs[pref.id]}
                    onChange={() => handleNotifChange(pref.id)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 : Préférences */}
          <section className="profil-section">
            <h3 className="profil-section-title">Préférences</h3>
            <div className="profil-card">
              {PREFERENCE_ITEMS.map((pref, idx) => {
                const Icon = pref.icon;
                return (
                  <div
                    key={pref.id}
                    className={`profil-list-item ${idx < PREFERENCE_ITEMS.length - 1 ? '' : 'profil-list-item-last'}`}
                  >
                    <div className="profil-list-icon">
                      <Icon size={18} />
                    </div>
                    <div className="profil-list-content">
                      <p className="profil-list-label">{pref.label}</p>
                    </div>
                    <select
                      className="profil-select"
                      value={preferences[pref.id]}
                      onChange={(e) => handlePreferenceChange(pref.id, e.target.value)}
                    >
                      {pref.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </section>

 {/* Section 5 : Aide & Informations */}
<section className="profil-section">
  <h3 className="profil-section-title">Aide & Informations</h3>
  <div className="profil-card">
    {HELP_ITEMS.map((item, idx) => {
      const Icon = item.icon;
      return (
        <button
          key={item.id}
          type="button"
          className={`profil-list-item ${idx < HELP_ITEMS.length - 1 ? '' : 'profil-list-item-last'}`}
          onClick={() => {
            if (item.id === 'terms') {
              navigate('/conditions-generales');
            } else if (item.id === 'privacy') {
              navigate('/politique-confidentialite');
            }
          }}
        >
          <div className="profil-list-icon">
            <Icon size={18} />
          </div>
          <div className="profil-list-content">
            <p className="profil-list-label">{item.label}</p>
            <p className="profil-list-desc">{item.desc}</p>
          </div>
          <ChevronRight size={16} className="profil-list-arrow" />
        </button>
      );
    })}
  </div>
</section>

          {/* Section 6 : Déconnexion */}
          <section className="profil-section profil-logout-section">
            <button type="button" className="profil-logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              Se déconnecter
            </button>
            <button
              type="button"
              className="profil-delete-link"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Fermer mon compte
            </button>
          </section>
        </div>
      </main>

      {/* Modal : Modifier le profil */}
      {activeModal === 'profile' && (
        <div className="profil-overlay" onClick={() => setActiveModal(null)}>
          <div className="profil-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profil-modal-header">
              <h3>Modifier mon profil</h3>
              <button type="button" onClick={() => setActiveModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="profil-modal-body">
              <div className="profil-modal-avatar">
                <div className="profil-avatar profil-avatar-large">MB</div>
                <button type="button" className="profil-avatar-edit-btn">
                  <Camera size={14} />
                  Changer la photo
                </button>
              </div>
              <label className="profil-modal-label">Nom complet</label>
              <input type="text" className="profil-modal-input" defaultValue="Marwa Boutabi" />
              <label className="profil-modal-label">Adresse e-mail</label>
              <input type="email" className="profil-modal-input" defaultValue="marwa.boutabi@gmail.ma" />
              <label className="profil-modal-label">Numéro de téléphone</label>
              <input type="tel" className="profil-modal-input" defaultValue="+212 6 12 34 56 78" />
            </div>
            <button type="button" className="profil-modal-submit" onClick={() => setActiveModal(null)}>
              <Check size={16} />
              Enregistrer les modifications
            </button>
          </div>
        </div>
      )}

      {/* Modal : Fermer le compte */}
      {showDeleteConfirm && (
        <div className="profil-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="profil-modal profil-modal-danger" onClick={(e) => e.stopPropagation()}>
            <div className="profil-modal-header">
              <h3>Fermer mon compte</h3>
              <button type="button" onClick={() => setShowDeleteConfirm(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="profil-modal-body">
              <div className="profil-warning-icon">
                <AlertTriangle size={32} />
              </div>
              <p className="profil-warning-text">
                Êtes-vous sûr de vouloir fermer votre compte ? Cette action est <strong>irréversible</strong> et entraînera la suppression définitive de toutes vos données.
              </p>
              <div className="profil-warning-check">
                <input type="checkbox" id="confirm-delete" />
                <label htmlFor="confirm-delete">
                  Je comprends que cette action est définitive
                </label>
              </div>
            </div>
            <div className="profil-modal-actions">
              <button type="button" className="profil-modal-cancel" onClick={() => setShowDeleteConfirm(false)}>
                Annuler
              </button>
              <button type="button" className="profil-modal-danger-btn">
                Fermer mon compte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}