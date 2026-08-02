import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Package, Boxes, Users,  ArrowLeftRight,
  FileText,  LogOut, Bell, ChevronDown,
  Wallet, UserPlus, CheckCircle2, AlertCircle, ArrowRight,
   ArrowLeft, CreditCard, Calendar, Mail, Phone,
  Copy, Share2, Send, RefreshCw,
  MessageCircle, ExternalLink, Clock, Check,Star,Bot,User
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import { QRCodeCanvas } from 'qrcode.react';
import './DemanderPaiement.css';

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/acceuil-com' },
  { icon: Package, label: 'Produits', to: '/produits' },
  { icon: Boxes, label: 'Stock', to: '/stock' },
  { icon: ArrowLeftRight, label: 'Paiements & Transactions', to: '/transactions-commerce' , active: true},
  { icon: Users, label: 'Fournisseurs', to: '/fournisseurs' },
  { icon: Star, label: 'Fidélité & Tickets', to: '/fidelite-commerce' },
  { icon: Bell, label: 'Notifications', to: '/notifications-com' },
  
  { icon: Bot, label: 'Assistant IA', to: '/assistant-commerce' },
  { icon: User, label: 'Profil & Paramètres', to: '/parametres-commerce' },
];

const QUICK_AMOUNTS = [100, 250, 500, 1000];

