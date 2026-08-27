import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Lock, ShieldCheck, Zap, TrendingUp, Users, ArrowLeft, ShieldQuestion } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo/Logo';
import './VerifyOTP.css';
import api from '../services/api';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang } = useLanguage();

  const email = location.state?.email;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputRefs = useRef([]);

  // Redirige si la page est ouverte directement sans email
  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.split('').slice(0, 6);
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }

    if (value === '' || /^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Veuillez entrer le code à 6 chiffres.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/verify-reset-otp', { email, otp: code });
      const { resetToken } = response.data;
      navigate('/reset-password', { state: { resetToken } });
    } catch (err) {
      setError(err.response?.data?.message || 'Code incorrect ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
    try {
      await api.post('/auth/forgot-password', { email });
      setTimeLeft(300);
      setResendCooldown(30);
      alert('Un nouveau code a été envoyé.');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du renvoi.');
    }
  };

  const features = [
    { icon: ShieldCheck, title: 'Sécurisé', text: 'Vos données sont protégées avec les plus hauts standards.' },
    { icon: Zap, title: 'Rapide', text: 'Des opérations simples et rapides à tout moment.' },
    { icon: TrendingUp, title: 'Intelligent', text: 'Des outils intelligents pour vous accompagner au quotidien.' },
    { icon: Users, title: 'À vos côtés', text: 'Une banque pensée pour les commerçants, fournisseurs et clients.' },
  ];

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
          <button type="button" className="submitted-lang-switch" onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}>
            {lang.toUpperCase()} <ChevronDown size={16} />
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
                <ShieldQuestion className="submitted-icon" size={40} />
              </div>
              <h1 className="submitted-card-title">Vérification du code</h1>
              <p className="submitted-card-subtitle">Entrez le code à 6 chiffres envoyé à votre adresse e-mail.</p>
            </div>

            <form onSubmit={handleSubmit} className="submitted-form">
              <div className="submitted-otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="submitted-otp-input"
                  />
                ))}
              </div>

              {error && <p className="submitted-form-error submitted-form-error-center">{error}</p>}

              <button type="submit" className="submitted-access-button" disabled={loading}>
                {loading ? 'Vérification...' : 'Vérifier le code'}
              </button>
            </form>

            <p className={`submitted-otp-timer ${timeLeft === 0 ? 'expired' : ''}`}>
              {timeLeft > 0
                ? `Code valide encore ${formatTime(timeLeft)}`
                : 'Le code a expiré.'}
            </p>

            <div className="submitted-otp-links">
              <button
                type="button"
                className="submitted-resend-link"
                onClick={handleResend}
                disabled={resendCooldown > 0}
              >
                {resendCooldown > 0 ? `Renvoyer (${resendCooldown}s)` : 'Renvoyer le code'}
              </button>

              <Link to="/forgot-password" className="submitted-back-link">
                <ArrowLeft size={16} /> Retour
              </Link>
            </div>

            <div className="submitted-footer">
              <div className="submitted-security-info">
                <Lock size={14} />
                <span>Connexion sécurisée SSL</span>
              </div>
              <p className="submitted-compliance">
                Conforme aux exigences de Bank Al-Maghrib
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}