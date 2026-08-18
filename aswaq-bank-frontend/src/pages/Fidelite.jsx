import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate  } from 'react-router-dom';
import {
  Home, ArrowLeftRight, ShoppingBag, Receipt, Star, PiggyBank, PieChart,
  Bell, Bot, User, LogOut, Gift, Clock, Store,
  ShoppingCart, QrCode, RotateCcw, Coffee, Truck, Percent, Gem, Sparkles,
  Smartphone, PartyPopper, Calculator,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './Fidelite.css';
import './DashboardClient.css';
import loyaltyService from "../services/loyaltyService";
import { QRCodeSVG } from "qrcode.react";
import UserHeader from '../components/UserHeader/UserHeader';
import NotificationBell from '../components/NotificationBell/NotificationBell';


const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/dashboard-client' },
  { icon: ArrowLeftRight, label: 'Gestion du compte', to: '/mon-compte' },
  { icon: Receipt, label: 'Tickets numériques', to: '/tickets-client' },
  { icon: Star, label: 'Points de fidélité', to: '/fidelite' },
  { icon: PiggyBank, label: "Objectifs d'épargne", to: '/epargne' },
  { icon: PieChart, label: 'Suivi des dépenses', to: '/depenses' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant' },
  { icon: User, label: 'Profil et paramètres', to: '/parametres' },
];

const LEVELS = [
  { name: 'Bronze', threshold: 0 },
  { name: 'Argent', threshold: 500 },
  { name: 'Or', threshold: 1500 },
  { name: 'Platine', threshold: 3000 },
];


export default function Fidelite() {
  const [partners, setPartners] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
const [points, setPoints] = useState(0);
const [level, setLevel] = useState("Bronze");
const [activeTab, setActiveTab] = useState(null);
const [activities, setActivities] = useState([]);
const [converting, setConverting] = useState(false);
const [conversionMessage, setConversionMessage] = useState("");
const [myRewards, setMyRewards] = useState([]);

useEffect(() => {
  const loadHistory = async () => {
    try {
      const data = await loyaltyService.getHistory();

      const formatted = data.map((item) => ({
  id: item.id,
  name: item.description,
  date: new Date(item.createdAt).toLocaleDateString("fr-FR"),
  points: Math.abs(item.points),
  type: item.type === "EARNED" ? "earned" : "spent",
  icon: item.type === "EARNED" ? ShoppingBag : Gift, // ou toute icône pertinente
}));

      setActivities(formatted);
    } catch (error) {
      console.error("Erreur historique fidélité", error);
    }
  };

  loadHistory();
}, []);
useEffect(() => {

    const loadLoyalty = async () => {

        try {

            const data = await loyaltyService.getMyPoints();


            setPoints(data.points);
            setLevel(data.level);


        } catch(error){

            console.error(
                "Erreur chargement fidélité",
                error
            );

        }

    };


    loadLoyalty();


}, []);
useEffect(() => {
  const loadRewards = async () => {
    try {
      const data = await loyaltyService.getRewards();

      setMyRewards(data);
    } catch (error) {
      console.error("Erreur chargement récompenses", error);
    }
  };

  loadRewards();
}, []);
useEffect(() => {
    const loadPartners = async () => {
        try {
            const data = await loyaltyService.getPartners();

            setPartners(data);

        } catch (error) {
            console.error(
                "Erreur chargement partenaires",
                error
            );

            setPartners([]);
        }
    };

    loadPartners();
}, []);

  const currentLevel =
  [...LEVELS]
    .reverse()
    .find((l) => points >= l.threshold) || LEVELS[0];

const currentLevelIndex = LEVELS.findIndex(
  (l) => l.name === currentLevel.name
);

const nextLevel = LEVELS[currentLevelIndex + 1] || null;

const pointsRemaining = nextLevel
  ? Math.max(0, nextLevel.threshold - points)
  : 0;

const progressPercent = nextLevel
  ? Math.min(
      100,
      Math.max(
        0,
        ((points - currentLevel.threshold) /
          (nextLevel.threshold - currentLevel.threshold)) *
          100
      )
    )
  : 100;

const estimatedValue = Math.round(points * 0.1);

  const ACTIONS = [
    { key: 'gagner', icon: Star, title: 'Gagner des points', desc: 'Découvrez comment' },
{
  key: 'echanger',
  icon: Gift,
  title: 'Échanger mes points',
  desc: '200 pts = 20 MAD'
},    
{ key: 'partenaires', icon: Store, title: 'Partenaires', desc: 'Où gagner des points' },
  ];
const handleConvertPoints = async () => {

    if (points < 200) {
        setConversionMessage(
            "Vous devez avoir au moins 200 points pour obtenir un bon de 20 MAD."
        );
        return;
    }

    try {

        setConverting(true);
        setConversionMessage("");

        const reward = await loyaltyService.convertPoints();

        setMyRewards((prev) => [
            reward,
            ...prev
        ]);

        // Recharger les vrais points depuis le backend
        const updatedAccount =
            await loyaltyService.getMyPoints();

        setPoints(updatedAccount.points);
        setLevel(updatedAccount.level);

        // Recharger également l'historique
        const history =
            await loyaltyService.getHistory();

        const formatted = history.map((item) => ({
            id: item.id,
            name: item.description,
            date: item.createdAt
                ? new Date(item.createdAt)
                    .toLocaleDateString("fr-FR")
                : "-",
            points: Math.abs(item.points || 0),
            type: item.type === "EARNED"
                ? "earned"
                : "spent",
            icon: item.type === "EARNED"
                ? ShoppingBag
                : Gift,
        }));

        setActivities(formatted);

        setConversionMessage(
            `Félicitations ! Votre bon de ${reward.rewardAmount} MAD a été créé.`
        );

    } catch (error) {

        console.error(
            "Erreur conversion points",
            error
        );

        setConversionMessage(
            error.response?.data?.message ||
            "Impossible de convertir vos points."
        );

    } finally {

        setConverting(false);

    }
};
  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="acc-sidebar-logo">
          <Logo size={100} className="mb-6" logo-white/>
        </div>
        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.to === '/fidelite';
            return (
              <Link
                key={item.label}
                to={item.to}
                state={location.state}
                className={`dash-nav-item ${isActive ? 'dash-nav-item-active' : ''}`}
              >
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="dash-help-card">
          <div className="dash-help-icon"><Bot size={20} /></div>
          <p className="dash-help-title">Besoin d'aide ?</p>
          <p className="dash-help-text">Notre assistant IA est là pour vous aider</p>
          <button type="button" className="dash-help-button">Discuter avec l'IA →</button>
        </div>
        <Link to="/" className="dash-logout">
          <LogOut size={18} /> Déconnexion
        </Link>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <header className="dash-topbar">
          <div>
            <h1 className="dash-greeting"><Star size={22} className="fid-title-star" /> Points de fidélité</h1>
            <p className="dash-greeting-sub">Gagnez des points, progressez et profitez de récompenses exclusives.</p>
          </div>
          <div className="dash-topbar-actions">
           <NotificationBell />
            <UserHeader />
          </div>
        </header>

        {/* ===== Carte principale : points + niveau ===== */}
        <div className="fid-hero-card">
          <div className="fid-hero-left">
            <span className="fid-hero-label">Mes points actuels</span>
            <span className="fid-hero-amount">{points.toLocaleString('fr-FR')} <small>pts</small></span>
            <span className="fid-hero-value">≈ {estimatedValue} MAD de réductions</span>
          </div>

          <div className="fid-hero-center">
            <span className="fid-hero-label">Niveau actuel</span>
            <div className="fid-level-badge">
              <Gem size={15} /> {currentLevel.name}
            </div>
          </div>

          <div className="fid-hero-right">
            <Sparkles size={14} className="fid-hero-sparkle" style={{ top: '15%', right: '22%' }} />
            <Sparkles size={10} className="fid-hero-sparkle" style={{ top: '55%', right: '30%' }} />
            <Sparkles size={12} className="fid-hero-sparkle" style={{ top: '75%', right: '15%' }} />
            <div className="fid-hero-illustration">
              <Gift size={60} strokeWidth={1.3} />
            </div>
          </div>
        </div>

        {/* ===== Barre de progression ===== */}
        {nextLevel && (
          <div className="fid-progress-card">
            <div className="fid-progress-header">
              <span className="fid-progress-title">Vous êtes proche du niveau {nextLevel.name} !</span>
              <span className="fid-progress-target">{nextLevel.threshold.toLocaleString('fr-FR')} pts</span>
            </div>
            <div className="fid-progress-track">
              <div className="fid-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="fid-progress-footer">
              <span className="fid-progress-remaining">
                Il vous reste <strong>{pointsRemaining.toLocaleString('fr-FR')} points</strong> pour atteindre le niveau {nextLevel.name}.
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
          </div>
        )}

        {/* ===== 4 cartes d'action ===== */}
        <div className="fid-actions-grid">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.key}
                type="button"
                className={`fid-action-card ${activeTab === action.key ? 'fid-action-card-active' : ''}`}
onClick={() => {
  if (action.key === 'echanger') {
    handleConvertPoints();
  } else {
    setActiveTab(activeTab === action.key ? null : action.key);
  }
}}              >
                <div className="fid-action-icon"><Icon size={18} /></div>
                <div className="fid-action-text">
                  <p className="fid-action-title">{action.title}</p>
                  <p className="fid-action-desc">{action.desc}</p>
                </div>
                <span className="fid-action-arrow">→</span>
              </button>
            );
          })}
        </div>

        {/* ===== Panneau : Comment gagner des points ? ===== */}
        {activeTab === 'gagner' && (
          <div className="fid-info-panel">
            <h3>Comment gagner des points ?</h3>
            <p className="fid-info-intro">
              Vous cumulez automatiquement des points lorsque vous effectuez des achats chez les
              commerçants partenaires Aswaq. Les points sont calculés selon le montant de vos achats
              et les offres promotionnelles en cours.
            </p>

            <div className="fid-rule-list">
              <div className="fid-rule-row">
                <div className="fid-rule-icon"><ShoppingBag size={18} /></div>
                <span>Achats chez les commerçants partenaires Aswaq</span>
              </div>
              <div className="fid-rule-row">
                <div className="fid-rule-icon"><Smartphone size={18} /></div>
                <span>Paiements via QR Code Aswaq</span>
              </div>
              <div className="fid-rule-row">
                <div className="fid-rule-icon"><PartyPopper size={18} /></div>
                <span>Offres promotionnelles avec points bonus</span>
              </div>
            </div>

            <div className="fid-calc-highlight">
              <Calculator size={18} />
              <span><strong>Règle de calcul :</strong> 1 point est gagné pour chaque tranche de 10 MAD dépensés.</span>
            </div>
          </div>
        )}

        {/* ===== Panneau : Partenaires ===== */}
{activeTab === 'partenaires' && (
    <div className="fid-info-panel">

        <h3>Commerçants partenaires</h3>

        {partners.length === 0 ? (

            <p className="fid-info-intro">
                Aucun commerçant partenaire disponible pour le moment.
            </p>

        ) : (

            <div className="fid-partners-list">

                {partners.map((merchant) => (

                    <div
                        key={merchant.id}
                        className="fid-partner-row"
                    >

                        <div className="fid-partner-icon">
                            <Store size={18} />
                        </div>

                        <div className="fid-partner-info">

                            <p className="fid-partner-name">
                                {merchant.companyName}
                            </p>

                            <p className="fid-partner-category">
                                {merchant.activitySector || "Commerce"}
                            </p>

                            {merchant.city && (
                                <p className="fid-partner-category">
                                    {merchant.city}
                                </p>
                            )}

                        </div>

                        <span className="fid-partner-points">
                            1 pt / 10 MAD
                        </span>

                    </div>

                ))}

            </div>

        )}

    </div>
)}
{/* ===== Mes bons d'achat ===== */}
{myRewards.length > 0 && (
  <div className="fid-panel" style={{ marginBottom: '20px' }}>

    <div className="fid-panel-header">
      <h2 className="fid-panel-title">Mes bons d'achat</h2>
    </div>

    <div className="fid-popular-list">

      {myRewards.map((reward) => (

        <div
          key={reward.id}
          className="fid-popular-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}
        >

          {/* Icône */}
          <div className="fid-popular-icon fid-tone-green">
            <Gift size={18} />
          </div>

          {/* Informations du bon */}
          <div
            className="fid-popular-info"
            style={{ flex: 1 }}
          >

            <p className="fid-popular-name">
              Bon d'achat de {reward.rewardAmount} MAD
            </p>

            <p className="fid-popular-desc">
              Code : <strong>{reward.code}</strong>
            </p>

            <p className="fid-popular-desc">
              {reward.status === "AVAILABLE"
                ? "Disponible"
                : reward.status === "USED"
                ? "Utilisé"
                : "Expiré"}
            </p>

          </div>

          {/* Points utilisés */}
          <span className="fid-partner-points">
            {reward.pointsUsed} pts
          </span>

          {/* QR CODE */}
          {reward.status === "AVAILABLE" && reward.code && (
            <div
              style={{
                background: '#ffffff',
                padding: '10px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '110px',
                minHeight: '110px'
              }}
            >
              <QRCodeSVG
                value={String(reward.code)}
                size={90}
                level="M"
              />
            </div>
          )}

        </div>

      ))}

    </div>

  </div>
)}
        
      </main>
    </div>
  );
}