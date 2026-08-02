import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, ArrowLeftRight,Star, Bell, Bot, User, LogOut, ChevronDown,
  Send, Sparkles, TrendingUp, Target, CreditCard, RefreshCw,
  Package, Boxes, Users,  Truck, BarChart3, Percent,
  AlertTriangle, DollarSign, ShoppingBag,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './AssistantCom.css';
import './DashboardClient.css';

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/acceuil-com' },
  { icon: Package, label: 'Produits', to: '/produits' },
  { icon: Boxes, label: 'Stock', to: '/stock' },
  { icon: ArrowLeftRight, label: 'Paiements & Transactions', to: '/transactions-commerce' },
  { icon: Users, label: 'Fournisseurs', to: '/fournisseurs' },
  { icon: Star, label: 'Fidélité & Tickets', to: '/fidelite-commerce' },
  { icon: Bell, label: 'Notifications', to: '/notifications-com' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant-commerce', active: true },
  { icon: User, label: 'Profil & Paramètres', to: '/parametres-commerce' },
];

const QUICK_SUGGESTIONS = [
  {
    id: 1,
    icon: TrendingUp,
    label: 'Analyser mes ventes',
    question: 'Peux-tu analyser mes ventes ce mois-ci ?',
  },
  {
    id: 2,
    icon: ShoppingBag,
    label: 'Produits les plus vendus',
    question: 'Quels produits se vendent le mieux ?',
  },
  {
    id: 3,
    icon: AlertTriangle,
    label: 'Produits à réapprovisionner',
    question: 'Quels produits doivent être réapprovisionnés ?',
  },
  {
    id: 4,
    icon: Boxes,
    label: 'Analyser mon stock',
    question: 'Peux-tu analyser mon stock actuel ?',
  },
  {
    id: 5,
    icon: BarChart3,
    label: 'Prévoir les ventes',
    question: 'Quelles sont les prévisions de ventes pour la semaine prochaine ?',
  },
  {
    id: 6,
    icon: Percent,
    label: 'Conseiller une promotion',
    question: 'Conseille-moi une promotion à lancer',
  },
  {
    id: 7,
    icon: Target,
    label: 'Produits peu vendus',
    question: 'Quels sont mes produits les moins vendus ?',
  },
  {
    id: 8,
    icon: CreditCard,
    label: 'Paiements récents',
    question: 'Peux-tu résumer mes paiements récents ?',
  },
  {
    id: 9,
    icon: Truck,
    label: 'Commandes fournisseurs',
    question: 'Analyse mes commandes fournisseurs',
  },
  {
    id: 10,
    icon: DollarSign,
    label: 'Augmenter mes revenus',
    question: 'Comment puis-je augmenter mes revenus ?',
  },
];

