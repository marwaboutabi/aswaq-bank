import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, ArrowLeftRight,  Star, Bell, Bot, User, LogOut, Search, ChevronDown, ChevronRight,
  Camera, Mail, Phone, Shield, Smartphone, History, Lock,
  Globe, DollarSign, Monitor, HelpCircle, FileText,
  MessageCircle, AlertTriangle, X, Check, Edit3,
  Package, Boxes, Users,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './ProfilCom.css';
import './DashboardClient.css';
import api from '../services/api';

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/acceuil-com' },
  { icon: Package, label: 'Produits', to: '/produits' },
  { icon: ArrowLeftRight, label: 'Paiements & Transactions', to: '/transactions-commerce' },
  { icon: Users, label: 'Fournisseurs', to: '/fournisseurs' },
  { icon: Star, label: 'Fidélité & Tickets', to: '/fidelite-commerce' },
  { icon: Bell, label: 'Notifications', to: '/notifications-com' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant-commerce' },
  { icon: User, label: 'Profil & Paramètres', to: '/parametres-commerce', active: true },
];

const SECURITY_ITEMS = [
  { id: 'password', icon: Lock, label: 'Modifier le mot de passe', desc: 'Dernière modification il y a 3 mois' },
  { id: 'devices', icon: Smartphone, label: 'Appareils connectés', desc: '3 appareils' },
  { id: 'history', icon: History, label: 'Historique des connexions', desc: 'Voir les dernières connexions' },
];

// Adapté pour un commerçant : alertes métier au lieu de finances personnelles
const NOTIFICATION_PREFS = [
  { id: 'payments', label: 'Paiements & Ventes', desc: 'Notifications pour chaque encaissement', default: true },
  { id: 'security', label: 'Sécurité', desc: 'Alertes de connexion et accès au compte', default: true },
  { id: 'loyalty', label: 'Programme de fidélité', desc: 'Nouveaux inscrits et récompenses distribuées', default: true },
  { id: 'stock', label: 'Alertes de stock', desc: 'Ruptures et seuils critiques atteints', default: true },
  { id: 'supplier', label: 'Fournisseurs', desc: 'Mises à jour des commandes et livraisons', default: true },
  { id: 'ai', label: 'Assistant IA', desc: 'Recommandations et analyses commerciales', default: false },
];

const PREFERENCE_ITEMS = [
  { id: 'language', icon: Globe, label: 'Langue', value: 'Français', options: ['Français', 'Arabe', 'English'] },
  { id: 'currency', icon: DollarSign, label: 'Devise', value: 'MAD', options: ['MAD', 'EUR', 'USD'] },
  { id: 'theme', icon: Monitor, label: 'Apparence', value: 'Clair', options: ['Clair', 'Sombre', 'Automatique'] },
];

