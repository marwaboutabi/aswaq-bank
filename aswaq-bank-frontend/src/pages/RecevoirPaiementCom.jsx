import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Package, Boxes, Users, ArrowLeftRight, Star, Bell, Bot, User,
  LogOut, ChevronDown, QrCode, CheckCircle2, Clock, XCircle,
  Tag, Copy, Download, Share2, Wallet, ArrowRight,
  Shield, Smartphone, Search, Headphones, Loader2,
  Printer, FileText, RefreshCw, AlertCircle
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './RecevoirPaiementCom.css';
import api from "../services/api";
import { QRCodeSVG } from "qrcode.react";

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/acceuil-com' },
  { icon: Package, label: 'Produits', to: '/produits' },
  { icon: Boxes, label: 'Stock', to: '/stock' },
  { icon: ArrowLeftRight, label: 'Paiements & Transactions', to: '/transactions-commerce', active: true },
  { icon: Users, label: 'Fournisseurs', to: '/fournisseurs' },
  { icon: Star, label: 'Fidélité & Tickets', to: '/fidelite-commerce' },
  { icon: Bell, label: 'Notifications', to: '/notifications-com' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant-commerce' },
  { icon: User, label: 'Profil & Paramètres', to: '/parametres-commerce'},
];

const QUICK_AMOUNTS = [50, 100, 200, 500];
const QR_VALIDITY_SECONDS = 300; // 5 minutes

// QR Code réaliste avec logo ASWAQ
function RealisticQRCode({ size = 220 }) {
  const modules = 25;
  const moduleSize = size / modules;
  
  const generateQRPattern = () => {
    const pattern = [];
    let seed = 42;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        const isTopLeft = row < 7 && col < 7;
        const isTopRight = row < 7 && col >= modules - 7;
        const isBottomLeft = row >= modules - 7 && col < 7;
        
        if (isTopLeft || isTopRight || isBottomLeft) {
          const localRow = isTopLeft ? row : isTopRight ? row : row - (modules - 7);
          const localCol = isTopLeft ? col : isTopRight ? col - (modules - 7) : col;
          
          if (localRow === 0 || localRow === 6 || localCol === 0 || localCol === 6) {
            pattern.push({ row, col, fill: '#0b1f4b' });
          } else if (localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4) {
            pattern.push({ row, col, fill: '#0b1f4b' });
          }
        } else if (row >= 9 && row <= 15 && col >= 9 && col <= 15) {
          // Zone vide pour le logo
        } else if (random() > 0.5) {
          pattern.push({ row, col, fill: '#0b1f4b' });
        }
      }
    }
    return pattern;
  };

  const pattern = generateQRPattern();

  return (
    <div className="rp-qr-wrapper">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="white" rx="12" />
        {pattern.map((module, idx) => (
          <rect
            key={idx}
            x={module.col * moduleSize}
            y={module.row * moduleSize}
            width={moduleSize}
            height={moduleSize}
            fill={module.fill}
          />
        ))}
        <circle cx={size / 2} cy={size / 2} r={moduleSize * 4} fill="white" />
        <circle cx={size / 2} cy={size / 2} r={moduleSize * 3.5} fill="#1d4fd8" />
        <text 
          x={size / 2} 
          y={size / 2 + 1} 
          textAnchor="middle" 
          fill="white" 
          fontSize="10" 
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          ASWAQ
        </text>
        <text 
          x={size / 2} 
          y={size / 2 + 11} 
          textAnchor="middle" 
          fill="white" 
          fontSize="7"
          fontFamily="Arial, sans-serif"
        >
          BANK
        </text>
      </svg>
    </div>
  );
}

