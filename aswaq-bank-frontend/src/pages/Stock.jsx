import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, Boxes, ArrowLeftRight, Users, Star, Bot, LogOut,
  Search, Bell, ChevronDown, ChevronLeft, ChevronRight,
  Box, CheckCircle2, AlertTriangle, XCircle, Pencil, Trash2, User, X,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './Stock.css';

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Lait 1L', code: 'PRD001', category: 'Boissons', price: '12,00 MAD', stock: 35, status: 'En stock', date: '10 Juil 2026' },
  { id: 2, name: 'Pain complet', code: 'PRD002', category: 'Boulangerie', price: '8,00 MAD', stock: 4, status: 'Stock faible', date: '09 Juil 2026' },
  { id: 3, name: "Huile d'olive 1L", code: 'PRD003', category: 'Épicerie', price: '65,00 MAD', stock: 0, status: 'Rupture', date: '08 Juil 2026' },
  { id: 4, name: 'Café moulu 250g', code: 'PRD004', category: 'Épicerie', price: '45,00 MAD', stock: 12, status: 'Stock faible', date: '08 Juil 2026' },
  { id: 5, name: 'Sucre blanc 1kg', code: 'PRD005', category: 'Épicerie', price: '9,50 MAD', stock: 46, status: 'En stock', date: '07 Juil 2026' },
  { id: 6, name: 'Eau minérale 1.5L', code: 'PRD006', category: 'Boissons', price: '6,00 MAD', stock: 80, status: 'En stock', date: '07 Juil 2026' },
];

const CATEGORIES = ['Boissons', 'Boulangerie', 'Épicerie'];

const CATEGORY_STYLES = {
  Boissons: { bg: '#dbeafe', color: '#1d4fd8' },
  Boulangerie: { bg: '#ede9fe', color: '#7c3aed' },
  Épicerie: { bg: '#e0f2fe', color: '#0284c7' },
};

const STATUS_STYLES = {
  'En stock': { dot: '#16a34a', color: '#16a34a' },
  'Stock faible': { dot: '#f59e0b', color: '#b45309' },
  'Rupture': { dot: '#dc2626', color: '#dc2626' },
};

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/acceuil-com' },
  { icon: Package, label: 'Produits', to: '/produits' },
  { icon: Boxes, label: 'Stock', to: '/stock', active: true },
  { icon: ArrowLeftRight, label: 'Paiements & Transactions', to: '/transactions-commerce' },
  { icon: Users, label: 'Fournisseurs', to: '/fournisseurs' },
  { icon: Star, label: 'Fidélité & Tickets', to: '/fidelite-commerce' },
  { icon: Bell, label: 'Notifications', to: '/notifications-com' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant-commerce' },
  { icon: User, label: 'Profil & Paramètres', to: '/parametres-commerce' },
];

const PAGE_SIZE = 10;

const getStatusFromStock = (stock) => {
  const stockNum = parseInt(stock) || 0;
  if (stockNum === 0) return 'Rupture';
  if (stockNum <= 12) return 'Stock faible';
  return 'En stock';
};

