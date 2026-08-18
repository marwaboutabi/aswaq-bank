import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Search, Bell, ChevronDown, QrCode, Camera, Upload,
  Shield, CheckCircle2, Check, Info, Lock, AlertCircle, Store, Zap, ChevronRight
} from "lucide-react";

// Assurez-vous d'importer les composants partagés comme dans le Dashboard
import Logo from "../components/Logo/Logo";
import UserHeader from '../components/UserHeader/UserHeader'; // Ajouté pour homogénéité
import NotificationBell from '../components/NotificationBell/NotificationBell'; // Ajouté pour homogénéité
import "./PayQRCode.css";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "../services/api";

const NAV_ITEMS = [
  { icon: "Home", label: "Accueil", to: "/dashboard-client" },
  { icon: "CreditCard", label: "Gestion du compte", to: "/mon-compte" },
  { icon: "ArrowLeftRight", label: "Historique des transactions", to: "/transactions-client" },
  { icon: "Receipt", label: "Tickets numériques", to: "/tickets-client" },
  { icon: "Star", label: "Points de fidélité", to: "/fidelite" },
  { icon: "PiggyBank", label: "Objectifs d'épargne", to: "/epargne" },
  { icon: "PieChart", label: "Suivi des dépenses", to: "/depenses" },
  { icon: "Bell", label: "Notifications", to: "/notifications" },
  { icon: "Bot", label: "Assistant IA", to: "/assistant" },
  { icon: "User", label: "Profil et paramètres", to: "/parametres" },
];

const STEPS = [
  { label: "Scanner le code" },
  { label: "Vérifier les informations" },
  { label: "Saisir le montant" },
  { label: "Confirmer le paiement" },
];

const QUICK_AMOUNTS = [50, 100, 200, 500];

