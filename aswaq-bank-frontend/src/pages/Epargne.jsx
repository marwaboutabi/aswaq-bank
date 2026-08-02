import React, { useState } from 'react';
import { Link, useLocation, useNavigate  } from 'react-router-dom';
import {
  Home, ArrowLeftRight,Receipt, Star, PiggyBank, PieChart,
  Bell, Bot, User, LogOut, ChevronDown, Plus,
  X, Pencil, Trash2, Sparkles, Wallet,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './Epargne.css';
import './DashboardClient.css';

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

const INITIAL_GOALS = [
  {
    id: 1,
    name: "Vacances d'été",
    current: 3250,
    target: 5000,
    deadline: '30 juin 2027',
    monthlyAdvice: 350,
    onTrack: true,
  },
  {
    id: 2,
    name: 'Nouvelle voiture',
    current: 18000,
    target: 40000,
    deadline: 'Décembre 2028',
    monthlyAdvice: 620,
    onTrack: false,
  },
];

const HISTORY = [
  { id: 1, date: '20 juillet 2026', amount: 300, goalName: 'Vacances d\'été' },
  { id: 2, date: '12 juillet 2026', amount: 500, goalName: 'Nouvelle voiture' },
  { id: 3, date: '5 juillet 2026', amount: 200, goalName: "Vacances d'été" },
];

const QUICK_AMOUNTS = [200, 500, 1000];

export default function Epargne() {
  const location = useLocation();
  const navigate = useNavigate();
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [history, setHistory] = useState(HISTORY);

  const [addModalGoal, setAddModalGoal] = useState(null);
  const [addAmount, setAddAmount] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '' });

  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);

  const handleAddMoney = () => {
    const amount = Number(addAmount);
    if (!amount || amount <= 0 || !addModalGoal) return;

    setGoals((prev) =>
      prev.map((g) => (g.id === addModalGoal.id ? { ...g, current: Math.min(g.current + amount, g.target) } : g))
    );
    setHistory((prev) => [
      { id: Date.now(), date: "Aujourd'hui", amount, goalName: addModalGoal.name },
      ...prev,
    ]);
    setAddModalGoal(null);
    setAddAmount('');
  };

  const handleDeleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleCreateGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    setGoals((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newGoal.name,
        current: 0,
        target: Number(newGoal.target),
        deadline: newGoal.deadline || 'Non définie',
        monthlyAdvice: Math.round(Number(newGoal.target) / 12),
        onTrack: true,
      },
    ]);
    setNewGoal({ name: '', target: '', deadline: '' });
    setCreateModalOpen(false);
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
            const isActive = item.to === '/epargne';
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
            <h1 className="dash-greeting">Objectifs d'épargne</h1>
            <p className="dash-greeting-sub">Économisez progressivement pour réaliser vos projets.</p>
          </div>
          <div className="dash-topbar-actions">
           <button 
  type="button" 
  className="dash-icon-button"
  onClick={() => navigate('/notifications')}
>
  <Bell size={18} />
  <span className="dash-badge">3</span>
