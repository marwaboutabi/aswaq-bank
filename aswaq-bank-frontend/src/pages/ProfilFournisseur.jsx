import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Star, User, LogOut, Search, ChevronDown, ChevronRight,
  Camera, Mail, Phone, Shield, Smartphone, History, Lock,
  Globe, DollarSign, Monitor,  FileText, 
  MessageCircle, AlertTriangle, X, Check, Edit3,
  Package, Users, Truck, ShoppingCart, CreditCard, Layers,
  Bot, Bell ,Building2
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './ProfilCom.css'; 
import './DashboardClient.css';

const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', to: '/accueil-fournisseur' },
    { icon: Package, label: 'Produits', to: '/produits-fournisseur' },
    { icon: ShoppingCart, label: 'Commandes reçues', to: '/commandes-fournisseur' },
    { icon: CreditCard, label: 'Paiements', to: '/paiements-fournisseur' },
    { icon: Truck, label: 'Livraisons', to: '/livraisons-fournisseur' },
    { icon: Layers, label: 'Catalogue', to: '/catalogue-fournisseur' },
   { icon: Bell, label: 'Notifications', to: '/notifications-fournisseur' },
    { icon: Bot, label: 'Assistant IA', to: '/assistant-fournisseur' },
    { icon: User, label: 'Profil & Paramètres', to: '/profil-fournisseur' , active: true},

  ];

const SECURITY_ITEMS = [
  { id: 'password', icon: Lock, label: 'Modifier le mot de passe', desc: 'Dernière modification il y a 3 mois' },
  { id: 'devices', icon: Smartphone, label: 'Appareils connectés', desc: '3 appareils' },
  { id: 'history', icon: History, label: 'Historique des connexions', desc: 'Voir les dernières connexions' },
];

const NOTIFICATION_PREFS = [
  { id: 'orders', label: 'Nouvelles commandes', desc: 'Recevoir une notification lorsqu\'un commerçant passe une commande', default: true },
  { id: 'delivery', label: 'Livraisons', desc: 'Suivi des expéditions et livraisons', default: true },
  { id: 'payments', label: 'Paiements', desc: 'Versements et paiements reçus', default: true },
  { id: 'stock', label: 'Stock', desc: 'Alertes de stock faible', default: true },
  { id: 'security', label: 'Sécurité', desc: 'Connexions et activité du compte', default: true },
  { id: 'ai', label: 'Assistant IA', desc: 'Suggestions commerciales et recommandations', default: false },
];

const PREFERENCE_ITEMS = [
  { id: 'language', icon: Globe, label: 'Langue', value: 'Français', options: ['Français', 'Arabe', 'English'] },
  { id: 'currency', icon: DollarSign, label: 'Devise', value: 'MAD', options: ['MAD', 'EUR', 'USD'] }, // <-- CORRECTION: Ajout de icon: DollarSign
  { id: 'theme', icon: Monitor, label: 'Apparence', value: 'Clair', options: ['Clair', 'Sombre', 'Automatique'] },
];

