import React from 'react';
import Logo from '../components/Logo/Logo';

export default function Footer() {
  return (
    <footer className="home-footer">
      <div className="home-footer-grid">
        {/* Logo & Description */}
        <div className="home-footer-col">
          <div className="home-footer-logo">
            <Logo size={80} />
          </div>
          <p className="home-footer-desc">
            La banque digitale qui fait grandir le commerce de proximité au Maroc.
          </p>
        </div>

        {/* Services */}
        <div className="home-footer-col">
          <h4>Services</h4>
          <ul>
            <li><button type="button">Paiement QR</button></li>
            <li><button type="button">Gestion de stock</button></li>
            <li><button type="button">Fidélité client</button></li>
          </ul>
        </div>

        {/* Entreprise */}
        <div className="home-footer-col">
          <h4>Entreprise</h4>
          <ul>
            <li><button type="button">À propos</button></li>
            <li><button type="button">Contact</button></li>
            <li><button type="button">Carrières</button></li>
          </ul>
        </div>

        {/* Légal */}
        <div className="home-footer-col">
          <h4>Légal</h4>
          <ul>
            <li><button type="button">Conditions générales (CGU)</button></li>
            <li><button type="button">Politique de confidentialité</button></li>
            <li><button type="button">Mentions légales</button></li>
          </ul>
        </div>
      </div>

      <div className="home-footer-bottom">
        © 2026 Aswaq Bank. Tous droits réservés. Conforme aux exigences de Bank Al-Maghrib.
      </div>
    </footer>
  );
}