import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { ChevronDown, Lock, Briefcase, ShieldCheck, Zap, TrendingUp, Users } from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './ProfessionalInfo.css';
import { saveRegistrationData } from '../utils/registrationStorage';

export default function ProfessionalInfo() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    profession: '',
    situationPro: '',
    sourceRevenus: '',
    fourchetteRevenus: '',
    objetCompte: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.situationPro || !formData.sourceRevenus || !formData.objetCompte) {
      setError("Merci de compléter les informations obligatoires.");
      return;
    }

    saveRegistrationData(formData);
    navigate('/choix-offre');
  };

  const features = [
    { icon: ShieldCheck, title: 'Sécurisé', text: 'Vos données sont protégées avec les plus hauts standards.' },
    { icon: Zap, title: 'Rapide', text: 'Des opérations simples et rapides à tout moment.' },
    { icon: TrendingUp, title: 'Intelligent', text: 'Des outils intelligents pour vous accompagner au quotidien.' },
    { icon: Users, title: 'Proche de vous', text: 'Une banque pensée pour les commerçants, fournisseurs et clients.' },
  ];

  return (
    <div className="pro-page">
      {/* ===== Header ===== */}
      <header className="pro-navbar">
        <div className="pro-navbar-inner">
          <div className="pro-brand-block">
            <Logo size={90} />
            <div className="pro-brand-text">
              <span className="pro-brand-name">Aswaq Bank</span>
              <span className="pro-brand-tagline">Votre banque, partout, pour vous.</span>
            </div>
          </div>
          <nav className="pro-navbar-links">
            <a href="/">Accueil</a>
            <a href="/about">À propos</a>
            <a href="/#services">Services</a>
            <a href="/security">Sécurité</a>
            <a href="/help">Aide</a>
          </nav>
          <button type="button" className="pro-lang-switch">
            FR <ChevronDown size={16} />
          </button>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="pro-main">
        {/* ===== Hero / colonne gauche ===== */}
        <section className="pro-hero">
          <h1 className="pro-hero-title">
            La banque digitale
            <br />
            qui fait grandir le
            <br />
            <span className="pro-hero-accent">commerce de proximité.</span>
          </h1>
          <p className="pro-hero-subtitle">
            Gérez vos finances, développez votre activité et profitez de
            services innovants, 100% en ligne.
          </p>

          <ul className="pro-features">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="pro-feature">
                <span className="pro-feature-icon">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="pro-feature-title">{title}</p>
                  <p className="pro-feature-text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Carte / colonne droite ===== */}
        <section className="pro-card-wrapper">
          <div className="pro-card">
            <div className="pro-card-header">
              <div className="pro-icon-badge">
                <Briefcase size={22} />
              </div>
              <h2 className="pro-title">Informations professionnelles</h2>
              <p className="pro-subtitle">
                Étape 3 sur 3 — Ces informations nous permettent de mieux vous connaître
              </p>
            </div>

            <form onSubmit={handleSubmit} className="pro-form">
              <div className="pro-form-group">
                <label className="pro-label">Profession / activité</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="pro-input"
                  placeholder="Ex : Commerçant, Salarié, Étudiant..."
                />
              </div>

              <div className="pro-form-group">
                <label className="pro-label">Situation professionnelle *</label>
                <select
                  name="situationPro"
                  value={formData.situationPro}
                  onChange={handleChange}
                  className="pro-select"
                  required
                >
                  <option value="">Sélectionnez une option</option>
                  <option value="salarie">Salarié</option>
                  <option value="independant">Indépendant / Auto-entrepreneur</option>
                  <option value="commercant">Commerçant</option>
                  <option value="sans_emploi">Sans emploi</option>
                  <option value="etudiant">Étudiant</option>
                  <option value="retraite">Retraité</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="pro-form-group">
                <label className="pro-label">Source principale des revenus *</label>
                <select
                  name="sourceRevenus"
                  value={formData.sourceRevenus}
                  onChange={handleChange}
                  className="pro-select"
                  required
                >
                  <option value="">Sélectionnez une option</option>
                  <option value="salaire">Salaire</option>
                  <option value="activite_commerciale">Activité commerciale</option>
                  <option value="revenus_locatifs">Revenus locatifs</option>
                  <option value="pension">Pension / Retraite</option>
                  <option value="aide_familiale">Aide familiale</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="pro-form-group">
                <label className="pro-label">
                  Fourchette de revenus mensuels
                  <span className="pro-optional-tag">Facultatif</span>
                </label>
                <select
                  name="fourchetteRevenus"
                  value={formData.fourchetteRevenus}
                  onChange={handleChange}
                  className="pro-select"
                >
                  <option value="">Préférez ne pas répondre</option>
                  <option value="moins_3000">Moins de 3 000 MAD</option>
                  <option value="3000_6000">3 000 – 6 000 MAD</option>
                  <option value="6000_10000">6 000 – 10 000 MAD</option>
                  <option value="10000_20000">10 000 – 20 000 MAD</option>
                  <option value="plus_20000">Plus de 20 000 MAD</option>
                </select>
              </div>

              <div className="pro-form-group">
                <label className="pro-label">Objet principal du compte *</label>
                <select
                  name="objetCompte"
                  value={formData.objetCompte}
                  onChange={handleChange}
                  className="pro-select"
                  required
                >
                  <option value="">Sélectionnez une option</option>
                  <option value="gestion_commerce">Gestion de mon commerce</option>
                  <option value="epargne">Épargne personnelle</option>
                  <option value="paiements_quotidiens">Paiements du quotidien</option>
                  <option value="virements_famille">Virements / Envois familiaux</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {error && <div className="pro-error">{error}</div>}

              <button type="submit" className="pro-button">
                <span aria-hidden="true">→</span> Continuer
              </button>
            </form>

            <div className="pro-footer-link">
              <Link to="/identity-verification" className="pro-back-link">
                ← Retour à l'étape précédente
              </Link>
            </div>

            <div className="pro-footer">
              <div className="pro-security-info">
                <Lock className="pro-security-icon" size={14} />
                <span>Vos données sont protégées</span>
              </div>
              <p className="pro-compliance">
                Conforme aux exigences de Bank Al-Maghrib.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}