// src/components/Logo.jsx
import React from 'react';
import './Logo.css';
import aswaqIcon from '../../assets/logo.png';

export default function Logo({
  size = 100,
  className = '',
}) {
  // Nouveau logo complet (icône + "ASWAQ BANK" + tagline) intégré dans une seule image.
  // Plus besoin de recréer le texte en CSS à côté : tout est déjà dans le fichier source.
  return (
    <div className={`logo-wrapper ${className}`}>
      <img
        className="logo-svg"
        src={aswaqIcon}
        alt="ASWAQ BANK - Votre avenir. Notre engagement."
        style={{ height: size, width: 'auto' }}
      />
    </div>
  );
}