import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown, Lock, ShieldCheck, Zap, TrendingUp, Users
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import api from '../services/api';
import { getRegistrationData, saveRegistrationData } from '../utils/registrationStorage';
import './VerifierContact.css';

const OTP_LENGTH = 6;
const EXPIRY_SECONDS = 5 * 60;

function maskEmail(email) {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 1) return `${local}@${domain}`;
  const visible = local[0];
  const hidden = '*'.repeat(Math.max(local.length - 1, 4));
  return `${visible}${hidden}@${domain}`;
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function VerifierContact() {
  const navigate = useNavigate();
  const email = getRegistrationData().email || 'exemple@gmail.com';

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS);
  const inputRefs = useRef([]);
  const otpSentRef = useRef(false);

  const [consents, setConsents] = useState({
    conditions: false,
    confidentialite: false,
    donneesPersonnelles: false,
    biometrique: false,
  });

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  useEffect(() => {
    if (otpSentRef.current) return;
    otpSentRef.current = true;

    api.post('/auth/send-otp', { email }).catch(() => {
      setError("Impossible d'envoyer le code de vérification. Veuillez réessayer.");
    });
  }, [email]);
  
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const isExpired = secondsLeft <= 0;

  const handleChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.split('').slice(0, OTP_LENGTH);
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (i < OTP_LENGTH) newOtp[i] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
      return;
    }

    if (value === '' || /^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');

      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConsentChange = (name) => {
    setConsents((prev) => ({ ...prev, [name]: !prev[name] }));
    setError('');
  };

  const allConsentsChecked = Object.values(consents).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isExpired) {
      setError('Le code a expiré, veuillez en demander un nouveau.');
      return;
    }

    const code = otp.join('');
    if (code.length !== OTP_LENGTH) {
      setError('Veuillez saisir les 6 chiffres du code.');
      return;
    }

    if (!allConsentsChecked) {
      setError("Merci d'accepter l'ensemble des conditions pour continuer.");
      return;
    }

    try {
      const response = await api.post('/auth/verify-otp', { email, code });
      if (response.data.valid) {
        saveRegistrationData({ emailVerifie: true });
        navigate('/compte-soumis');
      } else {
        setError('Code incorrect. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Erreur lors de la vérification. Veuillez réessayer.');
    }
  };

  const handleResend = useCallback(() => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    setSecondsLeft(EXPIRY_SECONDS);
    inputRefs.current[0]?.focus();
    api.post('/auth/send-otp', { email }).catch(() => {
      setError('Impossible de renvoyer le code. Veuillez réessayer.');
    });
  }, [email]);

  const features = [
    { icon: ShieldCheck, title: 'Sécurisé', text: 'Vos données sont protégées avec les plus hauts standards.' },
    { icon: Zap, title: 'Rapide', text: 'Des opérations simples et rapides à tout moment.' },
    { icon: TrendingUp, title: 'Intelligent', text: 'Des outils intelligents pour vous accompagner au quotidien.' },
    { icon: Users, title: 'Proche de vous', text: 'Une banque pensée pour les commerçants, fournisseurs et clients.' },
  ];

  return (
    <div className="vc-page">
      {/* ===== Header ===== */}
      <header className="vc-navbar">
        <div className="vc-navbar-inner">
          <div className="vc-brand-block">
            <Logo size={90} />
            <div className="vc-brand-text">
              <span className="vc-brand-name">Aswaq Bank</span>
              <span className="vc-brand-tagline">Votre banque, partout, pour vous.</span>
            </div>
          </div>
          <nav className="vc-navbar-links">
            <a href="/">Accueil</a>
            <a href="/about">À propos</a>
            <a href="/#services">Services</a>
            <a href="/security">Sécurité</a>
            <a href="/help">Aide</a>
          </nav>
          <button type="button" className="vc-lang-switch">
            FR <ChevronDown size={16} />
          </button>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="vc-main">
        {/* ===== Hero / colonne gauche ===== */}
        <section className="vc-hero">
          <h1 className="vc-hero-title">
            La banque digitale
            <br />
            qui fait grandir le
            <br />
            <span className="vc-hero-accent">commerce de proximité.</span>
          </h1>
          <p className="vc-hero-subtitle">
            Gérez vos finances, développez votre activité et profitez de
            services innovants, 100% en ligne.
          </p>

          <ul className="vc-features">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="vc-feature">
                <span className="vc-feature-icon">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="vc-feature-title">{title}</p>
                  <p className="vc-feature-text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Carte / colonne droite ===== */}
        <section className="vc-card-wrapper">
          <div className="vc-card">
            <div className="vc-card-header">
              <h1 className="vc-card-title">Vérification et consentement</h1>
              <p className="vc-card-subtitle">
                Nous avons envoyé un code de vérification à :
                <br />
                <span className="email-highlight">{maskEmail(email)}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="vc-form">
              {/* ===== OTP Inputs ===== */}
              <div className="otp-container">
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
                    className="otp-input"
                    disabled={isExpired}
                  />
                ))}
              </div>

              <div className={`otp-timer ${isExpired ? 'otp-timer-expired' : ''}`}>
                {isExpired
                  ? 'Le code a expiré'
                  : `Le code expire dans ${formatTime(secondsLeft)}`}
              </div>

              {/* ===== Section Consentements ===== */}
              <div className="consent-section-divider">
                <span>CONSENTEMENTS</span>
              </div>

              <label className="consent-checkbox-row">
                <input
                  type="checkbox"
                  checked={consents.conditions}
                  onChange={() => handleConsentChange('conditions')}
                  className="consent-checkbox"
                />
                <span>
                  J'accepte les <a href="/conditions-generales" target="_blank" rel="noreferrer">Conditions générales</a> d'utilisation *
                </span>
              </label>

              <label className="consent-checkbox-row">
                <input
                  type="checkbox"
                  checked={consents.confidentialite}
                  onChange={() => handleConsentChange('confidentialite')}
                  className="consent-checkbox"
                />
                <span>
                  J'accepte la <a href="/politique-confidentialite" target="_blank" rel="noreferrer">Politique de confidentialité</a> *
                </span>
              </label>

              <label className="consent-checkbox-row">
                <input
                  type="checkbox"
                  checked={consents.donneesPersonnelles}
                  onChange={() => handleConsentChange('donneesPersonnelles')}
                  className="consent-checkbox"
                />
                <span>
                  Je consens au traitement de mes données personnelles conformément à la réglementation en vigueur *
                </span>
              </label>

              <label className="consent-checkbox-row">
                <input
                  type="checkbox"
                  checked={consents.biometrique}
                  onChange={() => handleConsentChange('biometrique')}
                  className="consent-checkbox"
                />
                <span>
                  Je consens à la vérification biométrique de mon identité (selfie et pièce d'identité) *
                </span>
              </label>

              {error && <div className="form-error">{error}</div>}

              <button type="submit" className="vc-submit-button" disabled={isExpired}>
                Soumettre ma demande
              </button>
            </form>

            <div className="vc-footer-link">
              <span className="resend-question">Vous n'avez pas reçu le code ?</span>
              <button type="button" className="resend-link" onClick={handleResend}>
                Renvoyer le code
              </button>
               <br></br>
              <Link to="/choix-offre" className="back-link">
                ← Retour
              </Link>
            </div>

            <div className="vc-footer">
              <div className="security-info">
                <Lock size={14} />
                <span>Vos données sont protégées</span>
              </div>
              <p className="compliance">
                Conforme aux exigences de Bank Al-Maghrib.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}