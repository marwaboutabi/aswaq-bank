import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown, CheckCircle2, Clock, ArrowLeft, AlertTriangle, Loader2,
  ShieldCheck, Zap, TrendingUp, Users, Lock
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import api from '../services/api';
import { getRegistrationData } from '../utils/registrationStorage';
import './AccountSubmitted.css';

const PROGRESS_TICK_MS = 3000;

export default function AccountSubmitted() {
  const [status, setStatus] = useState('verifying');
  const [progress, setProgress] = useState(0);
  const registerSentRef = useRef(false);

useEffect(() => {
    if (registerSentRef.current) return;
    registerSentRef.current = true;

    const step = 100;
    const increment = (step / PROGRESS_TICK_MS) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + increment, 95));
    }, step);

    const { confirmationMotDePasse, emailVerifie, ...payload } = getRegistrationData();

    api.post('/auth/register', payload)
      .then(() => {
        sessionStorage.removeItem('accountData');
        setProgress(100);
        setStatus('success');
      })
      .catch(() => {
        setProgress(100);
        setStatus('issue');
      })
      .finally(() => {
        clearInterval(interval);
      });

    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: ShieldCheck, title: 'Sécurisé', text: 'Vos données sont protégées avec les plus hauts standards.' },
    { icon: Zap, title: 'Rapide', text: 'Des opérations simples et rapides à tout moment.' },
    { icon: TrendingUp, title: 'Intelligent', text: 'Des outils intelligents pour vous accompagner au quotidien.' },
    { icon: Users, title: 'Proche de vous', text: 'Une banque pensée pour les commerçants, fournisseurs et clients.' },
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
            

            {status === 'verifying' && (
              <>
                <div className="submitted-icon-wrapper submitted-icon-loading">
                  <Loader2 className="submitted-icon submitted-spin" size={48} />
                </div>
                <h1 className="submitted-card-title">Vérification en cours…</h1>
                <p className="submitted-card-subtitle">
                  Nous analysons votre dossier, cela ne prendra que quelques instants.
                </p>
                <div className="submitted-progress-track">
                  <div
                    className="submitted-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="submitted-icon-wrapper submitted-icon-success">
                  <CheckCircle2 className="submitted-icon" size={56} />
                </div>
                <h1 className="submitted-card-title">Votre demande a été validée</h1>
                <p className="submitted-card-subtitle">
                  Votre compte a été créé avec succès !
                </p>

                <div className="submitted-status-badge submitted-status-success">
                  <span className="submitted-status-dot submitted-status-dot-success" />
                  Statut : Compte vérifié
                </div>

                <div className="submitted-info-box">
                  <Clock className="submitted-info-icon" size={20} />
                  <div className="submitted-info-content">
                    <p>Vous pouvez maintenant accéder à votre espace.</p>
                    <p>Les fonctionnalités bancaires seront progressivement activées dans les prochaines 24 heures.</p>
                  </div>
                </div>

                <Link to="/dashboard" className="submitted-access-button">
                  Accéder à mon compte <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                </Link>

                <Link to="/" className="submitted-back-link">
                  <ArrowLeft size={16} /> Retour à l'accueil
                </Link>
              </>
            )}

            {status === 'issue' && (
              <>
                <div className="submitted-icon-wrapper submitted-icon-warning">
                  <AlertTriangle className="submitted-icon submitted-icon-warning-color" size={48} />
                </div>
                <h1 className="submitted-card-title">Un problème a été détecté</h1>
                <p className="submitted-card-subtitle">
                  Certaines informations de votre dossier nécessitent une vérification complémentaire.
                </p>

                <div className="submitted-status-badge submitted-status-issue">
                  <span className="submitted-status-dot submitted-status-dot-issue" />
                  Statut : Vérification manuelle requise
                </div>

                <div className="submitted-info-box submitted-info-box-issue">
                  <AlertTriangle className="submitted-info-icon submitted-icon-warning-color" size={20} />
                  <div className="submitted-info-content">
                    <p>Un conseiller ASWAQ BANK va vous contacter sous peu afin de résoudre ce problème et finaliser l'ouverture de votre compte.</p>
                  </div>
                </div>

                <Link to="/" className="submitted-back-link">
                  <ArrowLeft size={16} /> Retour à l'accueil
                </Link>
              </>
            )}

            <div className="submitted-footer">
              <div className="submitted-security-info">
                <Lock size={14} />
                <span>Vos données sont protégées</span>
              </div>
              <p className="submitted-compliance">
                Conforme aux exigences de Bank Al-Maghrib.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}