export default function DemanderPaiement() {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1 Form Data
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    amount: '',
    description: '',
    expirationDate: ''
  });

  // Step 2 Generated Data
  const [paymentLink, setPaymentLink] = useState('');
  const [requestReference, setRequestReference] = useState('');
  
  // UI States
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuickAmount = (amount) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  const handleContinue = () => {
    // Generate payment link and reference
    const ref = 'PAY-TRX-' + Math.floor(Math.random() * 900000) + 100000;
    const link = `https://pay.aswaqbank.ma/${ref}`;
    
    setPaymentLink(link);
    setRequestReference(ref);
    setCurrentStep(2);
  };

  const handleSendRequest = () => {
    setCurrentStep(3);
  };

  const handleNewRequest = () => {
    setCurrentStep(1);
    setFormData({
      clientName: '',
      email: '',
      phone: '',
      amount: '',
      description: '',
      expirationDate: ''
    });
    setPaymentLink('');
    setRequestReference('');
    setCopied(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (method) => {
    // Simulation de partage
    console.log(`Partage via ${method}: ${paymentLink}`);
    setShowShareMenu(false);
  };

  const isStep1Valid = () => {
    return formData.clientName && formData.email && formData.amount && formData.expirationDate;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dp-layout">
      {/* Sidebar */}
      <aside className="dp-sidebar">
        <div className="dp-sidebar-logo">
          <Logo size={100} className="mb-6 logo-white"/>
        </div>


        <nav className="dp-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                state={location.state}
                className={`dp-nav-item ${isActive ? 'dp-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a href="/" className="dp-logout">
          <LogOut size={18} />
          Déconnexion
        </a>
      </aside>

      {/* Main Content */}
      <main className="dp-main">
        {/* Header */}
        <header className="dp-header">
          <div>
            <h1 className="dp-title">Demander un paiement</h1>
            <p className="dp-subtitle">Envoyez un lien de paiement sécurisé à vos clients</p>
          </div>

          <div className="dp-header-actions">
            <button type="button" className="dp-icon-button">
              <Bell size={18} />
              <span className="dp-badge">3</span>
            </button>
            <div className="dp-user-chip">
              <div className="dp-user-avatar">MB</div>
              <div className="dp-user-info">
                <span className="dp-user-name">Marwa Boutabi</span>
                <span className="dp-user-role">Commerçant</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Stepper */}
        <div className="dp-stepper">
          <div className={`dp-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="dp-step-circle">
              {currentStep > 1 ? <CheckCircle2 size={16} /> : '1'}
            </div>
            <span className="dp-step-label">Informations de la demande</span>
          </div>
          <div className={`dp-step-line ${currentStep >= 2 ? 'active' : ''}`} />
          <div className={`dp-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="dp-step-circle">
              {currentStep > 2 ? <CheckCircle2 size={16} /> : '2'}
            </div>
            <span className="dp-step-label">Génération du lien</span>
          </div>
          <div className={`dp-step-line ${currentStep >= 3 ? 'active' : ''}`} />
          <div className={`dp-step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="dp-step-circle">3</div>
            <span className="dp-step-label">Confirmation</span>
          </div>
        </div>

        {/* STEP 1: Payment Request Form */}
        {currentStep === 1 && (
          <div className="dp-grid">
            <div className="dp-form-section">
              <div className="dp-card">
                <h2 className="dp-card-title">Informations du client</h2>
                
                <div className="dp-form-group">
                  <label className="dp-label">Nom du client *</label>
                  <div className="dp-input-wrapper">
                    <UserPlus size={18} className="dp-input-icon" />
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      className="dp-input"
                      placeholder="Ex : Ahmed Ali"
                    />
                  </div>
                </div>

                <div className="dp-form-group">
                  <label className="dp-label">Email *</label>
                  <div className="dp-input-wrapper">
                    <Mail size={18} className="dp-input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="dp-input"
                      placeholder="Ex : ahmed@email.com"
                    />
                  </div>
                </div>

                <div className="dp-form-group">
                  <label className="dp-label">Téléphone (optionnel)</label>
                  <div className="dp-input-wrapper">
                    <Phone size={18} className="dp-input-icon" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="dp-input"
                      placeholder="Ex : 06 12 34 56 78"
                    />
                  </div>
                </div>
              </div>

              <div className="dp-card">
                <h2 className="dp-card-title">Détails du paiement</h2>
                
                <div className="dp-form-group">
                  <label className="dp-label">Montant *</label>
                  <div className="dp-amount-wrapper">
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="dp-input dp-amount-input"
                      placeholder="0,00"
                      min="0"
                      step="0.01"
                    />
                    <span className="dp-currency">MAD</span>
                  </div>
                  
                  <div className="dp-quick-amounts">
                    {QUICK_AMOUNTS.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        className={`dp-quick-amount ${formData.amount === amount.toString() ? 'active' : ''}`}
                        onClick={() => handleQuickAmount(amount)}
                      >
                        {amount} MAD
                      </button>
                    ))}
                  </div>
                </div>

                <div className="dp-form-group">
                  <label className="dp-label">Description / Objet du paiement *</label>
                  <div className="dp-input-wrapper">
                    <CreditCard size={18} className="dp-input-icon" />
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="dp-input"
                      placeholder="Ex : Commande n°254, Achat de matériel..."
                    />
                  </div>
                </div>

                <div className="dp-form-group">
                  <label className="dp-label">Date d'expiration *</label>
                  <div className="dp-input-wrapper">
                    <Calendar size={18} className="dp-input-icon" />
                    <input
                      type="datetime-local"
                      name="expirationDate"
                      value={formData.expirationDate}
                      onChange={handleInputChange}
                      className="dp-input"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="dp-btn-primary dp-btn-full"
                  onClick={handleContinue}
                  disabled={!isStep1Valid()}
                >
                  Continuer <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="dp-summary-sidebar">
              <div className="dp-card dp-summary-card">
                <h2 className="dp-card-title">Résumé de la demande</h2>
                
                <div className="dp-summary-row">
                  <div className="dp-summary-label">
                    <UserPlus size={16} />
                    Client
                  </div>
                  <div className="dp-summary-value">
                    {formData.clientName || '-'}
                  </div>
                </div>

                <div className="dp-summary-row">
                  <div className="dp-summary-label">
                    <Mail size={16} />
                    Email
                  </div>
                  <div className="dp-summary-value">
                    {formData.email || '-'}
                  </div>
                </div>

                <div className="dp-summary-row">
                  <div className="dp-summary-label">
                    <Phone size={16} />
                    Téléphone
                  </div>
                  <div className="dp-summary-value">
                    {formData.phone || '-'}
                  </div>
                </div>

                <div className="dp-summary-divider" />

                <div className="dp-summary-row">
                  <div className="dp-summary-label">
                    <Wallet size={16} />
                    Montant
                  </div>
                  <div className="dp-summary-value dp-summary-value-blue">
                    {formData.amount ? `${parseFloat(formData.amount).toLocaleString('fr-FR')} MAD` : '0,00 MAD'}
                  </div>
                </div>

                <div className="dp-summary-row">
                  <div className="dp-summary-label">
                    <FileText size={16} />
                    Description
                  </div>
                  <div className="dp-summary-value">
                    {formData.description || '-'}
                  </div>
                </div>

                <div className="dp-summary-row">
                  <div className="dp-summary-label">
                    <Calendar size={16} />
                    Expiration
                  </div>
                  <div className="dp-summary-value">
                    {formatDate(formData.expirationDate)}
                  </div>
                </div>

                <div className="dp-info-box">
                  <AlertCircle size={16} className="dp-info-icon" />
                  <p className="dp-info-text">
                    Remplissez les informations pour générer votre lien de paiement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Payment Link Generation */}
        {currentStep === 2 && (
          <div className="dp-step-container">
            <div className="dp-grid dp-grid-2">
              <div className="dp-card dp-link-card">
                <div className="dp-success-header">
                  <div className="dp-success-icon">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h2 className="dp-success-title">Demande de paiement créée !</h2>
                    <p className="dp-success-subtitle">Votre lien de paiement est prêt à être envoyé.</p>
                  </div>
                </div>

                <div className="dp-form-group">
                  <label className="dp-label">Lien de paiement</label>
                  <div className="dp-link-wrapper">
                    <input
                      type="text"
                      value={paymentLink}
                      readOnly
                      className="dp-input dp-link-input"
                    />
                    <button 
                      type="button"
                      className="dp-btn-icon"
                      onClick={handleCopyLink}
                      title="Copier"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className="dp-actions-row">
                  <button 
                    type="button"
                    className="dp-btn-secondary"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft size={18} />
                    Retour
                  </button>
                  
                  <div className="dp-share-wrapper">
                    <button 
                      type="button"
                      className="dp-btn-secondary"
                      onClick={() => setShowShareMenu(!showShareMenu)}
                    >
                      <Share2 size={18} />
                      Partager
                    </button>
                    
                    {showShareMenu && (
                      <div className="dp-share-menu">
                        <button 
                          type="button"
                          className="dp-share-item"
                          onClick={() => handleShare('whatsapp')}
                        >
                          <MessageCircle size={16} />
                          WhatsApp
                        </button>
                        <button 
                          type="button"
                          className="dp-share-item"
                          onClick={() => handleShare('email')}
                        >
                          <Mail size={16} />
                          Email
                        </button>
                        <button 
                          type="button"
                          className="dp-share-item"
                          onClick={handleCopyLink}
                        >
                          <Copy size={16} />
                          Copier le lien
                        </button>
                      </div>
                    )}
                  </div>

                  <button 
                    type="button"
                    className="dp-btn-primary"
                    onClick={handleSendRequest}
                  >
                    <Send size={18} />
                    Envoyer la demande
                  </button>
                </div>
              </div>

              <div className="dp-qr-card dp-card">
                <div className="dp-qr-wrapper">
                  <QRCodeCanvas
  value={paymentLink}
  size={200}
  level="H"
  includeMargin={true}
  className="dp-qr-code"
/>
                  <div className="dp-qr-logo">
                    <Logo size={40} />
                  </div>
                </div>
                <p className="dp-qr-text">Scannez pour payer</p>
                
                <div className="dp-qr-details">
                  <div className="dp-qr-detail-row">
                    <span className="dp-qr-label">Client</span>
                    <span className="dp-qr-value">{formData.clientName}</span>
                  </div>
                  <div className="dp-qr-detail-row">
                    <span className="dp-qr-label">Montant</span>
                    <span className="dp-qr-value dp-qr-amount">{parseFloat(formData.amount).toLocaleString('fr-FR')} MAD</span>
                  </div>
                  <div className="dp-qr-detail-row">
                    <span className="dp-qr-label">Expiration</span>
                    <span className="dp-qr-value">{formatDate(formData.expirationDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dp-card dp-details-card">
              <h3 className="dp-details-title">Détails de la demande</h3>
              
              <div className="dp-details-grid">
                <div className="dp-detail-item">
                  <span className="dp-detail-label">Client</span>
                  <span className="dp-detail-value">{formData.clientName}</span>
                </div>
                <div className="dp-detail-item">
                  <span className="dp-detail-label">Email</span>
                  <span className="dp-detail-value">{formData.email}</span>
                </div>
                <div className="dp-detail-item">
                  <span className="dp-detail-label">Montant</span>
                  <span className="dp-detail-value dp-detail-amount">{parseFloat(formData.amount).toLocaleString('fr-FR')} MAD</span>
                </div>
                <div className="dp-detail-item">
                  <span className="dp-detail-label">Description</span>
                  <span className="dp-detail-value">{formData.description}</span>
                </div>
                <div className="dp-detail-item">
                  <span className="dp-detail-label">Expiration</span>
                  <span className="dp-detail-value dp-detail-expiration">
                    {formatDate(formData.expirationDate)}
                  </span>
                </div>
              </div>

              <div className="dp-info-box dp-info-box-light">
                <Clock size={16} className="dp-info-icon" />
                <p className="dp-info-text">
                  Le lien expirera à la date indiquée.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Confirmation */}
        {currentStep === 3 && (
          <div className="dp-confirm-container">
            <div className="dp-card dp-confirm-card">
              <div className="dp-confirm-header">
                <div className="dp-confirm-icon-wrapper">
                  <div className="dp-confirm-check">
                    <CheckCircle2 size={64} />
                  </div>
                </div>
                
                <h2 className="dp-confirm-title">Demande envoyée avec succès !</h2>
                <p className="dp-confirm-subtitle">
                  Votre demande de paiement a été envoyée à votre client.
                </p>
              </div>

              <div className="dp-confirm-details">
                <div className="dp-confirm-grid">
                  <div className="dp-confirm-item">
                    <span className="dp-confirm-label">Client</span>
                    <span className="dp-confirm-value">{formData.clientName}</span>
                  </div>
                  <div className="dp-confirm-item">
                    <span className="dp-confirm-label">Montant</span>
                    <span className="dp-confirm-value dp-confirm-amount">{parseFloat(formData.amount).toLocaleString('fr-FR')} MAD</span>
                  </div>
                  <div className="dp-confirm-item">
                    <span className="dp-confirm-label">Référence</span>
                    <span className="dp-confirm-value dp-confirm-ref">{requestReference}</span>
                  </div>
                  <div className="dp-confirm-item">
                    <span className="dp-confirm-label">Date d'envoi</span>
                    <span className="dp-confirm-value">{new Date().toLocaleString('fr-FR')}</span>
                  </div>
                  <div className="dp-confirm-item">
                    <span className="dp-confirm-label">Expiration</span>
                    <span className="dp-confirm-value">{formatDate(formData.expirationDate)}</span>
                  </div>
                  <div className="dp-confirm-item">
                    <span className="dp-confirm-label">Statut</span>
                    <span className="dp-status-badge dp-status-pending">
                      <Clock size={12} />
                      En attente
                    </span>
                  </div>
                </div>
              </div>

              <div className="dp-confirm-actions">
                <button 
                  type="button"
                  className="dp-btn-secondary"
                  onClick={handleNewRequest}
                >
                  <RefreshCw size={18} />
                  Nouvelle demande
                </button>
                <Link to="/transactions-commerce" className="dp-btn-primary">
                  <FileText size={18} />
                  Voir les demandes envoyées
                </Link>
              </div>
            </div>

            <div className="dp-card dp-info-card">
              <div className="dp-info-illustration">
                <ExternalLink size={48} />
              </div>
              <h3 className="dp-info-title">Le client pourra payer à tout moment</h3>
              <p className="dp-info-text">
                Avant l'expiration du lien, votre client peut effectuer le paiement 
                en scannant le QR code ou en cliquant sur le lien reçu.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}