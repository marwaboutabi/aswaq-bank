import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Bell,Send,
  User, Shield, Wallet, FileText, Lock, Check,
  Search, ChevronRight, AlertCircle,
  Building2, CreditCard, Tag, Phone, Info
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './SendMoney.css';
import UserHeader from '../components/UserHeader/UserHeader';
import NotificationBell from '../components/NotificationBell/NotificationBell';
const MAIN_STEPS = [
  { icon: User, label: 'Bénéficiaire' },
  { icon: Shield, label: 'Vérification' },
  { icon: Wallet, label: 'Montant' },
  { icon: FileText, label: 'Récapitulatif' },
  { icon: Lock, label: 'Authentification' },
  { icon: Check, label: 'Confirmation' },
];

// Bénéficiaire par défaut si aucun n'est passé en state
const DEFAULT_BENEFICIARY = {
  name: 'BOUTABI Said',
  bank: 'Aswaq Bank',
  account: '•••• •••• •••• 7890',
  type: 'Particulier',
  alias: 'Personnel',
  phone: '06 XX XX XX XX',
};

export default function SendMoneyVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const beneficiary = location.state?.beneficiary || DEFAULT_BENEFICIARY;

  return (
    <div className="dash-layout">
      {/* Sidebar (identique) */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-logo"><Logo size={100} className="mb-6" /></div>
        <nav className="dash-nav">
          {[
            { icon: 'Home', label: 'Accueil', to: '/dashboard-client' },
            { icon: 'CreditCard', label: 'Gestion du compte', to: '/mon-compte' },
            { icon: 'ArrowLeftRight', label: 'Historique des transactions', to: '/transactions-client' },
            { icon: 'Receipt', label: 'Tickets numériques', to: '/tickets-client' },
            { icon: 'Star', label: 'Points de fidélité', to: '/fidelite' },
            { icon: 'PiggyBank', label: "Objectifs d'épargne", to: '/epargne' },
            { icon: 'PieChart', label: 'Suivi des dépenses', to: '/depenses' },
            { icon: 'Bell', label: 'Notifications', to: '/notifications' },
            { icon: 'Bot', label: 'Assistant IA', to: '/assistant' },
            { icon: 'User', label: 'Profil et paramètres', to: '/parametres' },
          ].map((item) => (
            <a key={item.label} href={item.to} className="dash-nav-item"><span>{item.label}</span></a>
          ))}
        </nav>
        <a href="/" className="dash-logout"><span>Déconnexion</span></a>
      </aside>

      {/* Main */}
      <main className="dash-main send-money-main">
        {/* Header identique */}
        <header className="sm-topbar">
          <button type="button" className="sm-back" onClick={() => navigate('/envoyer-argent')}>
            <ArrowLeft size={18} /> Retour
          </button>
          <div className="sm-topbar-actions">
            <div className="dash-search"><Search size={16} /><input type="text" placeholder="Rechercher..." /></div>
            <NotificationBell />
            <UserHeader />
          </div>
        </header>

        {/* Page header identique */}
        <div className="sm-page-header">
          <div className="sm-page-icon"><Send size={22} /></div>
          <div>
            <h1 className="sm-page-title">Envoyer de l'argent</h1>
            <p className="sm-page-subtitle">Choisissez un bénéficiaire pour effectuer un virement sécurisé</p>
          </div>
        </div>

        {/* Stepper mis à jour : Étape 2 active */}
        <section className="sm-stepper-card">
          <h2 className="sm-stepper-title">
            <span>Étape 2 sur 6 :</span> Vérification du bénéficiaire
          </h2>
          <div className="sm-stepper">
            {MAIN_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isDone = idx === 0; // Étape 1 terminée
              const isActive = idx === 1; // Étape 2 active
              return (
                <div key={step.label} className="sm-step">
                  {idx > 0 && <div className="sm-step-line" />}
                  <div className={`sm-step-circle ${isDone ? 'sm-step-done' : isActive ? 'sm-step-active' : ''}`}>
                    {isDone ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  <span className={`sm-step-label ${isActive ? 'sm-step-label-active' : ''}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Grid : Carte de vérification + Conseils */}
        <div className="sm-grid">
          {/* Carte de vérification (remplace la liste des bénéficiaires) */}
          <section className="sm-beneficiaries-panel sm-verification-panel">
            <h3 className="sm-verification-title">Vérification des informations</h3>

            <div className="sm-verification-card">
              <div className="sm-verification-row">
                <div className="sm-verification-row-icon">
                  <User size={18} />
                </div>
                <div className="sm-verification-row-content">
                  <span className="sm-verification-row-label">Nom complet</span>
                  <span className="sm-verification-row-value">{beneficiary.name}</span>
                </div>
              </div>

              <div className="sm-verification-row">
                <div className="sm-verification-row-icon">
                  <Building2 size={18} />
                </div>
                <div className="sm-verification-row-content">
                  <span className="sm-verification-row-label">Banque</span>
                  <span className="sm-verification-row-value">{beneficiary.bank}</span>
                </div>
              </div>

              <div className="sm-verification-row">
                <div className="sm-verification-row-icon">
                  <CreditCard size={18} />
                </div>
                <div className="sm-verification-row-content">
                  <span className="sm-verification-row-label">RIB / IBAN</span>
                  <span className="sm-verification-row-value sm-verification-rib">{beneficiary.account}</span>
                </div>
              </div>

              <div className="sm-verification-row">
                <div className="sm-verification-row-icon">
                  <User size={18} />
                </div>
                <div className="sm-verification-row-content">
                  <span className="sm-verification-row-label">Type</span>
                  <span className="sm-verification-row-value">{beneficiary.type}</span>
                </div>
              </div>

              <div className="sm-verification-row">
                <div className="sm-verification-row-icon">
                  <Tag size={18} />
                </div>
                <div className="sm-verification-row-content">
                  <span className="sm-verification-row-label">Alias</span>
                  <span className="sm-verification-row-value">{beneficiary.alias}</span>
                </div>
              </div>

              <div className="sm-verification-row">
                <div className="sm-verification-row-icon">
                  <Phone size={18} />
                </div>
                <div className="sm-verification-row-content">
                  <span className="sm-verification-row-label">Téléphone</span>
                  <span className="sm-verification-row-value">{beneficiary.phone}</span>
                </div>
              </div>
            </div>

            {/* Boîte d'information bleue */}
            <div className="sm-verification-info-box">
              <Info size={18} className="sm-verification-info-icon" />
              <p className="sm-verification-info-text">
                Veuillez vérifier attentivement les informations du bénéficiaire avant de poursuivre votre virement.
              </p>
            </div>
          </section>

          {/* Conseils de sécurité (mis à jour) */}
          <aside className="sm-tips-panel">
            <div className="sm-tips-header">
              <div className="sm-tips-icon"><Shield size={18} /></div>
              <h3 className="sm-tips-title">Conseils de sécurité</h3>
            </div>
            <ul className="sm-tips-list">
              <li className="sm-tip-item">
                <div className="sm-tip-icon"><User size={16} /></div>
                <p>Vérifiez toujours le nom du bénéficiaire.</p>
              </li>
              <li className="sm-tip-item">
                <div className="sm-tip-icon"><Building2 size={16} /></div>
                <p>Vérifiez la banque sélectionnée.</p>
              </li>
              <li className="sm-tip-item">
                <div className="sm-tip-icon"><CreditCard size={16} /></div>
                <p>Vérifiez le RIB / IBAN.</p>
              </li>
              <li className="sm-tip-item">
                <div className="sm-tip-icon"><AlertCircle size={16} /></div>
                <p>Une fois le virement confirmé, certaines opérations peuvent être irréversibles.</p>
              </li>
            </ul>
          </aside>
        </div>

        {/* Boutons en bas : Modifier + Continuer */}
        <footer className="sm-footer sm-footer-two-buttons">
          <button
            type="button"
            className="sm-btn-modify"
            onClick={() => navigate('/envoyer-argent')}
          >
            <ArrowLeft size={16} /> Modifier le bénéficiaire
          </button>
          <button
            type="button"
            className="sm-continue-btn"
            onClick={() => navigate('/envoyer-argent/recapitulatif', { state: { beneficiary } })}
          >
            Continuer <ChevronRight size={18} />
          </button>
        </footer>
      </main>
    </div>
  );
}