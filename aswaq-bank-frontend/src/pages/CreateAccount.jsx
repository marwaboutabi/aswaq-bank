import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown, UserPlus,
  TrendingUp, ShieldCheck, Zap, Smartphone,
  CreditCard,
} from 'lucide-react';
import './CreateAccount.css';
import Logo from '../components/Logo/Logo';
import api from '../services/api';

export default function CreateAccount() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motDePasse: '',
    confirmationMotDePasse: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const passwordChecks = {
    length: formData.motDePasse.length >= 8,
    digit: /\d/.test(formData.motDePasse),
    uppercase: /[A-Z]/.test(formData.motDePasse),
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.motDePasse !== formData.confirmationMotDePasse) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (formData.motDePasse.length < 6) {
      setError('Le mot de passe est trop court.');
      return;
    }
    if (!acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation.");
      return;
    }

    try {
      const response = await api.get('/auth/check-email', {
        params: { email: formData.email },
      });
      if (response.data.exists) {
        setError('Cet email est déjà utilisé.');
        return;
      }
    } catch (err) {
      setError('Erreur lors de la vérification de l\'email. Veuillez réessayer.');
      return;
    }

    sessionStorage.setItem('accountData', JSON.stringify(formData));
    navigate('/identity-verification');
  };

  const features = [
    { icon: TrendingUp, title: 'Ouverture 100% en ligne', text: 'Sans déplacement, sans paperasse.' },
    { icon: ShieldCheck, title: 'Sécurisé', text: 'Vos informations sont protégées.' },
    { icon: Zap, title: 'Rapide', text: 'Votre compte est activé en quelques étapes.' },
    { icon: Smartphone, title: 'Accessible', text: 'Gérez votre compte 24h/24 et 7j/7.' },
  ];

  return (
    <div className="create-account-page">
      {/* ===== Header ===== */}
      <header className="ca-navbar">
        <div className="ca-navbar-inner">
          <div className="ca-brand-block">
            <Logo size={90} />
            <div className="ca-brand-text">
              <span className="ca-brand-name">Aswaq Bank</span>
              <span className="ca-brand-tagline">Votre banque, partout, pour vous.</span>
            </div>
          </div>
          <nav className="ca-navbar-links">
            <a href="/">Accueil</a>
            <a href="/about">À propos</a>
            <a href="/#services">Services</a>
            <a href="/security">Sécurité</a>
            <a href="/help">Aide</a>
          </nav>
          <button type="button" className="ca-lang-switch">
            FR <ChevronDown size={16} />
          </button>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="ca-main">
        <section className="ca-hero">
          <h1 className="ca-hero-title">
            Créez votre compte
            <br />
            <span className="ca-hero-accent">en quelques minutes</span>
          </h1>
          <p className="ca-hero-subtitle">
            Rejoignez Aswaq Bank et profitez d'une expérience bancaire simple, rapide et sécurisée.
          </p>

          <ul className="ca-features">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="ca-feature">
                <span className="ca-feature-icon">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="ca-feature-title">{title}</p>
                  <p className="ca-feature-text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Carte de création de compte ===== */}
        <section className="ca-card-wrapper">
          <div className="ca-card">
            <div className="ca-tabs">
              <Link to="/login" className="ca-tab">
                Connexion
              </Link>
              <span className="ca-tab ca-tab-active">
                Créer un compte
              </span>
            </div>

            <form onSubmit={handleSubmit} className="ca-form">
              <div className="ca-form-row">
                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Nom"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Prénom"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Adresse e-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="exemple@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Numéro de téléphone</label>
                <div className="ca-phone-row">
                  <button type="button" className="ca-phone-code">
                    <span className="ca-flag">🇲🇦</span> +212 <ChevronDown size={14} />
                  </button>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="6 12 34 56 78"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mot de passe</label>
                <input
                  type="password"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Créez un mot de passe"
                  required
                />
                <div className="ca-password-hints">
                  <span className={passwordChecks.length ? 'ca-hint ca-hint-valid' : 'ca-hint'}>
                    8 caractères minimum
                  </span>
                  <span className={passwordChecks.digit ? 'ca-hint ca-hint-valid' : 'ca-hint'}>
                    1 chiffre
                  </span>
                  <span className={passwordChecks.uppercase ? 'ca-hint ca-hint-valid' : 'ca-hint'}>
                    1 majuscule
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="confirmationMotDePasse"
                  value={formData.confirmationMotDePasse}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirmez votre mot de passe"
                  required
                />
              </div>

              <label className="ca-terms">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => { setAcceptTerms(e.target.checked); setError(''); }}
                />
                <span>
                  J'accepte les 
                  <Link to="/terms">Conditions d'utilisation</Link>
                   et la 
                  <Link to="/privacy">Politique de confidentialité</Link>
                </span>
              </label>

              {error && <div className="form-error">{error}</div>}

              <button type="submit" className="ca-submit-button">
                <UserPlus size={16} />
                Créer mon compte
              </button>
            </form>

            <div className="ca-login-link">
              <p>Vous avez déjà un compte ?</p>
              <Link to="/login" className="ca-login-link-button">
                Se connecter
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}