const HELP_ITEMS = [
  { id: 'help', icon: HelpCircle, label: "Centre d'aide", desc: 'Guides et tutoriels pour commerçants' },
  { id: 'faq', icon: FileText, label: 'FAQ', desc: 'Questions fréquentes' },
  { id: 'terms', icon: FileText, label: "Conditions d'utilisation", desc: 'Règles et obligations de la plateforme' },
  { id: 'privacy', icon: Shield, label: 'Politique de confidentialité', desc: 'Protection de vos données et celles de vos clients' },
  { id: 'contact', icon: MessageCircle, label: 'Contacter le support', desc: 'Assistance dédiée aux professionnels' },
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
  
  // Nouveaux states à ajouter
const [profileForm, setProfileForm] = useState({
  nom: '', prenom: '', telephone: '', email: '',
  companyName: '', activitySector: '', address: '', city: '',
});
const [emailStep, setEmailStep] = useState('idle'); // 'idle' | 'otp'
const [otpCode, setOtpCode] = useState('');
const [otpError, setOtpError] = useState('');
const [savingProfile, setSavingProfile] = useState(false);
const [currentUser, setCurrentUser] = useState(null);

const [activeModal, setActiveModal] = useState(null);

const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

const [notifPrefs, setNotifPrefs] = useState({
  payments: true,
  security: true,
  loyalty: true,
  stock: true,
  supplier: true,
  ai: false,
});

const [preferences, setPreferences] = useState({
  language: 'Français',
  currency: 'MAD',
  theme: 'Clair',
});
useEffect(() => { const loadCurrentUser = async () => { try { const response = await api.get('/users/me'); 
  const user = response.data; console.log('Utilisateur connecté :', user); 
  setCurrentUser(user); setProfileForm({
     nom: user.nom || '', prenom: user.prenom || '',
      telephone: user.telephone || '', email: user.email || '',
       companyName: user.merchant?.companyName || '', 
       activitySector: user.merchant?.activitySector || '',
        address: user.merchant?.address || user.adresse || '',
         city: user.merchant?.city || user.ville || '', });
         } catch (error) { 
          console.error( 'Erreur lors du chargement du profil :', error );
         } }; 
         loadCurrentUser(); 
        }, []);
// Au clic "Modifier les informations du commerce", pré-remplir profileForm
// avec les vraies données récupérées via GET /api/users/me (à charger au montage).

const handleSaveProfile = async () => {
  setSavingProfile(true);
  try {
    // 1) On met à jour tout SAUF l'email
    await api.put('/users/me', {
      nom: profileForm.nom,
      prenom: profileForm.prenom,
      telephone: profileForm.telephone,
      companyName: profileForm.companyName,
      activitySector: profileForm.activitySector,
      address: profileForm.address,
      city: profileForm.city,
    });

    // 2) Si l'email a changé, on déclenche la vérification OTP
    if (profileForm.email && profileForm.email !== currentUser.email) {
      await api.post('/users/me/email/request-change', { newEmail: profileForm.email });
      setEmailStep('otp'); // on bascule le modal en mode "saisie du code"
    } else {
      setActiveModal(null); // rien à vérifier, on ferme normalement
    }
  } catch (err) {
    alert(err.response?.data?.message || "Erreur lors de l'enregistrement.");
  } finally {
    setSavingProfile(false);
  }
};

const handleConfirmEmailOtp = async () => {
  setOtpError('');
  try {
    const res = await api.post('/users/me/email/confirm-change', {
      newEmail: profileForm.email,
      code: otpCode,
    });

    if (res.data.success) {
      // Déconnexion forcée : l'email a changé, il faut se reconnecter avec le nouveau
      localStorage.removeItem('token');
      navigate('/login', {
        state: { message: 'Votre email a été mis à jour. Veuillez vous reconnecter.' },
      });
    } else {
      setOtpError(res.data.message || 'Code invalide.');
    }
  } catch (err) {
    setOtpError(err.response?.data?.message || 'Erreur de vérification.');
  }
};

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
        <div className="dash-sidebar-logo">
          <Logo size={100} className="mb-6 logo-white" />
        </div>
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
            <h1 className="dash-greeting">Profil & Paramètres</h1>
            <p className="dash-greeting-sub">
              Gérez les informations de votre commerce, vos préférences et la sécurité de votre compte professionnel.
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
              onClick={() => navigate('/notifications-com')}
            >
              <Bell size={18} />
              <span className="dash-badge">3</span>
            </button>
           <div className="dash-user-chip">
  <div className="dash-user-avatar">MB</div>
  <div className="dash-user-info">
    <span className="dash-user-name">Marwa Boutabi</span>
    <span className="dash-user-role">Commerçant</span>
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
                  <div className="profil-avatar">MB</div>
                  <button type="button" className="profil-avatar-edit">
                    <Camera size={14} />
                  </button>
                </div>
                <div className="profil-profile-info">
<h2 className="profil-profile-name"> {profileForm.prenom} {profileForm.nom} </h2>                  <p> {profileForm.companyName || 'Commerce'} </p>
                  <div className="profil-profile-details" style={{ marginTop: '8px' }}>
                    <div className="profil-detail-item">
                      <Mail size={14} />
<span>{profileForm.email}</span>                    </div>
                    <div className="profil-detail-item">
                      <Phone size={14} />
<span>{profileForm.telephone}</span>                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="profil-edit-btn"
                onClick={() => setActiveModal('profile')}
              >
                <Edit3 size={16} />
                Modifier les informations du commerce
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
              Fermer mon compte commerce
            </button>
          </section>
        </div>
      </main>

      {activeModal === 'profile' && (
  <div className="profil-overlay" onClick={() => setActiveModal(null)}>
    <div className="profil-modal" onClick={(e) => e.stopPropagation()}>
      <div className="profil-modal-header">
        <h3>{emailStep === 'otp' ? 'Vérification de votre nouvel email' : 'Modifier les informations du commerce'}</h3>
        <button type="button" onClick={() => { setActiveModal(null); setEmailStep('idle'); }}>
          <X size={20} />
        </button>
      </div>

      {emailStep === 'idle' ? (
        <>
          <div className="profil-modal-body">
            {/* ... tes champs existants, mais liés à profileForm au lieu de defaultValue ... */}
            <label className="profil-modal-label">Nom complet du gérant</label>
            <input
              type="text"
              className="profil-modal-input"
              value={`${profileForm.prenom} ${profileForm.nom}`}
              onChange={(e) => {
                const [prenom, ...rest] = e.target.value.split(' ');
                setProfileForm({ ...profileForm, prenom, nom: rest.join(' ') });
              }}
            />
            <label className="profil-modal-label">Nom de l'entreprise / Commerce</label>
            <input
              type="text"
              className="profil-modal-input"
              value={profileForm.companyName}
              onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
            />
            <label className="profil-modal-label">Adresse e-mail professionnelle</label>
            <input
              type="email"
              className="profil-modal-input"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            />
            <label className="profil-modal-label">Numéro de téléphone professionnel</label>
            <input
              type="tel"
              className="profil-modal-input"
              value={profileForm.telephone}
              onChange={(e) => setProfileForm({ ...profileForm, telephone: e.target.value })}
            />
          </div>
          <button
            type="button"
            className="profil-modal-submit"
            onClick={handleSaveProfile}
            disabled={savingProfile}
          >
            <Check size={16} />
            {savingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </>
      ) : (
        <div className="profil-modal-body">
          <p>Un code de vérification a été envoyé à <strong>{profileForm.email}</strong>.</p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            className="profil-modal-input"
            placeholder="Code à 6 chiffres"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
          />
          {otpError && <div className="form-error">{otpError}</div>}
          <button type="button" className="profil-modal-submit" onClick={handleConfirmEmailOtp}>
            <Check size={16} />
            Confirmer et se reconnecter
          </button>
        </div>
      )}
    </div>
  </div>
)}

      {/* Modal : Fermer le compte */}
      {showDeleteConfirm && (
        <div className="profil-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="profil-modal profil-modal-danger" onClick={(e) => e.stopPropagation()}>
            <div className="profil-modal-header">
              <h3>Fermer mon compte commerce</h3>
              <button type="button" onClick={() => setShowDeleteConfirm(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="profil-modal-body">
              <div className="profil-warning-icon">
                <AlertTriangle size={32} />
              </div>
              <p className="profil-warning-text">
                Êtes-vous sûr de vouloir fermer votre compte commerce ? Cette action est <strong>irréversible</strong> et entraînera la suppression définitive de votre boutique, de votre historique de ventes, de votre stock et de toutes vos données professionnelles.
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
                Fermer mon compte commerce
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  }







  