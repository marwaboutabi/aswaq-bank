import React from 'react';
import { ShoppingBag, BarChart3, QrCode, Package, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Services() {
  const { t } = useLanguage();
  const services = [
    { icon: <ShoppingBag className="w-7 h-7" />, title: t('services.products'), desc: t('services.productsDesc'), color: 'bg-aswaq-green' },
    { icon: <BarChart3 className="w-7 h-7" />, title: t('services.dashboard'), desc: t('services.dashboardDesc'), color: 'bg-aswaq-gold' },
    { icon: <QrCode className="w-7 h-7" />, title: t('services.qr'), desc: t('services.qrDesc'), color: 'bg-aswaq-green' },
    { icon: <Package className="w-7 h-7" />, title: t('services.stock'), desc: t('services.stockDesc'), color: 'bg-aswaq-gold' },
  ];

  return (
<section id="services" className="py-16 bg-white">       <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-aswaq-green text-center mb-4">{t('services.title')}</h2>
        <div className="w-16 h-1 bg-aswaq-gold mx-auto mb-12" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition group">
              <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center text-white mb-4`}>{service.icon}</div>
              <h3 className="font-bold text-aswaq-green text-lg mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.desc}</p>
              <div className="w-8 h-8 rounded-full border border-aswaq-gold flex items-center justify-center text-aswaq-gold group-hover:bg-aswaq-gold group-hover:text-white transition">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}