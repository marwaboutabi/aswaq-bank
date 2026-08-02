import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, ArrowLeftRight, Star, Bell, Bot, User, LogOut, ChevronDown,
  Send, Sparkles, TrendingUp, Target, CreditCard, RefreshCw,
  Package, Boxes, Users, Truck, BarChart3, Percent,
  AlertTriangle, DollarSign, ShoppingBag, Wallet, ClipboardList,
  CheckCircle, Clock, PackageCheck, PackageX, Zap, FileText,ShoppingCart,Layers
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './AssistantFournisseur.css';

const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', to: '/accueil-fournisseur' },
    { icon: Package, label: 'Produits', to: '/produits-fournisseur' },
    { icon: ShoppingCart, label: 'Commandes reçues', to: '/commandes-fournisseur' },
    { icon: CreditCard, label: 'Paiements', to: '/paiements-fournisseur' },
    { icon: Truck, label: 'Livraisons', to: '/livraisons-fournisseur' },
    { icon: Layers, label: 'Catalogue', to: '/catalogue-fournisseur' },
   { icon: Bell, label: 'Notifications', to: '/notifications-fournisseur' },
    { icon: Bot, label: 'Assistant IA', to: '/assistant-fournisseur', active: true },
    { icon: User, label: 'Profil & Paramètres', to: '/profil-fournisseur' },

  ];

const QUICK_SUGGESTIONS = [
  {
    id: 1,
    icon: ShoppingBag,
    label: 'Analyser mes commandes',
    question: 'Peux-tu analyser mes commandes reçues ce mois-ci ?',
  },
  {
    id: 2,
    icon: TrendingUp,
    label: 'Produits les plus commandés',
    question: 'Quels sont mes produits les plus commandés ?',
  },
  {
    id: 3,
    icon: AlertTriangle,
    label: 'Produits bientôt en rupture',
    question: 'Quels produits seront bientôt en rupture de stock ?',
  },
  {
    id: 4,
    icon: Truck,
    label: 'Livraisons en cours',
    question: 'Quel est l\'état de mes livraisons en cours ?',
  },
  {
    id: 5,
    icon: Wallet,
    label: 'Paiements reçus',
    question: 'Peux-tu résumer mes paiements reçus récemment ?',
  },
  {
    id: 6,
    icon: BarChart3,
    label: 'Prévision des commandes',
    question: 'Quelles sont les prévisions de commandes pour la semaine prochaine ?',
  },
  {
    id: 7,
    icon: Target,
    label: 'Produits les moins demandés',
    question: 'Quels sont mes produits les moins demandés ?',
  },
  {
    id: 8,
    icon: ClipboardList,
    label: 'Analyser mon catalogue',
    question: 'Peux-tu analyser mon catalogue produits ?',
  },
  {
    id: 9,
    icon: Clock,
    label: 'Commandes en attente',
    question: 'Quelles sont mes commandes en attente de traitement ?',
  },
  {
    id: 10,
    icon: DollarSign,
    label: 'Augmenter mes ventes fournisseurs',
    question: 'Comment puis-je augmenter mes ventes en tant que fournisseur ?',
  },
];

