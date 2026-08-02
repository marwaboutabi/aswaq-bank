import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Loader2, ShieldCheck, Zap, TrendingUp, Users, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Login.css';
import Logo from '../components/Logo/Logo';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
        setError(t('login.errorEmpty') || 'Veuillez remplir tous les champs.');
        return;
    }

    setIsLoading(true);

    try {

        const response = await api.post("/auth/login", {
            email: formData.email,
            password: formData.password
        });


        // récupération du JWT
        const token = response.data.token;


        // stockage du token
        localStorage.setItem("token", token);


        setError("");

        navigate('/acceuil-com');


    } catch (error) {

        console.log(error);

        setError(
          "Email ou mot de passe incorrect"
        );

    } finally {

        setIsLoading(false);

    }
};

  const features = [
    { icon: ShieldCheck, title: t('login.feat1Title') || 'Sécurisé', text: t('login.feat1Text') || 'Vos données sont protégées avec les plus hauts standards.' },
    { icon: Zap, title: t('login.feat2Title') || 'Rapide', text: t('login.feat2Text') || 'Des opérations simples et rapides à tout moment.' },
    { icon: TrendingUp, title: t('login.feat3Title') || 'Intelligent', text: t('login.feat3Text') || 'Des outils intelligents pour vous accompagner au quotidien.' },
    { icon: Users, title: t('login.feat4Title') || 'Proche de vous', text: t('login.feat4Text') || 'Une banque pensée pour les commerçants, fournisseurs et clients.' },
  ];

  return (
    <div className="login-page">
      {/* ===== Header ===== */}
      <header className="login-navbar">
        <div className="login-navbar-inner">
          <div className="brand-block">
            <Logo size={90} />
            <div className="brand-text">
              <span className="brand-name">{t('login.brandName') || 'Aswaq Bank'}</span>
              <span className="brand-tagline">{t('login.brandTagline') || 'Votre banque, partout, pour vous.'}</span>
            </div>
          </div>
          <nav className="navbar-links">
            <a href="/">{t('nav.home') || 'Accueil'}</a>
            <a href="/about">{t('nav.about') || 'À propos'}</a>
            <a href="/security">{t('nav.security') || 'Sécurité'}</a>
            <a href="/help">{t('nav.help') || 'Aide'}</a>
          </nav>
          <button type="button" className="lang-switch">
            FR <ChevronDown size={16} />
          </button>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="login-main">
        <section className="login-hero">
          <h1 className="hero-title">
            {t('login.heroLine1') || 'La banque digitale'}
            <br />
            {t('login.heroLine2') || 'qui fait grandir le'}{' '}
            <span className="hero-accent">{t('login.heroLine3') || 'commerce de proximité.'}</span>
          </h1>
          <p className="hero-subtitle">
            {t('login.heroSubtitle') ||
              'Gérez vos finances, développez votre activité et profitez de services innovants, 100% en ligne.'}
          </p>

          <ul className="hero-features">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="hero-feature">
                <span className="hero-feature-icon">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="hero-feature-title">{title}</p>
                  <p className="hero-feature-text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Carte de connexion ===== */}
        <section className="login-card-wrapper">
          <div className="login-card">
            <div className="login-tabs">
              <span className="login-tab login-tab-active">{t('login.tabLogin') || 'Connexion'}</span>
              <Link to="/create-account" className="login-tab login-tab-link">
                {t('login.tabRegister') || 'Créer un compte'}
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">{t('login.email') || 'Adresse e-mail'}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="exemple@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('login.password') || 'Mot de passe'}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <span>{t('login.remember') || 'Se souvenir de moi'}</span>
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  {t('login.forgot') || 'Mot de passe oublié ?'}
                </Link>
              </div>

              {error && <div className="form-error">{error}</div>}

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    {t('login.loading') || 'Connexion en cours...'}
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    {t('login.submit') || 'Se connecter'}
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <span>{t('login.orContinue') || 'ou continuer avec'}</span>
            </div>

            <div className="social-buttons">
              <button type="button" className="social-button" disabled={isLoading}>
                <img src="https://www.google.com/favicon.ico" alt="" width={18} height={18} />
                Google
              </button>
              <button type="button" className="social-button" disabled={isLoading}>
                <img src="https://www.microsoft.com/favicon.ico" alt="" width={18} height={18} />
                Microsoft
              </button>
            </div>

            <div className="signup-link">
              <p>{t('login.noAccount') || "Vous n'avez pas de compte ?"}</p>
              <Link to="/create-account" className="signup-button-link">
                {t('login.openAccount') || 'Créer un compte'}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}