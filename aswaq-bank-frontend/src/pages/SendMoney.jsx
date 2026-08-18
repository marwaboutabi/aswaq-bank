import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, Bell, Send,
  User, Shield, Wallet, FileText, Lock, Check, CheckCircle2,
  UserPlus, Filter, ChevronRight, X, AlertCircle, Edit2,
  MoreVertical, Trash2, AlertTriangle, Loader2,
  // Icônes du menu client
  Home, CreditCard, ArrowLeftRight, Receipt, Star, PiggyBank, PieChart, Bot
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './SendMoney.css';
import api from "../services/api";
import UserHeader from '../components/UserHeader/UserHeader';
import NotificationBell from '../components/NotificationBell/NotificationBell';

// ===== MENU ESPACE CLIENT =====
const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/dashboard-client' },
  { icon: CreditCard, label: 'Gestion du compte', to: '/mon-compte' },
  { icon: ArrowLeftRight, label: 'Historique des transactions', to: '/transactions-client' },
  { icon: Receipt, label: 'Tickets numériques', to: '/tickets-client' },
  { icon: Star, label: 'Points de fidélité', to: '/fidelite' },
  { icon: PiggyBank, label: "Objectifs d'épargne", to: '/epargne' },
  { icon: PieChart, label: 'Suivi des dépenses', to: '/depenses' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant' },
  { icon: User, label: 'Profil et paramètres', to: '/parametres' },
];

const MAIN_STEPS = [
  { icon: User, label: 'Bénéficiaire' },
  { icon: Shield, label: 'Vérification' },
  { icon: Wallet, label: 'Montant' },
  { icon: FileText, label: 'Récapitulatif' },
  { icon: Lock, label: 'Authentification' },
  { icon: Check, label: 'Confirmation' },
];

const ADD_BENEFICIARY_STEPS = [
  { label: 'Informations' },
  { label: 'Vérification' },
  { label: 'Confirmation' },
];

const getEmptyForm = () => ({
  name: '', type: 'particulier', country: 'Maroc', bank: 'Aswaq Bank', rib: '', accountNumber: '', alias: '', phone: ''
});

/**
 * Masque un RIB pour ne jamais l'afficher en clair dans l'interface.
 * Ex: "011780000000123456789" -> "**** **** **** 6789"
 */
function maskRIB(rib) {
  if (!rib) return '';
  const digitsOnly = String(rib).replace(/\D/g, '');
  const last4 = digitsOnly.slice(-4);
  return `**** **** **** ${last4}`;
}
function BeneficiaryForm({ formData, onChange, disabled }) {
  return (
    <div className="beneficiary-form">

      <div className="form-group">
        <label>Nom complet</label>
        <input
          type="text"
          value={formData.name}
          disabled={disabled}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Nom du bénéficiaire"
        />
      </div>

      <div className="form-group">
        <label>Banque</label>
        <input
          type="text"
          value={formData.bank}
          disabled={disabled}
          onChange={(e) => onChange("bank", e.target.value)}
          placeholder="Nom de la banque"
        />
      </div>

      <div className="form-group">
        <label>RIB</label>
        <input
          type="text"
          value={formData.rib}
          disabled={disabled}
          maxLength={24}
          onChange={(e) => onChange("rib", e.target.value)}
          placeholder="24 chiffres"
        />
      </div>

      <div className="form-group">
        <label>Téléphone</label>
        <input
          type="text"
          value={formData.phone}
          disabled={disabled}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="Téléphone"
        />
      </div>

    </div>
  );
}
export default function SendMoney() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // États de chargement / erreurs
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // États pour les modals
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [editingBeneficiary, setEditingBeneficiary] = useState(null);
  const [deletingBeneficiary, setDeletingBeneficiary] = useState(null);

  const [formData, setFormData] = useState(getEmptyForm);
