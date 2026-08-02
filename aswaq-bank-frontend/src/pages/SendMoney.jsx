import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, Bell, ChevronDown, Send,
  User, Shield, Wallet, FileText, Lock, Check, CheckCircle2,
  UserPlus, Filter, ChevronRight, X, Building, Tag, ShieldCheck, AlertCircle, Edit2,
  MoreVertical, Trash2, AlertTriangle,
  // Icônes du menu client
  Home, CreditCard, ArrowLeftRight, Receipt, Star, PiggyBank, PieChart, Bot
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './SendMoney.css';

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

// Liste initiale des bénéficiaires
const INITIAL_BENEFICIARIES = [
  { 
    id: 1, 
    name: 'Ahmed El Amrani', 
    bank: 'Aswaq Bank', 
    account: '•••• •••• •••• 4587',
    rib: '011780000000123456789087',
    type: 'particulier',
    country: 'Maroc',
    alias: 'Mon frère',
    phone: '0661234587',
    initial: 'A', 
    color: '#eef3fc', 
    textColor: '#1d4fd8' 
  },
  { 
    id: 2, 
    name: 'Fatima Zahra', 
    bank: 'Banque Populaire', 
    account: '•••• •••• •••• 3215',
    rib: '007780000000987654321015',
    type: 'particulier',
    country: 'Maroc',
    alias: '',
    phone: '0662345321',
    initial: 'F', 
    color: '#f3e8ff', 
    textColor: '#7c3aed' 
  },
  { 
    id: 3, 
    name: 'Omar Benali', 
    bank: 'CIH Bank', 
    account: '•••• •••• •••• 7812',
    rib: '064780000000456123789012',
    type: 'entreprise',
    country: 'Maroc',
    alias: 'Fournisseur',
    phone: '0663456712',
    initial: 'O', 
    color: '#dcfce7', 
    textColor: '#16a34a' 
  },
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

const BANKS = ['Aswaq Bank', 'Attijariwafa Bank', 'Banque Populaire', 'CIH Bank', 'Bank of Africa', 'CFG Bank'];

const AVATAR_COLORS = [
  { color: '#eef3fc', textColor: '#1d4fd8' },
  { color: '#f3e8ff', textColor: '#7c3aed' },
  { color: '#dcfce7', textColor: '#16a34a' },
  { color: '#fef3c7', textColor: '#d97706' },
  { color: '#fee2e2', textColor: '#dc2626' },
  { color: '#e0e7ff', textColor: '#4f46e5' },
];

const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

export default function SendMoney() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [beneficiaries, setBeneficiaries] = useState(INITIAL_BENEFICIARIES);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // États pour les modals
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [editingBeneficiary, setEditingBeneficiary] = useState(null);
  const [deletingBeneficiary, setDeletingBeneficiary] = useState(null);

  const [formData, setFormData] = useState({
    name: '', type: 'particulier', country: 'Maroc', bank: 'Aswaq Bank', rib: '', accountNumber: '', alias: '', phone: ''
  });

  const filtered = beneficiaries.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase()) || b.bank.toLowerCase().includes(query.toLowerCase())
  );

  const isFormValid = formData.name.trim() !== '' && formData.bank !== '' && formData.rib.length === 24;

  // ===== AJOUT =====
  const handleAddBeneficiary = () => {
    const lastFourDigits = formData.rib.slice(-4);
    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    
    const newBeneficiary = {
      id: generateId(),
      name: formData.name,
      bank: formData.bank,
      account: `•••• •••• •••• ${lastFourDigits}`,
      rib: formData.rib,
      type: formData.type,
      country: formData.country,
      alias: formData.alias,
      phone: formData.phone,
      initial: formData.name.charAt(0).toUpperCase(),
      color: randomColor.color,
      textColor: randomColor.textColor,
    };

    setBeneficiaries([...beneficiaries, newBeneficiary]);
    setSelectedId(newBeneficiary.id);
    setAddStep(3);
    resetForm();
  };

  // ===== MODIFICATION =====
  const openEditModal = (beneficiary) => {
    setEditingBeneficiary(beneficiary);
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

  const handleSaveEdit = () => {
    const lastFourDigits = formData.rib.slice(-4);
    const updatedBeneficiaries = beneficiaries.map((b) =>
      b.id === editingBeneficiary.id
        ? {
            ...b,
            name: formData.name,
            type: formData.type,
            country: formData.country,
            bank: formData.bank,
            rib: formData.rib,
            account: `•••• •••• •••• ${lastFourDigits}`,
            alias: formData.alias,
            phone: formData.phone,
            initial: formData.name.charAt(0).toUpperCase(),
          }
        : b
    );
    setBeneficiaries(updatedBeneficiaries);
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

  const handleDeleteBeneficiary = () => {
    const updatedList = beneficiaries.filter((b) => b.id !== deletingBeneficiary.id);
    setBeneficiaries(updatedList);
    
    if (selectedId === deletingBeneficiary.id) {
      setSelectedId(updatedList.length > 0 ? updatedList[0].id : null);
    }
    
    setIsDeleting(false);
    setDeletingBeneficiary(null);
  };

  const resetForm = () => {
    setFormData({
      name: '', type: 'particulier', country: 'Maroc', bank: 'Aswaq Bank', rib: '', accountNumber: '', alias: '', phone: ''
    });
    setAddStep(1);
  };

  const closeAddModal = () => {
    setIsAdding(false);
    resetForm();
  };

  const closeEditModal = () => {
    setIsEditing(false);
    resetForm();
    setEditingBeneficiary(null);
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
            <button type="button" className="dash-icon-button"><Bell size={18} /><span className="dash-badge">3</span></button>
            <div className="dash-user-chip">
              <div className="dash-user-avatar">MB</div>
              <span>Marwa Boutabi</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

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
            <div className="sm-beneficiaries-grid">
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
            disabled={!selectedId}
            onClick={() => {
              const selectedBeneficiary = beneficiaries.find(b => b.id === selectedId);
              if (selectedBeneficiary) {
                navigate('/envoyer-argent/verification', { 
                  state: { beneficiary: selectedBeneficiary } 
                });
              }
            }}
          >
            Continuer <ChevronRight size={18} />
          </button>
        </footer>
      </main>

      {/* ===== MODAL AJOUT ===== */}
      {isAdding && (
        <div className="sm-overlay" onClick={closeAddModal}>
          <div className="sm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sm-modal-header">
              <div>
                <h2 className="sm-modal-title">Ajouter un bénéficiaire</h2>
                <p className="sm-modal-subtitle">Enregistrez un bénéficiaire pour effectuer vos virements rapidement et en toute sécurité.</p>
              </div>
              <button type="button" className="sm-modal-close" onClick={closeAddModal}>
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
                <div className="sm-form-grid">
                  <div className="sm-form-section">
                    <h3 className="sm-form-section-title"><User size={16} /> Informations personnelles</h3>
                    <div className="sm-input-group">
                      <label>Nom complet du bénéficiaire *</label>
                      <input type="text" placeholder="Ex: Ahmed El Amrani" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="sm-row-2">
                      <div className="sm-input-group">
                        <label>Type de bénéficiaire *</label>
                        <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                          <option value="particulier">Particulier</option>
                          <option value="entreprise">Entreprise</option>
                        </select>
                      </div>
                      <div className="sm-input-group">
                        <label>Pays *</label>
                        <select value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})}>
                          <option value="Maroc">🇲🇦 Maroc</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="sm-form-section">
                    <h3 className="sm-form-section-title"><Building size={16} /> Informations bancaires</h3>
                    <div className="sm-input-group">
                      <label>Banque du bénéficiaire *</label>
                      <select value={formData.bank} onChange={(e) => setFormData({...formData, bank: e.target.value})}>
                        {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="sm-input-group">
                      <label>RIB / IBAN * (24 chiffres)</label>
                      <input 
                        type="text" 
                        placeholder="Ex: 011 780 000000123456789" 
                        maxLength={24}
                        value={formData.rib} 
                        onChange={(e) => setFormData({...formData, rib: e.target.value.replace(/\D/g, '')})} 
                      />
                      {formData.rib.length > 0 && formData.rib.length < 24 && (
                        <span className="sm-input-hint error"><AlertCircle size={12} /> Le RIB doit contenir exactement 24 chiffres</span>
                      )}
                      {formData.rib.length === 24 && (
                        <span className="sm-input-hint success"><CheckCircle2 size={12} /> Format RIB valide détecté</span>
                      )}
                    </div>
                  </div>

                  <div className="sm-form-section">
                    <h3 className="sm-form-section-title"><Tag size={16} /> Informations supplémentaires</h3>
                    <div className="sm-row-2">
                      <div className="sm-input-group">
                        <label>Alias du bénéficiaire (optionnel)</label>
                        <input type="text" placeholder="Ex: Mon frère, Fournisseur, Loyer" value={formData.alias} onChange={(e) => setFormData({...formData, alias: e.target.value})} />
                      </div>
                      <div className="sm-input-group">
                        <label>Téléphone (optionnel)</label>
                        <input type="tel" placeholder="06 XX XX XX XX" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div className="sm-security-box">
                    <ShieldCheck size={20} className="sm-security-icon" />
                    <div>
                      <p className="sm-security-title">Sécurité bancaire</p>
                      <p className="sm-security-text">Vos informations sont protégées et vérifiées avant l'activation du bénéficiaire.</p>
                    </div>
                  </div>
                </div>
              )}

              {addStep === 2 && (
                <div className="sm-verify-container">
                  <h3 className="sm-verify-title">Vérifiez les informations du bénéficiaire</h3>
                  <p className="sm-verify-desc">Veuillez vérifier attentivement les informations avant validation.</p>
                  <div className="sm-verify-card">
                    <div className="sm-verify-row"><span className="sm-verify-label">Nom complet</span><span className="sm-verify-value">{formData.name}</span></div>
                    <div className="sm-verify-row"><span className="sm-verify-label">Type</span><span className="sm-verify-value">{formData.type === 'particulier' ? 'Particulier' : 'Entreprise'}</span></div>
                    <div className="sm-verify-row"><span className="sm-verify-label">Banque</span><span className="sm-verify-value">{formData.bank}</span></div>
                    <div className="sm-verify-row"><span className="sm-verify-label">RIB</span><span className="sm-verify-value font-mono">•••• •••• •••• {formData.rib.slice(-4)}</span></div>
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
                    <button type="button" className="sm-btn-primary sm-btn-full" onClick={() => { closeAddModal(); navigate('/envoyer-argent/verification'); }}>
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
                    <button type="button" className="sm-btn-secondary" onClick={() => setAddStep(1)}>
                      <Edit2 size={16} /> Modifier
                    </button>
                    <button type="button" className="sm-btn-primary" onClick={handleAddBeneficiary}>
                      Confirmer l'ajout <Check size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="sm-btn-secondary" onClick={closeAddModal}>Annuler</button>
                    <button type="button" className="sm-btn-primary" disabled={!isFormValid} onClick={() => setAddStep(2)}>
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
        <div className="sm-overlay" onClick={closeEditModal}>
          <div className="sm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sm-modal-header">
              <div>
                <h2 className="sm-modal-title">Modifier le bénéficiaire</h2>
                <p className="sm-modal-subtitle">Modifiez les informations de <strong>{editingBeneficiary.name}</strong>.</p>
              </div>
              <button type="button" className="sm-modal-close" onClick={closeEditModal}>
                <X size={20} />
              </button>
            </div>

            <div className="sm-modal-body">
              <div className="sm-form-grid">
                <div className="sm-form-section">
                  <h3 className="sm-form-section-title"><User size={16} /> Informations personnelles</h3>
                  <div className="sm-input-group">
                    <label>Nom complet du bénéficiaire *</label>
                    <input type="text" placeholder="Ex: Ahmed El Amrani" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="sm-row-2">
                    <div className="sm-input-group">
                      <label>Type de bénéficiaire *</label>
                      <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                        <option value="particulier">Particulier</option>
                        <option value="entreprise">Entreprise</option>
                      </select>
                    </div>
                    <div className="sm-input-group">
                      <label>Pays *</label>
                      <select value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})}>
                        <option value="Maroc">🇲🇦 Maroc</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="sm-form-section">
                  <h3 className="sm-form-section-title"><Building size={16} /> Informations bancaires</h3>
                  <div className="sm-input-group">
                    <label>Banque du bénéficiaire *</label>
                    <select value={formData.bank} onChange={(e) => setFormData({...formData, bank: e.target.value})}>
                      {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="sm-input-group">
                    <label>RIB / IBAN * (24 chiffres)</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 011 780 000000123456789" 
                      maxLength={24}
                      value={formData.rib} 
                      onChange={(e) => setFormData({...formData, rib: e.target.value.replace(/\D/g, '')})} 
                    />
                    {formData.rib.length > 0 && formData.rib.length < 24 && (
                      <span className="sm-input-hint error"><AlertCircle size={12} /> Le RIB doit contenir exactement 24 chiffres</span>
                    )}
                    {formData.rib.length === 24 && (
                      <span className="sm-input-hint success"><CheckCircle2 size={12} /> Format RIB valide détecté</span>
                    )}
                  </div>
                </div>

                <div className="sm-form-section">
                  <h3 className="sm-form-section-title"><Tag size={16} /> Informations supplémentaires</h3>
                  <div className="sm-row-2">
                    <div className="sm-input-group">
                      <label>Alias du bénéficiaire (optionnel)</label>
                      <input type="text" placeholder="Ex: Mon frère, Fournisseur, Loyer" value={formData.alias} onChange={(e) => setFormData({...formData, alias: e.target.value})} />
                    </div>
                    <div className="sm-input-group">
                      <label>Téléphone (optionnel)</label>
                      <input type="tel" placeholder="06 XX XX XX XX" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sm-modal-footer">
              <button type="button" className="sm-btn-secondary" onClick={closeEditModal}>Annuler</button>
              <button type="button" className="sm-btn-primary" disabled={!isFormValid} onClick={handleSaveEdit}>
                Enregistrer les modifications <Check size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL SUPPRESSION ===== */}
      {isDeleting && deletingBeneficiary && (
        <div className="sm-overlay" onClick={() => setIsDeleting(false)}>
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
                <button type="button" className="sm-btn-secondary sm-btn-full" onClick={() => setIsDeleting(false)}>
                  Annuler
                </button>
                <button type="button" className="sm-btn-danger sm-btn-full" onClick={handleDeleteBeneficiary}>
                  <Trash2 size={16} /> Oui, supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}