import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate  } from 'react-router-dom';
import {
  Home, ArrowLeftRight,  Receipt, Star, PiggyBank, PieChart,
  Bell, Bot, User, LogOut, Send, Sparkles,
  TrendingUp, Target, CreditCard, Wallet, RefreshCw,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './Assistant.css';
import './DashboardClient.css';
import UserHeader from '../components/UserHeader/UserHeader';
import NotificationBell from '../components/NotificationBell/NotificationBell';

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/dashboard-client' },
  { icon: ArrowLeftRight, label: 'Gestion du compte', to: '/mon-compte' },
  { icon: ArrowLeftRight, label: 'Historique des transactions', to: '/transactions-client' },
  { icon: Receipt, label: 'Tickets numériques', to: '/tickets-client' },
  { icon: Star, label: 'Points de fidélité', to: '/fidelite' },
  { icon: PiggyBank, label: "Objectifs d'épargne", to: '/epargne' },
  { icon: PieChart, label: 'Suivi des dépenses', to: '/depenses' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant' },
  { icon: User, label: 'Profil et paramètres', to: '/parametres' },
];

const QUICK_SUGGESTIONS = [
  {
    id: 1,
    icon: TrendingUp,
    label: 'Analyse mes dépenses',
    question: 'Peux-tu analyser mes dépenses ce mois-ci ?',
  },
  {
    id: 2,
    icon: Wallet,
    label: 'Comment économiser ?',
    question: 'Comment puis-je économiser ce mois-ci ?',
  },
  {
    id: 3,
    icon: Target,
    label: "Mon objectif d'épargne",
    question: "Comment atteindre mon objectif d'épargne ?",
  },
  {
    id: 4,
    icon: Star,
    label: 'Mes points de fidélité',
    question: 'Comment fonctionnent mes points de fidélité ?',
  },
  {
    id: 5,
    icon: CreditCard,
    label: 'Mes dernières transactions',
    question: 'Explique-moi mes dernières transactions',
  },
];

const AI_RESPONSES = {
  'Peux-tu analyser mes dépenses ce mois-ci ?': {
    text: "D'après l'analyse de vos transactions, voici la répartition de vos dépenses ce mois-ci :\n\n **Alimentation** : 1 137 MAD (35%)\n **Transport** : 650 MAD (20%)\n🍽️ **Restaurants** : 487 MAD (15%)\n🛍️ **Shopping** : 390 MAD (12%)\n\nVos dépenses en restauration ont augmenté de 15% par rapport au mois dernier. C'est la catégorie où vous pourriez réaliser le plus d'économies.",
    actions: [
      { label: 'Voir mes dépenses', to: '/depenses', icon: TrendingUp },
    ],
  },
  'Comment puis-je économiser ce mois-ci ?': {
    text: "D'après vos dépenses récentes, la catégorie **Restaurants** représente une part importante de votre budget. En réduisant légèrement ces dépenses, vous pourriez économiser environ **250 MAD** ce mois-ci.\n\nVous êtes également proche de votre objectif d'épargne **Vacances d'été** (80% atteint). Un petit effort supplémentaire vous permettra de l'atteindre avant la date cible.",
    actions: [
      { label: 'Voir mes dépenses', to: '/depenses', icon: TrendingUp },
      { label: 'Voir mon objectif', to: '/epargne', icon: Target },
    ],
  },
  "Comment atteindre mon objectif d'épargne ?": {
    text: "Votre objectif **Vacances d'été** est à **80%** (4 000 MAD sur 5 000 MAD). Il vous reste **1 000 MAD** à économiser d'ici le 30 juin 2027.\n\n **Conseil** : En épargnant environ **85 MAD par mois**, vous atteindrez votre objectif dans les temps. Vous pouvez aussi activer l'épargne automatique pour ne plus y penser.",
    actions: [
      { label: 'Voir mon objectif', to: '/epargne', icon: Target },
    ],
  },
  'Comment fonctionnent mes points de fidélité ?': {
    text: "Vous disposez actuellement de **1 275 points** de fidélité. Voici comment ça fonctionne :\n\n⭐ **1 point** = 1 MAD dépensé\n **1 500 points** = Récompense disponible\n📈 **Niveau actuel** : Bronze → **Silver à 2 000 points**\n\nIl vous reste **225 points** pour débloquer votre prochaine récompense !",
    actions: [
      { label: 'Voir mes points', to: '/fidelite', icon: Star },
    ],
  },
  'Explique-moi mes dernières transactions': {
    text: "Voici vos **5 dernières transactions** :\n\n💳 **Carrefour** — 250 MAD — Aujourd'hui\n **Virement reçu** de Ahmed Benali — +2 000 MAD — Hier\n **Café Central** — 85 MAD — 19 juillet\n⛽ **Station Total** — 300 MAD — 19 juillet\n **Virement envoyé** à Sara El Fassi — 500 MAD — 18 juillet\n\nVotre solde actuel est de **12 450 MAD**.",
    actions: [
      { label: 'Voir toutes les transactions', to: '/transactions-client', icon: CreditCard },
    ],
  },
};

const DEFAULT_RESPONSE = {
  text: "Je suis votre Conseiller Financier Intelligent. Je peux vous aider à :\n\n Analyser vos dépenses\n💰 Vous conseiller sur l'épargne\n🎯 Suivre vos objectifs\n⭐ Gérer vos points de fidélité\n\nN'hésitez pas à me poser une question plus précise ou à utiliser les suggestions ci-dessous.",
  actions: [],
};

// --- MODIFICATION ICI : Appel réel au Backend ---
async function askAI(question) {
  try {
    const response = await fetch('http://localhost:8080/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: question,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur : ${response.status}`);
    }

    const data = await response.json();

    return {
      text: data.response,
      actions: [],
    };

  } catch (error) {
    console.error('Erreur assistant IA:', error);

    return {
      text: "Désolé, je rencontre actuellement un problème pour contacter l'assistant IA. Veuillez réessayer dans quelques instants.",
      actions: [],
    };
  }
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
      text: "Bonjour \n\nJe suis votre **Conseiller Financier Intelligent**. Je peux vous aider à comprendre vos dépenses, mieux gérer votre budget et atteindre vos objectifs d'épargne.\n\nComment puis-je vous aider aujourd'hui ?",
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
        text: "Bonjour \n\nJe suis votre **Conseiller Financier Intelligent**. Je peux vous aider à comprendre vos dépenses, mieux gérer votre budget et atteindre vos objectifs d'épargne.\n\nComment puis-je vous aider aujourd'hui ?",
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
          <Logo size={100} className="mb-6" logo-white/>
        </div>
        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.to === '/assistant';
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
            <h1 className="dash-greeting">Assistant IA</h1>
            <p className="dash-greeting-sub">
              Votre conseiller financier intelligent, disponible pour vous accompagner dans la gestion de vos finances.
            </p>
          </div>
          <div className="dash-topbar-actions">
            <button type="button" className="dash-new-chat-btn" onClick={handleNewConversation}>
              <RefreshCw size={16} />
              Nouvelle conversation
            </button>
            <NotificationBell />
            <UserHeader />
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
                placeholder="Posez votre question..."
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