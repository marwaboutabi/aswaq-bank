import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, Zap, Lock } from 'lucide-react';
import PhoneMockup from './PhoneMockup';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-aswaq-green leading-tight mb-6">
            {t('hero.title1')}
            <span className="text-aswaq-gold">{t('hero.title2')}</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => navigate('/create-account')}
              className="bg-aswaq-green text-white px-8 py-4 rounded-full font-medium flex items-center gap-2 hover:bg-aswaq-green-light transition shadow-lg shadow-aswaq-green/20 cursor-pointer"
            >
              {t('hero.btn1')} <ChevronRight className="w-5 h-5" />
            </button>

            <a
              href="#services"
              className="border-2 border-aswaq-green text-aswaq-green px-8 py-4 rounded-full font-medium hover:bg-aswaq-green hover:text-white transition cursor-pointer no-underline"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              {t('hero.btn2')}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FeatureBadge
              icon={<Shield className="w-6 h-6" />}
              title={t('hero.secure')}
              desc={t('hero.secureDesc')}
            />
            <FeatureBadge
              icon={<Zap className="w-6 h-6" />}
              title={t('hero.fast')}
              desc={t('hero.fastDesc')}
            />
            <FeatureBadge
              icon={<Lock className="w-6 h-6" />}
              title={t('hero.compliant')}
              desc={t('hero.compliantDesc')}
            />
          </div>
        </div>

        <div className="relative bg-aswaq-beige rounded-3xl p-6 md:p-10 overflow-hidden flex justify-center">
          <div className="absolute top-0 right-0 w-40 h-40 bg-aswaq-gold/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-aswaq-green/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureBadge({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 rounded-full bg-aswaq-beige flex items-center justify-center text-aswaq-green shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-aswaq-green">{title}</h3>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  );
}