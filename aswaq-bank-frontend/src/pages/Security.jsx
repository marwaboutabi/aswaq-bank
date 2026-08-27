import React, { useState } from 'react';
import {
  ShieldCheck, Lock, Sparkles, Fingerprint, Eye, ChevronDown, AlertTriangle, FileCheck,
} from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer';
import './InfoPages.css';

const MEASURES = [
  { icon: Lock, title: 'Chiffrement des données', text: "Vos données personnelles et financières sont chiffrées, aussi bien en transit qu'au repos." },
  { icon: Fingerprint, title: 'Authentification sécurisée', text: "Vérification d'identité renforcée lors de la création de compte et de la connexion." },
  { icon: Eye, title: 'Surveillance continue', text: "Détection automatique des activités suspectes sur votre compte." },
  { icon: FileCheck, title: 'Conformité réglementaire', text: "Respect strict des exigences de Bank Al-Maghrib pour les Établissements de Paiement." },
];

const TIPS = [
  "Ne partagez jamais votre mot de passe ou votre code PIN, même avec le support Aswaq Bank.",
  "Vérifiez toujours que vous êtes sur le site officiel avant de saisir vos identifiants.",
  "Activez les notifications pour être alerté de chaque transaction sur votre compte.",
  "Signalez immédiatement toute activité suspecte à notre support.",
];

const FAQ = [
  { q: 'Aswaq Bank est-il un établissement agréé ?', a: "Aswaq Bank opère en tant qu'Établissement de Paiement, conformément au cadre réglementaire de Bank Al-Maghrib. Vos fonds et vos données sont protégés selon les exigences en vigueur." },
  { q: 'Comment sont protégées mes données bancaires ?', a: "Toutes les données sensibles sont chiffrées et ne sont accessibles qu'aux systèmes strictement nécessaires au fonctionnement de votre compte." },
  { q: 'Que faire si je soupçonne une fraude sur mon compte ?', a: "Contactez immédiatement notre support via la page Aide, ou bloquez votre compte depuis Profil & Paramètres si l'option est disponible." },
  { q: 'Mes informations sont-elles partagées avec des tiers ?', a: "Non, vos données ne sont jamais vendues ni partagées à des fins commerciales avec des tiers." },
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

export default function Security() {
  return (
    <div className="info-page">
      <Navbar />
      <main>
        <section className="info-hero">
          <div className="info-hero-decoration info-hero-decoration-1"></div>
          <div className="info-hero-decoration info-hero-decoration-2"></div>
          <div className="info-hero-badge"><Sparkles size={14} /> Sécurité</div>
          <h1 className="info-hero-title">
            Votre sécurité, <br />
            <span>notre priorité absolue</span>
          </h1>
          <p className="info-hero-text">
            Nous mettons en œuvre des standards de sécurité élevés pour protéger vos données
            et vos fonds à chaque instant.
          </p>
        </section>

        <section className="info-section">
          <div className="section-heading">
            <h2>Nos mesures de protection</h2>
            <p>Une infrastructure conçue pour protéger chaque utilisateur de la plateforme.</p>
          </div>
          <div className="info-cards-grid">
            {MEASURES.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.title} className="info-card">
                  <div className="info-card-icon"><Icon size={20} /></div>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="info-section">
          <div className="info-banner">
            <ShieldCheck size={28} />
            <div>
              <p className="info-banner-title">Conforme au cadre réglementaire de Bank Al-Maghrib</p>
              <p className="info-banner-text">Aswaq Bank respecte les exigences applicables aux Établissements de Paiement au Maroc.</p>
            </div>
          </div>
        </section>

        <section className="info-section-narrow">
          <div className="section-heading">
            <h2>Bonnes pratiques</h2>
            <p>Quelques réflexes simples pour protéger votre compte au quotidien.</p>
          </div>
          <div className="info-cards-grid" style={{ gridTemplateColumns: '1fr' }}>
            {TIPS.map((tip, i) => (
              <div key={i} className="info-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '14px' }}>
                <div className="info-card-icon" style={{ marginBottom: 0, flexShrink: 0 }}>
                  <AlertTriangle size={18} />
                </div>
                <p style={{ margin: 0, color: 'var(--text)', fontSize: '13.5px', lineHeight: 1.65 }}>{tip}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="info-section-narrow">
          <div className="section-heading">
            <h2>Questions fréquentes</h2>
            <p>Tout ce qu'il faut savoir sur la sécurité de votre compte.</p>
          </div>
          <div className="info-faq-list">
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