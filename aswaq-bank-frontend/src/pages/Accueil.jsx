import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  User,
  Store,
  Truck,
  Smartphone,
  ShieldCheck,
  Zap,
  BarChart3,
  Headphones,
  CreditCard,
  Lock,
  QrCode,
  Send,
  Plus,
  Bell,
  Eye,
  Package,
  Receipt
} from 'lucide-react';

import Logo from '../components/Logo/Logo';
import Navbar from '../components/Navbar/Navbar'; // ✅ Nouvelle navbar
import Footer from '../components/Footer'; // ✅ Footer
import './Accueil.css';

export default function Accueil() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}
      <Navbar />


      {/* ================= HERO ================= */}
      <main>

        <section className="hero-section">
          <div className="hero-container">

            {/* LEFT */}
            <div className="hero-content">

              <div className="hero-badge">
                La banque digitale nouvelle génération
              </div>

              <h1 className="hero-title">
                La banque digitale
                <br />
                qui fait grandir le
                <br />
                <span>commerce de proximité.</span>
              </h1>

              <p className="hero-description">
                Gérez vos finances, développez votre activité
                <br />
                et profitez de services innovants,
                <strong> 100% en ligne.</strong>
              </p>

              <div className="hero-buttons">

                <Link to="/create-account" className="primary-button">
                  Ouvrir un compte
                  <ArrowRight size={20} />
                </Link>

                <Link to="/services" className="secondary-button">
                  Découvrir nos services
                </Link>

              </div>

              <div className="security-message">
                <div className="security-icon">
                  <Lock size={19} />
                </div>

                <div>
                  <strong>Vos données sont protégées</strong>
                  <p>
                    Conforme aux exigences de Bank Al-Maghrib.
                  </p>
                </div>
              </div>

            </div>


            {/* RIGHT - DASHBOARD MOCKUP */}
            <div className="hero-dashboard-wrapper">

              <div className="dashboard-decoration decoration-one"></div>
              <div className="dashboard-decoration decoration-two"></div>

              <div className="dashboard">

                {/* SIDEBAR */}
                <aside className="dashboard-sidebar">

                  <div className="dashboard-logo">
                    <Logo size={75} />
                  </div>

                  <div className="dashboard-menu">

                    <div className="dashboard-menu-item selected">
                      <BarChart3 size={17} />
                      <span>Tableau de bord</span>
                    </div>

                    <div className="dashboard-menu-item">
                      <CreditCard size={17} />
                      <span>Comptes</span>
                    </div>

                    <div className="dashboard-menu-item">
                      <Receipt size={17} />
                      <span>Transactions</span>
                    </div>

                    <div className="dashboard-menu-item">
                      <QrCode size={17} />
                      <span>Paiements</span>
                    </div>

                    <div className="dashboard-menu-item">
                      <Send size={17} />
                      <span>Virements</span>
                    </div>

                    <div className="dashboard-menu-item">
                      <CreditCard size={17} />
                      <span>Cartes</span>
                    </div>

                    <div className="dashboard-menu-item">
                      <Package size={17} />
                      <span>Facturation</span>
                    </div>

                  </div>

                  <div className="dashboard-menu-bottom">

                    <div className="dashboard-menu-item">
                      <Smartphone size={17} />
                      <span>Paramètres</span>
                    </div>

                    <div className="dashboard-menu-item">
                      <Headphones size={17} />
                      <span>Aide & Support</span>
                    </div>

                  </div>

                </aside>


                {/* DASHBOARD CONTENT */}
                <div className="dashboard-content">

                  <div className="dashboard-top">
                    <span>
                      Bonjour, Ahmad 👋
                    </span>

                    <Bell size={19} />
                  </div>


                  {/* BALANCE */}
                  <div className="balance-card">

                    <div className="balance-label">
                      Solde disponible
                      <Eye size={17} />
                    </div>

                    <div className="balance-value">
                      12 450,00 MAD
                    </div>

                    <div className="account-number">
                      Compte principal ···· 4587
                    </div>

                    <div className="balance-wave"></div>

                  </div>


                  {/* QUICK ACTIONS */}
                  <div className="quick-actions">

                    <div className="quick-action">
                      <div className="quick-icon">
                        <Send size={20} />
                      </div>
                      <span>Virement</span>
                    </div>

                    <div className="quick-action">
                      <div className="quick-icon">
                        <QrCode size={20} />
                      </div>
                      <span>Paiement</span>
                    </div>

                    <div className="quick-action">
                      <div className="quick-icon">
                        <Plus size={21} />
                      </div>
                      <span>Recharger</span>
                    </div>

                  </div>


                  {/* TRANSACTIONS */}
                  <div className="transactions-card">

                    <div className="transactions-header">
                      <strong>Transactions récentes</strong>
                      <span>Voir tout →</span>
                    </div>

                    <Transaction
                      icon={<ArrowRight size={16} />}
                      title="Paiement reçu"
                      date="Aujourd'hui, 14:35"
                      amount="+ 1 250,00 MAD"
                      positive
                    />

                    <Transaction
                      icon={<Send size={16} />}
                      title="Virement envoyé"
                      date="Hier, 16:20"
                      amount="- 850,00 MAD"
                    />

                    <Transaction
                      icon={<Package size={16} />}
                      title="Achat fournitures"
                      date="Hier, 09:15"
                      amount="- 320,00 MAD"
                    />

                  </div>

                </div>

              </div>


              {/* BANK CARD */}
              <div className="bank-card">

                <div className="bank-card-brand">
                  <span className="card-logo-a">A</span>
                  <span>ASWAQ BANK</span>
                </div>

                <div className="card-chip"></div>

                <div className="card-number">
                  1234 5678 9012 3456
                </div>

                <div className="card-bottom">
                  <span>AHMED EL ARRANI</span>
                  <strong>VISA</strong>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* ================= AUDIENCE ================= */}
        <section className="audience-section">

          <div className="section-heading">
            <h2>Une banque pensée pour vous</h2>
            <p>
              Des solutions adaptées à vos besoins, que vous soyez
              particulier, commerçant ou fournisseur.
            </p>
          </div>

          <div className="audience-grid">

            <AudienceCard
              icon={<User size={29} />}
              title="Client Particulier"
              text="Gérez votre argent au quotidien, épargnez et réalisez vos projets en toute simplicité."
            />

            <AudienceCard
              icon={<Store size={29} />}
              title="Commerçant"
              text="Développez votre activité, encaissez, gérez vos ventes et fidélisez vos clients."
            />

            <AudienceCard
              icon={<Truck size={29} />}
              title="Fournisseur"
              text="Gérez vos catalogues, commandes et relations avec les commerçants en toute efficacité."
            />

          </div>

        </section>


        {/* ================= SERVICES ================= */}
        <section className="services-section">

          <div className="section-heading">
            <h2>Tout ce dont vous avez besoin, au même endroit</h2>
            <p>
              Des services complets pour gérer votre banque et votre activité.
            </p>
          </div>

          <div className="services-grid">

            <ServiceCard
              icon={<Smartphone />}
              title="100% en ligne"
              text="Ouvrez votre compte et gérez-le depuis votre mobile."
            />

            <ServiceCard
              icon={<ShieldCheck />}
              title="Sécurisé"
              text="Vos données et transactions sont protégées avec les plus hauts standards."
            />

            <ServiceCard
              icon={<Zap />}
              title="Rapide"
              text="Des opérations simples et rapides à tout moment."
            />

            <ServiceCard
              icon={<BarChart3 />}
              title="Intelligent"
              text="Des outils et tableaux de bord pour piloter votre activité."
            />

            <ServiceCard
              icon={<Headphones />}
              title="Support dédié"
              text="Une équipe à votre écoute 7j/7 pour vous accompagner."
            />

            <ServiceCard
              icon={<CreditCard />}
              title="Cartes & Paiements"
              text="Cartes bancaires, paiements et retraits adaptés à vos besoins."
            />

          </div>


          

        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
}


/* ================= COMPONENTS ================= */

function Transaction({
  icon,
  title,
  date,
  amount,
  positive
}) {
  return (
    <div className="transaction">

      <div className={`transaction-icon ${positive ? 'positive' : ''}`}>
        {icon}
      </div>

      <div className="transaction-info">
        <strong>{title}</strong>
        <span>{date}</span>
      </div>

      <div className={`transaction-amount ${positive ? 'positive-text' : ''}`}>
        {amount}
      </div>

    </div>
  );
}


function AudienceCard({ icon, title, text }) {
  return (
    <div className="audience-card">

      <div className="audience-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <Link to="/services">
        En savoir plus
        <ArrowRight size={17} />
      </Link>

    </div>
  );
}


function ServiceCard({ icon, title, text }) {
  return (
    <div className="service-card">

      <div className="service-icon">
        {icon}
      </div>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>

    </div>
  );
}