const isFormValid =
  formData.name.trim() !== "" &&
  formData.bank.trim() !== "" &&
  /^\d{24}$/.test(formData.rib);

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  // Fait disparaître le message d'erreur automatiquement après quelques secondes
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(''), 5000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const showError = (fallbackMessage, error) => {
    const backendMessage = error?.response?.data?.message;
    setErrorMessage(backendMessage || fallbackMessage);
    console.error(error);
  };

  // ===== CHARGEMENT =====
  const loadBeneficiaries = async () => {
    setIsLoadingList(true);
    try {
      const response = await api.get("/beneficiaries");

      const data = response.data.map((b) => ({
        ...b,
        account: maskRIB(b.rib),
        initial: b.name.charAt(0).toUpperCase(),
        color: "#eef3fc",
        textColor: "#1d4fd8",
      }));

      setBeneficiaries(data);
    } catch (error) {
      showError("Impossible de charger la liste des bénéficiaires.", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  const filtered = beneficiaries.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase()) || b.bank.toLowerCase().includes(query.toLowerCase())
  );

const isValidRIB = (rib) => /^\d{24}$/.test(rib);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(getEmptyForm());
    setAddStep(1);
  };

  // ===== AJOUT =====
  const addBeneficiary = async (payload) => {
    setIsSubmitting(true);
    try {
      await api.post("/beneficiaries", payload);
      await loadBeneficiaries();
      setAddStep(3);
    } catch (error) {
      showError("L'ajout du bénéficiaire a échoué. Veuillez réessayer.", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBeneficiary = () => {
    if (formData.rib.length !== 24) {
      setErrorMessage('Le RIB doit contenir exactement 24 chiffres.');
      return;
    }
    addBeneficiary(formData);
  };

  // ===== MODIFICATION =====
  const openEditModal = (beneficiary) => {
    setEditingBeneficiary(beneficiary);
    // On ne charge que les champs nécessaires au formulaire ; le RIB existant est conservé tel quel
    setFormData({
      name: beneficiary.name,
      type: beneficiary.type,
      country: beneficiary.country,
      bank: beneficiary.bank,
      rib: beneficiary.rib,
      accountNumber: '',
      alias: beneficiary.alias || '',
      phone: beneficiary.phone || '',
    });
    setIsEditing(true);
    setActiveMenuId(null);
  };

  const updateBeneficiary = async (id, payload) => {
    setIsSubmitting(true);
    try {
      await api.put(`/beneficiaries/${id}`, payload);
      await loadBeneficiaries();
      setIsEditing(false);
      resetForm();
      setEditingBeneficiary(null);
    } catch (error) {
      showError("La modification du bénéficiaire a échoué. Veuillez réessayer.", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = () => {
    if (!editingBeneficiary) return;
    if (formData.rib.length !== 24) {
      setErrorMessage('Le RIB doit contenir exactement 24 chiffres.');
      return;
    }
    updateBeneficiary(editingBeneficiary.id, formData);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    resetForm();
    setEditingBeneficiary(null);
  };

  // ===== SUPPRESSION =====
  const openDeleteModal = (beneficiary) => {
    setDeletingBeneficiary(beneficiary);
    setIsDeleting(true);
    setActiveMenuId(null);
  };

  const deleteBeneficiary = async (id) => {
    setIsSubmitting(true);
    try {
      await api.delete(`/beneficiaries/${id}`);
      await loadBeneficiaries();
      // Si le bénéficiaire supprimé était sélectionné, on réinitialise la sélection
      setSelectedId((current) => (current === id ? null : current));
      setIsDeleting(false);
      setDeletingBeneficiary(null);
    } catch (error) {
      showError("La suppression du bénéficiaire a échoué. Veuillez réessayer.", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBeneficiary = () => {
    if (!deletingBeneficiary) return;
    deleteBeneficiary(deletingBeneficiary.id);
  };

  const closeAddModal = () => {
    setIsAdding(false);
    resetForm();
  };

  // ===== NAVIGATION VERS L'ÉTAPE SUIVANTE =====
  const handleContinue = () => {
    const selectedBeneficiary = beneficiaries.find((b) => b.id === selectedId);
    if (!selectedBeneficiary) return;

    // On ne transmet que les données nécessaires à l'écran suivant, jamais le RIB en clair
    const safeBeneficiary = {
      id: selectedBeneficiary.id,
      name: selectedBeneficiary.name,
      bank: selectedBeneficiary.bank,
      ribMasked: maskRIB(selectedBeneficiary.rib),
    };

    navigate('/envoyer-argent/verification', {
      state: { beneficiary: safeBeneficiary }
    });
  };

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="acc-sidebar-logo"><Logo size={100} className="mb-6" logo-white /></div>

        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                state={location.state}
                className={`dash-nav-item ${item.active ? 'dash-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a href="/" className="dash-logout">
          <span>Déconnexion</span>
        </a>
      </aside>

      {/* Main */}
      <main className="dash-main send-money-main">
        <header className="sm-topbar">
          <button type="button" className="sm-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Retour
          </button>
          <div className="sm-topbar-actions">
            <div className="dash-search"><Search size={16} /><input type="text" placeholder="Rechercher..." /></div>
<NotificationBell />            <UserHeader />
          </div>
        </header>

        {errorMessage && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
              borderRadius: 10,
              padding: '10px 14px',
              margin: '0 0 16px 0',
              fontSize: 14,
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="sm-page-header">
          <div className="sm-page-icon"><Send size={22} /></div>
          <div>
            <h1 className="sm-page-title">Envoyer de l'argent</h1>
            <p className="sm-page-subtitle">Choisissez un bénéficiaire pour effectuer un virement sécurisé</p>
          </div>
        </div>

        <section className="sm-stepper-card">
          <h2 className="sm-stepper-title"><span>Étape 1 sur 6 :</span> Choix du bénéficiaire</h2>
          <div className="sm-stepper">
            {MAIN_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="sm-step">
                  {idx > 0 && <div className="sm-step-line" />}
                  <div className={`sm-step-circle ${idx === 0 ? 'sm-step-active' : ''}`}>
                    <Icon size={16} />
                  </div>
                  <span className="sm-step-label">{step.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <div className="sm-grid">
          <section className="sm-beneficiaries-panel">
            <div className="sm-search-row">
              <div className="sm-search-input">
                <Search size={16} />
                <input type="text" placeholder="Rechercher un bénéficiaire..." value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <button type="button" className="sm-filter-btn"><Filter size={16} /></button>
            </div>
            <h3 className="sm-section-title">Bénéficiaires récents</h3>

            {isLoadingList ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '24px 0', color: '#6b7280' }}>
                <Loader2 size={18} className="sm-spin" />
                <span>Chargement des bénéficiaires...</span>
              </div>
            ) : (
              <div className="sm-beneficiaries-grid">
                {filtered.length === 0 && (
                  <p style={{ gridColumn: '1 / -1', color: '#6b7280', fontSize: 14, padding: '8px 0 4px' }}>
                    Aucun bénéficiaire trouvé
                  </p>
                )}
                {filtered.map((b) => (
                  <div key={b.id} className="sm-beneficiary-wrapper">
                    <button
                      type="button"
                      className={`sm-beneficiary-card ${selectedId === b.id ? 'sm-beneficiary-selected' : ''}`}
                      onClick={() => setSelectedId(b.id)}
                    >
                      <div className="sm-beneficiary-main">
                        <div className="sm-beneficiary-avatar" style={{ background: b.color, color: b.textColor }}>{b.initial}</div>
                        <div className="sm-beneficiary-info">
                          <p className="sm-beneficiary-name">{b.name}</p>
                          <p className="sm-beneficiary-bank">{b.bank}</p>
                          <p className="sm-beneficiary-account">{b.account}</p>
                        </div>
                        {selectedId === b.id && <div className="sm-beneficiary-check"><Check size={14} /></div>}
                      </div>
                      <ChevronRight size={16} className="sm-beneficiary-arrow" />
                    </button>

                    <button
                      type="button"
                      className="sm-beneficiary-menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === b.id ? null : b.id);
                      }}
                      title="Actions"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenuId === b.id && (
                      <div className="sm-beneficiary-dropdown">
                        <button
                          type="button"
                          className="sm-dropdown-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(b);
                          }}
                        >
                          <Edit2 size={14} /> Modifier
                        </button>
                        <button
                          type="button"
                          className="sm-dropdown-item sm-dropdown-item-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(b);
                          }}
                        >
                          <Trash2 size={14} /> Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button type="button" className="sm-beneficiary-card sm-add-beneficiary" onClick={() => setIsAdding(true)}>
                  <div className="sm-beneficiary-main">
                    <div className="sm-add-icon"><UserPlus size={18} /></div>
                    <div className="sm-beneficiary-info">
                      <p className="sm-beneficiary-name">Ajouter un nouveau bénéficiaire</p>
                      <p className="sm-beneficiary-sub">Nom, RIB, Banque...</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="sm-beneficiary-arrow" />
                </button>
              </div>
            )}
          </section>

          <aside className="sm-tips-panel">
            <div className="sm-tips-header">
              <div className="sm-tips-icon"><Shield size={18} /></div>
              <h3 className="sm-tips-title">Conseils de sécurité</h3>
            </div>
            <ul className="sm-tips-list">
              <li className="sm-tip-item"><div className="sm-tip-icon"><User size={16} /></div><p>Vérifiez toujours le nom du bénéficiaire avant de confirmer.</p></li>
              <li className="sm-tip-item"><div className="sm-tip-icon"><Lock size={16} /></div><p>Ne partagez jamais votre code OTP ou vos informations personnelles.</p></li>
              <li className="sm-tip-item"><div className="sm-tip-icon"><AlertCircle size={16} /></div><p>Vérifiez le montant et les détails avant de valider l'opération.</p></li>
            </ul>
          </aside>
        </div>

        <footer className="sm-footer">
          <button
            type="button"
            className="sm-continue-btn"
            disabled={!selectedId || isLoadingList}
            onClick={handleContinue}
          >
            Continuer <ChevronRight size={18} />
          </button>
        </footer>
      </main>

      {/* ===== MODAL AJOUT ===== */}
      {isAdding && (
        <div className="sm-overlay" onClick={!isSubmitting ? closeAddModal : undefined}>
          <div className="sm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sm-modal-header">
              <div>
                <h2 className="sm-modal-title">Ajouter un bénéficiaire</h2>
                <p className="sm-modal-subtitle">Enregistrez un bénéficiaire pour effectuer vos virements rapidement et en toute sécurité.</p>
              </div>
              <button type="button" className="sm-modal-close" onClick={closeAddModal} disabled={isSubmitting}>
                <X size={20} />
              </button>
            </div>

            <div className="sm-modal-stepper">
              {ADD_BENEFICIARY_STEPS.map((step, idx) => (
                <div key={step.label} className="sm-modal-step">
                  <div className={`sm-modal-step-circle ${addStep > idx + 1 ? 'done' : addStep === idx + 1 ? 'active' : ''}`}>
                    {addStep > idx + 1 ? <Check size={14} /> : idx + 1}
                  </div>
                  <span className={`sm-modal-step-label ${addStep === idx + 1 ? 'active' : ''}`}>{step.label}</span>
                  {idx < 2 && <div className="sm-modal-step-line" />}
                </div>
              ))}
            </div>

            <div className="sm-modal-body">
              {addStep === 1 && (
                <BeneficiaryForm formData={formData} onChange={handleFormChange} disabled={isSubmitting} showSecurityBox />
              )}

              {addStep === 2 && (
                <div className="sm-verify-container">
                  <h3 className="sm-verify-title">Vérifiez les informations du bénéficiaire</h3>
                  <p className="sm-verify-desc">Veuillez vérifier attentivement les informations avant validation.</p>
                  <div className="sm-verify-card">
                    <div className="sm-verify-row"><span className="sm-verify-label">Nom complet</span><span className="sm-verify-value">{formData.name}</span></div>
                    <div className="sm-verify-row"><span className="sm-verify-label">Type</span><span className="sm-verify-value">{formData.type === 'particulier' ? 'Particulier' : 'Entreprise'}</span></div>
                    <div className="sm-verify-row"><span className="sm-verify-label">Banque</span><span className="sm-verify-value">{formData.bank}</span></div>
                    <div className="sm-verify-row"><span className="sm-verify-label">RIB</span><span className="sm-verify-value font-mono">{maskRIB(formData.rib)}</span></div>
                    {formData.alias && <div className="sm-verify-row"><span className="sm-verify-label">Alias</span><span className="sm-verify-value">{formData.alias}</span></div>}
                  </div>
                  <div className="sm-security-box sm-security-box-compact">
                    <Lock size={16} className="sm-security-icon" />
                    <p className="sm-security-text">Veuillez vérifier attentivement les informations avant validation.</p>
                  </div>
                </div>
              )}

              {addStep === 3 && (
                <div className="sm-success-container">
                  <div className="sm-success-icon"><CheckCircle2 size={48} /></div>
                  <h3 className="sm-success-title">Bénéficiaire ajouté avec succès</h3>
                  <p className="sm-success-desc">Le bénéficiaire est enregistré. Vous pouvez maintenant effectuer un virement vers ce compte.</p>
                  <div className="sm-success-actions">
                    <button
                      type="button"
                      className="sm-btn-primary sm-btn-full"
                      onClick={() => {
                        const newBeneficiary = {
                          name: formData.name,
                          bank: formData.bank,
                          ribMasked: maskRIB(formData.rib),
                        };
                        closeAddModal();
                        navigate('/envoyer-argent/verification', { state: { beneficiary: newBeneficiary } });
                      }}
                    >
                      <Send size={16} /> Effectuer un virement
                    </button>
                    <button type="button" className="sm-btn-secondary sm-btn-full" onClick={closeAddModal}>
                      Retour aux bénéficiaires
                    </button>
                  </div>
                </div>
              )}
            </div>

            {addStep < 3 && (
              <div className="sm-modal-footer">
                {addStep === 2 ? (
                  <>
                    <button type="button" className="sm-btn-secondary" onClick={() => setAddStep(1)} disabled={isSubmitting}>
                      <Edit2 size={16} /> Modifier
                    </button>
                    <button type="button" className="sm-btn-primary" onClick={handleAddBeneficiary} disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 size={16} className="sm-spin" /> : <Check size={16} />}
                      {isSubmitting ? 'Ajout en cours...' : "Confirmer l'ajout"}
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="sm-btn-secondary" onClick={closeAddModal} disabled={isSubmitting}>Annuler</button>
                    <button type="button" className="sm-btn-primary" disabled={!isFormValid || isSubmitting} onClick={() => setAddStep(2)}>
                      Continuer <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== MODAL MODIFICATION ===== */}
      {isEditing && editingBeneficiary && (
        <div className="sm-overlay" onClick={!isSubmitting ? closeEditModal : undefined}>
          <div className="sm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sm-modal-header">
              <div>
                <h2 className="sm-modal-title">Modifier le bénéficiaire</h2>
                <p className="sm-modal-subtitle">Modifiez les informations de <strong>{editingBeneficiary.name}</strong>.</p>
              </div>
              <button type="button" className="sm-modal-close" onClick={closeEditModal} disabled={isSubmitting}>
                <X size={20} />
              </button>
            </div>

            <div className="sm-modal-body">
              <BeneficiaryForm formData={formData} onChange={handleFormChange} disabled={isSubmitting} showSecurityBox={false} />
            </div>

            <div className="sm-modal-footer">
              <button type="button" className="sm-btn-secondary" onClick={closeEditModal} disabled={isSubmitting}>Annuler</button>
              <button type="button" className="sm-btn-primary" disabled={!isFormValid || isSubmitting} onClick={handleSaveEdit}>
                {isSubmitting ? <Loader2 size={16} className="sm-spin" /> : <Check size={16} />}
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL SUPPRESSION ===== */}
      {isDeleting && deletingBeneficiary && (
        <div className="sm-overlay" onClick={!isSubmitting ? () => setIsDeleting(false) : undefined}>
          <div className="sm-modal sm-modal-delete" onClick={(e) => e.stopPropagation()}>
            <div className="sm-delete-container">
              <div className="sm-delete-icon">
                <AlertTriangle size={32} />
              </div>
              <h3 className="sm-delete-title">Supprimer ce bénéficiaire ?</h3>
              <p className="sm-delete-desc">
                Vous êtes sur le point de supprimer <strong>{deletingBeneficiary.name}</strong> de votre liste de bénéficiaires. Cette action est irréversible.
              </p>

              <div className="sm-delete-summary">
                <div className="sm-verify-row"><span className="sm-verify-label">Nom</span><span className="sm-verify-value">{deletingBeneficiary.name}</span></div>
                <div className="sm-verify-row"><span className="sm-verify-label">Banque</span><span className="sm-verify-value">{deletingBeneficiary.bank}</span></div>
                <div className="sm-verify-row"><span className="sm-verify-label">Compte</span><span className="sm-verify-value font-mono">{deletingBeneficiary.account}</span></div>
              </div>

              <div className="sm-delete-actions">
                <button type="button" className="sm-btn-secondary sm-btn-full" onClick={() => setIsDeleting(false)} disabled={isSubmitting}>
                  Annuler
                </button>
                <button type="button" className="sm-btn-danger sm-btn-full" onClick={handleDeleteBeneficiary} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 size={16} className="sm-spin" /> : <Trash2 size={16} />}
                  {isSubmitting ? 'Suppression...' : 'Oui, supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}