const AI_RESPONSES = {
  'Peux-tu analyser mes ventes ce mois-ci ?': {
    text: "Voici l'analyse de vos ventes pour ce mois-ci :\n\n💰 **Chiffre d'affaires total** : 47 850 MAD\n📈 **Évolution** : +12% par rapport au mois dernier\n🛒 **Nombre de transactions** : 342\n🧾 **Panier moyen** : 140 MAD\n\n🏆 **Meilleure journée** : Samedi 20 juillet (2 850 MAD)\n⏰ **Heures de forte affluence** : 17h - 20h\n\n📊 **Répartition par catégorie** :\n🥖 Alimentation : 18 200 MAD (38%)\n🧴 Hygiène : 9 450 MAD (20%)\n🥤 Boissons : 7 680 MAD (16%)\n🛍️ Autres : 12 520 MAD (26%)\n\nVotre commerce affiche une belle croissance. Les catégories Alimentation et Hygiène tirent particulièrement bien.",
    actions: [
      { label: 'Voir les ventes détaillées', to: '/analyse-ventes', icon: TrendingUp },
      { label: 'Voir le tableau de bord', to: '/acceuil-com', icon: BarChart3 },
    ],
  },

  'Quels produits se vendent le mieux ?': {
    text: "Voici vos **5 produits les plus vendus** ce mois-ci :\n\n🥇 **Huile d'olive extra vierge 1L** — 127 unités — 15 875 MAD\n🥈 **Café arabica 500g** — 98 unités — 8 820 MAD\n🥉 **Lait frais 1L** — 245 unités — 2 450 MAD\n4️⃣ **Pain complet** — 312 unités — 1 872 MAD\n5️⃣ **Yaourt nature x4** — 156 unités — 2 340 MAD\n\n💡 **Conseil** : Ces 5 produits représentent **32% de votre chiffre d'affaires**. Assurez-vous qu'ils soient toujours en stock et bien mis en avant en magasin.",
    actions: [
      { label: 'Voir tous les produits', to: '/produits', icon: Package },
      { label: 'Voir les statistiques', to: '/statistiques', icon: BarChart3 },
    ],
  },

  'Quels produits doivent être réapprovisionnés ?': {
    text: "Voici les produits nécessitant un **réapprovisionnement urgent** :\n\n🚨 **Rupture de stock** :\n• Café arabica 500g — 0 unité (2 commandes en attente)\n• Fromage camembert — 0 unité\n\n⚠️ **Stock faible (< 5 unités)** :\n• Huile d'olive 1L — 3 unités\n• Lait frais 1L — 4 unités\n• Pâtes 500g — 2 unités\n• Riz basmati 1kg — 5 unités\n\n📦 **Commande recommandée** :\nJe vous suggère de passer commande chez **DistribMaroc** pour un montant estimé de **4 200 MAD** afin de reconstituer votre stock pour les 10 prochains jours.",
    actions: [
      { label: 'Voir le stock', to: '/stock', icon: Boxes },
      { label: 'Voir les fournisseurs', to: '/fournisseurs', icon: Truck },
    ],
  },

  'Peux-tu analyser mon stock actuel ?': {
    text: "Voici l'analyse de votre stock actuel :\n\n📦 **Total produits en stock** : 1 247 unités\n💰 **Valeur totale du stock** : 87 450 MAD\n📊 **Rotation moyenne** : 18 jours\n\n✅ **Stock sain** : 89% de vos produits\n⚠️ **Stock faible** : 8 produits (6%)\n🚨 **Rupture** : 3 produits (2%)\n🐌 **Sur-stock** : 5 produits (3%) — durée de rotation > 45 jours\n\n💡 **Recommandations** :\n• Réduisez le stock de \"Biscuits secs\" et \"Conserve de thon\" (sur-stock)\n• Passez commande rapidement pour \"Huile d'olive\" et \"Café arabica\"\n• Votre rotation est bonne, continuez ainsi !",
    actions: [
      { label: 'Voir le stock complet', to: '/stock', icon: Boxes },
      { label: 'Voir les produits', to: '/produits', icon: Package },
    ],
  },

  'Quelles sont les prévisions de ventes pour la semaine prochaine ?': {
    text: "Voici les **prévisions de ventes** pour la semaine du 24 au 30 juillet :\n\n📅 **Lundi 24** : ~5 800 MAD\n📅 **Mardi 25** : ~6 200 MAD\n📅 **Mercredi 26** : ~6 500 MAD\n📅 **Jeudi 27** : ~7 100 MAD\n📅 **Vendredi 28** : ~8 400 MAD\n📅 **Samedi 29** : ~9 800 MAD ⭐\n📅 **Dimanche 30** : ~7 200 MAD\n\n💰 **CA estimé total** : ~51 000 MAD (+7% vs semaine dernière)\n\n🔍 **Facteurs pris en compte** :\n• Tendance saisonnière (période estivale)\n• Jours de forte affluence (vendredi-samedi)\n• Promotions actives en magasin\n\n💡 **Conseil** : Renforcez votre stock et votre personnel pour le **samedi 29**, journée prévue la plus chargée.",
    actions: [
      { label: 'Voir les statistiques', to: '/statistiques', icon: BarChart3 },
      { label: 'Gérer le stock', to: '/stock', icon: Boxes },
    ],
  },

  'Conseille-moi une promotion à lancer': {
    text: "Voici **3 promotions recommandées** basées sur votre activité :\n\n🎯 **1. Pack \"Petit-déjeuner complet\"**\n• Café arabica + Lait frais + Pain complet\n• Prix spécial : 45 MAD au lieu de 58 MAD\n• Marge estimée : 22%\n• Potentiel : +15% de ventes sur ces produits\n\n🎯 **2. -20% sur les produits en sur-stock**\n• Biscuits secs, Conserve de thon\n• Durée : 7 jours\n• Objectif : écouler 180 unités\n\n🎯 **3. Programme fidélité \"3 achats = 1 offert\"**\n• Sur la catégorie Hygiène\n• Fidélisation estimée : +25% de clients récurrents\n\n💡 **Ma recommandation** : Lancez le **Pack \"Petit-déjeuner complet\"** en priorité. Il combine marge correcte et fort potentiel de ventes, surtout en période estivale.",
    actions: [
      { label: 'Voir les produits', to: '/produits', icon: Package },
      { label: 'Voir la fidélité', to: '/fidelite-commerce', icon: Star },
    ],
  },

  'Quels sont mes produits les moins vendus ?': {
    text: "Voici vos **5 produits les moins vendus** ce mois-ci :\n\n📉 **Produits à faible rotation** :\n\n1. **Conserve de sardines premium** — 2 unités vendues — 60 MAD\n2. **Chocolat noir 85%** — 4 unités — 140 MAD\n3. **Biscuits secs bio** — 5 unités — 75 MAD\n4. **Confiture artisanale** — 6 unités — 180 MAD\n5. **Thé vert spécial** — 8 unités — 160 MAD\n\n💡 **Analyse** :\n• Ces 5 produits représentent seulement **1,3% de votre CA**\n• Durée moyenne de rotation : **52 jours** (vs 18 jours pour la moyenne)\n• Valeur immobilisée en stock : **4 280 MAD**\n\n🎯 **Actions recommandées** :\n• Lancez une promotion -25% sur ces produits\n• Envisagez de les remplacer par des références plus demandées\n• Regroupez-les dans un corner \"Produits d'exception\"",
    actions: [
      { label: 'Voir les produits', to: '/produits', icon: Package },
      { label: 'Voir les statistiques', to: '/statistiques', icon: BarChart3 },
    ],
  },

  'Peux-tu résumer mes paiements récents ?': {
    text: "Voici le résumé de vos **paiements récents** :\n\n💳 **Aujourd'hui (23 juillet)** :\n• 42 transactions — 6 850 MAD\n• Répartition : 65% carte, 30% espèces, 5% mobile\n\n💳 **Hier (22 juillet)** :\n• 38 transactions — 5 940 MAD\n• Répartition : 62% carte, 33% espèces, 5% mobile\n\n💳 **21 juillet** :\n• 45 transactions — 7 280 MAD\n\n📊 **Tendance des paiements** :\n• 📈 Paiements par carte : +18% ce mois\n• 📉 Espèces : -8% ce mois\n• 📱 Paiement mobile : stable à 5%\n\n💡 **Conseil** : La part des paiements par carte augmente. Assurez-vous que votre TPE fonctionne correctement aux heures de pointe.",
    actions: [
      { label: 'Voir les transactions', to: '/transactions-commerce', icon: CreditCard },
      { label: 'Voir le tableau de bord', to: '/acceuil-com', icon: BarChart3 },
    ],
  },

  'Analyse mes commandes fournisseurs': {
    text: "Voici l'analyse de vos **commandes fournisseurs** :\n\n📦 **Commandes en cours** :\n• #Fourn-2026-156 — DistribMaroc — 15 800 MAD — En attente\n• #Fourn-2026-154 — AtlasSupply — 8 450 MAD — En transit (livraison prévue le 24/07)\n\n✅ **Dernières livraisons** :\n• #Fourn-2026-152 — DistribMaroc — 12 300 MAD — Livrée le 18/07 ✓\n• #Fourn-2026-150 — AtlasSupply — 9 800 MAD — Livrée le 15/07 ✓\n\n📊 **Statistiques fournisseurs (30 derniers jours)** :\n• Total commandé : 58 400 MAD\n• Délai moyen de livraison : 3,2 jours\n• Taux de conformité : 96%\n\n🏆 **Meilleur fournisseur** : DistribMaroc (délai 2,8 jours, conformité 98%)\n\n💡 **Recommandation** : Anticipez vos commandes pour la semaine prochaine — plusieurs produits approchent du seuil critique.",
    actions: [
      { label: 'Voir les fournisseurs', to: '/fournisseurs', icon: Truck },
      { label: 'Voir le stock', to: '/stock', icon: Boxes },
    ],
  },

  'Comment puis-je augmenter mes revenus ?': {
    text: "Voici **5 stratégies concrètes** pour augmenter vos revenus :\n\n💰 **1. Optimiser vos prix**\n• 5 produits ont une marge inférieure à 15%\n• Gain potentiel : +2 340 MAD/mois en ajustant les prix de 5 à 8%\n\n💰 **2. Lancer des packs promotionnels**\n• 3 packs identifiés (petit-déjeuner, goûter, ménage)\n• Gain estimé : +3 500 MAD/mois\n\n💰 **3. Réduire les ruptures de stock**\n• 12% de pertes de ventes dues aux ruptures\n• Gain potentiel : +4 200 MAD/mois\n\n💰 **4. Fidéliser vos clients**\n• 65% de clients non fidélisés\n• Programme de fidélité : +18% de récurrence estimée\n\n💰 **5. Étendre les heures d'ouverture**\n• Demande identifiée entre 20h et 22h\n• Gain potentiel : +2 800 MAD/mois\n\n🎯 **Gain total estimé** : +12 840 MAD/mois (+27%)\n\n💡 **Priorité** : Commencez par **réduire les ruptures** et **optimiser les prix**, ce sont les leviers les plus rapides.",
    actions: [
      { label: 'Voir les statistiques', to: '/statistiques', icon: BarChart3 },
      { label: 'Voir les produits', to: '/produits', icon: Package },
      { label: 'Voir le tableau de bord', to: '/acceuil-com', icon: TrendingUp },
    ],
  },
};

