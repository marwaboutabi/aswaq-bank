import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Loader2, ShieldCheck, Zap, TrendingUp, Users, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Login.css';
import Logo from '../components/Logo/Logo';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage(); // t conservé pour compatibilité, mais non utilisé ici

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
        setError('Veuillez remplir tous les champs.');
        return;
    }

    setIsLoading(true);

    try {
        const response = await api.post("/auth/login", {
            email: formData.email,
            password: formData.password
        });
        
        const { token, role } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        if (role === "CLIENT") {
            navigate("/dashboard-client");
        } else if (role === "COMMERCANT") {
            navigate("/acceuiL-com");
        } else if (role === "FOURNISSEUR") {
            navigate("/accueil-fournisseur");
        } else {
            navigate("/");
        }

   } catch (error) {
    console.error("Échec de la connexion :", error.response?.status || "Erreur réseau");
    setError("Email ou mot de passe incorrect");
} finally {
        setIsLoading(false);
    }
};

  const features = [
    { 
      icon: ShieldCheck, 
      title: 'Sécurisé', 
      text: 'Vos données sont protégées avec les plus hauts standards.' 
    },
    { 
      icon: Zap, 
      title: 'Rapide', 
      text: 'Des opérations simples et rapides à tout moment.' 
    },
    { 
      icon: TrendingUp, 
      title: 'Intelligent', 
      text: 'Des outils intelligents pour vous accompagner au quotidien.' 
    },
    { 
      icon: Users, 
      title: 'Accessible', 
      text: 'Une banque pensée pour les commerçants, fournisseurs et clients.' 
    },
  ];

  return (
    <div className="login-page">
      {/* ===== Header ===== */}
      <header className="login-navbar">
        <div className="login-navbar-inner">
          <div className="brand-block">
            <Logo size={90} />
            <div className="brand-text">
              <span className="brand-name">Aswaq Bank</span>
              <span className="brand-tagline">Votre banque, partout, pour vous.</span>
            </div>
          </div>
          <nav className="navbar-links">
            <a href="/">Accueil</a>
            <a href="/about">À propos</a>
            <a href="/security">Sécurité</a>
            <a href="/help">Aide</a>
          </nav>
          <button type="button" className="lang-switch" onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}>
            {lang.toUpperCase()} <ChevronDown size={16} />
          </button>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="login-main">
        <section className="login-hero">
          <h1 className="hero-title">
            La banque digitale
            <br />
            qui fait grandir le{' '}
            <span className="hero-accent">commerce de proximité.</span>
          </h1>
          <p className="hero-subtitle">
            Gérez vos finances, développez votre activité et profitez de services innovants, 100% en ligne.
          </p>

          <ul className="hero-features">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="hero-feature">
                <span className="hero-feature-icon">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="hero-feature-title">{title}</p>
                  <p className="hero-feature-text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Carte de connexion ===== */}
        <section className="login-card-wrapper">
          <div className="login-card">
            <div className="login-tabs">
              <span className="login-tab login-tab-active">Connexion</span>
              <Link to="/create-account" className="login-tab login-tab-link">
                Créer un compte
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Adresse e-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="exemple@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <span>Se souvenir de moi</span>
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Mot de passe oublié ?
                </Link>
              </div>

              {error && <div className="form-error">{error}</div>}

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Se connecter
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <span>ou continuer avec</span>
            </div>

            <div className="social-buttons">
              <button type="button" className="social-button" disabled={isLoading}>
                <img src="https://www.google.com/favicon.ico" alt="" width={18} height={18} />
                Google
              </button>
              <button type="button" className="social-button" disabled={isLoading}>
                <img src="https://www.microsoft.com/favicon.ico" alt="" width={18} height={18} />
                Microsoft
              </button>
            </div>

            <div className="signup-link">
              <p>Vous n'avez pas de compte ?</p>
              <Link to="/create-account" className="signup-button-link">
                Créer un compte
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}