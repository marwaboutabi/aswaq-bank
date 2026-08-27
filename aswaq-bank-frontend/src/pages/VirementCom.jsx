import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, Boxes, Users, ArrowLeftRight,
  FileText,  LogOut, Bell, ChevronDown,
  Wallet, UserPlus, Building, CheckCircle2, AlertCircle,
  ArrowRight, MoreVertical, Edit2, Shield, ArrowLeft, CreditCard,
  Check, Star,Bot,User
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './VirementCom.css';
import api from "../services/api";

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/acceuil-com' },
  { icon: Package, label: 'Produits', to: '/produits' },
  { icon: ArrowLeftRight, label: 'Paiements & Transactions', to: '/transactions-commerce' },
  { icon: Users, label: 'Fournisseurs', to: '/fournisseurs', active: true },
  { icon: Star, label: 'Fidélité & Tickets', to: '/fidelite-commerce' },
  { icon: Bell, label: 'Notifications', to: '/notifications-com' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant-commerce' },
  { icon: User, label: 'Profil & Paramètres', to: '/parametres-commerce' },
];

const MOTIF_OPTIONS = [
  'Paiement fournisseur',
  'Achat de matériel',
  'Loyer',
  'Remboursement',
  'Paiement de salaire',
  'Autre'
];

const BANK_OPTIONS = [
  'Attijariwafa Bank',
  'Bank of Africa',
  'BMCE Bank',
  'CIH Bank',
  'Crédit Agricole',
  'Société Générale',
  'Banque Populaire',
  'CFG Bank',
  'Autre'
];

