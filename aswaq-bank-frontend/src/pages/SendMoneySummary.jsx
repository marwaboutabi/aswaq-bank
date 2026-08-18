import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Bell, Send,
  User, Shield, Wallet, FileText, Lock, Check,
  Search, ChevronRight, Info, CreditCard, Percent,
  Calendar, Building2, AlertTriangle
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

// Données par défaut si aucune donnée n'est passée
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

export default function SendMoneySummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const transferData = location.state?.transferData || DEFAULT_TRANSFER;

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

  const getReasonLabel = (reason) => {
    const reasons = {
      'loyer': 'Loyer',
      'salaire': 'Salaire',
      'facture': 'Facture',
      'cadeau': 'Cadeau',
      'epargne': 'Épargne',
      'autre': 'Autre',
    };
    return reasons[reason] || reason || 'Non spécifié';
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
          <button type="button" className="sm-back" onClick={() => navigate('/envoyer-argent/recapitulatif')}>
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

        {/* Stepper : Étape 4 active */}
        <section className="sm-stepper-card">
          <h2 className="sm-stepper-title">
            <span>Étape 4 sur 6 :</span> Récapitulatif
          </h2>
          <div className="sm-stepper">
            {MAIN_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isDone = idx < 3; // Étapes 1, 2, 3 terminées
              const isActive = idx === 3; // Étape 4 active
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

        {/* Grid : Récapitulatif + Conseils */}
        <div className="sm-grid">
          {/* Carte gauche : Récapitulatif */}
          <section className="sm-beneficiaries-panel sm-summary-panel">
            <h3 className="sm-summary-title">Récapitulatif du virement</h3>

            <div className="sm-summary-card">
              {/* Bénéficiaire */}
              <div className="sm-summary-row sm-summary-row-highlight">
                <div className="sm-summary-icon"><User size={18} /></div>
                <div className="sm-summary-content">
                  <span className="sm-summary-label">Bénéficiaire</span>
                  <div className="sm-summary-value-group">
                    <span className="sm-summary-value sm-summary-value-bold">{transferData.beneficiary.name}</span>
                    <span className="sm-summary-value-sub">{transferData.beneficiary.bank}</span>
                    <span className="sm-summary-value-sub sm-summary-rib">RIB : {transferData.beneficiary.account}</span>
                  </div>
                </div>
              </div>

              {/* Compte débité */}
              <div className="sm-summary-row">
                <div className="sm-summary-icon"><CreditCard size={18} /></div>
                <div className="sm-summary-content">
                  <span className="sm-summary-label">Compte débité</span>
                  <div className="sm-summary-value-group">
                    <span className="sm-summary-value sm-summary-value-bold">Compte courant</span>
                    <span className="sm-summary-value-sub">•••• •••• •••• 1234</span>
                  </div>
                </div>
              </div>

              {/* Montant */}
              <div className="sm-summary-row">
                <div className="sm-summary-icon"><Wallet size={18} /></div>
                <div className="sm-summary-content">
                  <span className="sm-summary-label">Montant</span>
                  <span className="sm-summary-value sm-summary-value-bold sm-summary-amount">
                    {formatAmount(transferData.amount)} MAD
                  </span>
                </div>
              </div>

              {/* Frais */}
              <div className="sm-summary-row">
                <div className="sm-summary-icon"><Percent size={18} /></div>
                <div className="sm-summary-content">
                  <span className="sm-summary-label">Frais</span>
                  <span className="sm-summary-value sm-summary-value-green">
                    {formatAmount(transferData.fees)} MAD
                  </span>
                </div>
              </div>

              {/* Motif */}
              <div className="sm-summary-row">
                <div className="sm-summary-icon"><FileText size={18} /></div>
                <div className="sm-summary-content">
                  <span className="sm-summary-label">Motif</span>
                  <span className="sm-summary-value">{getReasonLabel(transferData.reason)}</span>
                </div>
              </div>

              {/* Date d'exécution */}
              <div className="sm-summary-row">
                <div className="sm-summary-icon"><Calendar size={18} /></div>
                <div className="sm-summary-content">
                  <span className="sm-summary-label">Date d'exécution</span>
                  <div className="sm-summary-value-group">
                    <span className="sm-summary-value sm-summary-value-bold">
                      {formatDate(transferData.executionDate)}
                    </span>
                    {transferData.executionDate && new Date(transferData.executionDate).toDateString() !== new Date().toDateString() && (
                      <span className="sm-summary-value-sub">
                        {new Date(transferData.executionDate).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Boîte d'information */}
            <div className="sm-verification-info-box">
              <Info size={18} className="sm-verification-info-icon" />
              <p className="sm-verification-info-text">
                Veuillez vérifier attentivement les informations ci-dessus avant de confirmer votre virement.
              </p>
            </div>
          </section>

          {/* Carte droite : Conseils de sécurité */}
          <aside className="sm-tips-panel">
            <div className="sm-tips-header">
              <div className="sm-tips-icon"><Shield size={18} /></div>
              <h3 className="sm-tips-title">Conseils de sécurité</h3>
            </div>
            <ul className="sm-tips-list">
              <li className="sm-tip-item">
                <div className="sm-tip-icon"><User size={16} /></div>
                <p>Vérifiez que le nom du bénéficiaire est correct.</p>
              </li>
              <li className="sm-tip-item">
                <div className="sm-tip-icon"><Building2 size={16} /></div>
                <p>Vérifiez la banque et le RIB / IBAN.</p>
              </li>
              <li className="sm-tip-item">
                <div className="sm-tip-icon"><Wallet size={16} /></div>
                <p>Vérifiez le montant et le motif du virement.</p>
              </li>
              <li className="sm-tip-item">
                <div className="sm-tip-icon"><AlertTriangle size={16} /></div>
                <p>Une fois le virement confirmé, l'opération pourra être irréversible.</p>
              </li>
            </ul>
          </aside>
        </div>

        {/* Boutons : Retour + Continuer */}
        <footer className="sm-footer sm-footer-two-buttons">
          <button
            type="button"
            className="sm-btn-modify"
            onClick={() => navigate('/envoyer-argent/recapitulatif')}
          >
            <ArrowLeft size={16} /> Retour
          </button>
          <button
            type="button"
            className="sm-continue-btn"
            onClick={() => navigate('/envoyer-argent/confirmation', { state: { transferData } })}
          >
            Continuer <ChevronRight size={18} />
          </button>
        </footer>
      </main>
    </div>
  );
}