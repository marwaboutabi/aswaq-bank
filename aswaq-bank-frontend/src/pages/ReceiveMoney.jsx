import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Bell,
  ChevronDown,
  Copy,
  Download,
  Share2,
  Info,
  CheckCircle2,
  Clock,
  Building2,
  User,
  Check,
  Home,
  CreditCard,
  ArrowLeftRight,
  Receipt,
  Star,
  PiggyBank,
  PieChart,
  Bot
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './ReceiveMoney.css';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';
import NotificationBell from '../components/NotificationBell/NotificationBell';


// ===== MENU ESPACE CLIENT =====
const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/dashboard-client' },
  { icon: CreditCard, label: 'Gestion du compte', to: '/mon-compte' },
  { icon: ArrowLeftRight, label: 'Historique des transactions', to: '/transactions-client' },
  { icon: Receipt, label: 'Tickets numériques', to: '/tickets-client' },
  { icon: Star, label: 'Points de fidélité', to: '/fidelite' },
  { icon: PiggyBank, label: "Objectifs d'épargne", to: '/epargne' },
  { icon: PieChart, label: 'Suivi des dépenses', to: '/depenses' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant' },
  { icon: User, label: 'Profil et paramètres', to: '/parametres' },
];

export default function ReceiveMoney() {
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [transactionsReceived, setTransactionsReceived] = useState([]);
const [loadingTransactions, setLoadingTransactions] = useState(true);
 useEffect(() => {

    const token = localStorage.getItem("token");

    axios.get(
      "http://localhost:8080/api/transactions/received",
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )
    .then(response => {

        setTransactionsReceived(response.data);

    })
    .catch(error => {

        console.log("Erreur récupération transactions :", error);

    })
    .finally(()=>{
        setLoadingTransactions(false);
    });

}, []); 
useEffect(() => {

    axios.get("http://localhost:8080/api/receive-money/info", {
        headers:{
            Authorization:
            `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => {

        setUserData(response.data);

    })
    .catch(error => {

        console.log("Erreur récupération compte :", error);

    });

}, []);
  const handleCopyIBAN = () => {
    navigator.clipboard.writeText(userData?.rib?.replace(/\s/g, '') || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {

  const canvas = document.querySelector(".rm-qr-code canvas");

  if (!canvas) {
    return;
  }

  const url = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = url;
  link.download = "AswaqBank-QR.png";

  link.click();
};

  const handleShareQR = () => {

  const qrData = JSON.stringify({
    bank:"Aswaq Bank",
    rib:userData?.rib,
    name:`${userData?.nom} ${userData?.prenom}`
  });

  if(navigator.share){

    navigator.share({
      title:"Mon QR Aswaq Bank",
      text:qrData
    });

  } else {
    handleCopyIBAN();
  }
};
  

  const formatAmount = (amount) => {

  if (!amount) return "0.00";

  return Number(amount).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-logo">
          <Logo size={100}  className="mb-6 logo-white"/>
        </div>
        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                state={location.state}
                className={`dash-nav-item ${item.active ? 'dash-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <a href="/" className="dash-logout">
          <span>Déconnexion</span>
        </a>
      </aside>

      {/* Main */}
      <main className="dash-main receive-money-main">
        {/* Topbar */}
        <header className="rm-topbar">
          <div>
            <h1 className="rm-greeting">Bonjour, Marwa 👋</h1>
            <p className="rm-greeting-sub">Voici les informations pour recevoir de l'argent.</p>
          </div>
          <div className="rm-topbar-actions">
            <div className="dash-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
         <NotificationBell />
            <div className="dash-user-chip">
              <div className="dash-user-avatar">MB</div>
              <span>Marwa Boutabi</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Page header */}
        <div className="rm-page-header">
          <button type="button" className="rm-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="rm-page-title">Recevoir de l'argent</h1>
            <p className="rm-page-subtitle">Partagez vos informations pour recevoir des paiements facilement.</p>
          </div>
        </div>

        {/* 3 cartes du haut */}
        <div className="rm-top-cards">
          {/* Carte IBAN */}
          <div className="rm-card rm-iban-card">
            <div className="rm-card-header">
              <h3 className="rm-card-title">Mon IBAN</h3>
              <Info size={16} className="rm-info-icon" />
            </div>
            <p className="rm-card-desc">Partagez votre IBAN pour recevoir des virements depuis d'autres comptes.</p>
            
            <div className="rm-iban-display">
<span className="rm-iban-text">
 {userData?.rib || "Chargement..."}
</span>              <button type="button" className="rm-copy-iban-btn" onClick={handleCopyIBAN}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <button type="button" className="rm-action-btn rm-action-btn-outline" onClick={handleCopyIBAN}>
              {copied ? <><Check size={16} /> IBAN copié !</> : <><Copy size={16} /> Copier l'IBAN</>}
            </button>
          </div>

          {/* Carte QR Code */}
          <div className="rm-card rm-qr-card">
            <div className="rm-card-header">
              <h3 className="rm-card-title">Mon QR Code</h3>
              <Info size={16} className="rm-info-icon" />
            </div>
            <p className="rm-card-desc">Montrez ce QR Code à la personne qui souhaite vous envoyer de l'argent.</p>

            <div className="rm-qr-display">
              <div className="rm-qr-code">
                <QRCodeCanvas
 value={
   userData?.rib
   ? JSON.stringify({
       type: "ASWAQ_TRANSFER",
       bank: "Aswaq Bank",
       rib: userData.rib,
       name: `${userData.nom} ${userData.prenom}`
     })
   : ""
 }
 size={180}
 level="H"
 includeMargin={true}
/>
              </div>
            </div>

            <div className="rm-qr-actions">
              <button type="button" className="rm-action-btn rm-action-btn-outline" onClick={handleDownloadQR}>
                <Download size={16} /> Télécharger
              </button>
              <button type="button" className="rm-action-btn rm-action-btn-outline" onClick={handleShareQR}>
                <Share2 size={16} /> Partager
              </button>
            </div>
          </div>

          {/* Carte Info */}
          <div className="rm-card rm-info-card">
            <div className="rm-info-card-icon">
              <CheckCircle2 size={24} />
            </div>
            <p className="rm-info-card-text">
              Les virements entre comptes Aswaq Bank sont généralement <strong>instantanés</strong>.
            </p>
            <p className="rm-info-card-text">
              Les virements provenant d'autres banques peuvent prendre jusqu'à <strong>24 heures ouvrables</strong>.
            </p>
            <div className="rm-info-card-illustration">
              <Building2 size={48} className="rm-bank-icon" />
              <Clock size={24} className="rm-clock-icon" />
            </div>
          </div>
        </div>

        {/* 2 cartes du bas */}
        <div className="rm-bottom-cards">
        

          {/* Historique des fonds reçus */}
          <div className="rm-card rm-history-card">
            <div className="rm-history-header">
              <h3 className="rm-card-title">Historique des fonds reçus</h3>
              <button type="button" className="rm-view-all-btn">Voir tout</button>
            </div>

            <div className="rm-history-table-wrapper">
              <table className="rm-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Expéditeur</th>
                    <th>Référence</th>
                    <th>Montant</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
{transactionsReceived.map((tx) => (
                      <tr key={tx.id}>
                      <td className="rm-history-date">
   {new Date(tx.transactionDate).toLocaleDateString("fr-FR")}
</td>
                      <td>
                        <div className="rm-sender-info">
                          <div className="rm-sender-avatar">
{tx.senderName?.substring(0,2).toUpperCase()}                          </div>
                          <div className="rm-sender-details">
                            <span className="rm-sender-name">{tx.senderName}</span>
                            {tx.type && <span className="rm-sender-type">{tx.type}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="rm-history-ref">{tx.transactionReference}</td>
                      <td className="rm-history-amount">+ {formatAmount(tx.amount)} MAD</td>
                      <td>
                        <span className="rm-status-badge rm-status-received">
                          <Check size={12} /> Reçu
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}