import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, ArrowLeftRight, Star, Bell, Bot, User, LogOut, ChevronDown,
  Send, Sparkles, TrendingUp, Target, CreditCard, RefreshCw,
  Package, Boxes, Users, Truck, BarChart3, Percent,
  AlertTriangle, DollarSign, ShoppingBag,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './AssistantCom.css';
import './DashboardClient.css';

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/acceuil-com' },
  { icon: Package, label: 'Produits', to: '/produits' },
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

// --- Appel API vers Spring Boot ---
async function askAI(question) {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:8080/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      message: question,
      role: 'COMMERCHANT', // Rôle spécifique pour le commerçant
    }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la communication avec Gemini');
  }

  const data = await response.json();

  return {
    text: data.response || data.message || 'Je n’ai pas pu générer une réponse.',
    actions: [],
  };
}

// --- Récupération de l'utilisateur connecté ---
async function fetchCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const response = await fetch('http://localhost:8080/api/users/me', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;

  return response.json();
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser()
      .then((data) => {
        if (data) setUser(data);
      })
      .catch((err) => console.error('Erreur chargement utilisateur:', err));
  }, []);

  // CORRECTION : Ne scroller que si la conversation a commencé (plus que le message de bienvenue)
  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const userInitials = user
    ? `${(user.prenom || user.firstName || '')[0] || ''}${(user.nom || user.lastName || '')[0] || ''}`
    : 'CO';

  const userFullName = user
    ? `${user.prenom || user.firstName || ''} ${user.nom || user.lastName || ''}`.trim() || 'Commerçant'
    : 'Commerçant';

  // --- Gestion robuste des erreurs et du loading ---
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

    try {
      const aiResponse = await askAI(question);

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponse.text,
        actions: aiResponse.actions || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erreur Assistant IA:', error);

      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Désolé, je rencontre actuellement un problème pour communiquer avec l'assistant IA. Veuillez réessayer dans quelques instants.",
        actions: [],
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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
          <Logo size={100} className="mb-6 logo-white" />
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
              <div className="dash-user-avatar">{userInitials}</div>
              <div className="dash-user-info">
                <span className="dash-user-name">{userFullName}</span>
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
                      {userInitials}
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