const AI_RESPONSES = {
  'Peux-tu analyser mes commandes reçues ce mois-ci ?': {
    text: "Voici l'analyse de vos **commandes reçues** ce mois-ci :\n\n📦 **Nombre total de commandes** : 187\n✅ **Commandes acceptées** : 172 (92%)\n❌ **Commandes refusées** : 15 (8%)\n🔄 **En préparation** : 23\n🚚 **Livrées** : 149\n💰 **Montant total** : 248 650 MAD\n📈 **Évolution** : +14% par rapport au mois dernier\n\n🏆 **Meilleur commerçant** : Épicerie Atlas — 24 commandes — 38 450 MAD\n⏰ **Journée la plus active** : Mardi 22 juillet (18 commandes)\n\n📊 **Répartition par statut** :\n• En attente : 12 commandes\n• En préparation : 23 commandes\n• Expédiées : 3 commandes\n• Livrées : 149 commandes\n\n💡 Votre taux d'acceptation est excellent. Attention cependant aux 15 commandes refusées — elles concernent principalement des produits en rupture.",
    actions: [
      { label: 'Voir les commandes', to: '/commandes-fournisseur', icon: ShoppingBag },
      { label: 'Voir le tableau de bord', to: '/dashboard-fournisseur', icon: BarChart3 },
    ],
  },

  'Quels sont mes produits les plus commandés ?': {
    text: "Voici vos **5 produits les plus commandés** ce mois-ci :\n\n🥇 **Huile d'olive Premium 1L** — 412 commandes — 89 240 MAD — +18%\n🥈 **Café Moulu Premium 500g** — 356 commandes — 52 680 MAD — +22%\n🥉 **Farine Bio Premium 1kg** — 298 commandes — 26 820 MAD — +12%\n4️⃣ **Lait Frais Pasteurisé 1L** — 275 commandes — 16 500 MAD — +8%\n5️⃣ **Sucre Roux Bio 1kg** — 234 commandes — 14 040 MAD — +15%\n\n💡 **Analyse** :\n• Ces 5 produits représentent **41% de votre chiffre d'affaires**\n• Le Café Moulu Premium connaît la plus forte croissance (+22%)\n• L'Huile d'olive Premium reste votre produit phare\n\n🎯 **Recommandation** :\n• Maintenez un stock élevé pour ces 5 produits\n• Anticipez une hausse de 15% la semaine prochaine\n• Envisagez des packs combinés pour augmenter le panier moyen",
    actions: [
      { label: 'Voir le catalogue', to: '/catalogue-fournisseur', icon: Package },
      { label: 'Voir les produits', to: '/produits-fournisseur', icon: Boxes },
    ],
  },

  'Quels produits seront bientôt en rupture de stock ?': {
    text: "Voici les produits **à risque de rupture** dans les 7 prochains jours :\n\n🚨 **Rupture imminente (< 3 jours)** :\n• Café Moulu Premium 500g — 18 unités restantes — Demande prévue : 45 unités\n• Huile d'olive Premium 1L — 24 unités restantes — Demande prévue : 60 unités\n\n⚠️ **Niveau critique (3-7 jours)** :\n• Farine Bio Premium 1kg — 42 unités — Seuil minimum : 50 unités\n• Lait Frais Pasteurisé 1L — 58 unités — Seuil minimum : 70 unités\n• Sucre Roux Bio 1kg — 65 unités — Seuil minimum : 80 unités\n\n📊 **Indice de risque calculé par l'IA** :\n• Taux de rotation moyen : 6 jours\n• Délai d'approvisionnement moyen : 4 jours\n• Marge de sécurité recommandée : 30%\n\n💡 **Recommandations IA** :\n• Passez commande **dès aujourd'hui** pour le Café Moulu et l'Huile d'olive\n• Augmentez votre stock de sécurité de 20% pour les produits bio\n• Contactez vos fournisseurs alternatifs pour sécuriser l'approvisionnement",
    actions: [
      { label: 'Voir les produits', to: '/produits-fournisseur', icon: Boxes },
      { label: 'Voir le catalogue', to: '/catalogue-fournisseur', icon: Package },
    ],
  },

  'Quel est l\'état de mes livraisons en cours ?': {
    text: "Voici l'état de vos **livraisons en cours** :\n\n🔄 **En préparation** : 8 livraisons\n• LIV-00219 — Épicerie Atlas — Casablanca — Préparation en cours\n• LIV-00220 — Superette El Baraka — Rabat — Emballage\n• LIV-00221 — Mini Market Youssef — Marrakech — Étiquetage\n\n🚚 **Expédiées** : 5 livraisons\n• LIV-00215 — Aswaq Logistics — En transit — Arrivée prévue demain 14h\n• LIV-00216 — Atlas Transport — En transit — Arrivée prévue demain 16h\n\n✅ **Livrées aujourd'hui** : 12 livraisons\n• Taux de livraison à l'heure : 94%\n• Délai moyen : 2,4 jours\n\n⚠️ **Retards signalés** : 1 livraison\n• LIV-00212 — Retard de 3h dû aux conditions météo\n\n📊 **Performance globale** :\n• Taux de livraison réussi : 97%\n• Satisfaction commerçants : 4,7/5\n• Coût logistique moyen : 45 MAD/livraison\n\n💡 **Conseil** : Renforcez votre équipe de préparation pour la journée de demain — pic de commandes prévu.",
    actions: [
      { label: 'Voir les livraisons', to: '/livraisons-fournisseur', icon: Truck },
      { label: 'Voir les commandes', to: '/commandes-fournisseur', icon: ShoppingBag },
    ],
  },

  'Peux-tu résumer mes paiements reçus récemment ?': {
    text: "Voici le résumé de vos **paiements reçus** :\n\n💰 **Aujourd'hui (28 juillet)** :\n• 14 paiements validés — 28 450 MAD\n• Répartition : 70% virement, 25% mobile, 5% chèque\n\n💰 **Hier (27 juillet)** :\n• 18 paiements validés — 34 820 MAD\n• 3 paiements en attente de validation — 6 240 MAD\n\n💰 **26 juillet** :\n• 12 paiements validés — 21 340 MAD\n\n📊 **Statistiques du mois** :\n• Total reçu : 248 650 MAD\n• Paiements validés : 187\n• Paiements en attente : 8 (12 480 MAD)\n• Délai moyen de réception : 1,8 jour\n\n📈 **Tendance** :\n• 📈 Virements bancaires : +22% ce mois\n• 📱 Paiement mobile : +35% ce mois\n• 📉 chèques : -12% ce mois\n\n💡 **Conseil** : Le paiement mobile progresse fortement. Assurez-vous que votre RIB Aswaq Bank est bien configuré pour recevoir les paiements instantanés.",
    actions: [
      { label: 'Voir les paiements', to: '/paiements-fournisseur', icon: CreditCard },
      { label: 'Voir le tableau de bord', to: '/dashboard-fournisseur', icon: BarChart3 },
    ],
  },

  'Quelles sont les prévisions de commandes pour la semaine prochaine ?': {
    text: "Voici les **prévisions de commandes** pour la semaine du 29 juillet au 4 août :\n\n📅 **Lundi 29** : ~24 commandes — ~42 000 MAD\n📅 **Mardi 30** : ~28 commandes — ~48 500 MAD\n📅 **Mercredi 31** : ~26 commandes — ~45 200 MAD\n📅 **Jeudi 1 août** : ~31 commandes — ~54 800 MAD\n📅 **Vendredi 2** : ~35 commandes — ~62 400 MAD ⭐\n📅 **Samedi 3** : ~29 commandes — ~51 200 MAD\n📅 **Dimanche 4** : ~18 commandes — ~31 500 MAD\n\n💰 **CA estimé total** : ~335 600 MAD (+12% vs semaine dernière)\n\n🔍 **Produits les plus demandés prévus** :\n• Huile d'olive Premium — +28% de demande\n• Café Moulu Premium — +32% de demande\n• Farine Bio Premium — +18% de demande\n\n📈 **Facteurs pris en compte** :\n• Saisonnalité (période estivale)\n• Historical data des 90 derniers jours\n• Promotions actives chez vos commerçants\n• Événements locaux (Aïd El Kebir approche)\n\n💡 **Recommandation** : Anticipez un **renforcement de stock de 25%** sur les produits bio et le café. Le vendredi 2 août sera la journée la plus chargée.",
    actions: [
      { label: 'Voir le tableau de bord', to: '/dashboard-fournisseur', icon: BarChart3 },
      { label: 'Voir les produits', to: '/produits-fournisseur', icon: Boxes },
    ],
  },

  'Quels sont mes produits les moins demandés ?': {
    text: "Voici vos **5 produits les moins demandés** ce mois-ci :\n\n📉 **Produits à faible rotation** :\n\n1. **Confiture Artisanale Fraise 350g** — 8 commandes — 480 MAD — -22%\n2. **Miel Bio Eucalyptus 500g** — 12 commandes — 960 MAD — -15%\n3. **Thé Vert Bio 250g** — 15 commandes — 1 050 MAD — -8%\n4. **Chocolat Noir 85% 200g** — 18 commandes — 1 260 MAD — -12%\n5. **Biscuits Secs Avoine 400g** — 22 commandes — 1 320 MAD — -5%\n\n💡 **Analyse** :\n• Ces 5 produits représentent seulement **2,1% de votre CA**\n• Durée moyenne de rotation : **58 jours** (vs 6 jours pour la moyenne)\n• Valeur immobilisée en stock : **18 450 MAD**\n• Coût de stockage mensuel : ~420 MAD\n\n🎯 **Actions recommandées** :\n• Lancez une **promotion -20%** sur ces produits auprès de vos commerçants\n• Proposez des **packs combinés** avec vos produits phares\n• Envisagez de **supprimer du catalogue** les 2 produits les moins performants\n• Contactez vos commerçants clés pour leur proposer ces produits en exclusivité\n\n⚠️ **Alerte** : Si aucune action n'est prise dans les 30 jours, ces produits pourraient devenir des stocks dormants.",
    actions: [
      { label: 'Voir le catalogue', to: '/catalogue-fournisseur', icon: Package },
      { label: 'Voir les produits', to: '/produits-fournisseur', icon: Boxes },
    ],
  },

  'Peux-tu analyser mon catalogue produits ?': {
    text: "Voici l'analyse complète de votre **catalogue produits** :\n\n📦 **Vue d'ensemble** :\n• Nombre total de produits : **287 références**\n• Catégories actives : **12**\n• Produits actifs : 264 (92%)\n• Produits inactifs : 23 (8%)\n\n📊 **Répartition par catégorie** :\n🥖 Alimentation générale : 98 produits (34%)\n🥤 Boissons : 54 produits (19%)\n🧴 Hygiène & Entretien : 42 produits (15%)\n🌾 Produits bio : 38 produits (13%)\n🍬 Confiserie : 28 produits (10%)\n📦 Autres : 27 produits (9%)\n\n🏆 **Top 3 catégories par CA** :\n1. Alimentation générale — 98 450 MAD\n2. Produits bio — 62 340 MAD\n3. Boissons — 45 820 MAD\n\n⚠️ **Points d'attention** :\n• 12 produits n'ont pas été commandés depuis 60+ jours\n• 8 produits ont des fiches incomplètes (photos ou descriptions manquantes)\n• 15 produits ont des prix non compétitifs vs la moyenne du marché\n\n💡 **Recommandations** :\n• Mettez à jour les fiches des 8 produits incomplets\n• Révisez les prix des 15 produits non compétitifs\n• Supprimez ou remplacez les 12 produits dormants\n• Ajoutez 10-15 nouvelles références dans la catégorie \"Produits bio\" (forte demande)",
    actions: [
      { label: 'Voir le catalogue', to: '/catalogue-fournisseur', icon: Package },
      { label: 'Voir les produits', to: '/produits-fournisseur', icon: Boxes },
    ],
  },

  'Quelles sont mes commandes en attente de traitement ?': {
    text: "Voici vos **commandes en attente de traitement** :\n\n⏳ **12 commandes à traiter** — Total : 24 680 MAD\n\n🚨 **Priorité haute (à traiter aujourd'hui)** :\n\n1️⃣ **CMD-2026-218** — Épicerie Atlas\n• 28 articles — 5 450 MAD\n• Passée il y a 2h — Casablanca\n• ⚠️ Délai de préparation : 4h restantes\n\n2️⃣ **CMD-2026-219** — Superette El Baraka\n• 15 articles — 2 840 MAD\n• Passée il y a 3h — Rabat\n• ⚠️ Délai de préparation : 6h restantes\n\n🟡 **Priorité moyenne (à traiter demain)** :\n\n3️⃣ **CMD-2026-220** — Mini Market Youssef — 3 120 MAD\n4️⃣ **CMD-2026-221** — Hanout Al Amal — 1 980 MAD\n5️⃣ **CMD-2026-222** — Épicerie du Nord — 2 450 MAD\n\n🟢 **Priorité basse (à traiter cette semaine)** :\n• 7 autres commandes — 8 840 MAD\n\n💡 **Recommandation** :\n• Commencez par **CMD-2026-218** et **CMD-2026-219** (délais courts)\n• Vérifiez la disponibilité du stock avant de confirmer\n• Contactez les commerçants si certains produits sont en rupture",
    actions: [
      { label: 'Voir les commandes', to: '/commandes-fournisseur', icon: ShoppingBag },
      { label: 'Voir les produits', to: '/produits-fournisseur', icon: Boxes },
    ],
  },

  'Comment puis-je augmenter mes ventes en tant que fournisseur ?': {
    text: "Voici **7 stratégies concrètes** pour augmenter vos ventes fournisseurs :\n\n💰 **1. Élargir votre catalogue**\n• Ajoutez 15-20 nouvelles références par mois\n• Privilégiez les produits bio et locaux (+28% de demande)\n• Gain potentiel : +18 500 MAD/mois\n\n💰 **2. Mettre à jour régulièrement le catalogue**\n• 23 produits inactifs à réactiver ou supprimer\n• Actualisez les photos et descriptions\n• Gain estimé : +8 200 MAD/mois\n\n💰 **3. Réduire les délais de livraison**\n• Délai actuel moyen : 2,4 jours\n• Objectif : passer à 1,8 jour\n• Gain estimé : +12 400 MAD/mois (fidélisation)\n\n💰 **4. Maintenir un stock toujours disponible**\n• 12% de commandes refusées pour cause de rupture\n• Gain potentiel : +24 800 MAD/mois\n\n💰 **5. Proposer des remises sur volume**\n• -5% dès 50 articles\n• -10% dès 100 articles\n• Gain estimé : +15 600 MAD/mois\n\n💰 **6. Améliorer les fiches produits**\n• 8 fiches incomplètes identifiées\n• Ajoutez photos HD, descriptions détaillées, certifications\n• Gain estimé : +6 800 MAD/mois\n\n💰 **7. Répondre rapidement aux commandes**\n• Temps de réponse actuel : 4h\n• Objectif : < 1h\n• Gain estimé : +9 400 MAD/mois\n\n🎯 **Gain total estimé** : +95 700 MAD/mois (+38%)\n\n💡 **Priorité** : Commencez par **réduire les ruptures de stock** et **améliorer les délais de livraison**, ce sont les leviers les plus rapides et les plus impactants.",
    actions: [
      { label: 'Voir le tableau de bord', to: '/dashboard-fournisseur', icon: BarChart3 },
      { label: 'Voir le catalogue', to: '/catalogue-fournisseur', icon: Package },
      { label: 'Voir les produits', to: '/produits-fournisseur', icon: Boxes },
    ],
  },
};

