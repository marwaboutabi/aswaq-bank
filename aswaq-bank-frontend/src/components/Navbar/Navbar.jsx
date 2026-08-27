import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../Logo/Logo';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
  ];

  return (
    <nav className="simple-navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <Logo size={90} />
        </div>

        {/* Liens de navigation */}
        <div className="navbar-links">
         <Link to="/services" className="nav-link">
  Nos services
</Link>
          <button 
            onClick={() => navigate('/login')} 
            className="nav-link"
          >
            Se connecter
          </button>
          
          <button 
            onClick={() => navigate('/create-account')} 
            className="nav-link nav-link-highlight"
          >
           Ouvrir un compte
          </button>
        </div>

        {/* Sélecteur de langue */}
        <div className="navbar-lang">
          <button className="lang-selector" onClick={() => setLangOpen(!langOpen)}>
            {lang.toUpperCase()}
            <ChevronDown size={16} />
          </button>

          {langOpen && (
            <div className="lang-dropdown">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setLangOpen(false); }}
                  className={`lang-option ${lang === l.code ? 'active' : ''}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}