const HELP_ITEMS = [
  { id: 'faq', icon: FileText, label: 'FAQ', desc: 'Questions fréquentes' },
  { id: 'terms', icon: FileText, label: "Conditions d'utilisation", desc: 'Règles et obligations de la plateforme' },
  { id: 'privacy', icon: Shield, label: 'Politique de confidentialité', desc: 'Protection de vos données et celles de vos clients' },
  { id: 'contact', icon: MessageCircle, label: 'Contacter le support', desc: 'Assistance dédiée aux fournisseurs' },
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

export default function ProfilFournisseur() {
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
        <p className="liv-four-sidebar-section">
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
          <div className="dash-help-icon">
            <Bot size={20} /> {/* <-- CORRECTION: Réajout de l'icône Bot */}
          </div>
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
              Gérez les informations de votre entreprise, vos préférences et la sécurité de votre compte fournisseur.
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
              onClick={() => navigate('/notifications-fournisseur')}
            >
              <Bell size={18} /> {/* <-- CORRECTION: Réajout de l'icône Bell */}
              <span className="dash-badge">3</span>
            </button>
            <div className="dash-user-chip">
              <div className="dash-user-avatar">MB</div>
              <div className="dash-user-info">
                <span className="dash-user-name">Marwa Boutabi</span>
                <span className="dash-user-role">Fournisseur</span>
              </div>
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
                  <div className="profil-avatar">AD</div>
                  <button type="button" className="profil-avatar-edit">
                    <Camera size={14} />
                  </button>
                </div>
                <div className="profil-profile-info">
                  <h2 className="profil-profile-name">Marwa Boutabi</h2>
                  <p className="profil-profile-role" style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px', fontWeight: '500' }}>
                    Responsable Fournisseur • Atlas Distribution SARL
                  </p>
                  <div className="profil-profile-details" style={{ marginTop: '8px' }}>
                    <div className="profil-detail-item">
                      <Mail size={14} />
                      <span>contact@atlas-distribution.ma</span>
                    </div>
                    <div className="profil-detail-item">
                      <Phone size={14} />
                      <span>+212 6 55 44 33 22</span>
                    </div>
                    <div className="profil-detail-item">
                      <Globe size={14} />
                      <span>Zone Industrielle Ain Sebaa, Casablanca</span>
                    </div>
                    <div className="profil-detail-item">
                      <FileText size={14} />
                      <span>ICE : 001234567890123 • Catégorie : Produits alimentaires</span>
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
                Modifier les informations de l'entreprise
              </button>
            </div>
          </section>

          {/* Section 2 : Sécurité */}
          <section className="profil-section">
            <h3 className="profil-section-title">Sécurité du compte</h3>
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
                        navigate('/reset-password');
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
            <h3 className="profil-section-title">Préférences d'affichage</h3>
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
            <h3 className="profil-section-title">Aide & Informations légales</h3>
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
              Fermer mon compte fournisseur
            </button>
          </section>
        </div>
      </main>

      {/* Modal : Modifier le profil */}
      {activeModal === 'profile' && (
        <div className="profil-overlay" onClick={() => setActiveModal(null)}>
          <div className="profil-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profil-modal-header">
              <h3>Modifier les informations de l'entreprise</h3>
              <button type="button" onClick={() => setActiveModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="profil-modal-body">
              <div className="profil-modal-avatar">
                <div className="profil-avatar profil-avatar-large">AD</div>
                <button type="button" className="profil-avatar-edit-btn">
                  <Camera size={14} />
                  Changer le logo
                </button>
              </div>
              <label className="profil-modal-label">Nom du responsable</label>
              <input type="text" className="profil-modal-input" defaultValue="Marwa Boutabi" />
              
              <label className="profil-modal-label">Nom de l'entreprise</label>
              <input type="text" className="profil-modal-input" defaultValue="Atlas Distribution SARL" />
              
              <label className="profil-modal-label">Adresse e-mail professionnelle</label>
              <input type="email" className="profil-modal-input" defaultValue="contact@atlas-distribution.ma" />
              
              <label className="profil-modal-label">Numéro de téléphone professionnel</label>
              <input type="tel" className="profil-modal-input" defaultValue="+212 6 55 44 33 22" />

              <label className="profil-modal-label">Adresse</label>
              <input type="text" className="profil-modal-input" defaultValue="Zone Industrielle Ain Sebaa" />

              <label className="profil-modal-label">Ville</label>
              <input type="text" className="profil-modal-input" defaultValue="Casablanca" />

              <label className="profil-modal-label">ICE</label>
              <input type="text" className="profil-modal-input" defaultValue="001234567890123" />

              <label className="profil-modal-label">IF</label>
              <input type="text" className="profil-modal-input" defaultValue="12345678" />

              <label className="profil-modal-label">Catégorie</label>
              <input type="text" className="profil-modal-input" defaultValue="Produits alimentaires" />

              <label className="profil-modal-label">Site Web</label>
              <input type="url" className="profil-modal-input" defaultValue="https://atlas-distribution.ma" />
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
              <h3>Fermer mon compte fournisseur</h3>
              <button type="button" onClick={() => setShowDeleteConfirm(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="profil-modal-body">
              <div className="profil-warning-icon">
                <AlertTriangle size={32} />
              </div>
              <p className="profil-warning-text">
                Êtes-vous sûr de vouloir fermer votre compte fournisseur ? Cette action est <strong>irréversible</strong> et supprimera définitivement votre entreprise, votre catalogue de produits, votre historique de commandes, vos livraisons et toutes vos données fournisseur.
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
                Fermer mon compte fournisseur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}