const DEFAULT_RESPONSE = {
  text: "Je suis votre **Assistant IA Fournisseur**. Je peux vous aider à :\n\n📦 Analyser vos commandes reçues\n📋 Gérer votre catalogue produits\n🚚 Suivre vos livraisons\n💰 Optimiser vos paiements\n📊 Prévoir la demande\n⭐ Identifier les produits performants\n💡 Proposer des stratégies de croissance\n\nN'hésitez pas à me poser une question précise ou à utiliser les suggestions ci-dessous.",
  actions: [],
};

async function askAI(question) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const response = AI_RESPONSES[question] || DEFAULT_RESPONSE;
  return response;
}

export default function AssistantFournisseur() {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 0,
      sender: 'ai',
      text: "Bonjour 👋\n\nJe suis votre **Assistant IA Fournisseur**. Je peux vous aider à :\n\n• analyser vos commandes reçues\n• gérer votre catalogue produits\n• suivre vos livraisons\n• optimiser vos paiements\n• prévoir la demande\n• identifier les produits performants\n• anticiper les ruptures de stock\n• améliorer votre activité fournisseur\n\nComment puis-je vous aider aujourd'hui ?",
      actions: [],
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const question = text || inputValue.trim();
    if (!question || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: question,
      actions: [],
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const aiResponse = await askAI(question);

    const aiMessage = {
      id: Date.now() + 1,
      sender: 'ai',
      text: aiResponse.text,
      actions: aiResponse.actions || [],
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion.question);
  };

  const handleNewConversation = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: "Bonjour 👋\n\nJe suis votre **Assistant IA Fournisseur**. Je peux vous aider à :\n\n• analyser vos commandes reçues\n• gérer votre catalogue produits\n• suivre vos livraisons\n• optimiser vos paiements\n• prévoir la demande\n• identifier les produits performants\n• anticiper les ruptures de stock\n• améliorer votre activité fournisseur\n\nComment puis-je vous aider aujourd'hui ?",
        actions: [],
      },
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={j}>{part.slice(2, -2)}</strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="acc-sidebar-logo">
          <Logo size={100} className="mb-6" logo-white />
        </div>
        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
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
        {/* Header */}
        <header className="dash-topbar">
          <div>
            <h1 className="dash-greeting">Assistant IA Fournisseur</h1>
            <p className="dash-greeting-sub">
              Votre assistant intelligent pour gérer votre catalogue, vos commandes, vos livraisons, vos paiements et optimiser votre activité de fournisseur.
            </p>
          </div>
          <div className="dash-topbar-actions">
            <button type="button" className="dash-new-chat-btn" onClick={handleNewConversation}>
              <RefreshCw size={16} />
              Nouvelle conversation
            </button>
            <button
              type="button"
              className="dash-icon-button"
              onClick={() => navigate('/notifications-fournisseur')}
            >
              <Bell size={18} />
              <span className="dash-badge">4</span>
            </button>
            <div className="fourn-user-chip" onClick={() => navigate('/parametres-fournisseur')}>
              <div className="fourn-user-avatar">AD</div>
              <div className="fourn-user-info">
                <span className="fourn-user-name">Atlas Distribution</span>
                <span className="fourn-user-role">Fournisseur</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Chat layout */}
        <div className="assistant-layout">
          {/* Zone de conversation */}
          <div className="assistant-chat">
            <div className="assistant-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`assistant-message assistant-message-${msg.sender}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="assistant-avatar assistant-avatar-ai">
                      <Bot size={18} />
                    </div>
                  )}
                  <div className="assistant-bubble">
                    <div className="assistant-bubble-text">
                      {formatText(msg.text)}
                    </div>
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="assistant-actions">
                        {msg.actions.map((action, idx) => {
                          const ActionIcon = action.icon;
                          return (
                            <Link
                              key={idx}
                              to={action.to}
                              className="assistant-action-btn"
                            >
                              <ActionIcon size={14} />
                              {action.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="assistant-avatar assistant-avatar-user">
                      AD
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="assistant-message assistant-message-ai">
                  <div className="assistant-avatar assistant-avatar-ai">
                    <Bot size={18} />
                  </div>
                  <div className="assistant-bubble assistant-bubble-typing">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions rapides */}
            {messages.length <= 1 && (
              <div className="assistant-suggestions">
                <p className="assistant-suggestions-title">
                  <Sparkles size={14} /> Suggestions rapides
                </p>
                <div className="assistant-suggestions-list">
                  {QUICK_SUGGESTIONS.map((suggestion) => {
                    const Icon = suggestion.icon;
                    return (
                      <button
                        key={suggestion.id}
                        type="button"
                        className="assistant-suggestion-btn"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <Icon size={14} />
                        {suggestion.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Champ de saisie */}
            <div className="assistant-input-bar">
              <input
                ref={inputRef}
                type="text"
                className="assistant-input"
                placeholder="Posez votre question sur votre activité fournisseur..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
              />
              <button
                type="button"
                className="assistant-send-btn"
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}