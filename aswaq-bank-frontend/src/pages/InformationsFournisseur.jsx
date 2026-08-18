import React, { useState } from 'react';
import { ChevronDown, Store, QrCode, ShoppingBag, PackageSearch, BrainCircuit, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo/Logo';
import './InformationsFournisseur.css';
import { saveRegistrationData } from '../utils/registrationStorage';

const SECTEURS = [
  'Alimentation',
  'Commerce de détail',
  'Services',
  'Technologie',
  'Autre',
];

export default function InformationsFournisseur() {
      const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    activitySector: '',
    ice: '',
    registreCommerce: '',
    address: '',
    city: '',
  });

  const [errors, setErrors] = useState({});

  const features = [
  {
    icon: QrCode,
    title: 'Paiements simplifiés',
    text: 'Recevez vos paiements en toute simplicité.'
  },
  {
    icon: ShoppingBag,
    title: 'Gestion des commandes',
    text: 'Suivez vos commandes et vos opérations en temps réel.'
  },
  {
    icon: PackageSearch,
    title: 'Gestion des produits',
    text: 'Gérez vos produits et vos approvisionnements facilement.'
  },
  {
    icon: BrainCircuit,
    title: 'Suivi de votre activité',
    text: 'Gardez une vision claire de votre activité avec Aswaq Bank.'
  },
];

  const handleChange = (field) => (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleIceChange = (e) => {
    // N'accepte que des chiffres, 15 max
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 15);
    setFormData((prev) => ({ ...prev, ice: digitsOnly }));
    if (errors.ice) {
      setErrors((prev) => ({ ...prev, ice: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Le nom du fournisseur est requis.';
    }

    if (!formData.activitySector) {
      newErrors.activitySector = 'Veuillez sélectionner un secteur d\'activité.';
    }

    // ICE optionnel : validé uniquement s'il est renseigné
    if (formData.ice.trim() && !/^\d{15}$/.test(formData.ice.trim())) {
      newErrors.ice = 'L\'ICE doit contenir exactement 15 chiffres.';
    }

    // Registre de commerce optionnel : aucune validation requise

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse du fournisseur est requise.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;

    saveRegistrationData({
      supplier: {
        companyName: formData.companyName.trim(),
        activitySector: formData.activitySector,
        ice: formData.ice.trim(),
        registreCommerce: formData.registreCommerce.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
      },
    });

    navigate('/verifier-contact');
  };

  return (
    <div className="commercant-page">
      {/* ===== Header ===== */}
      <header className="commercant-navbar">
        <div className="commercant-navbar-inner">
          <div className="commercant-brand-block">
            <Logo size={90} />
            <div className="commercant-brand-text">
              <span className="commercant-brand-name">Aswaq Bank</span>
              <span className="commercant-brand-tagline">Votre banque, partout, pour vous.</span>
            </div>
          </div>
          <nav className="commercant-navbar-links">
            <a href="/">Accueil</a>
            <a href="/about">À propos</a>
            <a href="/#services">Services</a>
            <a href="/security">Sécurité</a>
            <a href="/help">Aide</a>
          </nav>
          <button type="button" className="commercant-lang-switch">
            FR <ChevronDown size={16} />
          </button>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="commercant-main">
        {/* ===== Hero / colonne gauche ===== */}
        <section className="commercant-hero">
          <h1 className="commercant-hero-title">
            Développez votre activité
            <br />
            avec <span className="commercant-hero-accent">Aswaq Bank.</span>
          </h1>
          <p className="commercant-hero-subtitle">
            Créez votre espace fournisseur pour gérer vos commandes, vos paiements et
votre activité en toute simplicité.
          </p>

          <ul className="commercant-features">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="commercant-feature">
                <span className="commercant-feature-icon">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="commercant-feature-title">{title}</p>
                  <p className="commercant-feature-text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Carte / colonne droite ===== */}
        <section className="commercant-card-wrapper">
          <div className="commercant-card">
            <div className="commercant-card-header">
              <div className="commercant-icon-badge">
                <Store size={22} />
              </div>
              <h2 className="commercant-title">Informations de votre activité</h2>
              <p className="commercant-subtitle">
Ces informations permettent de créer votre espace fournisseur.              </p>
            </div>

            <form className="commercant-form" onSubmit={(e) => e.preventDefault()} noValidate>
              <div className="commercant-field">
                <label htmlFor="companyName" className="commercant-label">Nom du fournisseur</label>
                <input
                  id="companyName"
                  type="text"
                  className={`commercant-input ${errors.companyName ? 'commercant-input-error' : ''}`}
                  placeholder="Ex: Atlas Distribution, Maroc Fruits..."
                  value={formData.companyName}
                  onChange={handleChange('companyName')}
                />
                {errors.companyName && <span className="commercant-error-msg">{errors.companyName}</span>}
              </div>

              <div className="commercant-field">
                <label htmlFor="activitySector" className="commercant-label">Secteur d'activité</label>
                <select
                  id="activitySector"
                  className={`commercant-select ${errors.activitySector ? 'commercant-input-error' : ''}`}
                  value={formData.activitySector}
                  onChange={handleChange('activitySector')}
                >
                  <option value="">Sélectionnez un secteur</option>
                  {SECTEURS.map((secteur) => (
                    <option key={secteur} value={secteur}>{secteur}</option>
                  ))}
                </select>
                {errors.activitySector && <span className="commercant-error-msg">{errors.activitySector}</span>}
              </div>

              <div className="commercant-field-row">
                <div className="commercant-field">
                  <label htmlFor="ice" className="commercant-label">
                    ICE <span className="commercant-optional-tag">(optionnel)</span>
                  </label>
                  <input
                    id="ice"
                    type="text"
                    inputMode="numeric"
                    maxLength={15}
                    className={`commercant-input ${errors.ice ? 'commercant-input-error' : ''}`}
                    placeholder="Votre numéro ICE"
                    value={formData.ice}
                    onChange={handleIceChange}
                  />
                  {errors.ice && <span className="commercant-error-msg">{errors.ice}</span>}
                </div>

                <div className="commercant-field">
                  <label htmlFor="registreCommerce" className="commercant-label">
                    Registre de commerce <span className="commercant-optional-tag">(optionnel)</span>
                  </label>
                  <input
                    id="registreCommerce"
                    type="text"
                    className={`commercant-input ${errors.registreCommerce ? 'commercant-input-error' : ''}`}
                    placeholder="Votre numéro RC"
                    value={formData.registreCommerce}
                    onChange={handleChange('registreCommerce')}
                  />
                  {errors.registreCommerce && <span className="commercant-error-msg">{errors.registreCommerce}</span>}
                </div>
              </div>

              <div className="commercant-field">
                <label htmlFor="address" className="commercant-label">Adresse</label>
                <input
                  id="address"
                  type="text"
                  className={`commercant-input ${errors.address ? 'commercant-input-error' : ''}`}
                  placeholder="Adresse complète du fournisseur"
                  value={formData.address}
                  onChange={handleChange('address')}
                />
                {errors.address && <span className="commercant-error-msg">{errors.address}</span>}
              </div>

              <div className="commercant-field">
                <label htmlFor="city" className="commercant-label">Ville</label>
                <input
                  id="city"
                  type="text"
                  className={`commercant-input ${errors.city ? 'commercant-input-error' : ''}`}
                  placeholder="Casablanca"
                  value={formData.city}
                  onChange={handleChange('city')}
                />
                {errors.city && <span className="commercant-error-msg">{errors.city}</span>}
              </div>

              <div className="commercant-info-box">
                <Info size={18} className="commercant-info-icon" />
<span>
  Vos informations sont vérifiées avant l'activation de votre espace fournisseur.
</span>              </div>

              <button type="button" className="commercant-continue-button" onClick={handleContinue}>
                <span aria-hidden="true">→</span> Continuer
              </button>
            </form>

            <div className="commercant-footer-link">
              <Link to="/choix-offre" className="commercant-back-link">
                ← Retour au choix du compte
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}