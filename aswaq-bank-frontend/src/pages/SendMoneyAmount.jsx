import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Bell,Send,
  User, Shield, Wallet, FileText, Lock, Check,
  Search, ChevronRight, Info, CreditCard, Wallet as WalletIcon,
  Percent, DollarSign, RefreshCw, 
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

const TRANSFER_REASONS = [
  { value: '', label: 'Sélectionner un motif' },
  { value: 'loyer', label: 'Loyer' },
  { value: 'salaire', label: 'Salaire' },
  { value: 'facture', label: 'Facture' },
  { value: 'cadeau', label: 'Cadeau' },
  { value: 'epargne', label: 'Épargne' },
  { value: 'autre', label: 'Autre' },
];

export default function SendMoneyAmount() {
  const navigate = useNavigate();
  const location = useLocation();
  const beneficiary = location.state?.beneficiary || {
    name: 'BOUTABI Said',
    bank: 'Aswaq Bank',
    account: '•••• •••• •••• 7890',
  };

  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [executionDate, setExecutionDate] = useState('today');
  const [scheduledDate, setScheduledDate] = useState('');

  const availableBalance = 12540.80;
  const fees = 0.00;

  const isFormValid = amount !== '' && parseFloat(amount) > 0 && parseFloat(amount) <= availableBalance;

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.,]/g, '');
    setAmount(value);
  };

  const handleContinue = () => {
    if (!isFormValid) return;
    
    const transferData = {
      beneficiary,
      amount: parseFloat(amount.replace(',', '.')),
      reason: reason === 'autre' ? otherReason : reason,
      executionDate: executionDate === 'today' ? new Date().toISOString() : scheduledDate,
      fees,
      currency: 'MAD',
      type: 'Virement national',
    };

    navigate('/envoyer-argent/authentification', { state: { transferData } });
  };

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="acc-sidebar-logo"><Logo size={100} className="mb-6" logo-white /></div>
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
          <button type="button" className="sm-back" onClick={() => navigate('/envoyer-argent/verification')}>
            <ArrowLeft size={18} /> Retour
          </button>
          <div className="sm-topbar-actions">
            <div className="dash-search"><Search size={16} /><input type="text" placeholder="Rechercher..." /></div>
            <NotificationBell />
            <UserHeader />
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

        {/* Stepper : Étape 3 active */}
        <section className="sm-stepper-card">
          <h2 className="sm-stepper-title">
            <span>Étape 3 sur 6 :</span> Montant du virement
          </h2>
          <div className="sm-stepper">
            {MAIN_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isDone = idx < 2; // Étapes 1 et 2 terminées
              const isActive = idx === 2; // Étape 3 active
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

        {/* Grid : Formulaire montant + Informations */}
        <div className="sm-grid">
          {/* Carte gauche : Formulaire */}
          <section className="sm-beneficiaries-panel sm-amount-panel">
            <h3 className="sm-amount-title">Montant du virement</h3>

            {/* Rappel bénéficiaire */}
            <div className="sm-beneficiary-reminder">
              <div className="sm-beneficiary-reminder-avatar">
                {beneficiary.name.charAt(0).toUpperCase()}
              </div>
              <div className="sm-beneficiary-reminder-info">
                <p className="sm-beneficiary-reminder-name">{beneficiary.name}</p>
                <p className="sm-beneficiary-reminder-bank">{beneficiary.bank}</p>
                <p className="sm-beneficiary-reminder-rib">RIB : {beneficiary.account}</p>
              </div>
            </div>

            {/* Montant */}
            <div className="sm-input-group sm-amount-input-group">
              <label className="sm-input-label">Montant (MAD) *</label>
              <div className="sm-amount-input-wrapper">
                <input
                  type="text"
                  placeholder="0,00"
                  value={amount}
                  onChange={handleAmountChange}
                  className="sm-amount-input"
                />
                <span className="sm-amount-currency">MAD</span>
              </div>
              {amount && parseFloat(amount.replace(',', '.')) > availableBalance && (
                <span className="sm-input-hint error">Solde insuffisant</span>
              )}
            </div>

            {/* Motif */}
            <div className="sm-input-group">
              <label className="sm-input-label">Motif du virement (optionnel)</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="sm-select-input"
              >
                {TRANSFER_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              {reason === 'autre' && (
                <input
                  type="text"
                  placeholder="Précisez le motif"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  className="sm-text-input"
                  style={{ marginTop: '0.75rem' }}
                />
              )}
            </div>

            {/* Date d'exécution */}
            <div className="sm-input-group">
              <label className="sm-input-label">Date d'exécution</label>
              <div className="sm-radio-group">
                <label className="sm-radio-label">
                  <input
                    type="radio"
                    name="executionDate"
                    value="today"
                    checked={executionDate === 'today'}
                    onChange={(e) => setExecutionDate(e.target.value)}
                  />
                  <span className="sm-radio-custom" />
                  Aujourd'hui
                </label>
                <label className="sm-radio-label">
                  <input
                    type="radio"
                    name="executionDate"
                    value="scheduled"
                    checked={executionDate === 'scheduled'}
                    onChange={(e) => setExecutionDate(e.target.value)}
                  />
                  <span className="sm-radio-custom" />
                  Programmer le virement
                </label>
              </div>
              {executionDate === 'scheduled' && (
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="sm-date-input"
                  style={{ marginTop: '0.75rem' }}
                  min={new Date().toISOString().split('T')[0]}
                />
              )}
            </div>

            {/* Boîte d'information */}
            <div className="sm-verification-info-box">
              <Info size={18} className="sm-verification-info-icon" />
              <p className="sm-verification-info-text">
                Le montant sera débité de votre compte après confirmation du virement.
              </p>
            </div>
          </section>

          {/* Carte droite : Informations du virement */}
          <aside className="sm-tips-panel sm-transfer-info-panel">
            <div className="sm-transfer-info-header">
              <div className="sm-tips-icon"><WalletIcon size={18} /></div>
              <h3 className="sm-tips-title">Informations du virement</h3>
            </div>

            <div className="sm-transfer-info-list">
              <div className="sm-transfer-info-row">
                <div className="sm-transfer-info-icon"><CreditCard size={16} /></div>
                <div className="sm-transfer-info-content">
                  <span className="sm-transfer-info-label">Compte débité</span>
                  <span className="sm-transfer-info-value">Compte courant</span>
                </div>
              </div>

              <div className="sm-transfer-info-row">
                <div className="sm-transfer-info-icon"><WalletIcon size={16} /></div>
                <div className="sm-transfer-info-content">
                  <span className="sm-transfer-info-label">Solde disponible</span>
                  <span className="sm-transfer-info-value sm-transfer-info-value-green">
                    {availableBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                  </span>
                </div>
              </div>

              <div className="sm-transfer-info-row">
                <div className="sm-transfer-info-icon"><Percent size={16} /></div>
                <div className="sm-transfer-info-content">
                  <span className="sm-transfer-info-label">Frais</span>
                  <span className="sm-transfer-info-value">
                    {fees.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                  </span>
                </div>
              </div>

              <div className="sm-transfer-info-row">
                <div className="sm-transfer-info-icon"><DollarSign size={16} /></div>
                <div className="sm-transfer-info-content">
                  <span className="sm-transfer-info-label">Devise</span>
                  <span className="sm-transfer-info-value">MAD</span>
                </div>
              </div>

              <div className="sm-transfer-info-row">
                <div className="sm-transfer-info-icon"><RefreshCw size={16} /></div>
                <div className="sm-transfer-info-content">
                  <span className="sm-transfer-info-label">Type</span>
                  <span className="sm-transfer-info-value">Virement national</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Boutons : Retour + Continuer */}
        <footer className="sm-footer sm-footer-two-buttons">
          <button
            type="button"
            className="sm-btn-modify"
            onClick={() => navigate('/envoyer-argent/verification')}
          >
            <ArrowLeft size={16} /> Retour
          </button>
          <button
            type="button"
            className="sm-continue-btn"
            disabled={!isFormValid}
            onClick={handleContinue}
          >
            Continuer <ChevronRight size={18} />
          </button>
        </footer>
      </main>
    </div>
  );
}