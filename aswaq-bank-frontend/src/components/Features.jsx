import React from 'react';
import { Phone, Award, Bell, Headphones } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Features() {
  const { t } = useLanguage();
  const features = [
    { icon: <Phone className="w-6 h-6" />, title: t('features.digital'), desc: t('features.digitalDesc'), color: 'bg-aswaq-green' },
    { icon: <Award className="w-6 h-6" />, title: t('features.loyalty'), desc: t('features.loyaltyDesc'), color: 'bg-aswaq-gold' },
    { icon: <Bell className="w-6 h-6" />, title: t('features.notif'), desc: t('features.notifDesc'), color: 'bg-aswaq-green' },
    { icon: <Headphones className="w-6 h-6" />, title: t('features.support'), desc: t('features.supportDesc'), color: 'bg-aswaq-gold' },
  ];

  return (
    <section className="py-16 bg-aswaq-beige">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className={`w-14 h-14 ${feature.color} rounded-full flex items-center justify-center text-white shrink-0`}>{feature.icon}</div>
              <div>
                <h3 className="font-bold text-aswaq-green mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}