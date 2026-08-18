import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Bell,  Send,
  User, Shield, Wallet, FileText, Lock, Check,
  Search, ChevronRight, CreditCard, Building2,
  Calendar, Percent, Download, Share2, RefreshCw, Home
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
  reference: 'TRX-20260723-000154',
  timestamp: new Date().toISOString(),
};

export default function SendMoneyConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const transferData = location.state?.transferData || DEFAULT_TRANSFER;

  const formatAmount = (amount) => {
    return amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <button type="button" className="sm-back" onClick={() => navigate('/dashboard-client')}>
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

        {/* Stepper : Étape 6 active */}
        <section className="sm-stepper-card">
          <h2 className="sm-stepper-title">
            <span>Étape 6 sur 6 :</span> Confirmation
          </h2>
          <div className="sm-stepper">
            {MAIN_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isDone = idx < 5; // Étapes 1-5 terminées
              const isActive = idx === 5; // Étape 6 active
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

        {/* Grid : Confirmation + Actions */}
        <div className="sm-grid">
          {/* Carte gauche : Confirmation */}
          <section className="sm-beneficiaries-panel sm-confirmation-panel">
            <div className="sm-confirmation-content">
              <div className="sm-confirmation-icon">
                <Check size={48} className="sm-confirmation-icon-success" />
              </div>
              <h2 className="sm-confirmation-title">Virement effectué avec succès</h2>
              <p className="sm-confirmation-subtitle">
                Votre virement a été enregistré et sera traité selon les délais bancaires.
              </p>

              <div className="sm-confirmation-card">
                <div className="sm-confirmation-row">
                  <div className="sm-confirmation-row-icon">
                    <FileText size={18} />
                  </div>
                  <div className="sm-confirmation-row-content">
                    <span className="sm-confirmation-row-label">Référence</span>
                    <span className="sm-confirmation-row-value">{transferData.reference}</span>
                  </div>
                </div>

                <div className="sm-confirmation-row">
                  <div className="sm-confirmation-row-icon">
                    <User size={18} />
                  </div>
                  <div className="sm-confirmation-row-content">
                    <span className="sm-confirmation-row-label">Bénéficiaire</span>
                    <span className="sm-confirmation-row-value">{transferData.beneficiary.name}</span>
                  </div>
                </div>

                <div className="sm-confirmation-row">
                  <div className="sm-confirmation-row-icon">
                    <Building2 size={18} />
                  </div>
                  <div className="sm-confirmation-row-content">
                    <span className="sm-confirmation-row-label">Banque</span>
                    <span className="sm-confirmation-row-value">{transferData.beneficiary.bank}</span>
                  </div>
                </div>

                <div className="sm-confirmation-row">
                  <div className="sm-confirmation-row-icon">
                    <CreditCard size={18} />
                  </div>
                  <div className="sm-confirmation-row-content">
                    <span className="sm-confirmation-row-label">Compte débité</span>
                    <span className="sm-confirmation-row-value">Compte courant</span>
                    <span className="sm-confirmation-row-value-sub">•••• •••• •••• 1234</span>
                  </div>
                </div>

                <div className="sm-confirmation-row">
                  <div className="sm-confirmation-row-icon">
                    <Wallet size={18} />
                  </div>
                  <div className="sm-confirmation-row-content">
                    <span className="sm-confirmation-row-label">Montant</span>
                    <span className="sm-confirmation-row-value sm-confirmation-amount">
                      {formatAmount(transferData.amount)} MAD
                    </span>
                  </div>
                </div>

                <div className="sm-confirmation-row">
                  <div className="sm-confirmation-row-icon">
                    <Percent size={18} />
                  </div>
                  <div className="sm-confirmation-row-content">
                    <span className="sm-confirmation-row-label">Frais</span>
                    <span className="sm-confirmation-row-value">{formatAmount(transferData.fees)} MAD</span>
                  </div>
                </div>

                <div className="sm-confirmation-row">
                  <div className="sm-confirmation-row-icon">
                    <FileText size={18} />
                  </div>
                  <div className="sm-confirmation-row-content">
                    <span className="sm-confirmation-row-label">Motif</span>
                    <span className="sm-confirmation-row-value">{transferData.reason}</span>
                  </div>
                </div>

                <div className="sm-confirmation-row">
                  <div className="sm-confirmation-row-icon">
                    <Calendar size={18} />
                  </div>
                  <div className="sm-confirmation-row-content">
                    <span className="sm-confirmation-row-label">Date</span>
                    <span className="sm-confirmation-row-value">{formatDate(transferData.timestamp)}</span>
                    <span className="sm-confirmation-row-value-sub">{formatTime(transferData.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Boîte d'information */}
              <div className="sm-verification-info-box sm-verification-info-box-success">
                <Check size={18} className="sm-verification-info-icon" />
                <p className="sm-verification-info-text">
                  Le reçu de cette opération est disponible et l'opération apparaît désormais dans votre historique des transactions.
                </p>
              </div>
            </div>
          </section>

          {/* Carte droite : Prochaines actions */}
          <aside className="sm-tips-panel">
            <div className="sm-tips-header">
              <div className="sm-tips-icon"><FileText size={18} /></div>
              <h3 className="sm-tips-title">Prochaines actions</h3>
            </div>

            <div className="sm-actions-list">
              <button type="button" className="sm-action-item">
                <div className="sm-action-icon"><Download size={18} /></div>
                <div className="sm-action-content">
                  <span className="sm-action-title">Télécharger le reçu</span>
                </div>
                <ChevronRight size={16} className="sm-action-arrow" />
              </button>

              <button type="button" className="sm-action-item">
                <div className="sm-action-icon"><Share2 size={18} /></div>
                <div className="sm-action-content">
                  <span className="sm-action-title">Partager le reçu</span>
                </div>
                <ChevronRight size={16} className="sm-action-arrow" />
              </button>

              <button type="button" className="sm-action-item" onClick={() => navigate('/envoyer-argent')}>
                <div className="sm-action-icon"><RefreshCw size={18} /></div>
                <div className="sm-action-content">
                  <span className="sm-action-title">Effectuer un nouveau virement</span>
                </div>
                <ChevronRight size={16} className="sm-action-arrow" />
              </button>

              <button type="button" className="sm-action-item" onClick={() => navigate('/dashboard-client')}>
                <div className="sm-action-icon"><Home size={18} /></div>
                <div className="sm-action-content">
                  <span className="sm-action-title">Retour au tableau de bord</span>
                </div>
                <ChevronRight size={16} className="sm-action-arrow" />
              </button>
            </div>
          </aside>
        </div>

        {/* Boutons : Nouveau virement + Retour au tableau de bord */}
        <footer className="sm-footer sm-footer-two-buttons">
          <button
            type="button"
            className="sm-btn-modify"
            onClick={() => navigate('/envoyer-argent')}
          >
            <ArrowLeft size={16} /> Nouveau virement
          </button>
          <button
            type="button"
            className="sm-continue-btn"
            onClick={() => navigate('/dashboard-client')}
          >
            Retour au tableau de bord <ChevronRight size={18} />
          </button>
        </footer>
      </main>
    </div>
  );
}