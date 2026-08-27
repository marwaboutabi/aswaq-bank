import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Store, Truck, Check, ChevronDown, ArrowRight,
  QrCode, CreditCard, Star, Package, BarChart3, ShieldCheck, Sparkles,
} from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer';
import './Services.css';

const AUDIENCES = [
  {
    key: 'client',
    icon: User,
    label: 'Client Particulier',
    intro: "Gérez votre argent au quotidien, épargnez et payez en toute simplicité.",
    features: [
      { icon: QrCode, title: 'Paiement QR instantané', text: 'Payez chez vos commerçants partenaires en scannant un simple QR code.' },
      { icon: CreditCard, title: 'Virements & transferts', text: "Envoyez et recevez de l'argent en quelques secondes, sans frais cachés." },
      { icon: Star, title: 'Points de fidélité', text: 'Cumulez des points à chaque paiement et convertissez-les en bons d\'achat.' },
      { icon: BarChart3, title: "Suivi des dépenses", text: "Visualisez vos dépenses par catégorie et fixez des objectifs d'épargne." },
    ],
    plans: [
      {
        name: 'Essentiel',
        price: 'Gratuit',
        period: '',
        highlight: false,
        items: [
          'Compte courant digital',
          'Carte virtuelle',
          'Paiement QR illimité',
          'Virements entre comptes Aswaq',
        ],
      },
      {
        name: 'Plus',
        price: '19',
        period: '/mois',
        highlight: true,
        items: [
          'Tout Essentiel',
          'Carte physique incluse',
          'Objectifs d\'épargne illimités',
          'Support prioritaire',
        ],
      },
    ],
  },
  {
    key: 'commercant',
    icon: Store,
    label: 'Commerçant',
    intro: "Encaissez, gérez vos ventes et fidélisez vos clients au même endroit.",
    features: [
      { icon: QrCode, title: 'Encaissement QR', text: 'Recevez vos paiements instantanément, sans terminal physique.' },
      { icon: Package, title: 'Gestion de catalogue', text: 'Ajoutez vos produits, suivez votre stock en temps réel.' },
      { icon: Star, title: 'Programme de fidélité', text: 'Distribuez des points à vos clients et développez leur fidélité.' },
      { icon: BarChart3, title: 'Tableau de bord des ventes', text: "Chiffre d'affaires, commandes, stock : tout au même endroit." },
    ],
    plans: [
      {
        name: 'Starter',
        price: 'Gratuit',
        period: '',
        highlight: false,
        items: [
          "Jusqu'à 50 produits",
          'Encaissement QR',
          'Tableau de bord de base',
          'Gestion des commandes fournisseurs',
        ],
      },
      {
        name: 'Pro',
        price: '99',
        period: '/mois',
        highlight: true,
        items: [
          'Produits illimités',
          'Statistiques avancées',
          'Programme de fidélité complet',
          'Support dédié',
        ],
      },
    ],
  },
  {
    key: 'fournisseur',
    icon: Truck,
    label: 'Fournisseur',
    intro: "Gérez vos catalogues, vos commandes et vos livraisons en toute efficacité.",
    features: [
      { icon: Package, title: 'Catalogue produits', text: 'Publiez vos produits, gérez vos prix et votre stock.' },
      { icon: BarChart3, title: 'Commandes en temps réel', text: 'Recevez, acceptez et suivez les commandes des commerçants.' },
      { icon: Truck, title: 'Suivi des livraisons', text: 'Générez vos bons de livraison et suivez chaque expédition.' },
      { icon: CreditCard, title: 'Paiements sécurisés', text: 'Recevez vos paiements directement sur votre compte Aswaq.' },
    ],
    plans: [
      {
        name: 'Standard',
        price: 'Gratuit',
        period: '',
        highlight: false,
        items: [
          'Catalogue produits',
          'Réception de commandes',
          'Gestion des livraisons',
          'Tableau de bord de base',
        ],
      },
      {
        name: 'Business',
        price: '149',
        period: '/mois',
        highlight: true,
        items: [
          'Tout Standard',
          'Mise en avant du catalogue',
          'Statistiques de ventes avancées',
          'Support prioritaire',
        ],
      },
    ],
  },
];