export default function PayQRCode() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCamera, setShowCamera] = useState(false);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [beneficiary, setBeneficiary] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [availableRewards, setAvailableRewards] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const scannerRef = useRef(null);

  const availableBalance = 12450.0;
  const fees = 0;
  const numericAmount = Number(String(amount).replace(",", "."));
  const selectedRewardAmount = selectedReward?.rewardAmount ? Number(selectedReward.rewardAmount) : 0;
  const amountAfterVoucher = Math.max(numericAmount - selectedRewardAmount, 0);
  const total = amountAfterVoucher + fees;

  const loadAvailableRewards = async () => {
    try {
      const response = await api.get("/loyalty/rewards/available");
      setAvailableRewards(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erreur récupération bons :", error);
      setAvailableRewards([]);
    }
  };

  const clearScanner = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.clear(); } catch (e) {}
      scannerRef.current = null;
    }
  };

  const startScanner = () => {
    if (scannerRef.current) return;
    const readerElement = document.getElementById("reader");
    if (!readerElement) return;

    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true, showTorchButtonIfSupported: true }, false);
    scannerRef.current = scanner;
    scanner.render(async (decodedText) => { await handleQrDecoded(decodedText); }, () => {});
  };

  useEffect(() => {
    if (!showCamera) return;
    const timer = setTimeout(() => startScanner(), 300);
    return () => clearTimeout(timer);
  }, [showCamera]);

  useEffect(() => { return () => clearScanner(); }, []);

  const handleQrDecoded = async (decodedText) => {
    if (!decodedText) return;
    try {
      let value = decodedText.trim();
      if (value.includes("/")) value = value.split("/").filter(Boolean).pop();
      value = decodeURIComponent(value);

      if (value.toUpperCase().startsWith("PAY-")) {
        const response = await api.get(`/payment-requests/${value}`);
        const payment = response.data;
        if (payment.status && payment.status !== "PENDING") { alert("Cette demande de paiement n'est plus disponible."); return; }
        if (payment.expiresAt && new Date(payment.expiresAt) < new Date()) { alert("Ce QR Code a expiré."); return; }

        setBeneficiary({ type: "merchant", reference: payment.reference, name: payment.merchantName, rib: payment.merchantRib, bank: payment.bank || "Aswaq Bank", amount: payment.amount, description: payment.description, status: payment.status, expiresAt: payment.expiresAt, verified: true, isMerchantPayment: true });
        setAmount(payment.amount !== null && payment.amount !== undefined ? String(payment.amount) : "");
        await loadAvailableRewards();
        setSelectedReward(null);
        await clearScanner();
        setShowCamera(false);
        setCurrentStep(2);
        return;
      }

      let ribToLookup = value;
      try {
        const parsed = JSON.parse(value);
        if (parsed && parsed.type === "ASWAQ_TRANSFER" && parsed.rib) ribToLookup = parsed.rib;
      } catch (e) {}

      const response = await api.get(`/receive-money/lookup?rib=${encodeURIComponent(ribToLookup)}`);
      const data = response.data;
      setBeneficiary({ type: "classic", ...data, isMerchantPayment: false });
      setAmount("");
      setReason("");
      await clearScanner();
      setShowCamera(false);
      setCurrentStep(2);
    } catch (error) {
      console.error("Erreur traitement QR :", error);
      alert(error.response?.data?.message || "QR Code invalide ou demande introuvable.");
    }
  };

  const handleStartScan = () => setShowCamera(true);
  const handleCloseCamera = async () => { await clearScanner(); setShowCamera(false); };
  const handleImportImage = () => alert("La lecture d'un QR depuis une image sera ajoutée prochainement.");
  const handleContinue = () => { if (currentStep < 4) setCurrentStep(currentStep + 1); };

  const isStep3Valid = amount !== "" && numericAmount > 0 && amountAfterVoucher <= availableBalance;

  const handleConfirmPayment = async () => {
    if (!beneficiary || !beneficiary.rib) { alert("Bénéficiaire invalide."); return; }
    if (beneficiary.expiresAt && new Date(beneficiary.expiresAt) < new Date()) { alert("QR Code expiré."); return; }
    if (!amountAfterVoucher || amountAfterVoucher <= 0) { alert("Montant invalide."); return; }
    if (amountAfterVoucher > availableBalance) { alert("Solde insuffisant."); return; }
    if (isPaying) return;

    try {
      setIsPaying(true);
      if (beneficiary.isMerchantPayment && beneficiary.reference) {
        const voucherCode = selectedReward?.code || null;
        await api.post(`/payment-requests/pay/${beneficiary.reference}`, { voucherCode });
        alert(selectedReward ? `✅ Paiement effectué avec le bon de ${formatAmount(selectedReward.rewardAmount)} MAD` : "✅ Paiement effectué avec succès à " + beneficiary.name);
      } else {
        await api.post("/transactions/qr-payment", { receiverRib: beneficiary.rib, amount: amountAfterVoucher, description: reason || "Paiement QR" });
        alert("✅ Paiement effectué avec succès à " + beneficiary.name);
      }
      navigate("/dashboard-client");
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data;
      alert(typeof backendMessage === "string" ? backendMessage : "Le paiement a échoué.");
    } finally {
      setIsPaying(false);
    }
  };

  const formatAmount = (value) => {
    const number = Number(String(value).replace(",", "."));
    if (Number.isNaN(number)) return "0,00";
    return number.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    // ✅ CORRECTION LAYOUT : Utilisation de dash-layout au lieu de dashboard-layout
    <div className="dash-layout">
      {/* ✅ SIDEBAR HOMOGÉNÉISÉE */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-logo">
          <Logo size={100} className="mb-6 logo-white"/>
        </div>
        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => (
            <button key={item.label} type="button" className="dash-nav-item" onClick={() => navigate(item.to)}>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="dash-help-card">
          <div className="dash-help-icon"><Zap size={20} /></div>
          <p className="dash-help-title">Besoin d'aide ?</p>
          <p className="dash-help-text">Notre assistant IA est là pour vous aider</p>
          <button type="button" className="dash-help-button">Discuter avec l'IA →</button>
        </div>
        <button type="button" className="dash-logout" onClick={() => navigate("/login")}>
          Déconnexion
        </button>
      </aside>

      {/* ✅ MAIN CONTENT HOMOGÉNÉISÉ */}
      <main className="dash-main pay-qr-main">
        
        {/* ✅ TOPBAR UTILISANT LES COMPOSANTS PARTAGÉS */}
        <header className="dash-topbar">
          <div>
            <h1 className="dash-greeting">Bonjour, Marwa 👋</h1>
            <p className="dash-greeting-sub">Effectuez un paiement rapidement en scannant un QR Code.</p>
          </div>
          <div className="dash-topbar-actions">
            <div className="dash-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <NotificationBell />
            <UserHeader />
          </div>
        </header>

        {/* HEADER DE LA PAGE SPÉCIFIQUE */}
        <div className="pq-page-header">
          <button type="button" className="pq-back-btn" onClick={() => navigate("/dashboard-client")}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="pq-page-title">Payer / Scanner un code</h1>
            <p className="pq-page-subtitle">Scannez un QR Code pour effectuer un paiement instantané.</p>
          </div>
        </div>

        {/* STEPPER */}
        <div className="pq-stepper">
          {STEPS.map((step, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            return (
              <div key={step.label} className={`pq-step ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
                <div className="pq-step-circle">{isDone ? <Check size={14} /> : stepNum}</div>
                <span className="pq-step-label">{step.label}</span>
              </div>
            );
          })}
        </div>

                {/* ÉTAPE 1 : SCAN */}
        {currentStep === 1 && (
          <div className="pq-content">
            {/* On passe en grille d'une seule colonne ou on centre la carte */}
            <div className="pq-single-col"> 
              <div className="pq-card pq-scan-card pq-centered-card">
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
                  <button type="button" className="pq-secondary-btn pq-full" onClick={handleCloseCamera}>
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
            </div>
          </div>
        )}

                {/* ÉTAPE 2 : VÉRIFICATION */}
        {currentStep === 2 && (
          <div className="pq-content">
            <div className="pq-success-banner">
              <CheckCircle2 size={16} /><span>QR Code scanné avec succès</span>
            </div>
            
            {/* ✅ MODIFICATION : Grille supprimée, carte centrée et limitée en largeur */}
            <div className="pq-single-col">
              <div className="pq-card pq-centered-card">
                <h3 className="pq-card-title">Informations du bénéficiaire</h3>
                <div className="pq-beneficiary-card">
                  <div className="pq-beneficiary-header">
                    <div className="pq-beneficiary-icon"><Store size={20} /></div>
                    <div>
                      <p className="pq-beneficiary-name">{beneficiary?.name || "Bénéficiaire"}</p>
                      {beneficiary?.verified && <p className="pq-beneficiary-verified">Commerçant vérifié <CheckCircle2 size={12} /></p>}
                    </div>
                  </div>
                  <div className="pq-beneficiary-details">
                    <div className="pq-detail-row"><span className="pq-detail-label">Nom du bénéficiaire</span><span className="pq-detail-value">{beneficiary?.name || "-"}</span></div>
                    <div className="pq-detail-row"><span className="pq-detail-label">Banque</span><span className="pq-detail-value">{beneficiary?.bank || "Aswaq Bank"}</span></div>
                    <div className="pq-detail-row"><span className="pq-detail-label">Compte / IBAN</span><span className="pq-detail-value pq-iban">{beneficiary?.rib || "-"}</span></div>
                    {beneficiary?.isMerchantPayment && (<div className="pq-detail-row"><span className="pq-detail-label">Montant demandé</span><span className="pq-detail-value">{formatAmount(beneficiary.amount)} MAD</span></div>)}
                  </div>
                  <div className="pq-verify-hint"><Shield size={14} /><span>Vérifiez que les informations du bénéficiaire sont correctes avant de continuer.</span></div>
                </div>
              </div>
            </div>

            <div className="pq-footer">
              <button type="button" className="pq-secondary-btn" onClick={() => { setBeneficiary(null); setAmount(""); setReason(""); setCurrentStep(1); }}>
                <ArrowLeft size={16} /> Retour
              </button>
              <button type="button" className="pq-primary-btn" onClick={handleContinue}>Continuer <ChevronRight size={16} /></button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : MONTANT & BONS */}
        {currentStep === 3 && (
          <div className="pq-content">
            <div className="pq-grid-2">
              <div className="pq-card">
                <h3 className="pq-card-title">Récapitulatif du bénéficiaire</h3>
                <div className="pq-beneficiary-summary">
                  <div className="pq-beneficiary-header">
                    <div className="pq-beneficiary-icon"><Store size={20} /></div>
                    <div>
                      <p className="pq-beneficiary-name">{beneficiary?.name}</p>
                      {beneficiary?.verified && <p className="pq-beneficiary-verified">Commerçant vérifié <CheckCircle2 size={12} /></p>}
                    </div>
                  </div>
                  <div className="pq-beneficiary-details">
                    <div className="pq-detail-row"><span className="pq-detail-label">Banque</span><span className="pq-detail-value">{beneficiary?.bank}</span></div>
                    <div className="pq-detail-row"><span className="pq-detail-label">Compte / IBAN</span><span className="pq-detail-value pq-iban">{beneficiary?.rib}</span></div>
                  </div>
                  {beneficiary?.isMerchantPayment && (<div className="pq-detail-row"><span className="pq-detail-label">Demande de paiement</span><span className="pq-detail-value">{beneficiary?.reference}</span></div>)}
                  <button type="button" className="pq-modify-btn" onClick={async () => { await clearScanner(); setBeneficiary(null); setAmount(""); setReason(""); setShowCamera(false); setCurrentStep(1); }}>
                    <QrCode size={14} /> Modifier le bénéficiaire
                  </button>
                </div>
                <div className="pq-instant-hint"><Zap size={14} /><span>Les fonds seront transférés instantanément après confirmation.</span></div>
              </div>

              <div className="pq-card">
                <div className="pq-amount-header">
                  <h3 className="pq-card-title">Saisir le montant</h3>
                  <span className="pq-balance">Solde disponible : <strong>{formatAmount(availableBalance)} MAD</strong></span>
                </div>

                {beneficiary?.isMerchantPayment ? (
                  <>
                    <div className="pq-form-group">
                      <label className="pq-form-label">Montant demandé par le commerçant</label>
                      <div className="pq-amount-input-wrapper">
                        <input type="text" value={formatAmount(beneficiary?.amount)} readOnly className="pq-amount-input" />
                        <span className="pq-currency">MAD</span>
                      </div>
                    </div>
                    <div className="pq-hint"><Info size={14} /><span>Le montant est fixé par le commerçant. Vous pouvez choisir d'utiliser ou non un bon de fidélité disponible.</span></div>
                    {availableRewards.length > 0 && (
                      <div className="pq-form-group">
                        <label className="pq-form-label">Bon de fidélité</label>
                        <select className="pq-form-input" value={selectedReward?.code || ""} onChange={(e) => { const code = e.target.value; if (!code) { setSelectedReward(null); return; } const reward = availableRewards.find((r) => r.code === code); setSelectedReward(reward || null); }}>
                          <option value="">Ne pas utiliser de bon</option>
                          {availableRewards.map((reward) => (<option key={reward.code} value={reward.code}>Bon de {formatAmount(reward.rewardAmount)} MAD - {reward.code}</option>))}
                        </select>
                      </div>
                    )}
                    {selectedReward && (<div className="pq-summary-row"><span className="pq-summary-label">Bon utilisé</span><span className="pq-summary-value pq-free">- {formatAmount(selectedReward.rewardAmount)} MAD</span></div>)}
                    <div className="pq-summary-row"><span className="pq-summary-label">Montant à débiter</span><span className="pq-summary-value pq-summary-value-bold">{formatAmount(amountAfterVoucher)} MAD</span></div>
                  </>
                ) : (
                  <>
                    {selectedReward && (<div className="pq-summary-row"><span className="pq-summary-label">Bon de fidélité</span><span className="pq-summary-value pq-free">- {formatAmount(selectedReward.rewardAmount)} MAD</span></div>)}
                    <div className="pq-form-group">
                      <label className="pq-form-label">Montant</label>
                      <div className="pq-amount-input-wrapper">
                        <input type="text" placeholder="0,00" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))} className="pq-amount-input" />
                        <span className="pq-currency">MAD</span>
                      </div>
                    </div>
                    <div className="pq-quick-amounts">
                      {QUICK_AMOUNTS.map((value) => (<button key={value} type="button" className={`pq-quick-btn ${amount === String(value) ? "active" : ""}`} onClick={() => setAmount(String(value))}>{value} MAD</button>))}
                    </div>
                  </>
                )}

                <div className="pq-form-group">
                  <label className="pq-form-label">Motif (optionnel)</label>
                  <input type="text" placeholder="Ex : Paiement facture, achat, etc." value={reason} onChange={(e) => setReason(e.target.value)} className="pq-form-input" readOnly={beneficiary?.isMerchantPayment} />
                </div>
                {amountAfterVoucher > availableBalance && (<div className="pq-error-hint"><AlertCircle size={14} /> Solde insuffisant</div>)}
              </div>
            </div>
            <div className="pq-footer">
              <button type="button" className="pq-secondary-btn" onClick={() => setCurrentStep(2)}><ArrowLeft size={16} /> Retour</button>
              <button type="button" className="pq-primary-btn" disabled={!isStep3Valid} onClick={handleContinue}>Continuer <ChevronRight size={16} /></button>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : CONFIRMATION */}
        {currentStep === 4 && (
          <div className="pq-content">
            <div className="pq-grid-2">
              <div className="pq-card">
                <h3 className="pq-card-title">Détails du paiement</h3>
                <div className="pq-summary-list">
                  <div className="pq-summary-row"><span className="pq-summary-label">Vous payez à</span><span className="pq-summary-value pq-summary-value-bold">{beneficiary?.name}</span></div>
                  <div className="pq-summary-row"><span className="pq-summary-label">Compte / IBAN</span><span className="pq-summary-value pq-iban">{beneficiary?.rib}</span></div>
                  {beneficiary?.isMerchantPayment && (<div className="pq-summary-row"><span className="pq-summary-label">Référence</span><span className="pq-summary-value">{beneficiary?.reference}</span></div>)}
                  <div className="pq-summary-row"><span className="pq-summary-label">Montant initial</span><span className="pq-summary-value pq-summary-value-bold">{formatAmount(numericAmount)} MAD</span></div>
                  {selectedReward && (<div className="pq-summary-row"><span className="pq-summary-label">Bon de fidélité</span><span className="pq-summary-value pq-free">- {formatAmount(selectedReward.rewardAmount)} MAD</span></div>)}
                  <div className="pq-summary-row"><span className="pq-summary-label">Frais de transaction</span><span className="pq-summary-value pq-free">Gratuit</span></div>
                  <div className="pq-summary-divider" />
                  <div className="pq-summary-row pq-total-row"><span className="pq-summary-label pq-total-label">Total à payer</span><span className="pq-summary-value pq-total-value">{formatAmount(total)} MAD</span></div>
                </div>
              </div>
              <div className="pq-card pq-confirm-card">
                <h3 className="pq-card-title">Confirmer le paiement</h3>
                <div className="pq-security-box"><Shield size={20} /><span>Vos paiements sont sécurisés avec Aswaq Bank.</span></div>
                <div className="pq-lock-illustration"><div className="pq-lock-circle"><Lock size={32} /></div></div>
                <button type="button" className="pq-primary-btn pq-full pq-confirm-btn" onClick={handleConfirmPayment} disabled={isPaying}>
                  <Lock size={16} />{isPaying ? "Paiement en cours..." : "Confirmer le paiement"}
                </button>
                <button type="button" className="pq-cancel-btn" onClick={() => navigate("/dashboard-client")} disabled={isPaying}>Annuler le paiement</button>
              </div>
            </div>
            <div className="pq-final-hint"><Info size={14} /><span>En confirmant, vous acceptez d'effectuer ce paiement. Cette action est irréversible.</span></div>
          </div>
        )}
      </main>
    </div>
  );
}