export default function VirementCom() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [beneficiaryType, setBeneficiaryType] = useState('saved');
  const [recentTransfers, setRecentTransfers] = useState([]);

  useEffect(() => {
    loadBeneficiaries();
    loadAccounts();
    loadRecentTransfers();
  }, []);

  const loadRecentTransfers = async () => {
    try {
      const response = await api.get("/transactions/my");
      console.log("Transactions :", response.data);

      const data = response.data
        .filter(tx => tx.type === "TRANSFER")
        .map(tx => {
          // FIX 4 : sécurisation du split sur transactionDate
          const [datePart, timePart] = (tx.transactionDate || "").split("T");
          return {
            id: tx.id,
           beneficiary: tx.otherUserName,

initials: tx.otherUserName
  ? tx.otherUserName
      .split(" ")
      .map(n => n.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase()
  : "",

account: tx.otherAccountNumber,
            bank: "ASWAQ BANK",
            amount: tx.incoming ? Number(tx.amount) : -Number(tx.amount),

status: tx.incoming
    ? "Paiement reçu"
    : "Paiement envoyé",

badgeClass: tx.incoming
    ? "vir-status-success"
    : "vir-status-danger",
            reference: tx.transactionReference,
            date: datePart || "",
            time: timePart ? timePart.substring(0, 5) : ""
          };
        });

      setRecentTransfers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  // NOUVEAU : état de chargement des comptes, pour ne plus afficher un select vide/cassé
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState('');

  const loadBeneficiaries = async () => {
    try {
      const res = await api.get("/beneficiaries");
      setBeneficiaries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAccounts = async () => {
  try {
    setAccountsLoading(true);
    setAccountsError('');

const res = await api.get("/accounts/me");
    console.log("Réponse comptes :", res.data);

    const accountsData = Array.isArray(res.data)
      ? res.data
      : [res.data];

    setAccounts(accountsData);

    if (accountsData.length > 0) {
      setSelectedAccount(prev => prev || accountsData[0].accountNumber);
    }

  } catch (err) {
    console.error(err);
    setAccountsError("Impossible de charger vos comptes.");
    setAccounts([]);
  } finally {
    setAccountsLoading(false);
  }
};

  const [selectedBeneficiary, setSelectedBeneficiary] = useState('');
  const [amount, setAmount] = useState('');
  const [motif, setMotif] = useState('');
const [pin, setPin] = useState("");
const [pinError, setPinError] = useState("");
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: '',
    type: 'Fournisseur',
    bank: 'ASWAQ BANK', // les bénéficiaires sont toujours des comptes internes Aswaq Bank
    account: ''
  });

  // vérification du compte bénéficiaire par RIB (titulaire + solde)
  const [accountLookup, setAccountLookup] = useState(null); // { balance, holderName }
  const [lookupError, setLookupError] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);

  const [transferConfirmed, setTransferConfirmed] = useState(false);
  const [transferReference, setTransferReference] = useState('');

  const selectedBeneficiaryData = beneficiaries.find(b => b.id === parseInt(selectedBeneficiary));

  // FIX 3 : compte courant réel (au lieu du texte codé en dur)
  const currentAccount = accounts.find(a => a.accountNumber === selectedAccount);

  // Recherche automatique du compte dès que le RIB fait 24 chiffres
  useEffect(() => {
    const lookupAccount = async () => {
      if (newBeneficiary.account.length !== 24) {
        setAccountLookup(null);
        setLookupError('');
        return;
      }
      setLookupLoading(true);
      setLookupError('');
      try {
        // ⚠️ endpoint à confirmer côté backend
        const res = await api.get(`/bank-accounts/lookup/${newBeneficiary.account}`);
        const holderName = `${res.data.user?.firstName || ''} ${res.data.user?.lastName || ''}`.trim();
        setAccountLookup({ balance: res.data.balance, holderName });
      } catch (err) {
        console.error(err);
        setAccountLookup(null);
        setLookupError("Aucun compte Aswaq Bank trouvé pour ce RIB.");
      } finally {
        setLookupLoading(false);
      }
    };

    lookupAccount();
  }, [newBeneficiary.account]);

  // FIX 1 : persistance backend du nouveau bénéficiaire
  const handleAddBeneficiary = async () => {
    if (!newBeneficiary.name || newBeneficiary.account.length < 24 || !accountLookup) {
      return;
    }

    try {
      const res = await api.post("/beneficiaries", {
        name: newBeneficiary.name,
        type: newBeneficiary.type,
        bank: 'ASWAQ BANK',
rib: newBeneficiary.account      });

      setBeneficiaries([...beneficiaries, res.data]);
      setSelectedBeneficiary(res.data.id.toString());
      setBeneficiaryType('saved');
      setNewBeneficiary({ name: '', type: 'Fournisseur', bank: 'ASWAQ BANK', account: '' });
      setAccountLookup(null);
    } catch (err) {
      console.error(err);
      alert(JSON.stringify(err.response?.data));
    }
  };

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleConfirm = async () => {

  if(pin.length !== 4){
    setPinError("Veuillez saisir un PIN de 4 chiffres.");
    return;
  }

  setPinError("");

  try {
      // FIX 2 : conversion virgule -> point avant envoi au backend
      const normalizedAmount = Number(String(amount).replace(',', '.'));

      const response = await api.post("/transactions/transfer", {
        senderAccountNumber: selectedAccount,
        beneficiaryId: Number(selectedBeneficiary),
        amount: normalizedAmount,
        description: motif,
        pin: pin
      });

      setTransferReference(response.data.transactionReference);
      setTransferConfirmed(true);
      loadRecentTransfers();
      loadAccounts(); // pour rafraîchir le solde affiché après le virement
    } catch (err) {
      console.log(err);
      console.log(err.response);
      console.log(err.response?.data);
      alert(JSON.stringify(err.response?.data));
    }
  };

  const handleNewTransfer = () => {
    setCurrentStep(1);
    setSelectedBeneficiary('');
    setAmount('');
    setMotif('');
    setTransferConfirmed(false);
    setTransferReference('');
  };

  const formatAmount = (val) => {
    // FIX 2 (bis) : formatage cohérent même si la virgule est utilisée
    const normalized = String(val || 0).replace(',', '.');
    return parseFloat(normalized || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // NOUVEAU : RIB lisible par blocs de 4 chiffres, sans toucher à la valeur réelle
  const formatRib = (rib) => (rib ? rib.replace(/(.{4})/g, '$1 ').trim() : '');

  // ÉTAPE 1 : Formulaire
  const renderStep1 = () => (
    <div className="vir-grid">
      <div className="vir-form-column">
        <div className="vir-card">
          <div className="vir-card-header-with-back">
            <h2 className="vir-card-title">1. Informations du virement</h2>
            <button
              type="button"
              className="vir-back-btn"
              onClick={handleBack}
            >
              <ArrowLeft size={18} />
              Retour
            </button>
          </div>

          <div className="vir-form-group">
            <label className="vir-label">Compte à débiter *</label>
            <div className="vir-account-select">
              <div className="vir-account-info" style={{ flex: 1, minWidth: 0 }}>
                <Wallet size={18} className="vir-account-icon" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  {accountsLoading ? (
                    <span className="vir-select">
                      Chargement des comptes...
                    </span>
                  ) : accountsError ? (
                    <span className="vir-select">
                      {accountsError}
                    </span>
                  ) : accounts.length === 0 ? (
                    <span className="vir-select">
                      Aucun compte disponible
                    </span>
                  ) : (
                    <select
                      className="vir-select"
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                    >
                      {accounts.map(account => (
                        <option
                          key={account.id}
                          value={account.accountNumber}
                        >
                          {formatRib(account.accountNumber)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="vir-account-balance">
                <span className="vir-balance-label">Solde disponible</span>
                <span className="vir-balance-amount">
                  {accountsLoading
                    ? '...'
                    : currentAccount
                      ? `${formatAmount(currentAccount.balance)} MAD`
                      : '-'}
                </span>
              </div>
              {/* La flèche est déjà intégrée dans .vir-select (background-image en CSS) :
                  on ne l'affiche donc plus ici pour éviter le doublon visible dans la capture. */}
            </div>
          </div>

          <div className="vir-form-group">
            <label className="vir-label">Bénéficiaire *</label>

            <div className="vir-beneficiary-tabs">
              <button
                type="button"
                className={`vir-tab ${beneficiaryType === 'saved' ? 'active' : ''}`}
                onClick={() => setBeneficiaryType('saved')}
              >
                <Wallet size={16} />
                Enregistré
              </button>
              <button
                type="button"
                className={`vir-tab ${beneficiaryType === 'new' ? 'active' : ''}`}
                onClick={() => setBeneficiaryType('new')}
              >
                <UserPlus size={16} />
                Nouveau
              </button>
            </div>

            {beneficiaryType === 'saved' && (
              <div className="vir-select-wrapper">
                <select
                  value={selectedBeneficiary}
                  onChange={(e) => setSelectedBeneficiary(e.target.value)}
                  className="vir-select"
                >
                  <option value="">Sélectionner un bénéficiaire</option>
                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} - {b.bank} ({b.type})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {beneficiaryType === 'new' && (
              <div className="vir-new-beneficiary-form">
                <div className="vir-new-form-header">
                  <UserPlus size={20} />
                  <span>Ajouter un nouveau bénéficiaire</span>
                </div>

                <div className="vir-new-form-row">
                  <div className="vir-form-group vir-form-group-half">
                    <label className="vir-label">Nom du bénéficiaire *</label>
                    <input
                      type="text"
                      value={newBeneficiary.name}
                      onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
                      className="vir-input"
                      placeholder="Ex: Société ElectroMax"
                    />
                  </div>

                  <div className="vir-form-group vir-form-group-half">
                    <label className="vir-label">Type de bénéficiaire *</label>
                    <select
                      value={newBeneficiary.type}
                      onChange={(e) => setNewBeneficiary({ ...newBeneficiary, type: e.target.value })}
                      className="vir-select"
                    >
                      <option value="Fournisseur">Fournisseur</option>
                      <option value="Client">Client</option>
                      <option value="Facture">Facture</option>
                      <option value="Partenaire">Partenaire</option>
                      <option value="Salarié">Salarié</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="vir-form-group">
                  <label className="vir-label">Banque</label>
                  <div className="vir-input" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', cursor: 'not-allowed' }}>
                    <Building size={16} />
                    ASWAQ BANK
                  </div>
                </div>

                <div className="vir-form-group">
                  <label className="vir-label">Numéro de compte (RIB) *</label>
                  <input
                    type="text"
                    value={newBeneficiary.account}
                    onChange={(e) => setNewBeneficiary({
                      ...newBeneficiary,
                      account: e.target.value.replace(/[^0-9]/g, '').slice(0, 24)
                    })}
                    className="vir-input"
                    placeholder="Saisir les 24 chiffres du RIB"
                    maxLength={24}
                  />
                  <div className="vir-input-helper">
                    <span className={newBeneficiary.account.length === 24 ? 'valid' : ''}>
                      {newBeneficiary.account.length}/24 chiffres
                    </span>
                    {newBeneficiary.account.length === 24 && !lookupLoading && accountLookup && (
                      <CheckCircle2 size={14} className="vir-helper-icon" />
                    )}
                  </div>

                  {lookupLoading && (
                    <p className="vir-info-text" style={{ marginTop: 6 }}>Vérification du compte...</p>
                  )}

                  {lookupError && (
                    <div className="vir-info-box vir-info-box-warning" style={{ marginTop: 8 }}>
                      <AlertCircle size={16} className="vir-info-icon" />
                      <p className="vir-info-text">{lookupError}</p>
                    </div>
                  )}

                  {accountLookup && (
                    <div className="vir-info-box" style={{ marginTop: 8 }}>
                      <CheckCircle2 size={16} className="vir-info-icon" />
                      <div className="vir-info-content">
                        <p className="vir-info-text"><strong>{accountLookup.holderName}</strong></p>
                        <p className="vir-info-text">Solde disponible : {formatAmount(accountLookup.balance)} MAD</p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="vir-btn-primary vir-btn-add"
                  onClick={handleAddBeneficiary}
                  disabled={!newBeneficiary.name || newBeneficiary.account.length < 24 || !accountLookup}
                >
                  <Check size={18} />
                  Enregistrer le bénéficiaire
                </button>
              </div>
            )}
          </div>

          <div className="vir-form-group">
            <label className="vir-label">Montant *</label>
            <div className="vir-amount-wrapper">
              <input
                type="text"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ''))}
                className="vir-input vir-amount-input"
              />
              <span className="vir-currency">MAD</span>
            </div>
          </div>

          <div className="vir-form-group">
            <label className="vir-label">Motif du virement *</label>
            <div className="vir-select-wrapper">
              <select
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                className="vir-select"
              >
                <option value="">Sélectionner un motif</option>
                {MOTIF_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            className="vir-btn-primary vir-btn-full"
            onClick={handleContinue}
            disabled={!selectedBeneficiary || !amount || !motif}
          >
            Continuer <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="vir-summary-column">
        <div className="vir-card vir-summary-card">
          <h2 className="vir-card-title">Résumé du virement</h2>

          <div className="vir-summary-row">
            <div className="vir-summary-label">
              <Wallet size={16} />
              Compte à débiter
            </div>
            <div className="vir-summary-value">
              <p className="vir-summary-value-main">{currentAccount?.accountNumber || '-'}</p>
            </div>
          </div>

          <div className="vir-summary-row">
            <div className="vir-summary-label">
              <UserPlus size={16} />
              Bénéficiaire
            </div>
            <div className="vir-summary-value">
              <p className="vir-summary-value-main">
                {selectedBeneficiaryData ? selectedBeneficiaryData.name : '-'}
              </p>
              {selectedBeneficiaryData && (
                <p className="vir-summary-value-sub">{selectedBeneficiaryData.bank} - {selectedBeneficiaryData.type}</p>
              )}
            </div>
          </div>

          <div className="vir-summary-row">
            <div className="vir-summary-label">
              <Wallet size={16} />
              Montant
            </div>
            <div className="vir-summary-value">
              <p className="vir-summary-value-main">
                {amount ? `${formatAmount(amount)} MAD` : '-'}
              </p>
            </div>
          </div>

          <div className="vir-summary-row">
            <div className="vir-summary-label">
              <FileText size={16} />
              Motif
            </div>
            <div className="vir-summary-value">
              <p className="vir-summary-value-main">
                {motif || '-'}
              </p>
            </div>
          </div>

          <div className="vir-summary-row">
            <div className="vir-summary-label">
              <CheckCircle2 size={16} />
              Frais
            </div>
            <div className="vir-summary-value vir-summary-value-green">
              <p className="vir-summary-value-main">0,00 MAD</p>
            </div>
          </div>

          <div className="vir-summary-divider" />

          <div className="vir-summary-row vir-summary-total">
            <div className="vir-summary-label">Total à débiter</div>
            <div className="vir-summary-value vir-summary-value-blue">
              <p className="vir-summary-value-main">
                {amount ? `${formatAmount(amount)} MAD` : '0,00 MAD'}
              </p>
            </div>
          </div>

          <div className="vir-info-box">
            <AlertCircle size={16} className="vir-info-icon" />
            <p className="vir-info-text">
              Les virements sont généralement traités instantanément ou sous 24h selon la banque du bénéficiaire.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // ÉTAPE 2 : Vérification
  const renderStep2 = () => (
    <div className="vir-verify-container">
      <div className="vir-verify-main">
        <div className="vir-card">
          <div className="vir-card-header-with-back">
            <h2 className="vir-card-title">2. Vérification des informations</h2>
            <button
              type="button"
              className="vir-back-btn"
              onClick={handleBack}
            >
              <ArrowLeft size={18} />
              Retour
            </button>
          </div>
          <p className="vir-verify-subtitle">
            Veuillez vérifier les informations ci-dessous avant de continuer.
          </p>

          <div className="vir-verify-list">
            <div className="vir-verify-item">
              <div className="vir-verify-icon">
                <Wallet size={20} />
              </div>
              <div className="vir-verify-content">
                <span className="vir-verify-label">Compte à débiter</span>
                <div className="vir-verify-value">
                  <p className="vir-verify-value-main">{currentAccount?.accountNumber || '-'}</p>
                </div>
              </div>
              <button
                className="vir-edit-btn"
                onClick={() => setCurrentStep(1)}
              >
                <Edit2 size={14} />
                Modifier
              </button>
            </div>

            <div className="vir-verify-item">
              <div className="vir-verify-icon">
                <UserPlus size={20} />
              </div>
              <div className="vir-verify-content">
                <span className="vir-verify-label">Bénéficiaire</span>
                <div className="vir-verify-value">
                  <p className="vir-verify-value-main">{selectedBeneficiaryData?.name}</p>
                  <p className="vir-verify-value-sub">{selectedBeneficiaryData?.account}</p>
                </div>
              </div>
              <button
                className="vir-edit-btn"
                onClick={() => setCurrentStep(1)}
              >
                <Edit2 size={14} />
                Modifier
              </button>
            </div>

            <div className="vir-verify-item">
              <div className="vir-verify-icon">
                <Building size={20} />
              </div>
              <div className="vir-verify-content">
                <span className="vir-verify-label">Banque du bénéficiaire</span>
                <div className="vir-verify-value">
                  <p className="vir-verify-value-main">{selectedBeneficiaryData?.bank}</p>
                </div>
              </div>
              <button
                className="vir-edit-btn"
                onClick={() => setCurrentStep(1)}
              >
                <Edit2 size={14} />
                Modifier
              </button>
            </div>

            <div className="vir-verify-item">
              <div className="vir-verify-icon">
                <CreditCard size={20} />
              </div>
              <div className="vir-verify-content">
                <span className="vir-verify-label">Montant</span>
                <div className="vir-verify-value">
                  <p className="vir-verify-value-main">{formatAmount(amount)} MAD</p>
                </div>
              </div>
              <button
                className="vir-edit-btn"
                onClick={() => setCurrentStep(1)}
              >
                <Edit2 size={14} />
                Modifier
              </button>
            </div>

            <div className="vir-verify-item">
              <div className="vir-verify-icon">
                <FileText size={20} />
              </div>
              <div className="vir-verify-content">
                <span className="vir-verify-label">Motif du virement</span>
                <div className="vir-verify-value">
                  <p className="vir-verify-value-main">{motif}</p>
                </div>
              </div>
              <button
                className="vir-edit-btn"
                onClick={() => setCurrentStep(1)}
              >
                <Edit2 size={14} />
                Modifier
              </button>
            </div>
          </div>

          <div className="vir-info-box vir-info-box-warning">
            <AlertCircle size={16} className="vir-info-icon" />
            <div className="vir-info-content">
              <p className="vir-info-text">
                En confirmant, vous acceptez que ce virement soit exécuté immédiatement.
                Cette action est irréversible.
              </p>
            </div>
          </div>

          <div className="vir-verify-actions">
            <button
              className="vir-btn-secondary"
              onClick={handleBack}
            >
              <ArrowLeft size={18} />
              Retour
            </button>
            <button
              className="vir-btn-primary vir-btn-confirm"
              onClick={handleContinue}
            >
              <Shield size={18} />
              Confirmer le virement
            </button>
          </div>
        </div>
      </div>

      <div className="vir-summary-sidebar">
        <div className="vir-card vir-summary-card">
          <h2 className="vir-card-title">Résumé du virement</h2>

          <div className="vir-summary-row">
            <div className="vir-summary-label">
              <Wallet size={16} />
              Compte à débiter
            </div>
            <div className="vir-summary-value">
              <p className="vir-summary-value-main">{currentAccount?.accountNumber || '-'}</p>
            </div>
          </div>

          <div className="vir-summary-row">
            <div className="vir-summary-label">
              <UserPlus size={16} />
              Bénéficiaire
            </div>
            <div className="vir-summary-value">
              <p className="vir-summary-value-main">{selectedBeneficiaryData?.name}</p>
            </div>
          </div>

          <div className="vir-summary-row">
            <div className="vir-summary-label">
              <CreditCard size={16} />
              Compte bénéficiaire
            </div>
            <div className="vir-summary-value">
              <p className="vir-summary-value-sub">{selectedBeneficiaryData?.account}</p>
            </div>
          </div>

          <div className="vir-summary-row">
            <div className="vir-summary-label">
              <Building size={16} />
              Banque bénéficiaire
            </div>
            <div className="vir-summary-value">
              <p className="vir-summary-value-main">{selectedBeneficiaryData?.bank}</p>
            </div>
          </div>

          <div className="vir-summary-row">
            <div className="vir-summary-label">
              <CreditCard size={16} />
              Montant
            </div>
            <div className="vir-summary-value vir-summary-value-red">
              <p className="vir-summary-value-main">- {formatAmount(amount)} MAD</p>
            </div>
          </div>

          <div className="vir-summary-row">
            <div className="vir-summary-label">
              <Wallet size={16} />
              Frais
            </div>
            <div className="vir-summary-value">
              <p className="vir-summary-value-main">0,00 MAD</p>
            </div>
          </div>

          <div className="vir-summary-divider" />

          <div className="vir-summary-row vir-summary-total">
            <div className="vir-summary-label">Total à débiter</div>
            <div className="vir-summary-value vir-summary-value-red">
              <p className="vir-summary-value-main">
                {formatAmount(amount)} MAD
              </p>
            </div>
          </div>

          <div className="vir-security-box">
            <div className="vir-security-icon">
              <Shield size={24} />
            </div>
            <div className="vir-security-content">
              <h3 className="vir-security-title">Vos transactions sont sécurisées</h3>
              <p className="vir-security-text">
                Vos virements sont protégés par un cryptage avancé et soumis à une authentification forte.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ÉTAPE 3 : Confirmation
  const renderStep3 = () => (
    <div className="vir-confirm-container">
      <div className="vir-confirm-card">
        {transferConfirmed ? (
          <div className="vir-success-content">
            <div className="vir-success-icon">
              <CheckCircle2 size={64} />
            </div>
            <h2 className="vir-success-title">Virement effectué avec succès !</h2>
            <p className="vir-success-subtitle">
              Votre virement a été traité avec succès et sera exécuté sous 24h.
            </p>

            <div className="vir-success-details">
              <div className="vir-success-row">
                <span className="vir-success-label">Référence du virement</span>
                <span className="vir-success-value">{transferReference}</span>
              </div>
              <div className="vir-success-row">
                <span className="vir-success-label">Bénéficiaire</span>
                <span className="vir-success-value">{selectedBeneficiaryData?.name}</span>
              </div>
              <div className="vir-success-row">
                <span className="vir-success-label">Montant débité</span>
                <span className="vir-success-value vir-amount-red">{formatAmount(amount)} MAD</span>
              </div>
              <div className="vir-success-row">
                <span className="vir-success-label">Date d'exécution</span>
                <span className="vir-success-value">{new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            <div className="vir-success-actions">
              <button
                className="vir-btn-primary"
                onClick={handleNewTransfer}
              >
                Effectuer un autre virement
              </button>
              <Link to="/transactions-commerce" className="vir-btn-secondary">
                Voir mes transactions
              </Link>
            </div>
          </div>
        ) : (
          <div className="vir-confirm-content">
            <div className="vir-card-header-with-back">
              <h2 className="vir-card-title">3. Confirmation du virement</h2>
              <button
                type="button"
                className="vir-back-btn"
                onClick={handleBack}
              >
                <ArrowLeft size={18} />
                Retour
              </button>
            </div>
            <p className="vir-confirm-subtitle">
              Dernière étape avant l'exécution de votre virement
            </p>
<div className="vir-form-group">

<label className="vir-label">
  Code PIN de sécurité *
</label>

<input
  type="password"
  maxLength="4"
  value={pin}
  onChange={(e)=> {
    const value = e.target.value.replace(/\D/g,'');
    setPin(value);
    setPinError("");
  }}
  className="vir-input"
  placeholder="••••"
/>

<p className="vir-input-helper">
  Saisissez votre PIN à 4 chiffres pour confirmer le paiement.
</p>

{pinError && (
  <div className="vir-info-box vir-info-box-warning">
    <AlertCircle size={16}/>
    <p className="vir-info-text">
      {pinError}
    </p>
  </div>
)}

</div>
            <div className="vir-confirm-info">
              <div className="vir-confirm-icon">
                <Shield size={40} />
              </div>
              <p className="vir-confirm-text">
                Vous êtes sur le point d'effectuer un virement de <strong>{formatAmount(amount)} MAD</strong> vers <strong>{selectedBeneficiaryData?.name}</strong>.
              </p>
            </div>

            <div className="vir-confirm-warning">
              <AlertCircle size={20} />
              <p>Cette action est irréversible. Une fois confirmé, le virement sera exécuté immédiatement.</p>
            </div>

            <div className="vir-verify-actions">
              <button
                className="vir-btn-secondary"
                onClick={handleBack}
              >
                <ArrowLeft size={18} />
                Retour
              </button>
              <button
 className="vir-btn-primary vir-btn-confirm"
 onClick={handleConfirm}
 disabled={pin.length !== 4}
>
                <Check size={18} />
                Confirmer et exécuter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="vir-layout">
      <aside className="vir-sidebar">
        <div className="vir-sidebar-logo">
          <Logo size={100} className="mb-6 logo-white" />
        </div>

        <nav className="vir-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                state={location.state}
                className={`vir-nav-item ${isActive ? 'vir-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a href="/" className="vir-logout">
          <LogOut size={18} />
          Déconnexion
        </a>
      </aside>

      <main className="vir-main">
        <header className="vir-header">
          <div>
            <h1 className="vir-title">Effectuer un virement</h1>
            <p className="vir-subtitle">Transférez de l'argent en toute sécurité</p>
          </div>

          <div className="vir-header-actions">
            <button type="button" className="vir-icon-button">
              <Bell size={18} />
              <span className="vir-badge">3</span>
            </button>
            <div className="vir-user-chip">
              <div className="vir-user-avatar">MB</div>
              <div className="vir-user-info">
                <span className="vir-user-name">Marwa Boutabi</span>
                <span className="vir-user-role">Commerçant</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <div className="vir-stepper">
          <div className={`vir-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="vir-step-circle">
              {currentStep > 1 ? <CheckCircle2 size={16} /> : '1'}
            </div>
            <span className="vir-step-label">Informations</span>
          </div>
          <div className={`vir-step-line ${currentStep >= 2 ? 'active' : ''}`} />
          <div className={`vir-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="vir-step-circle">
              {currentStep > 2 ? <CheckCircle2 size={16} /> : '2'}
            </div>
            <span className="vir-step-label">Vérification</span>
          </div>
          <div className={`vir-step-line ${currentStep >= 3 ? 'active' : ''}`} />
          <div className={`vir-step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="vir-step-circle">3</div>
            <span className="vir-step-label">Confirmation</span>
          </div>
        </div>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {currentStep < 3 && (
          <div className="vir-panel">
            <div className="vir-panel-header">
              <h2 className="vir-panel-title">Virements récents</h2>
              <button type="button" className="vir-link-btn">
                Voir tout <ArrowRight size={16} />
              </button>
            </div>

            <div className="vir-table-wrapper">
              <table className="vir-table">
                <thead>
                  <tr>
                    <th>Date & heure</th>
                    <th>Bénéficiaire</th>
                    <th>Compte bénéficiaire</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Référence</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransfers.map((transfer) => (
                    <tr key={transfer.id}>
                      <td>
                        <p className="vir-table-date">{transfer.date} - {transfer.time}</p>
                      </td>
                      <td>
                        <div className="vir-beneficiary-cell">
                          
                          <div>
                            <p className="vir-beneficiary-name">{transfer.beneficiary}</p>
                            <p className="vir-beneficiary-type">{transfer.beneficiaryType}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="vir-account-cell">{transfer.account}</p>
                        <p className="vir-bank-cell">{transfer.bank}</p>
                      </td>
<td
  className={
    transfer.amount >= 0
      ? "vir-amount-positive"
      : "vir-amount-negative"
  }
>
  {transfer.amount > 0 ? "+" : ""}
  {transfer.amount.toLocaleString("fr-FR")} MAD
</td>                      <td>
  <span className={`vir-status-badge ${transfer.badgeClass}`}>
    <CheckCircle2 size={12} />
    {transfer.status}
  </span>
</td>
                      <td className="vir-reference">{transfer.reference}</td>
                      <td>
                        <button className="vir-table-action">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}