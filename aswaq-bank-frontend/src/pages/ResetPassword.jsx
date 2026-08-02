import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo/Logo';
import './ResetPassword.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage(); 
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError(t('reset.errorEmpty')); 
      return;
    }
    if (password !== confirmPassword) {
      setError(t('reset.errorMatch')); 
      return;
    }
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
        <Logo  size={100} className="mb-6" />
          <h1 className="auth-title">{t('reset.title')}</h1> 
          <p className="auth-subtitle">{t('reset.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">{t('reset.newPassword')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="form-input"
              placeholder={t('reset.newPasswordPlaceholder')}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('reset.confirmPassword')}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
              className="form-input"
              placeholder={t('reset.confirmPasswordPlaceholder')}
              required
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="auth-button">
            {t('reset.submit')} 
          </button>
        </form>

        <div className="auth-footer-link">
          <Link to="/" className="back-link">
            {t('reset.back')} 
          </Link>
        </div>

        <div className="auth-footer">
          <div className="security-info">
            <Lock className="security-icon" size={16} />
            <span>{t('reset.protected')}</span> 
          </div>
          <p className="compliance">{t('reset.compliance')}</p>
        </div>
      </div>
    </div>
  );
}