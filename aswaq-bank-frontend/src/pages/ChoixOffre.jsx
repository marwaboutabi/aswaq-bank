import React, { useState } from 'react';
import { ChevronDown, User, Store, Truck, Info, Check, ShieldCheck, Zap, TrendingUp, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo/Logo';
import './ChoixOffre.css';
import { saveRegistrationData } from '../utils/registrationStorage';
const OFFERS = [
  {
    id: 'personnel',
    icon: User,
    title: 'Compte Personnel',
    description: 'Pour gérer vos finances personnelles, effectuer des paiements et épargner en toute simplicité.',
  },
  {
    id: 'commercant',
    icon: Store,
    title: 'Compte Commerçant',
    description: 'Pour gérer votre activité, vos ventes, vos produits et vos paiements avec vos clients.',
  },
  {
    id: 'fournisseur',
    icon: Truck,
    title: 'Compte Fournisseur',
    description: 'Pour gérer votre catalogue, vos commandes et vos relations avec les commerçants.',
  },
];

export default function ChoixOffre() {
  
const navigate = useNavigate();
const [selected, setSelected] = useState('personnel');

  const handleContinue = () => {
    saveRegistrationData({ offre: selected });
    navigate('/verifier-contact');
  };

  const features = [
    { icon: ShieldCheck, title: 'Sécurisé', text: 'Vos données sont protégées avec les plus hauts standards.' },
    { icon: Zap, title: 'Rapide', text: 'Des opérations simples et rapides à tout moment.' },
    { icon: TrendingUp, title: 'Intelligent', text: 'Des outils intelligents pour vous accompagner au quotidien.' },
    { icon: Users, title: 'Proche de vous', text: 'Une banque pensée pour les commerçants, fournisseurs et clients.' },
  ];

  return (
    <div className="offre-page">
      {/* ===== Header ===== */}
      <header className="offre-navbar">
        <div className="offre-navbar-inner">
          <div className="offre-brand-block">
            <Logo size={90} />
            <div className="offre-brand-text">
              <span className="offre-brand-name">Aswaq Bank</span>
              <span className="offre-brand-tagline">Votre banque, partout, pour vous.</span>
            </div>
          </div>
          <nav className="offre-navbar-links">
            <a href="/">Accueil</a>
            <a href="/about">À propos</a>
            <a href="/#services">Services</a>
            <a href="/security">Sécurité</a>
            <a href="/help">Aide</a>
          </nav>
          <button type="button" className="offre-lang-switch">
            FR <ChevronDown size={16} />
          </button>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="offre-main">
        {/* ===== Hero / colonne gauche ===== */}
        <section className="offre-hero">
          <h1 className="offre-hero-title">
            La banque digitale
            <br />
            qui fait grandir le
            <br />
            <span className="offre-hero-accent">commerce de proximité.</span>
          </h1>
          <p className="offre-hero-subtitle">
            Gérez vos finances, développez votre activité et profitez de
            services innovants, 100% en ligne.
          </p>

          <ul className="offre-features">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="offre-feature">
                <span className="offre-feature-icon">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="offre-feature-title">{title}</p>
                  <p className="offre-feature-text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Carte / colonne droite ===== */}
        <section className="offre-card-wrapper">
          <div className="offre-card">
            <div className="offre-card-header">
              <div className="offre-icon-badge">
                <Users size={22} />
              </div>
              <h2 className="offre-title">Choisissez votre offre</h2>
              <p className="offre-subtitle">
                Sélectionnez le type de compte qui correspond le mieux à vos besoins.
              </p>
            </div>

            <div className="offre-list">
              {OFFERS.map((offer) => {
                const Icon = offer.icon;
                const isSelected = selected === offer.id;
                return (
                  <button
                    key={offer.id}
                    type="button"
                    className={`offre-card-item ${isSelected ? 'offre-card-item-selected' : ''}`}
                    onClick={() => setSelected(offer.id)}
                  >
                    <div className="offre-card-icon">
                      <Icon size={22} />
                    </div>
                    <div className="offre-card-content">
                      <span className="offre-card-title">{offer.title}</span>
                      <p className="offre-card-description">{offer.description}</p>
                    </div>
                    <div className={`offre-radio ${isSelected ? 'offre-radio-checked' : ''}`}>
                      {isSelected && <Check size={14} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="offre-info-box">
              <Info size={18} className="offre-info-icon" />
              <span>Vous pourrez ajouter d'autres rôles plus tard depuis votre espace.</span>
            </div>

            <button type="button" className="offre-continue-button" onClick={handleContinue}>
              <span aria-hidden="true">→</span> Continuer
            </button>
             <div className="pro-footer-link">
              <Link to="/informations-professionnelles" className="pro-back-link">
                ← Retour à l'étape précédente
              </Link>
            </div>
          </div>
          
        </section>
      </main>
    </div>
  );
}