import React from 'react';
import { Bell, Eye, QrCode, Package, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; // ✅ Ajoute cet import

export default function PhoneMockup() {
  const { t } = useLanguage(); // ✅ Ajoute ce hook

  return (
    <div className="bg-aswaq-green rounded-[2.5rem] p-3 shadow-2xl max-w-[280px]">
      <div className="bg-white rounded-[2rem] overflow-hidden">
        {/* Header vert */}
        <div className="bg-aswaq-green px-5 pt-6 pb-4 text-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm">{t('phoneMockup.greeting')}</span>
            <Bell className="w-5 h-5" />
          </div>
          <div className="text-xs opacity-80 mb-1">{t('phoneMockup.availableBalance')}</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">12 450,00 <span className="text-sm font-normal">MAD</span></div>
            <Eye className="w-5 h-5 opacity-70" />
          </div>
        </div>

        {/* Ventes du jour */}
        <div className="p-4 border-b">
          <div className="text-xs text-gray-500 mb-1">{t('phoneMockup.dailySales')}</div>
          <div className="flex items-center justify-between">
            <div className="font-bold text-aswaq-green">1 250,00 MAD</div>
            <svg className="w-16 h-8 text-aswaq-green" viewBox="0 0 60 30">
              <path d="M0 25 L10 20 L20 22 L30 15 L40 10 L50 12 L60 5" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        {/* Icônes rapides */}
        <div className="grid grid-cols-4 gap-2 p-4 border-b text-center">
          {[
            { icon: <QrCode className="w-4 h-4" />, label: t('phoneMockup.qrPayment') },
            { icon: <Package className="w-4 h-4" />, label: t('phoneMockup.stock') },
            { icon: <Heart className="w-4 h-4" />, label: t('phoneMockup.loyalty') },
            { icon: <Bell className="w-4 h-4" />, label: t('phoneMockup.notifications') },
          ].map((item, i) => (
            <div key={i}>
              <div className="w-8 h-8 mx-auto bg-aswaq-beige rounded-lg flex items-center justify-center text-aswaq-green mb-1">
                {item.icon}
              </div>
              <div className="text-[9px] text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="font-semibold text-sm text-aswaq-green">{t('phoneMockup.recentTransactions')}</div>
            <div className="text-xs text-aswaq-gold">{t('phoneMockup.seeAll')}</div>
          </div>
          <div className="space-y-3">
            <TransactionRow 
              name={t('phoneMockup.paymentReceived')} 
              time={t('phoneMockup.today') + ', 10:30'} 
              amount="+250,00 MAD" 
              positive 
            />
            <TransactionRow 
              name={t('phoneMockup.supplierPurchase')} 
              time={t('phoneMockup.today') + ', 09:15'} 
              amount="-120,00 MAD" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TransactionRow({ name, time, amount, positive }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${positive ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
          {positive ? 'R' : 'A'}
        </div>
        <div>
          <div className="text-xs font-medium text-gray-800">{name}</div>
          <div className="text-[10px] text-gray-400">{time}</div>
        </div>
      </div>
      <div className={`text-xs font-semibold ${positive ? 'text-green-600' : 'text-red-500'}`}>{amount}</div>
    </div>
  );
}