export default function Stock() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('Toutes');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '', code: '', category: 'Boissons', price: '', stock: ''
  });

  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  const stats = useMemo(() => {
    const total = products.length;
    const stock = products.filter(p => p.status === 'En stock').length;
    const low = products.filter(p => p.status === 'Stock faible').length;
    const out = products.filter(p => p.status === 'Rupture').length;
    return [
      { key: 'total', icon: Box, label: 'Total des produits', value: total, sub: 'Tous vos produits', subTone: 'muted' },
      { key: 'stock', icon: CheckCircle2, label: 'Produits en stock', value: stock, sub: `${total ? Math.round((stock/total)*100) : 0}% du total`, subTone: 'muted' },
      { key: 'low', icon: AlertTriangle, label: 'Stock faible', value: low, sub: 'À réapprovisionner', subTone: 'orange' },
      { key: 'out', icon: XCircle, label: 'En rupture', value: out, sub: 'Indisponibles', subTone: 'red' },
    ];
  }, [products]);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 5);
  }, [search, products]);

  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
        || p.code.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'Toutes' || p.category === categoryFilter;
      return matchSearch && matchCategory;
    });

    if (sortBy === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'price') list = [...list].sort((a, b) => parseFloat(a.price.replace(',', '.')) - parseFloat(b.price.replace(',', '.')));
    if (sortBy === 'stock') list = [...list].sort((a, b) => a.stock - b.stock);

    return list;
  }, [products, search, categoryFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => { setCurrentPage(1); }, [search, categoryFilter, sortBy]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (product) => {
    setSearch(product.name);
    setShowSuggestions(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      code: product.code,
      category: product.category,
      price: product.price.replace(' MAD', '').replace(',', '.'),
      stock: product.stock.toString(),
    });
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.code || !formData.price || !formData.stock) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const updatedProduct = {
      ...editingProduct,
      name: formData.name,
      code: formData.code,
      category: formData.category,
      price: `${formData.price.replace('.', ',')} MAD`,
      stock: parseInt(formData.stock),
      status: getStatusFromStock(formData.stock),
    };

    setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));

    setShowModal(false);
    setEditingProduct(null);
    setFormData({ name: '', code: '', category: 'Boissons', price: '', stock: '' });
  };

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm('Voulez-vous vous déconnecter ?')) {
      navigate('/');
    }
  };

  return (
    <div className="prod-layout">
      <aside className="prod-sidebar">
        <div className="prod-sidebar-logo">
          <Logo size={100} className="mb-6 logo-white" />
        </div>

        <nav className="prod-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                state={location.state}
                className={`prod-nav-item ${item.active ? 'prod-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a href="/" onClick={handleLogout} className="prod-logout">
          <LogOut size={18} />
          Déconnexion
        </a>
      </aside>

      <main className="prod-main">
        <header className="prod-topbar">
          <div>
            <h1 className="prod-title">Gestion du Stock</h1>
            <p className="prod-subtitle">Ajustez les quantités et les prix de vos produits.</p>
          </div>

          <div className="prod-topbar-actions">
            {/* ✅ CORRECTION ICI : Redirection vers la page des notifications */}
            <button
              type="button"
              className="prod-icon-button"
              onClick={() => navigate('/notifications-com')}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="prod-badge">3</span>
            </button>

            <div
              className="prod-user-chip"
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{ position: 'relative' }}
            >
              <div className="prod-user-avatar">MB</div>
              <div className="prod-user-info">
                <span className="prod-user-name">Marwa Boutabi</span>
                <span className="prod-user-role">Commerçant</span>
              </div>
              <ChevronDown size={16} />
              {showUserMenu && (
                <div style={{
                  position: 'absolute', right: 0, top: 48,
                  background: 'white', border: '1px solid #e5e7eb',
                  borderRadius: 10, padding: '0.5rem', width: 180,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10
                }}>
                  <Link to="/parametres-commerce" style={{ display: 'block', padding: '0.5rem', textDecoration: 'none', color: '#374151' }}>
                    Mon profil
                  </Link>
                  <Link to="/" onClick={handleLogout} style={{ display: 'block', padding: '0.5rem', textDecoration: 'none', color: '#dc2626' }}>
                    Déconnexion
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="prod-filters-row" style={{ position: 'relative' }}>
          <div className="prod-search" ref={searchRef}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setShowSuggestions(false); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: 'white', border: '1px solid #e5e7eb',
                borderRadius: 10, marginTop: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 20, maxHeight: 200, overflowY: 'auto',
              }}
            >
              {suggestions.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSuggestionClick(p)}
                  style={{
                    padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#0b1f4b', fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{p.code} • {p.category}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <select
            className="prod-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ appearance: 'auto', cursor: 'pointer' }}
          >
            <option value="Toutes">Toutes catégories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            className="prod-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ appearance: 'auto', cursor: 'pointer' }}
          >
            <option value="name">Trier par Nom</option>
            <option value="price">Trier par Prix</option>
            <option value="stock">Trier par Stock</option>
          </select>
        </section>

        <section className="prod-stats-row">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div className="prod-stat-card" key={s.key}>
                <div className="prod-stat-icon">
                  <Icon size={20} />
                </div>
                <div className="prod-stat-body">
                  <p className="prod-stat-label">{s.label}</p>
                  <p className="prod-stat-value">{s.value}</p>
                  <p className={`prod-stat-sub prod-stat-sub-${s.subTone}`}>{s.sub}</p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="prod-panel">
          <h2 className="prod-panel-title">
            Liste des produits en stock
            <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500, marginLeft: 8 }}>
              ({filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''})
            </span>
          </h2>

          <div className="prod-table-wrapper">
            <table className="prod-table">
              <thead>
                <tr>
                  <th>Nom du produit</th>
                  <th>Catégorie</th>
                  <th>Prix de vente</th>
                  <th>Stock actuel</th>
                  <th>Statut</th>
                  <th>Date d'ajout</th>
                  <th className="prod-th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                      Aucun produit trouvé.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((p) => {
                    const catStyle = CATEGORY_STYLES[p.category] || { bg: '#f1f5f9', color: '#475569' };
                    const statusStyle = STATUS_STYLES[p.status];
                    return (
                      <tr key={p.id}>
                        <td>
                          <p className="prod-name">{p.name}</p>
                          <p className="prod-code">Code : {p.code}</p>
                        </td>
                        <td>
                          <span
                            className="prod-category-pill"
                            style={{ background: catStyle.bg, color: catStyle.color }}
                          >
                            {p.category}
                          </span>
                        </td>
                        <td className="prod-price">{p.price}</td>
                        <td
                          className="prod-stock-value"
                          style={{ color: p.stock === 0 ? '#dc2626' : p.stock <= 12 ? '#d97706' : '#0f172a' }}
                        >
                          {p.stock}
                        </td>
                        <td>
                          <span className="prod-status">
                            <span className="prod-status-dot" style={{ background: statusStyle.dot }} />
                            <span style={{ color: statusStyle.color }}>{p.status}</span>
                          </span>
                        </td>
                        <td className="prod-date">{p.date}</td>
                        <td>
                          <div className="prod-actions">
                            <button
                              type="button"
                              className="prod-action-btn prod-action-edit"
                              aria-label="Modifier"
                              onClick={() => openEditModal(p)}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              className="prod-action-btn prod-action-delete"
                              aria-label="Supprimer"
                              onClick={() => handleDelete(p.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="prod-pagination">
            <div className="prod-per-page">
              <span>{PAGE_SIZE} par page</span>
              <ChevronDown size={15} />
            </div>

            <div className="prod-page-controls">
              <button
                type="button"
                className="prod-page-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Page précédente"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`prod-page-btn ${currentPage === n ? 'prod-page-btn-active' : ''}`}
                  onClick={() => setCurrentPage(n)}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                className="prod-page-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Page suivante"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL DE MODIFICATION */}
      {showModal && editingProduct && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '1rem',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: 'white', borderRadius: 16, padding: '2rem',
              width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: '#0b1f4b', fontSize: '1.25rem', fontWeight: 700 }}>
                Modifier le produit
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                  Nom du produit
                </label>
                <input
                  type="text"
                  value={formData.name}
                  readOnly
                  style={{
                    width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #e5e7eb',
                    borderRadius: 10, fontSize: 14, boxSizing: 'border-box', background: '#f8fafc'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                  Code produit
                </label>
                <input
                  type="text"
                  value={formData.code}
                  readOnly
                  style={{
                    width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #e5e7eb',
                    borderRadius: 10, fontSize: 14, boxSizing: 'border-box', background: '#f8fafc'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                    Prix (MAD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{
                      width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #e5e7eb',
                      borderRadius: 10, fontSize: 14, boxSizing: 'border-box',
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    style={{
                      width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #e5e7eb',
                      borderRadius: 10, fontSize: 14, boxSizing: 'border-box',
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                  Statut (Automatique selon le stock)
                </label>
                <input
                  type="text"
                  value={getStatusFromStock(formData.stock)}
                  readOnly
                  style={{
                    width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #e5e7eb',
                    borderRadius: 10, fontSize: 14, boxSizing: 'border-box', background: '#f8fafc',
                    color: STATUS_STYLES[getStatusFromStock(formData.stock)].color,
                    fontWeight: 600
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.7rem 1.25rem', border: '1px solid #e5e7eb',
                    borderRadius: 10, background: 'white', cursor: 'pointer',
                    fontSize: 14, fontWeight: 600, color: '#374151',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.7rem 1.25rem', border: 'none',
                    borderRadius: 10, background: '#1d4fd8', cursor: 'pointer',
                    fontSize: 14, fontWeight: 600, color: 'white',
                  }}
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VOIR DÉTAILS */}
      {viewingProduct && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '1rem',
          }}
          onClick={() => setViewingProduct(null)}
        >
          <div
            style={{
              background: 'white', borderRadius: 16, padding: '2rem',
              width: '100%', maxWidth: 400,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: '#0b1f4b', fontSize: '1.25rem', fontWeight: 700 }}>
                Détails du produit
              </h2>
              <button
                onClick={() => setViewingProduct(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0.5rem 0', color: '#0b1f4b' }}>{viewingProduct.name}</h3>
              <p style={{ margin: 0, color: '#9ca3af', fontSize: 13 }}>{viewingProduct.code}</p>
            </div>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                <span style={{ color: '#6b7280', fontSize: 13 }}>Catégorie</span>
                <span style={{ fontWeight: 600, color: '#0b1f4b' }}>{viewingProduct.category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                <span style={{ color: '#6b7280', fontSize: 13 }}>Prix</span>
                <span style={{ fontWeight: 600, color: '#0b1f4b' }}>{viewingProduct.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                <span style={{ color: '#6b7280', fontSize: 13 }}>Stock</span>
                <span style={{ fontWeight: 600, color: '#0b1f4b' }}>{viewingProduct.stock}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                <span style={{ color: '#6b7280', fontSize: 13 }}>Statut</span>
                <span style={{ fontWeight: 600, color: STATUS_STYLES[viewingProduct.status].color }}>{viewingProduct.status}</span>
              </div>
            </div>

            <button
              onClick={() => setViewingProduct(null)}
              style={{
                width: '100%', marginTop: '1.5rem', padding: '0.7rem',
                border: 'none', borderRadius: 10, background: '#1d4fd8',
                cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'white',
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}