export default function RecevoirPaiementCom() {
  const location = useLocation();

  // ===== Données venant de la création de vente =====
  const saleId = location.state?.saleId || null;
  const paymentRequestReference = location.state?.paymentRequestReference || null;
  const saleAmount = location.state?.amount || '';

  const isSalePayment = !!paymentRequestReference;

  // ===== États =====
  const [paymentState, setPaymentState] = useState(
    isSalePayment ? 'waiting' : 'create'
  );

  const [amount, setAmount] = useState(
    saleAmount !== '' ? String(saleAmount) : ''
  );

  const [description, setDescription] = useState(
    isSalePayment ? `Paiement vente #${saleId}` : ''
  );

  const [reference, setReference] = useState(
    paymentRequestReference || ''
  );

  const [timeLeft, setTimeLeft] = useState(QR_VALIDITY_SECONDS);
  const [copied, setCopied] = useState(false);
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [payments, setPayments] = useState([]);

  const timerRef = useRef(null);

  useEffect(() => {

    api.get("/transactions/my")
        .then(response => {

            const received = response.data.filter(
                tx => tx.incoming === true
            );

            setPayments(received);

        })
        .catch(error => {
            console.error(
                "Erreur récupération paiements reçus",
                error
            );
        });

}, []);
useEffect(() => {
  if (!isSalePayment) return;

  setReference(paymentRequestReference);

  setTransactionData({
    reference: paymentRequestReference,
    amount: formatAmount(saleAmount),
    description: `Paiement vente #${saleId}`,
    merchant: 'Marwa Boutabi',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + QR_VALIDITY_SECONDS * 1000),
  });

  setPaymentState('waiting');
}, []);
  // Formatage du montant
  const formatAmount = (val) => {
    if (!val) return '0,00';
    const numericVal = parseFloat(String(val).replace(',', '.'));
    return isNaN(numericVal) ? '0,00' : numericVal.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  // Formatage du temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Génération d'une référence unique
  const generateReference = () => {
    return `#PAY-${Math.floor(Math.random() * 90000) + 10000}`;
  };

  // Validation du montant
  const isValidAmount = () => {
    if (!amount) return false;
    const val = parseFloat(String(amount).replace(',', '.'));
    return !isNaN(val) && val > 0;
  };

  // Gestion de la génération du QR Code
 const handleGenerateQR = async () => {
  // Pour une vente, le PaymentRequest a déjà été créé
  // automatiquement par le backend lors de la création de la vente.
  if (isSalePayment) {
    console.log(
      'Demande de paiement déjà créée pour cette vente.'
    );
    return;
  }

  if (!isValidAmount()) {
    return;
  }

  try {
    setPaymentState('generating');

    const response = await api.post(
      '/payment-requests/create',
      null,
      {
        params: {
          amount: String(amount).replace(',', '.'),
          description:
            description || 'Achat en magasin',
        },
      }
    );

    const paymentRequest = response.data;

    console.log(
      'Réponse backend :',
      paymentRequest
    );

    setReference(paymentRequest.reference);

    setTransactionData({
      reference: paymentRequest.reference,
      amount: formatAmount(
        paymentRequest.amount
      ),
      description:
        paymentRequest.description ||
        'Achat en magasin',
      merchant: 'Marwa Boutabi',
      createdAt: new Date(),
      expiresAt: new Date(
        Date.now() +
          QR_VALIDITY_SECONDS * 1000
      ),
    });

    setPaymentState('waiting');
    setTimeLeft(QR_VALIDITY_SECONDS);

  } catch (error) {
    console.error(
      'Erreur création paiement',
      error
    );

    alert(
      error?.response?.data?.message ||
      'Erreur lors de la création du paiement'
    );

    setPaymentState('create');
  }
};


        

  // Compte à rebours
  useEffect(() => {
    if (paymentState === 'waiting') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setPaymentState('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paymentState]);//

  useEffect(() => {

    if (paymentState !== "waiting" || !reference) return;

    const interval = setInterval(async () => {

        try {

            const response = await api.get(
                `/payment-requests/${reference}`
            );

            const payment = response.data;

            if (payment.status === "COMPLETED") {

                setTransactionData(prev => ({
                    ...prev,
                    paidAt: new Date()
                }));

                setPaymentState("success");

                clearInterval(interval);

            }

            if (payment.status === "REJECTED") {

    clearInterval(interval);

    setPaymentState("expired");

}

        } catch (err) {

            console.error(
                "Erreur vérification paiement",
                err
            );

        }

    }, 2000);

    return () => clearInterval(interval);

}, [paymentState, reference]);
  // Copier la référence
  const copyReference = () => {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Réinitialiser pour un nouveau paiement
  const handleNewPayment = () => {
    setPaymentState('create');
    setAmount('');
    setDescription('');
    setReference('');
    setTimeLeft(QR_VALIDITY_SECONDS);
    setTransactionData(null);
    setSelectedQuickAmount(null);
  };

  // Régénérer un QR Code après expiration
  const handleRegenerate = async () => {
    if (!amount) return;

    try {
        setPaymentState('generating');

        const response = await api.post(
            "/payment-requests/create",
            null,
            {
                params: {
                    amount: String(amount).replace(',', '.'),
                    description: description || "Achat en magasin"
                }
            }
        );

        const paymentRequest = response.data;

        console.log("Nouvelle demande :", paymentRequest);

        setReference(paymentRequest.reference);

        setTransactionData({
            reference: paymentRequest.reference,
            amount: formatAmount(paymentRequest.amount),
            description:
                paymentRequest.description || "Achat en magasin",
            merchant: "Marwa Boutabi",
            createdAt: new Date(),
            expiresAt: new Date(
                Date.now() + QR_VALIDITY_SECONDS * 1000
            )
        });

        setTimeLeft(QR_VALIDITY_SECONDS);
        setPaymentState('waiting');

    } catch (error) {
        console.error(
            "Erreur régénération paiement",
            error
        );

        alert(
            "Impossible de générer un nouveau QR Code."
        );

        setPaymentState('expired');
    }
};

  // Sélection d'un montant rapide
  const handleQuickAmount = (val) => {
    setAmount(String(val));
    setSelectedQuickAmount(val);
  };

  // Étape actuelle pour le stepper
  const getCurrentStep = () => {
    if (paymentState === 'create' || paymentState === 'generating') return 1;
    if (paymentState === 'waiting' || paymentState === 'expired') return 2;
    if (paymentState === 'success') return 3;
    return 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="rp-layout">
      {/* Sidebar */}
      <aside className="rp-sidebar">
        <div className="rp-sidebar-logo">
          <Logo size={100} className="mb-6 logo-white" />
        </div>
        <nav className="rp-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                state={location.state}
                className={`rp-nav-item ${item.active ? 'rp-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <a href="/" className="rp-logout">
          <LogOut size={18} />
          <span>Déconnexion</span>
        </a>
        <div className="rp-support-box">
          <Headphones size={20} />
          <div>
            <div className="rp-support-title">Besoin d'aide ?</div>
            <div className="rp-support-text">Contactez notre support</div>
          </div>
          <ArrowRight size={16} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="rp-main">
        {/* Header */}
        <header className="rp-header">
          <div>
            <h1 className="rp-title">Recevoir un paiement</h1>
            <p className="rp-subtitle">Encaissez vos clients en toute simplicité</p>
          </div>
          <div className="rp-header-actions">
            <div className="rp-search-bar">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <button type="button" className="rp-icon-button">
              <Bell size={18} />
              <span className="rp-badge">3</span>
            </button>
            <div className="rp-user-chip">
              <div className="rp-user-avatar">MB</div>
              <div className="rp-user-info">
                <span className="rp-user-name">Marwa Boutabi</span>
                <span className="rp-user-role">Commerçant</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Stepper */}
        <div className="rp-stepper">
          <div className={`rp-stepper-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="rp-stepper-circle">
              {currentStep > 1 ? <CheckCircle2 size={16} /> : '1'}
            </div>
            <span className="rp-stepper-label">Créer une demande</span>
          </div>
          <div className="rp-stepper-line" />
          <div className={`rp-stepper-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="rp-stepper-circle">
              {currentStep > 2 ? <CheckCircle2 size={16} /> : '2'}
            </div>
            <span className="rp-stepper-label">QR Code généré</span>
          </div>
          <div className="rp-stepper-line" />
          <div className={`rp-stepper-step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="rp-stepper-circle">
              {currentStep === 3 ? <CheckCircle2 size={16} /> : '3'}
            </div>
            <span className="rp-stepper-label">Paiement reçu</span>
          </div>
        </div>

        {/* Contenu dynamique selon l'état */}
        <div className="rp-content-area">
          {paymentState === 'create' && (
            <div className="rp-state rp-state-create">
              <div className="rp-create-grid">
                {/* Formulaire */}
                <div className="rp-card rp-card-form">
                  <div className="rp-card-header">
                    <h2 className="rp-card-title">Créer une demande de paiement</h2>
                    <p className="rp-card-subtitle">Saisissez les informations du paiement à recevoir.</p>
                  </div>

                  <div className="rp-form-content">
                    <div className="rp-form-group">
                      <label className="rp-label">Montant à recevoir *</label>
                      <div className="rp-input-wrapper rp-input-large">
                        <div className="rp-input-icon-left">
                          <Wallet size={18} />
                        </div>
                        <input
                          type="text"
                          placeholder="0,00"
                          value={amount}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.,]/g, '');
                            setAmount(val);
                            setSelectedQuickAmount(null);
                          }}
                          className="rp-input"
                        />
                        <span className="rp-currency">MAD</span>
                      </div>
                      
                      <div className="rp-quick-amounts">
                        {QUICK_AMOUNTS.map((val) => (
                          <button
                            key={val}
                            type="button"
                            className={`rp-quick-btn ${selectedQuickAmount === val ? 'active' : ''}`}
                            onClick={() => handleQuickAmount(val)}
                          >
                            {val} MAD
                          </button>
                        ))}
                        <button
                          type="button"
                          className="rp-quick-btn rp-quick-btn-outline"
                          onClick={() => {
                            setAmount('');
                            setSelectedQuickAmount(null);
                          }}
                        >
                          + Autre montant
                        </button>
                      </div>
                    </div>

                    <div className="rp-form-group">
                      <label className="rp-label">Description <span className="rp-optional">(optionnelle)</span></label>
                      <div className="rp-input-with-icon">
                        <div className="rp-input-icon-left">
                          <Tag size={16} />
                        </div>
                        <input
                          type="text"
                          placeholder="Ex : Achat en magasin, Service..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="rp-input rp-input-with-icon"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="rp-btn-primary rp-btn-generate"
                      onClick={handleGenerateQR}
                      disabled={!isValidAmount()}
                    >
                      <QrCode size={18} />
                      Générer le QR Code
                    </button>

                    <div className="rp-hint">
                      <Shield size={14} />
                      <span>Le QR Code sera valide pendant 5 minutes</span>
                    </div>
                  </div>
                </div>

                {/* Placeholder QR */}
                <div className="rp-card rp-card-placeholder">
                  <div className="rp-placeholder-content">
                    <div className="rp-placeholder-icon">
                      <div className="rp-placeholder-circle">
                        <QrCode size={48} strokeWidth={1.5} />
                      </div>
                    </div>
                    <h3 className="rp-placeholder-title">Le QR Code apparaîtra ici</h3>
                    <p className="rp-placeholder-text">
                      après avoir généré la demande de paiement.
                    </p>
                    <div className="rp-placeholder-info">
                      <Smartphone size={16} />
                      <span>Le client devra scanner ce QR Code pour effectuer le paiement.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentState === 'generating' && (
            <div className="rp-state rp-state-loading">
              <div className="rp-loading-card">
                <div className="rp-loading-spinner">
                  <Loader2 size={48} />
                </div>
                <h2 className="rp-loading-title">Génération en cours...</h2>
                <p className="rp-loading-text">Création de votre demande de paiement et génération du QR Code sécurisé.</p>
              </div>
            </div>
          )}

          {paymentState === 'waiting' && transactionData && (
            <div className="rp-state rp-state-waiting">
              <div className="rp-waiting-grid">
                {/* Résumé */}
                <div className="rp-card rp-card-summary">
                  <div className="rp-summary-header">
                    <h3 className="rp-summary-title">Détails de la demande</h3>
                    <span className="rp-status-badge rp-status-waiting">
                      <Clock size={12} />
                      En attente
                    </span>
                  </div>
                  
                  <div className="rp-summary-content">
                    <div className="rp-summary-item">
                      <span className="rp-summary-label">Montant</span>
                      <span className="rp-summary-value rp-summary-amount">{transactionData.amount} MAD</span>
                    </div>
                    <div className="rp-summary-divider" />
                    <div className="rp-summary-item">
                      <span className="rp-summary-label">Description</span>
                      <span className="rp-summary-value">{transactionData.description}</span>
                    </div>
                    <div className="rp-summary-divider" />
                    <div className="rp-summary-item">
                      <span className="rp-summary-label">Référence</span>
                      <div className="rp-reference-display">
                        <span className="rp-reference-text">{reference}</span>
                        <button 
                          className="rp-copy-btn" 
                          onClick={copyReference}
                          title="Copier"
                        >
                          {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      {copied && <span className="rp-copied-hint">Copié !</span>}
                    </div>
                    <div className="rp-summary-divider" />
                    <div className="rp-summary-item">
                      <span className="rp-summary-label">Expire le</span>
                      <span className="rp-summary-value">
                        {transactionData.expiresAt.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="rp-card rp-card-qr">
                  <div className="rp-qr-header">
                    <h3 className="rp-qr-title">Scannez pour payer</h3>
                    <p className="rp-qr-subtitle">Demandez à votre client de scanner ce QR Code</p>
                  </div>

                 <div className="rp-qr-content">
    <QRCodeSVG
        value={`http://localhost:3000/pay/${reference}`}
        size={220}
        bgColor="#FFFFFF"
        fgColor="#0b1f4b"
        level="H"
        includeMargin={true}
    />
</div>

                  <div className="rp-qr-info">
                    <div className="rp-qr-info-row">
                      <span className="rp-qr-info-label">Montant</span>
                      <span className="rp-qr-info-value">{transactionData.amount} MAD</span>
                    </div>
                    <div className="rp-qr-info-row">
                      <span className="rp-qr-info-label">Référence</span>
                      <span className="rp-qr-info-value">{reference}</span>
                    </div>
                    <div className="rp-timer-display">
                      <Clock size={16} />
                      <span>Expire dans <strong>{formatTime(timeLeft)}</strong></span>
                    </div>
                    <p className="rp-qr-hint">Le QR Code expirera automatiquement.</p>
                  </div>

                  <div className="rp-qr-actions">
                    <button className="rp-btn-secondary">
                      <Share2 size={16} />
                      Partager
                    </button>
                    <button className="rp-btn-secondary">
                      <Download size={16} />
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentState === 'expired' && (
            <div className="rp-state rp-state-expired">
              <div className="rp-expired-card">
                <div className="rp-expired-icon">
                  <AlertCircle size={48} />
                </div>
                <h2 className="rp-expired-title">Cette demande de paiement a expiré</h2>
                <p className="rp-expired-text">
                  Le client n'a pas effectué le paiement dans le délai imparti. 
                  Le QR Code a été désactivé.
                </p>
                <div className="rp-expired-info">
                  <div className="rp-expired-info-item">
                    <span className="rp-expired-label">Référence</span>
                    <span className="rp-expired-value">{reference}</span>
                  </div>
                  <div className="rp-expired-info-item">
                    <span className="rp-expired-label">Montant</span>
                    <span className="rp-expired-value">{transactionData?.amount} MAD</span>
                  </div>
                </div>
                <div className="rp-expired-actions">
                  <button className="rp-btn-primary" onClick={handleRegenerate}>
                    <RefreshCw size={16} />
                    Générer un nouveau QR Code
                  </button>
                  <button className="rp-btn-outline" onClick={handleNewPayment}>
                    <XCircle size={16} />
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {paymentState === 'success' && transactionData && (
            <div className="rp-state rp-state-success">
              <div className="rp-success-grid">
                {/* Détails */}
                <div className="rp-card rp-card-details">
                  <div className="rp-details-header">
                    <h3 className="rp-details-title">Détails du paiement</h3>
                    <span className="rp-status-badge rp-status-success">
                      <CheckCircle2 size={12} />
                      Réussi
                    </span>
                  </div>
                  
                  <div className="rp-details-content">
                    <div className="rp-detail-row">
                      <span className="rp-detail-label">Montant reçu</span>
                      <span className="rp-detail-value rp-detail-amount">{transactionData.amount} MAD</span>
                    </div>
                    <div className="rp-detail-divider" />
                    <div className="rp-detail-row">
                      <span className="rp-detail-label">Référence</span>
                      <span className="rp-detail-value">{reference}</span>
                    </div>
                    <div className="rp-detail-divider" />
                    <div className="rp-detail-row">
                      <span className="rp-detail-label">Payé par</span>
                      <span className="rp-detail-value">{transactionData.paidBy || 'Client'}</span>
                    </div>
                    <div className="rp-detail-divider" />
                    <div className="rp-detail-row">
                      <span className="rp-detail-label">Date et heure</span>
                      <span className="rp-detail-value">
                        {transactionData.paidAt?.toLocaleDateString('fr-FR')} • {transactionData.paidAt?.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Confirmation */}
                <div className="rp-card rp-card-success">
                  <div className="rp-success-content">
                    <div className="rp-success-icon-wrapper">
                      <div className="rp-success-circle">
                        <CheckCircle2 size={48} />
                      </div>
                    </div>
                    
                    <h2 className="rp-success-title">Paiement reçu</h2>
                    <div className="rp-success-amount">{transactionData.amount} MAD</div>
                    <p className="rp-success-text">Le paiement a été effectué avec succès.</p>

                    <div className="rp-success-actions">
                      <button className="rp-btn-outline">
                        <FileText size={16} />
                        Voir le reçu
                      </button>
                      <button className="rp-btn-outline">
                        <Printer size={16} />
                        Imprimer
                      </button>
                      <button className="rp-btn-primary" onClick={handleNewPayment}>
                        <QrCode size={16} />
                        Nouveau paiement
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tableau des paiements récents */}
        <div className="rp-panel">
          <div className="rp-panel-header">
            <h2 className="rp-panel-title">Paiements récents</h2>
            <button type="button" className="rp-link-btn">
              Voir tout
              <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
            </button>
          </div>

          <div className="rp-table-wrapper">
            <table className="rp-table">
              <thead>
                <tr>
                  <th>Date & heure</th>
                  <th>Client</th>
                  <th>Méthode</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Référence</th>
                  <th></th>
                </tr>
              </thead>
            <tbody>

{payments.map((payment) => (

<tr key={payment.id}>

<td>
<p className="rp-table-date">
{new Date(payment.createdAt).toLocaleString('fr-FR')}
</p>
</td>


<td>
<div className="rp-client-info">

<div className="rp-client-avatar">
CL
</div>

<span>
{payment.senderName || "Client"}
</span>

</div>
</td>


<td>

<div className="rp-method-cell">

<QrCode size={14}/>

<span>
{payment.type === "QR_PAYMENT"
? "QR Code"
: "Virement"}
</span>

</div>

</td>


<td className="rp-amount-positive">

+
{payment.amount} MAD

</td>


<td>

<span className="rp-status-badge rp-status-success">

<CheckCircle2 size={12}/>

Réussi

</span>

</td>


<td className="rp-reference">

#{payment.transactionReference}

</td>


<td>
<ChevronDown size={16}/>
</td>


</tr>

))}


</tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}