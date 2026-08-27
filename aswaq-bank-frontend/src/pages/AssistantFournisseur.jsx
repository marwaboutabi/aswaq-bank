import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, ArrowLeftRight, Star, Bell, Bot, User, LogOut, ChevronDown,
  Send, Sparkles, TrendingUp, Target, CreditCard, RefreshCw,
  Package, Boxes, Users, Truck, BarChart3, Percent,
  AlertTriangle, DollarSign, ShoppingBag, Wallet, ClipboardList,
  CheckCircle, Clock, PackageCheck, PackageX, Zap, FileText, ShoppingCart, Layers
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './AssistantFournisseur.css';

const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', to: '/accueil-fournisseur' },
    { icon: Package, label: 'Produits', to: '/produits-fournisseur' },
    { icon: ShoppingCart, label: 'Commandes reçues', to: '/commandes-fournisseur' },
    { icon: Truck, label: 'Livraisons', to: '/livraisons-fournisseur' },
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

// --- NOUVELLE FONCTION askAI ---
async function askAI(question) {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:8080/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message: question,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erreur API IA : ${response.status}`);
  }

  const data = await response.json();

  return {
    text: data.response,
    actions: [],
  };
}

export default function AssistantFournisseur() {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // State pour stocker les informations de l'utilisateur connecté
  const [user, setUser] = useState(null);

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

  // Chargement du profil utilisateur au montage du composant
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        const response = await fetch('http://localhost:8080/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Impossible de récupérer le profil');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Erreur récupération utilisateur:', error);
      }
    };

    loadUser();
  }, []);

    // CORRECTION : Ne scroller vers le bas que si la conversation a commencé (plus que le message de bienvenue)
  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Helper pour générer les initiales si l'utilisateur est chargé
  const getInitials = () => {
    if (!user) return 'AD'; // Fallback par défaut (Atlas Distribution)
    const prenom = user.prenom || user.firstName || '';
    const nom = user.nom || user.lastName || '';
    const firstLetter = prenom.charAt(0).toUpperCase();
    const lastLetter = nom.charAt(0).toUpperCase();
    return `${firstLetter}${lastLetter}` || 'U';
  };

  // --- MODIFICATION : handleSend avec gestion d'erreur ---
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

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "Désolé, je n'arrive pas à contacter l'Assistant IA pour le moment.",
          actions: [],
        },
      ]);
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
              {/* Avatar avec initiales dynamiques */}
              <div className="fourn-user-avatar">{getInitials()}</div>
              <div className="fourn-user-info">
                {/* Affichage dynamique Nom Prénom */}
                <span className="fourn-user-name">
                  {user
                    ? `${user.prenom || user.firstName || ''} ${user.nom || user.lastName || ''}`.trim()
                    : 'Atlas Distribution'}
                </span>
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
                      {getInitials()}
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