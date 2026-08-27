import React from 'react';
import {
  Sparkles, Target, Heart, Users, ShieldCheck, TrendingUp, Rocket, Flag,
} from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer';
import './InfoPages.css';

const VALUES = [
  { icon: Target, title: 'Inclusion financière', text: "Rendre les services bancaires accessibles aux commerçants et fournisseurs du commerce de proximité, souvent laissés pour compte par la banque traditionnelle." },
  { icon: Heart, title: 'Simplicité', text: "Des outils pensés pour être utilisés au quotidien, sans jargon bancaire ni complexité inutile." },
  { icon: ShieldCheck, title: 'Confiance', text: "Une conformité stricte au cadre réglementaire de Bank Al-Maghrib, pour protéger chaque utilisateur." },
];

const TIMELINE = [
  { year: '01', title: 'Une idée née du terrain', text: "Constater que les commerçants et fournisseurs de proximité manquent d'outils financiers adaptés à leur réalité quotidienne." },
  { year: '02', title: 'Conception du produit', text: "Développement d'une plateforme unique réunissant compte digital, paiements QR, gestion de catalogue et fidélité client." },
  { year: '03', title: 'Mise en conformité', text: "Structuration de l'offre selon le statut d'Établissement de Paiement, dans le respect du cadre de Bank Al-Maghrib." },
  { year: '04', title: 'Aujourd\'hui', text: "Une plateforme pensée pour accompagner clients, commerçants et fournisseurs dans un seul écosystème digital." },
];

export default function About() {
  return (
    <div className="info-page">
      <Navbar />
      <main>
        <section className="info-hero">
          <div className="info-hero-decoration info-hero-decoration-1"></div>
          <div className="info-hero-decoration info-hero-decoration-2"></div>
          <div className="info-hero-badge"><Sparkles size={14} /> À propos</div>
          <h1 className="info-hero-title">
            La banque qui grandit <br />
            <span>avec le commerce de proximité</span>
          </h1>
          <p className="info-hero-text">
            Aswaq Bank est né d'un constat simple : les commerçants et fournisseurs qui font
            vivre l'économie de proximité au Maroc méritent des outils financiers aussi
            modernes que ceux des grandes entreprises.
          </p>

          <div className="info-stats-bar">
            <div className="info-stat"><span className="info-stat-value">3</span><span className="info-stat-label">Profils accompagnés</span></div>
            <div className="info-stat-divider" />
            <div className="info-stat"><span className="info-stat-value">100%</span><span className="info-stat-label">Digital</span></div>
            <div className="info-stat-divider" />
            <div className="info-stat"><span className="info-stat-value">BAM</span><span className="info-stat-label">Cadre réglementaire</span></div>
          </div>
        </section>

        <section className="info-section">
          <div className="section-heading">
            <h2>Notre mission</h2>
            <p>Donner à chaque acteur du commerce de proximité les moyens de développer son activité sereinement.</p>
          </div>
          <div className="info-cards-grid">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="info-card">
                  <div className="info-card-icon"><Icon size={20} /></div>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="info-section-narrow">
          <div className="section-heading">
            <h2>Notre parcours</h2>
            <p>De l'idée à la plateforme que vous utilisez aujourd'hui.</p>
          </div>
          <div className="info-timeline">
            {TIMELINE.map((item) => (
              <div key={item.year} className="info-timeline-item">
                <div className="info-timeline-dot">{item.year}</div>
                <div className="info-timeline-content">
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="info-section">
          <div className="info-banner">
            <Rocket size={28} />
            <div>
              <p className="info-banner-title">Une plateforme en constante évolution</p>
              <p className="info-banner-text">Nous développons continuellement de nouveaux outils pour mieux accompagner nos utilisateurs.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}