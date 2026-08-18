import React, { useState, useEffect } from 'react';
import { Link, useNavigate , useLocation } from 'react-router-dom';
import { ChevronDown, Lock, ShieldCheck, Zap, TrendingUp, Users, ArrowLeft, KeyRound } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo/Logo';
import './ResetPassword.css';
import api from '../services/api';
export default function ResetPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!password || !confirmPassword) {
    setError(t('reset.errorEmpty'));
    return;
  }
  if (password !== confirmPassword) {
    setError(t('reset.errorMatch'));
    return;
  }
  setLoading(true);
  try {
    await api.post('/auth/reset-password', { resetToken, newPassword: password });
    navigate('/');
  } catch (err) {
    setError(err.response?.data?.message || 'Une erreur est survenue.');
  } finally {
    setLoading(false);
  }
};

  const features = [
    { icon: ShieldCheck, title: 'Sécurisé', text: 'Vos données sont protégées avec les plus hauts standards.' },
    { icon: Zap, title: 'Rapide', text: 'Des opérations simples et rapides à tout moment.' },
    { icon: TrendingUp, title: 'Intelligent', text: 'Des outils intelligents pour vous accompagner au quotidien.' },
    { icon: Users, title: 'Proche de vous', text: 'Une banque pensée pour les commerçants, fournisseurs et clients.' },
  ];
const location = useLocation();
const resetToken = location.state?.resetToken;

useEffect(() => {
  if (!resetToken) navigate('/forgot-password');
}, [resetToken, navigate]);
  return (
    <div className="submitted-page">
      {/* ===== Header ===== */}
      <header className="submitted-navbar">
        <div className="submitted-navbar-inner">
          <div className="submitted-brand-block">
            <Logo size={90} />
            <div className="submitted-brand-text">
              <span className="submitted-brand-name">Aswaq Bank</span>
              <span className="submitted-brand-tagline">Votre banque, partout, pour vous.</span>
            </div>
          </div>
          <nav className="submitted-navbar-links">
            <a href="/">Accueil</a>
            <a href="/about">À propos</a>
            <a href="/#services">Services</a>
            <a href="/security">Sécurité</a>
            <a href="/help">Aide</a>
          </nav>
          <button type="button" className="submitted-lang-switch">
            FR <ChevronDown size={16} />
          </button>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="submitted-main">
        {/* ===== Hero / colonne gauche ===== */}
        <section className="submitted-hero">
          <h1 className="submitted-hero-title">
            La banque digitale
            <br />
            qui fait grandir le
            <br />
            <span className="submitted-hero-accent">commerce de proximité.</span>
          </h1>
          <p className="submitted-hero-subtitle">
            Gérez vos finances, développez votre activité et profitez de
            services innovants, 100% en ligne.
          </p>

          <ul className="submitted-features">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="submitted-feature">
                <span className="submitted-feature-icon">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="submitted-feature-title">{title}</p>
                  <p className="submitted-feature-text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Carte / colonne droite ===== */}
        <section className="submitted-card-wrapper">
          <div className="submitted-card">
            <div className="submitted-card-header">
              <div className="submitted-icon-wrapper submitted-icon-loading">
                <KeyRound className="submitted-icon" size={40} />
              </div>
              <h1 className="submitted-card-title">{t('reset.title')}</h1>
              <p className="submitted-card-subtitle">{t('reset.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="submitted-form">
              <div className="submitted-form-group">
                <label className="submitted-form-label">{t('reset.newPassword')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="submitted-form-input"
                  placeholder={t('reset.newPasswordPlaceholder')}
                  required
                />
              </div>

              <div className="submitted-form-group">
                <label className="submitted-form-label">{t('reset.confirmPassword')}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  className="submitted-form-input"
                  placeholder={t('reset.confirmPasswordPlaceholder')}
                  required
                />
              </div>

              {error && <p className="submitted-form-error">{error}</p>}

              <button type="submit" className="submitted-access-button">
                {t('reset.submit')}
              </button>
            </form>

            <Link to="/" className="submitted-back-link">
              <ArrowLeft size={16} /> {t('reset.back')}
            </Link>

            <div className="submitted-footer">
              <div className="submitted-security-info">
                <Lock size={14} />
                <span>{t('reset.protected')}</span>
              </div>
              <p className="submitted-compliance">{t('reset.compliance')}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}