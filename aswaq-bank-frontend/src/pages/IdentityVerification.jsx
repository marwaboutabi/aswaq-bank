import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown, Upload, ShieldCheck, Zap, TrendingUp, Users, Lock,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './IdentityVerification.css';
import { saveRegistrationData, fileToBase64 } from '../utils/registrationStorage';

export default function IdentityVerification() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dateNaissance: '',
    lieuNaissance: '',
    nationalite: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: '',
    cinNumero: '',
    cinExpiration: '',
    cinPhoto: null,
    selfie: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    const cinPhotoBase64 = await fileToBase64(formData.cinPhoto);
    const selfieBase64 = await fileToBase64(formData.selfie);

    saveRegistrationData({
      dateNaissance: formData.dateNaissance,
      lieuNaissance: formData.lieuNaissance,
      nationalite: formData.nationalite,
      adresse: formData.adresse,
      ville: formData.ville,
      codePostal: formData.codePostal,
      pays: formData.pays,
      cinNumero: formData.cinNumero,
      cinExpiration: formData.cinExpiration,
      cinPhoto: cinPhotoBase64,
      selfie: selfieBase64,
    });

    navigate('/informations-professionnelles');
  };

  const features = [
    { icon: ShieldCheck, title: 'Sécurisé', text: 'Vos données sont protégées avec les plus hauts standards.' },
    { icon: Zap, title: 'Rapide', text: 'Des opérations simples et rapides à tout moment.' },
    { icon: TrendingUp, title: 'Intelligent', text: 'Des outils intelligents pour vous accompagner au quotidien.' },
    { icon: Users, title: 'Proche de vous', text: 'Une banque pensée pour les commerçants, fournisseurs et clients.' },
  ];

  return (
    <div className="iv-page">
      {/* ===== Header ===== */}
      <header className="iv-navbar">
        <div className="iv-navbar-inner">
          <div className="iv-brand-block">
            <Logo size={90} />
            <div className="iv-brand-text">
              <span className="iv-brand-name">Aswaq Bank</span>
              <span className="iv-brand-tagline">Votre banque, partout, pour vous.</span>
            </div>
          </div>
          <nav className="iv-navbar-links">
            <a href="/">Accueil</a>
            <a href="/about">À propos</a>
            <a href="/#services">Services</a>
            <a href="/security">Sécurité</a>
            <a href="/help">Aide</a>
          </nav>
          <button type="button" className="iv-lang-switch">
            FR <ChevronDown size={16} />
          </button>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="iv-main">
        {/* ===== Hero / colonne gauche ===== */}
        <section className="iv-hero">
          <h1 className="iv-hero-title">
            La banque digitale
            <br />
            qui fait grandir le
            <br />
            <span className="iv-hero-accent">commerce de proximité.</span>
          </h1>
          <p className="iv-hero-subtitle">
            Gérez vos finances, développez votre activité et profitez de
            services innovants, 100% en ligne.
          </p>

          <ul className="iv-features">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="iv-feature">
                <span className="iv-feature-icon">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="iv-feature-title">{title}</p>
                  <p className="iv-feature-text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Carte / colonne droite ===== */}
        <section className="iv-card-wrapper">
          <div className="iv-card">
            <div className="iv-card-header">
              <h2 className="iv-card-title">Vérification de l'identité</h2>
              <p className="iv-card-subtitle">
                Étape 2 sur 3 — Veuillez compléter vos informations personnelles
              </p>
            </div>

            <form onSubmit={handleSubmit} className="iv-form">
              <div className="iv-form-row iv-row-3">
                <div className="form-group">
                  <label className="form-label">Date de naissance *</label>
                  <input
                    type="date"
                    name="dateNaissance"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Lieu de naissance *</label>
                  <input
                    type="text"
                    name="lieuNaissance"
                    value={formData.lieuNaissance}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ville de naissance"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nationalité *</label>
                  <input
                    type="text"
                    name="nationalite"
                    value={formData.nationalite}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Votre nationalité"
                    required
                  />
                </div>
              </div>

              <div className="iv-form-row iv-row-3">
                <div className="form-group">
                  <label className="form-label">Adresse *</label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Rue, numéro, appartement"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Ville *</label>
                  <input
                    type="text"
                    name="ville"
                    value={formData.ville}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Votre ville"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Code postal *</label>
                  <input
                    type="text"
                    name="codePostal"
                    value={formData.codePostal}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Code postal"
                    required
                  />
                </div>
              </div>

              <div className="iv-form-row iv-row-3">
                <div className="form-group">
                  <label className="form-label">Pays *</label>
                  <input
                    type="text"
                    name="pays"
                    value={formData.pays}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Votre pays"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Numéro de la pièce d'identité *</label>
                  <input
                    type="text"
                    name="cinNumero"
                    value={formData.cinNumero}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Numéro CIN ou Passeport"
                    required
                  />
                </div>
              </div>

              <div className="iv-form-row iv-row-2">
                <div className="form-group">
                  <label className="form-label">Date d'expiration *</label>
                  <input
                    type="date"
                    name="cinExpiration"
                    value={formData.cinExpiration}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Photo de la pièce d'identité *</label>
                  <div className="iv-file-upload">
                    <input
                      type="file"
                      name="cinPhoto"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="iv-file-input"
                      id="cin-upload"
                      required
                    />
                    <label htmlFor="cin-upload" className="iv-file-label">
                      <Upload className="iv-upload-icon" size={20} />
                      <span>Télécharger la photo de la CIN</span>
                      <span className="iv-file-hint">JPG, PNG ou PDF (max. 5 Mo)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Selfie de vérification *</label>
                <div className="iv-file-upload">
                  <input
                    type="file"
                    name="selfie"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="iv-file-input"
                    id="selfie-upload"
                    required
                  />
                  <label htmlFor="selfie-upload" className="iv-file-label">
                    <Upload className="iv-upload-icon" size={20} />
                    <span>Télécharger un selfie</span>
                    <span className="iv-file-hint">JPG, PNG ou PDF (max. 5 Mo)</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="iv-submit-button">
                Continuer <span aria-hidden="true">→</span>
              </button>
            </form>

            <div className="iv-footer">
              <div className="pro-footer-link">
              <Link to="/create-account" className="pro-back-link">
                ← Retour à l'étape précédente
              </Link>
            </div>

              <div className="iv-security-info">
                <Lock size={14} />
                <span>Vos données sont protégées</span>
              </div>
              <p className="iv-compliance">Conforme aux exigences de Bank Al-Maghrib.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}