const DEFAULT_RESPONSE = {
  text: "Je suis votre **Assistant IA Commercial**. Je peux vous aider à :\n\n📊 Analyser vos ventes et votre chiffre d'affaires\n📦 Gérer votre stock et vos réapprovisionnements\n🚚 Optimiser vos commandes fournisseurs\n💳 Suivre vos paiements et transactions\n🎯 Identifier les produits les plus rentables\n💡 Proposer des promotions efficaces\n⭐ Fidéliser vos clients\n\nN'hésitez pas à me poser une question précise ou à utiliser les suggestions ci-dessous.",
  actions: [],
};

async function askAI(question) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const response = AI_RESPONSES[question] || DEFAULT_RESPONSE;
  return response;
}

export default function Assistant() {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 0,
      sender: 'ai',
      text: "Bonjour 👋\n\nJe suis votre **Assistant IA Commercial**. Je peux vous aider à :\n\n• analyser vos ventes\n• suivre votre chiffre d'affaires\n• surveiller votre stock\n• optimiser vos commandes fournisseurs\n• analyser vos paiements\n• proposer des promotions\n• identifier les produits les plus rentables\n• améliorer la fidélisation de vos clients\n\nComment puis-je vous aider aujourd'hui ?",
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
        text: "Bonjour 👋\n\nJe suis votre **Assistant IA Commercial**. Je peux vous aider à :\n\n• analyser vos ventes\n• suivre votre chiffre d'affaires\n• surveiller votre stock\n• optimiser vos commandes fournisseurs\n• analyser vos paiements\n• proposer des promotions\n• identifier les produits les plus rentables\n• améliorer la fidélisation de vos clients\n\nComment puis-je vous aider aujourd'hui ?",
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
        <div className="dash-sidebar-logo">
          <Logo size={100} className="mb-6" className="mb-6 logo-white" />
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
            <h1 className="dash-greeting">Assistant IA Commercial</h1>
            <p className="dash-greeting-sub">
              Votre assistant intelligent pour piloter votre commerce, analyser vos ventes et optimiser votre activité.
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
              onClick={() => navigate('/notifications-com')}
            >
              <Bell size={18} />
              <span className="dash-badge">3</span>
            </button>
            <div className="dash-user-chip">
  <div className="dash-user-avatar">MB</div>
  <div className="dash-user-info">
    <span className="dash-user-name">Marwa Boutabi</span>
    <span className="dash-user-role">Commerçant</span>
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
                      MB
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
                placeholder="Posez votre question sur votre commerce..."
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