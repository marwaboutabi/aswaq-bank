import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, Bell, ChevronDown,
  QrCode, Camera, Upload, Shield, CheckCircle2,
  Check, Info, Lock, AlertCircle, Store, Zap,
   ChevronRight
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './PayQRCode.css';
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRef } from "react";
import api from "../services/api";

const NAV_ITEMS = [
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
];

const STEPS = [
  { label: 'Scanner le code' },
  { label: 'Vérifier les informations' },
  { label: 'Saisir le montant' },
  { label: 'Confirmer le paiement' },
];



const QUICK_AMOUNTS = [50, 100, 200, 500];

export default function PayQRCode() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [scanning, setScanning] = useState(false);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [showCamera, setShowCamera] = useState(false);
const scannerRef = useRef(null);

const [beneficiary, setBeneficiary] = useState(null);
  const availableBalance = 12450.00;
  const fees = 0;
const total = Number(
    amount.replace(",", ".") || 0
) + fees;
  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        setScanning(false);
        setCurrentStep(2);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [scanning]);
  useEffect(() => {

    if (showCamera) {

        const timer = setTimeout(() => {
            startScanner();
        }, 300);

        return () => clearTimeout(timer);
    }

}, [showCamera]);

useEffect(() => {
    return () => {
        if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
        }
    };
}, []);
const startScanner = async () => {
    if(scannerRef.current){
        return;
    }

    scannerRef.current = new Html5QrcodeScanner(
        "reader",
        {
            fps:10,
            qrbox:250
        },
        false
    );

    scannerRef.current.render(

async (decodedText) => {
    try {

    // Le QR contient une URL du type :
    // http://localhost:3000/pay/PAY-XXXXX

    const value = decodedText.split("/").pop();

try {

    // Nouveau QR commerçant
    if (value.startsWith("PAY-")) {

        const response = await api.get(`/payment-requests/${value}`);

        const payment = response.data;

        setBeneficiary({
    type: "merchant",
    reference: payment.reference,
    name: payment.merchantName,
    rib: payment.merchantRib,
    bank: payment.bank,
    amount: payment.amount,
    description: payment.description,
    status: payment.status,
    expiresAt: payment.expiresAt,
    verified: true,
    isMerchantPayment: true
});
setAmount(payment.amount.toString());

    } else {

        // Ancien QR (QR RIB)
        const response = await api.get(
            `/receive-money/info?rib=${value}`
        );

        setBeneficiary({
            type: "classic",
            ...response.data
        });

    }

    if (scannerRef.current) {
        await scannerRef.current.clear();
        scannerRef.current = null;
    }

    setShowCamera(false);
    setCurrentStep(2);

} catch (error) {

    console.error(error);
    alert("QR Code invalide ou demande introuvable");
}

} catch (error) {

    console.error(error);

    alert("QR Code invalide ou demande introuvable");

}

},

        ()=>{}

    );

};
 const handleStartScan = () => {

    setShowCamera(true);

};
const handleCloseCamera = async () => {
    if (scannerRef.current) {
        await scannerRef.current.clear();
        scannerRef.current = null;
    }

    setShowCamera(false);
};

  const handleImportImage = () => {
    setScanning(true);
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
const getNumericAmount = () => {
    return Number(
        amount.replace(",", ".")
    );
};
  const handleConfirmPayment = async () => {

    if (!beneficiary) {
        alert("Bénéficiaire introuvable");
        return;
    }
    if (
    beneficiary.expiresAt &&
    new Date(beneficiary.expiresAt) < new Date()
) {
    alert("QR Code expiré. Veuillez demander un nouveau QR Code.");
    return;
}

    if (!beneficiary.rib) {
        alert("Compte bénéficiaire invalide");
        return;
    }

    if (!amount || Number(amount) <= 0) {
        alert("Montant invalide");
        return;
    }

    try {

        await api.post("/transactions/qr-payment", {
            receiverRib: beneficiary.rib,
amount: getNumericAmount(),
            description: reason || "Paiement QR"
        });

        alert(
            "✅ Paiement effectué avec succès à " +
            beneficiary.name
        );

        navigate("/dashboard-client");

    } catch (error) {

        console.error(error);

        alert(
            error.response?.data?.message ||
            "Le paiement a échoué."
        );
    }
};

  const formatAmount = (val) => {
    return parseFloat(val).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

const numericAmount = Number(
    amount.replace(",", ".")
);

const isStep3Valid =
    amount !== '' &&
    numericAmount > 0 &&
    numericAmount <= availableBalance;
  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="acc-sidebar-logo"><Logo size={100} className="mb-6" logo-white/></div>
        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => (
            <a key={item.label} href={item.to} className="dash-nav-item"><span>{item.label}</span></a>
          ))}
        </nav>
        <a href="/" className="dash-logout"><span>Déconnexion</span></a>
      </aside>

      <main className="dash-main pay-qr-main">
        <header className="pq-topbar">
          <div>
            <h1 className="pq-greeting">Bonjour, Marwa 👋</h1>
            <p className="pq-greeting-sub">Effectuez un paiement rapidement en scannant un QR Code.</p>
          </div>
          <div className="pq-topbar-actions">
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

        <div className="pq-page-header">
          <button type="button" className="pq-back-btn" onClick={() => navigate('/dashboard-client')}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="pq-page-title">Payer / Scanner un code</h1>
            <p className="pq-page-subtitle">Scannez un QR Code pour effectuer un paiement instantané.</p>
          </div>
        </div>

        <div className="pq-stepper">
          {STEPS.map((step, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            return (
              <div key={step.label} className={`pq-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                <div className="pq-step-circle">
                  {isDone ? <Check size={14} /> : stepNum}
                </div>
                <span className="pq-step-label">{step.label}</span>
              </div>
            );
          })}
        </div>

        {currentStep === 1 && (
          <div className="pq-content">
            <div className="pq-grid-2">
              <div className="pq-card pq-scan-card">
                <h3 className="pq-card-title">Scanner un QR Code</h3>
                
                {!showCamera ? (
                  <div className="pq-scan-placeholder">
                    <QrCode size={48} className="pq-scan-icon" />
                    <p>Cliquez sur "Activer la caméra" pour commencer</p>
                  </div>
                ) : (
                  <div className="pq-camera-view">
    <div id="reader"></div>
</div>
                )}

                {!showCamera ? (
                  <button type="button" className="pq-primary-btn pq-full" onClick={handleStartScan}>
                    <Camera size={16} /> Activer la caméra
                  </button>
                ) : (
                  <button
    type="button"
    className="pq-secondary-btn pq-full"
    onClick={handleCloseCamera}
>
    Fermer la caméra
</button>
                )}

                <div className="pq-divider">OU</div>

                <button type="button" className="pq-secondary-btn pq-full" onClick={handleImportImage}>
                  <Upload size={16} /> Importer une image
                </button>

                <div className="pq-hint">
                  <Info size={14} />
                  <span>Assurez-vous que le QR Code est bien visible et éclairé.</span>
                </div>
              </div>

              <div className="pq-card pq-info-card">
                <div className="pq-info-icon">
                  <Shield size={24} />
                </div>
                <h4 className="pq-info-title">Vos paiements sont sécurisés avec Aswaq Bank.</h4>
                <p className="pq-info-text">Les informations du bénéficiaire seront affichées après le scan.</p>
                
                <div className="pq-illustration">
                  <div className="pq-phone-mockup">
                    <div className="pq-phone-screen">
                      <div className="pq-phone-qr">
                        <QrCode size={28} />
                      </div>
                    </div>
                    <div className="pq-phone-check">
                      <CheckCircle2 size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="pq-content">
            <div className="pq-success-banner">
              <CheckCircle2 size={16} />
              <span>QR Code scanné avec succès</span>
            </div>

            <div className="pq-grid-2">
              <div className="pq-card">
                <h3 className="pq-card-title">Informations du bénéficiaire</h3>
                
                <div className="pq-beneficiary-card">
                  <div className="pq-beneficiary-header">
                    <div className="pq-beneficiary-icon">
                      <Store size={20} />
                    </div>
                    <div>
                      <p className="pq-beneficiary-name">{beneficiary?.name}</p>
{beneficiary?.verified && (
    <p className="pq-beneficiary-verified">
        Commerçant vérifié <CheckCircle2 size={12} />
    </p>
)}
                    </div>
                  </div>

                  <div className="pq-beneficiary-details">
                    <div className="pq-detail-row">
                      <span className="pq-detail-label">Nom du bénéficiaire</span>
                      <span className="pq-detail-value">{beneficiary?.name}</span>
                    </div>
                    <div className="pq-detail-row">
                      <span className="pq-detail-label">Banque</span>
                      <span className="pq-detail-value">{beneficiary?.bank}</span>
                    </div>
                    <div className="pq-detail-row">
                      <span className="pq-detail-label">Compte / IBAN</span>
                      <span className="pq-detail-value pq-iban">{beneficiary?.rib}</span>
                    </div>
                  </div>

                  <div className="pq-verify-hint">
                    <Shield size={14} />
                    <span>Vérifiez que les informations du bénéficiaire sont correctes avant de continuer.</span>
                  </div>
                </div>
              </div>

              <div className="pq-card pq-illustration-card">
                <div className="pq-phone-illustration">
                  <div className="pq-phone-mockup">
                    <div className="pq-phone-screen">
                      <CheckCircle2 size={40} className="pq-phone-success-icon" />
                    </div>
                    <div className="pq-phone-check">
                      <CheckCircle2 size={14} />
                    </div>
                  </div>
                </div>
                <p className="pq-illustration-text">
                  Les informations ont été récupérées depuis le QR Code. Cliquez sur "Continuer" pour saisir le montant.
                </p>
              </div>
            </div>

            <div className="pq-footer">
              <button type="button" className="pq-secondary-btn" onClick={() => setCurrentStep(1)}>
                <ArrowLeft size={16} /> Retour
              </button>
              <button type="button" className="pq-primary-btn" onClick={handleContinue}>
                Continuer <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="pq-content">
            <div className="pq-grid-2">
              <div className="pq-card">
                <h3 className="pq-card-title">Récapitulatif du bénéficiaire</h3>
                
                <div className="pq-beneficiary-summary">
                  <div className="pq-beneficiary-header">
                    <div className="pq-beneficiary-icon">
                      <Store size={20} />
                    </div>
                    <div>
                      <p className="pq-beneficiary-name">{beneficiary?.name}</p>
                      {beneficiary?.verified && (
                        <p className="pq-beneficiary-verified">
                          Commerçant vérifié <CheckCircle2 size={12} />
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pq-beneficiary-details">
                    <div className="pq-detail-row">
                      <span className="pq-detail-label">Banque</span>
                      <span className="pq-detail-value">{beneficiary?.bank}</span>
                    </div>
                    <div className="pq-detail-row">
                      <span className="pq-detail-label">Compte / IBAN</span>
                      <span className="pq-detail-value pq-iban">{beneficiary?.rib}</span>
                    </div>
                  </div>

                  <button type="button" className="pq-modify-btn">
                    <QrCode size={14} /> Modifier le bénéficiaire
                  </button>
                </div>

                <div className="pq-instant-hint">
                  <Zap size={14} />
                  <span>Les fonds seront transférés instantanément après confirmation.</span>
                </div>
              </div>

              <div className="pq-card">
                <div className="pq-amount-header">
                  <h3 className="pq-card-title">Saisir le montant</h3>
                  <span className="pq-balance">Solde disponible : <strong>{formatAmount(availableBalance)} MAD</strong></span>
                </div>

                <div className="pq-form-group">
                  <label className="pq-form-label">Montant</label>
                  <div className="pq-amount-input-wrapper">
                    <input
                      type="text"
                      placeholder="0,00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ''))}
                      className="pq-amount-input"
                    />
                    <span className="pq-currency">MAD</span>
                  </div>
                </div>

                <div className="pq-quick-amounts">
                  {QUICK_AMOUNTS.map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`pq-quick-btn ${amount === String(val) ? 'active' : ''}`}
                      onClick={() => setAmount(String(val))}
                    >
                      {val} MAD
                    </button>
                  ))}
                </div>

                <div className="pq-form-group">
                  <label className="pq-form-label">Motif (optionnel)</label>
                  <input
                    type="text"
                    placeholder="Ex : Paiement facture, achat, etc."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="pq-form-input"
                  />
                </div>

                {amount && parseFloat(amount) > availableBalance && (
                  <div className="pq-error-hint">
                    <AlertCircle size={14} /> Solde insuffisant
                  </div>
                )}
              </div>
            </div>

            <div className="pq-footer">
              <button type="button" className="pq-secondary-btn" onClick={() => setCurrentStep(2)}>
                <ArrowLeft size={16} /> Retour
              </button>
              <button 
                type="button" 
                className="pq-primary-btn" 
                disabled={!isStep3Valid}
                onClick={handleContinue}
              >
                Continuer <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="pq-content">
            <div className="pq-grid-2">
              <div className="pq-card">
                <h3 className="pq-card-title">Détails du paiement</h3>
                
                <div className="pq-summary-list">
                  <div className="pq-summary-row">
                    <span className="pq-summary-label">Vous payez à</span>
                    <span className="pq-summary-value pq-summary-value-bold">{beneficiary?.name}</span>
                  </div>
                  <div className="pq-summary-row">
                    <span className="pq-summary-label">Compte / IBAN</span>
                    <span className="pq-summary-value pq-iban">{beneficiary?.rib}</span>
                  </div>
                  <div className="pq-summary-row">
                    <span className="pq-summary-label">Montant</span>
                    <span className="pq-summary-value pq-summary-value-bold">{formatAmount(amount)} MAD</span>
                  </div>
                  <div className="pq-summary-row">
                    <span className="pq-summary-label">Frais de transaction</span>
                    <span className="pq-summary-value pq-free">Gratuit</span>
                  </div>
                  <div className="pq-summary-divider" />
                  <div className="pq-summary-row pq-total-row">
                    <span className="pq-summary-label pq-total-label">Total à payer</span>
                    <span className="pq-summary-value pq-total-value">{formatAmount(total)} MAD</span>
                  </div>
                </div>
              </div>

              <div className="pq-card pq-confirm-card">
                <h3 className="pq-card-title">Confirmer le paiement</h3>
                
                <div className="pq-security-box">
                  <Shield size={20} />
                  <span>Vos paiements sont sécurisés avec Aswaq Bank.</span>
                </div>

                <div className="pq-lock-illustration">
                  <div className="pq-lock-circle">
                    <Lock size={32} />
                  </div>
                </div>

                <button 
                  type="button" 
                  className="pq-primary-btn pq-full pq-confirm-btn"
                  onClick={handleConfirmPayment}
                >
                  <Lock size={16} /> Confirmer le paiement
                </button>

                <button 
                  type="button" 
                  className="pq-cancel-btn"
                  onClick={() => navigate('/dashboard-client')}
                >
                  Annuler le paiement
                </button>
              </div>
            </div>

            <div className="pq-final-hint">
              <Info size={14} />
              <span>En confirmant, vous acceptez d'effectuer ce paiement. Cette action est irréversible.</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}