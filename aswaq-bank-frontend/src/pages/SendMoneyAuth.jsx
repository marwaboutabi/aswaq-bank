import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Bell, ChevronDown, Send,
  User, Shield, Wallet, FileText, Lock, Check,
  Search, ChevronRight, Info, CreditCard, Eye, EyeOff,
  Building2, Calendar
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './SendMoney.css';

const MAIN_STEPS = [
  { icon: User, label: 'Bénéficiaire' },
  { icon: Shield, label: 'Vérification' },
  { icon: Wallet, label: 'Montant' },
  { icon: FileText, label: 'Récapitulatif' },
  { icon: Lock, label: 'Authentification' },
  { icon: Check, label: 'Confirmation' },
];

// Données par défaut
const DEFAULT_TRANSFER = {
  beneficiary: {
    name: 'BOUTABI Said',
    bank: 'Aswaq Bank',
    account: '•••• •••• •••• 7890',
  },
  amount: 1000,
  reason: 'Loyer',
  executionDate: new Date().toISOString(),
  fees: 0,
  currency: 'MAD',
  type: 'Virement national',
};

export default function SendMoneyAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const transferData = location.state?.transferData || DEFAULT_TRANSFER;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = password.length >= 6;

  const formatAmount = (amount) => {
    return amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Aujourd\'hui';
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    }
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

const handleConfirm = () => {
  if (!isFormValid) return;
  
  // Générer une référence de transaction unique
  const now = new Date();
  const reference = `TRX-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
  
  const transferWithRef = {
    ...transferData,
    reference: reference,
    timestamp: now.toISOString(),
  };

  navigate('/envoyer-argent/success', { state: { transferData: transferWithRef } });
};
  return (
    <div className="dash-layout">
      {/* Sidebar */}
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
        {/* Header */}
        <header className="sm-topbar">
          <button type="button" className="sm-back" onClick={() => navigate('/envoyer-argent/authentification')}>
            <ArrowLeft size={18} /> Retour
          </button>
          <div className="sm-topbar-actions">
            <div className="dash-search"><Search size={16} /><input type="text" placeholder="Rechercher..." /></div>
            <button type="button" className="dash-icon-button">
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

        {/* Page header */}
        <div className="sm-page-header">
          <div className="sm-page-icon"><Send size={22} /></div>
          <div>
            <h1 className="sm-page-title">Envoyer de l'argent</h1>
            <p className="sm-page-subtitle">Choisissez un bénéficiaire pour effectuer un virement sécurisé</p>
          </div>
        </div>

        {/* Stepper : Étape 5 active */}
        <section className="sm-stepper-card">
          <h2 className="sm-stepper-title">
            <span>Étape 5 sur 6 :</span> Authentification
          </h2>
          <div className="sm-stepper">
            {MAIN_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isDone = idx < 4; // Étapes 1-4 terminées
              const isActive = idx === 4; // Étape 5 active
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

        {/* Grid : Authentification + Récapitulatif */}
        <div className="sm-grid">
          {/* Carte gauche : Authentification */}
          <section className="sm-beneficiaries-panel sm-auth-panel">
            <h3 className="sm-auth-title">Confirmation de sécurité</h3>

            <div className="sm-auth-intro">
              <Lock size={20} className="sm-auth-intro-icon" />
              <p className="sm-auth-intro-text">
                Pour protéger votre compte, veuillez confirmer votre identité avant d'effectuer ce virement.
              </p>
            </div>

            {/* Formulaire mot de passe */}
            <div className="sm-input-group">
              <label className="sm-input-label">Mot de passe de votre compte</label>
              <div className="sm-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="sm-password-input"
                />
                <button
                  type="button"
                  className="sm-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <label className="sm-checkbox-label">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <span className="sm-checkbox-custom" />
                Afficher le mot de passe
              </label>
            </div>

            {/* Boîte d'information */}
            <div className="sm-verification-info-box">
              <Info size={18} className="sm-verification-info-icon" />
              <p className="sm-verification-info-text">
                Cette étape permet de confirmer que vous êtes bien le titulaire du compte avant l'exécution du virement.
              </p>
            </div>

            {/* Note de sécurité */}
            <div className="sm-security-note">
              <Shield size={14} className="sm-security-note-icon" />
              <span>Votre mot de passe n'est jamais enregistré ni affiché.</span>
            </div>
          </section>

          {/* Carte droite : Récapitulatif du virement */}
          <aside className="sm-tips-panel sm-auth-summary-panel">
            <div className="sm-tips-header">
              <div className="sm-tips-icon"><Wallet size={18} /></div>
              <h3 className="sm-tips-title">Informations du virement</h3>
            </div>

            <div className="sm-auth-summary-list">
              <div className="sm-auth-summary-row">
                <div className="sm-auth-summary-icon"><User size={16} /></div>
                <div className="sm-auth-summary-content">
                  <span className="sm-auth-summary-label">Bénéficiaire</span>
                  <span className="sm-auth-summary-value">{transferData.beneficiary.name}</span>
                </div>
              </div>

              <div className="sm-auth-summary-row">
                <div className="sm-auth-summary-icon"><Wallet size={16} /></div>
                <div className="sm-auth-summary-content">
                  <span className="sm-auth-summary-label">Montant</span>
                  <span className="sm-auth-summary-value sm-auth-summary-value-bold">
                    {formatAmount(transferData.amount)} MAD
                  </span>
                </div>
              </div>

              <div className="sm-auth-summary-row">
                <div className="sm-auth-summary-icon"><Building2 size={16} /></div>
                <div className="sm-auth-summary-content">
                  <span className="sm-auth-summary-label">Banque</span>
                  <span className="sm-auth-summary-value">{transferData.beneficiary.bank}</span>
                </div>
              </div>

              <div className="sm-auth-summary-row">
                <div className="sm-auth-summary-icon"><Calendar size={16} /></div>
                <div className="sm-auth-summary-content">
                  <span className="sm-auth-summary-label">Date</span>
                  <span className="sm-auth-summary-value">{formatDate(transferData.executionDate)}</span>
                </div>
              </div>

              <div className="sm-auth-summary-row">
                <div className="sm-auth-summary-icon"><CreditCard size={16} /></div>
                <div className="sm-auth-summary-content">
                  <span className="sm-auth-summary-label">Compte débité</span>
                  <span className="sm-auth-summary-value">Compte courant</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Boutons : Retour + Confirmer */}
        <footer className="sm-footer sm-footer-two-buttons">
          <button
            type="button"
            className="sm-btn-modify"
            onClick={() => navigate('/envoyer-argent/authentification')}
          >
            <ArrowLeft size={16} /> Retour
          </button>
          <button
  type="button"
  className="sm-continue-btn"
  disabled={!isFormValid}
  onClick={handleConfirm}
>
  Confirmer le virement <ChevronRight size={18} />
</button>
        </footer>
      </main>
    </div>
  );
}