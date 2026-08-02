import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react'; 
import { useLanguage } from '../context/LanguageContext'; 
import './VerifyOTP.css';
import Logo from '../components/Logo/Logo'; 

export default function VerifyOTP() {
  const navigate = useNavigate();
  const { t } = useLanguage(); 
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  // Focus sur le premier champ au montage
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.split('').slice(0, 6);
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }

    if (value === '' || /^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setError(t('otp.errorEmpty')); 
      return;
    }
    if (code === '123456') {
      navigate('/reset-password');
    } else {
      setError(t('otp.error')); 
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
    alert(t('otp.resendSuccess')); 
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          
        <Logo  size={100} className="mb-6" />
          
          <h1 className="auth-title">{t('otp.title')}</h1> 
          <p className="auth-subtitle">
            {t('otp.subtitle')} 
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input"
              />
            ))}
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="auth-button">
            {t('otp.submit')} 
          </button>
        </form>

        <div className="auth-footer-link" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <button type="button" className="resend-link" onClick={handleResend}>
            {t('otp.resend')} 
          </button>
          <Link to="/forgot-password" className="back-link">
            {t('otp.back')} 
          </Link>
        </div>

        <div className="auth-footer">
          <div className="security-info">
            <Lock className="security-icon" size={16} />
            <span>{t('otp.protected')}</span>
          </div>
          <p className="compliance">
            {t('otp.compliance')} 
          </p>
        </div>
      </div>
    </div>
  );
}