const FAQ = [
  {
    q: 'Aswaq Bank est-il un établissement agréé ?',
    a: "Aswaq Bank opère en tant qu'Établissement de Paiement, conformément au cadre réglementaire de Bank Al-Maghrib. Vos fonds et vos données sont protégés selon les exigences en vigueur.",
  },
  {
    q: 'Combien de temps prend l\'ouverture d\'un compte ?',
    a: "L'ouverture d'un compte se fait 100% en ligne et prend généralement quelques minutes, sous réserve de la vérification de votre identité.",
  },
  {
    q: 'Y a-t-il des frais cachés ?',
    a: "Non. Les tarifs affichés sur cette page sont ceux appliqués, sans frais supplémentaires non annoncés.",
  },
  {
    q: 'Puis-je changer de formule à tout moment ?',
    a: "Oui, vous pouvez passer d'une formule à l'autre à tout moment depuis votre espace Profil & Paramètres.",
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: "Toutes vos données et transactions sont protégées avec des standards de sécurité élevés, conformément aux exigences de Bank Al-Maghrib.",
  },
];

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'faq-item-open' : ''}`}>
      <button type="button" className="faq-question" onClick={() => setOpen((v) => !v)}>
        <span>{item.q}</span>
        <ChevronDown size={18} className="faq-chevron" />
      </button>
      {open && <p className="faq-answer">{item.a}</p>}
    </div>
  );
}

export default function Services() {
  const [activeTab, setActiveTab] = useState('client');
  const active = AUDIENCES.find((a) => a.key === activeTab);

  return (
    <div className="services-page">
      <Navbar />

      <main>
                {/* HERO */}
        <section className="svc-hero">
          <div className="svc-hero-decoration svc-hero-decoration-1"></div>
          <div className="svc-hero-decoration svc-hero-decoration-2"></div>

          <div className="svc-hero-badge">
            <Sparkles size={14} />
            Nos services
          </div>
          <h1 className="svc-hero-title">
            Des solutions pensées <br />
            <span>pour chaque profil</span>
          </h1>
          <p className="svc-hero-text">
            Que vous soyez client particulier, commerçant ou fournisseur, Aswaq Bank vous
            accompagne avec des outils adaptés à votre activité.
          </p>

          <div className="svc-hero-stats">
            <div className="svc-hero-stat">
              <span className="svc-hero-stat-value">100%</span>
              <span className="svc-hero-stat-label">En ligne</span>
            </div>
            <div className="svc-hero-stat-divider" />
            <div className="svc-hero-stat">
              <span className="svc-hero-stat-value">0 MAD</span>
              <span className="svc-hero-stat-label">Frais d'ouverture</span>
            </div>
            <div className="svc-hero-stat-divider" />
            <div className="svc-hero-stat">
              <span className="svc-hero-stat-value">3</span>
              <span className="svc-hero-stat-label">Profils couverts</span>
            </div>
          </div>
        </section>

        {/* TABS */}
        <section className="svc-tabs-section">
          <div className="svc-tabs">
            {AUDIENCES.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.key}
                  type="button"
                  className={`svc-tab ${activeTab === a.key ? 'svc-tab-active' : ''}`}
                  onClick={() => setActiveTab(a.key)}
                >
                  <Icon size={18} />
                  {a.label}
                </button>
              );
            })}
          </div>

          <p className="svc-tab-intro">{active.intro}</p>

          {/* FEATURES */}
          <div className="svc-features-grid">
            {active.features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="svc-feature-card">
                  <div className="svc-feature-icon"><Icon size={20} /></div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              );
            })}
          </div>

          {/* PRICING */}
          <div className="svc-pricing-grid">
            {active.plans.map((plan) => (
              <div key={plan.name} className={`svc-plan-card ${plan.highlight ? 'svc-plan-highlight' : ''}`}>
                {plan.highlight && <span className="svc-plan-badge">Le plus choisi</span>}
                <h3 className="svc-plan-name">{plan.name}</h3>
                <div className="svc-plan-price">
                  {plan.price === 'Gratuit' ? (
                    <span>Gratuit</span>
                  ) : (
                    <>
                      <span className="svc-plan-amount">{plan.price} MAD</span>
                      <span className="svc-plan-period">{plan.period}</span>
                    </>
                  )}
                </div>
                <ul className="svc-plan-list">
                  {plan.items.map((item) => (
                    <li key={item}>
                      <Check size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/create-account" className={`svc-plan-button ${plan.highlight ? 'svc-plan-button-primary' : ''}`}>
                  Commencer
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* SECURITY BANNER */}
        <section className="svc-security-banner">
          <ShieldCheck size={28} />
          <div>
            <p className="svc-security-title">Conforme au cadre réglementaire de Bank Al-Maghrib</p>
            <p className="svc-security-text">Vos données et vos fonds sont protégés selon les plus hauts standards du secteur.</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="svc-faq-section">
          <div className="section-heading">
            <h2>Questions fréquentes</h2>
            <p>Tout ce qu'il faut savoir avant de commencer.</p>
          </div>
          <div className="svc-faq-list">
            {FAQ.map((item) => (
              <FaqItem key={item.q} item={item} />
            ))}
          </div>
        </section>

        
      </main>

      <Footer />
    </div>
  );
}