</button>
            <div className="dash-user-chip">
              <div className="dash-user-avatar">MB</div>
              <span>Marwa Boutabi</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* ===== Carte résumé BLANCHE SANS ICÔNE ===== */}
        <div className="epa-hero-card">
          <div className="epa-hero-info">
            <span className="epa-hero-label">Épargne totale</span>
            <span className="epa-hero-amount">{totalSaved.toLocaleString('fr-FR')} <small>MAD</small></span>
          </div>
          <div className="epa-hero-count">
            {goals.length} objectif{goals.length > 1 ? 's' : ''} actif{goals.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* ===== Mes objectifs ===== */}
        <section className="epa-section">
          <div className="epa-section-header">
            <h2 className="epa-section-title">Mes objectifs</h2>
            <button type="button" className="epa-create-btn" onClick={() => setCreateModalOpen(true)}>
              <Plus size={16} /> Créer un objectif
            </button>
          </div>

          <div className="epa-goals-grid">
            {goals.map((goal) => {
              const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
              const remaining = goal.target - goal.current;
              const isComplete = goal.current >= goal.target;

              return (
                <div key={goal.id} className="epa-goal-card">
                  <div className="epa-goal-top">
                    <p className="epa-goal-name">{goal.name}</p>
                    <div className="epa-goal-menu">
                      <button type="button" className="epa-icon-btn" title="Modifier">
                        <Pencil size={14} />
                      </button>
                      <button type="button" className="epa-icon-btn" title="Supprimer" onClick={() => handleDeleteGoal(goal.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="epa-goal-amounts">
                    {goal.current.toLocaleString('fr-FR')} MAD / {goal.target.toLocaleString('fr-FR')} MAD
                  </p>

                  <div className="epa-goal-track">
                    <div className="epa-goal-fill" style={{ width: `${percent}%` }} />
                  </div>

                  <div className="epa-goal-footer">
                    <span className="epa-goal-percent">{percent}%</span>
                    <span className="epa-goal-remaining">
                      {isComplete ? 'Objectif atteint 🎉' : `Il vous reste ${remaining.toLocaleString('fr-FR')} MAD`}
                    </span>
                  </div>

                  <p className="epa-goal-deadline">Date cible : {goal.deadline}</p>

                  <button
                    type="button"
                    className="epa-add-money-btn"
                    disabled={isComplete}
                    onClick={() => setAddModalGoal(goal)}
                  >
                    <Wallet size={16} /> Ajouter de l'argent
                  </button>
                </div>
              );
            })}

            {goals.length === 0 && (
              <div className="epa-empty-state">
                <PiggyBank size={32} />
                <p>Vous n'avez pas encore d'objectif d'épargne.</p>
                <button type="button" className="epa-create-btn" onClick={() => setCreateModalOpen(true)}>
                  <Plus size={16} /> Créer mon premier objectif
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ===== Conseils intelligents ===== */}
        {goals.length > 0 && (
          <section className="epa-section">
            <h2 className="epa-section-title epa-section-title-icon">
              <Sparkles size={18} /> Conseils intelligents
            </h2>
            <div className="epa-advice-grid">
              {goals.map((goal) => (
                <div key={goal.id} className={`epa-advice-card ${goal.onTrack ? 'epa-advice-good' : 'epa-advice-warning'}`}>
                  <p className="epa-advice-goal">{goal.name}</p>
                  {goal.onTrack ? (
                    <p className="epa-advice-text">
                      Au rythme actuel, vous atteindrez votre objectif <strong>avant la date prévue</strong>.
                    </p>
                  ) : (
                    <p className="epa-advice-text">
                      Pour atteindre votre objectif à temps, nous vous conseillons d'épargner environ{' '}
                      <strong>{goal.monthlyAdvice.toLocaleString('fr-FR')} MAD par mois</strong>.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== Historique ===== */}
        <section className="epa-section">
          <h2 className="epa-section-title">Historique</h2>
          <div className="epa-history-panel">
            {history.map((h) => (
              <div key={h.id} className="epa-history-row">
                <div className="epa-history-info">
                  <p className="epa-history-date">{h.date}</p>
                  <p className="epa-history-goal">Objectif {h.goalName}</p>
                </div>
                <span className="epa-history-amount">+{h.amount.toLocaleString('fr-FR')} MAD</span>
              </div>
            ))}
            {history.length === 0 && (
              <p className="epa-history-empty">Aucun versement pour le moment.</p>
            )}
          </div>
        </section>
      </main>

      {/* ===== Modal : Ajouter de l'argent ===== */}
      {addModalGoal && (
        <div className="epa-overlay" onClick={() => setAddModalGoal(null)}>
          <div className="epa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="epa-modal-header">
              <h3>Ajouter de l'argent</h3>
              <button type="button" onClick={() => setAddModalGoal(null)}><X size={20} /></button>
            </div>
            <p className="epa-modal-sub">Objectif : {addModalGoal.name}</p>

            <div className="epa-quick-amounts">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className={`epa-quick-amount-btn ${Number(addAmount) === amt ? 'epa-quick-amount-active' : ''}`}
                  onClick={() => setAddAmount(String(amt))}
                >
                  {amt} MAD
                </button>
              ))}
            </div>

            <label className="epa-modal-label">Ou montant libre</label>
            <input
              type="number"
              className="epa-modal-input"
              placeholder="Montant en MAD"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
            />

            <button type="button" className="epa-modal-submit" onClick={handleAddMoney}>
              Confirmer l'ajout
            </button>
          </div>
        </div>
      )}

      {/* ===== Modal : Créer un objectif ===== */}
      {createModalOpen && (
        <div className="epa-overlay" onClick={() => setCreateModalOpen(false)}>
          <div className="epa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="epa-modal-header">
              <h3>Créer un objectif</h3>
              <button type="button" onClick={() => setCreateModalOpen(false)}><X size={20} /></button>
            </div>

            <label className="epa-modal-label">Nom de l'objectif</label>
            <input
              type="text"
              className="epa-modal-input"
              placeholder="Ex : Voyage à Dubaï"
              value={newGoal.name}
              onChange={(e) => setNewGoal((p) => ({ ...p, name: e.target.value }))}
            />

            <label className="epa-modal-label">Montant cible (MAD)</label>
            <input
              type="number"
              className="epa-modal-input"
              placeholder="Ex : 5000"
              value={newGoal.target}
              onChange={(e) => setNewGoal((p) => ({ ...p, target: e.target.value }))}
            />

            <label className="epa-modal-label">Date cible</label>
            <input
              type="text"
              className="epa-modal-input"
              placeholder="Ex : Décembre 2027"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal((p) => ({ ...p, deadline: e.target.value }))}
            />

            <label className="epa-modal-label">Compte à utiliser</label>
            <select className="epa-modal-input epa-modal-select">
              <option>Compte principal •••• 4589</option>
            </select>

            <button type="button" className="epa-modal-submit" onClick={handleCreateGoal}>
              Créer l'objectif
            </button>
          </div>
        </div>
      )}
    </div>
  );
}