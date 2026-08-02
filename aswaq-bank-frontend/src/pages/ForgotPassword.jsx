import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo/Logo';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage(); 
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError(t('forgot.errorEmpty')); 
      return;
    }
    // Simulation : redirection vers OTP
    navigate('/verify-otp');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Logo size={100} className="mb-6" />
          
          <h1 className="auth-title">{t('forgot.title')}</h1> 
          <p className="auth-subtitle">
            {t('forgot.subtitle')} 
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">{t('forgot.email') || 'Email'}</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="form-input"
              placeholder={t('forgot.emailPlaceholder') || "exemple@email.com"}
              required
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="auth-button">
            {t('forgot.submit')} 
          </button>
          
          <div className="auth-footer-link">
            <Link to="/" className="back-link">
              {t('forgot.back')} 
            </Link>
          </div>
        </form>

        <div className="auth-footer">
          <div className="security-info">
            <Lock className="security-icon" size={16} />
            <span>{t('forgot.protected')}</span> 
          </div>
          <p className="compliance">
            {t('forgot.compliance')}
          </p>
        </div>
      </div>
    </div>
  );
}